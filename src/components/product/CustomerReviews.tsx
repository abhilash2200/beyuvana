"use client"
import { Rating } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { reviewApi, productsApi, type Product, type ProductsListRequest } from '@/lib/api'
import { useAuth } from '@/context/AuthProvider'

interface ReviewItem {
    id: number
    user_name: string
    review: string
    star_ratting: number
    created_at?: string
}

const timeAgo = (iso?: string) => {
    if (!iso) return "";
    const then = new Date(iso).getTime();
    if (Number.isNaN(then)) return "";
    const diff = Date.now() - then;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days <= 0) return "Today";
    if (days === 1) return "1 day ago";
    return `${days} days ago`;
};

const CustomerReviews = ({ productId, productName, designSlug }: { productId?: number; productName?: string; designSlug?: string }) => {
    const { sessionKey } = useAuth();
    const [reviews, setReviews] = useState<ReviewItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            setLoading(true);
            setError(null);

            // Prefer resolving by backend products list so each page gets its own id
            let resolvedId: number | undefined = undefined;
            try {
                // 1) Try strict filter by product_name and categorykey
                const filterParams: ProductsListRequest = { filter: {}, page: 1, limit: 10 };
                if (productName) (filterParams.filter as Record<string, unknown>).product_name = [productName];
                if (designSlug) (filterParams.filter as Record<string, unknown>).categorykey = [designSlug];
                const filteredResp = await productsApi.getList({
                    ...(filterParams as unknown as { filter?: { product_name?: string[]; categorykey?: string[] }; page?: number; limit?: number }),
                });
                let list: Product[] = (filteredResp?.data as Product[]) ?? [];

                // 2) If nothing found, fallback to searchTerms
                if (!Array.isArray(list) || list.length === 0) {
                    const searchResp = await productsApi.getList({ searchTerms: productName || designSlug || "", page: 1, limit: 50 });
                    list = (searchResp?.data as Product[]) ?? [];
                }

                const nameLower = (productName || "").toLowerCase();
                const slugLower = (designSlug || "").toLowerCase();

                const byExactName = list.find((p: Product) => (p as Product & { product_name?: string })?.product_name?.toLowerCase?.() === nameLower);
                const byIncludesName = byExactName ? undefined : list.find((p: Product) => (p as Product & { product_name?: string })?.product_name?.toLowerCase?.().includes(nameLower) && nameLower.length > 0);
                const byCategoryKey = (byExactName || byIncludesName) ? undefined : list.find((p: Product) => (p as Product & { categorykey?: string })?.categorykey?.toLowerCase?.() === slugLower && slugLower.length > 0);
                const byDesignType = (byExactName || byIncludesName || byCategoryKey) ? undefined : list.find((p: Product) => {
                    const dt = (p as Product & { design_type?: string })?.design_type;
                    if (!dt) return false;
                    const dtLower = String(dt).toLowerCase();
                    return (slugLower.includes("green") && dtLower.includes("green")) || (slugLower.includes("pink") && dtLower.includes("pink"));
                });
                const candidate = byExactName || byIncludesName || byCategoryKey || byDesignType;
                if ((candidate as Product | undefined)?.id) {
                    const parsed = parseInt((candidate as Product).id as unknown as string, 10);
                    if (!Number.isNaN(parsed)) {
                        resolvedId = parsed;
                    }
                }
                if (process.env.NODE_ENV === 'development') {
                    console.log("🔎 Reviews resolver:", { productName, designSlug, resolvedId, listCount: list?.length || 0 });
                }
            } catch {
                // ignore list fetch errors; we'll fallback to provided id
            }

            if (!resolvedId && productId && !Number.isNaN(Number(productId))) {
                resolvedId = productId;
            }

            if (!resolvedId || Number.isNaN(Number(resolvedId))) {
                setReviews([]);
                setLoading(false);
                return;
            }

            try {
                const resp = await reviewApi.getReviews(resolvedId, sessionKey || undefined);
                const rawData = resp?.data as unknown;
                const maybeObj = (rawData as { reviews?: unknown; data?: unknown }) || {};
                const listUnknown = Array.isArray(maybeObj.reviews)
                    ? maybeObj.reviews
                    : Array.isArray(maybeObj.data)
                        ? maybeObj.data
                        : Array.isArray(rawData)
                            ? rawData
                            : [];
                const arr: Array<Record<string, unknown>> = Array.isArray(listUnknown)
                    ? (listUnknown as Array<Record<string, unknown>>)
                    : [];
                const normalized: ReviewItem[] = arr.map((item, idx) => {
                    const idVal = item.id as string | number | undefined;
                    const id = typeof idVal === "string" ? parseInt(idVal, 10) : typeof idVal === "number" ? idVal : idx;
                    const userName = (item.customer_name as string) || (item.user_name as string) || "Anonymous";
                    const text = (item.review as string) || "";
                    const created = (item.created_on as string) || (item.created_at as string) || undefined;
                    const ratingRaw = item.star_ratting as string | number | null | undefined;
                    const ratingNum = typeof ratingRaw === "string" ? parseFloat(ratingRaw) : typeof ratingRaw === "number" ? ratingRaw : 0;
                    return { id, user_name: userName, review: text, star_ratting: ratingNum, created_at: created };
                });
                if (!cancelled) setReviews(normalized);
            } catch (e) {
                const msg = e instanceof Error ? e.message : 'Failed to load reviews';
                if (!cancelled) setError(msg);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true };
    }, [productId, productName, designSlug, sessionKey]);

    const content = useMemo(() => {
        if (loading) {
            return (
                <div className='flex flex-col gap-4'>
                    {[1, 2, 3].map((i) => (
                        <div key={i} className='animate-pulse flex flex-wrap gap-4 border-b-1 border-gray-300 md:pb-4 pb-2'>
                            <div className='w-full md:w-[88%]'>
                                <div className='h-5 bg-gray-200 rounded w-40 mb-4'></div>
                                <div className='h-4 bg-gray-100 rounded w-full mb-2'></div>
                                <div className='h-4 bg-gray-100 rounded w-3/4'></div>
                            </div>
                            <div className='w-full md:w-[8%]'>
                                <div className='h-4 bg-gray-100 rounded w-16'></div>
                            </div>
                        </div>
                    ))}
                </div>
            )
        }
        if (error) {
            return <p className='text-sm text-red-600'>{error}</p>
        }
        if ((!productId || Number.isNaN(Number(productId))) && !reviews.length && !loading && !error) {
            return <p className='text-sm text-gray-500'>Reviews unavailable.</p>
        }
        if (!reviews.length) {
            return <p className='text-sm text-gray-500'>No reviews yet.</p>
        }
        return (
            <div className='flex flex-col gap-4'>
                {reviews.map((r) => (
                    <div key={r.id} className='flex flex-wrap gap-4 border-b-1 border-gray-300 md:pb-4 pb-2'>
                        <div className='w-full md:w-[88%]'>
                            <div className='flex mb-5 gap-x-2'>
                                <h2 className=''>{r.user_name || 'Anonymous'}</h2>
                                <Rating
                                    name="rating-read"
                                    value={Number(r.star_ratting) || 0}
                                    precision={0.5}
                                    readOnly
                                    className='text-green-500 md:text-2xl text-xl'
                                />
                            </div>
                            <p className='md:text-[15px] text-[13px] leading-tight font-light'>{r.review}</p>
                        </div>
                        <div className='w-full md:w-[8%]'>
                            <div>
                                <p className='md:text-[15px] text-[13px] leading-tight font-light'>{timeAgo(r.created_at)}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }, [loading, error, reviews, productId])

    return (
        <div>
            {content}
        </div>
    )
}

export default CustomerReviews
