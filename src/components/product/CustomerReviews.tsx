"use client"
import { Rating } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { reviewApi, productsApi, type Product, type ProductsListRequest } from '@/lib/api'
import { useAuth } from '@/context/AuthProvider'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp } from 'lucide-react'

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
    const [showAllReviews, setShowAllReviews] = useState<boolean>(false);

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
                    // Debug: Reviews resolver
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

    const displayedReviews = useMemo(() => {
        return showAllReviews ? reviews : reviews.slice(0, 5);
    }, [reviews, showAllReviews]);

    const content = useMemo(() => {
        if (loading) {
            return (
                <div className='flex flex-col gap-6'>
                    {[1, 2, 3].map((i) => (
                        <div key={i} className='animate-pulse bg-white rounded-lg p-6 shadow-sm border border-gray-100'>
                            <div className='flex items-start gap-4'>
                                <div className='w-10 h-10 bg-gray-200 rounded-full'></div>
                                <div className='flex-1 space-y-3'>
                                    <div className='flex items-center gap-3'>
                                        <div className='h-4 bg-gray-200 rounded w-24'></div>
                                        <div className='h-4 bg-gray-200 rounded w-20'></div>
                                    </div>
                                    <div className='space-y-2'>
                                        <div className='h-4 bg-gray-100 rounded w-full'></div>
                                        <div className='h-4 bg-gray-100 rounded w-3/4'></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )
        }
        if (error) {
            return (
                <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                    <p className='text-sm text-red-600'>{error}</p>
                </div>
            )
        }
        if ((!productId || Number.isNaN(Number(productId))) && !reviews.length && !loading && !error) {
            return (
                <div className='bg-gray-50 border border-gray-200 rounded-lg p-6 text-center'>
                    <p className='text-sm text-gray-500'>Reviews unavailable.</p>
                </div>
            )
        }
        if (!reviews.length) {
            return (
                <div className='bg-gray-50 border border-gray-200 rounded-lg p-6 text-center'>
                    <p className='text-sm text-gray-500'>No reviews yet.</p>
                </div>
            )
        }

        return (
            <div className='space-y-6'>
                <div className={`space-y-4 transition-all duration-500 ease-in-out ${showAllReviews ? 'opacity-100' : 'opacity-100'}`}>
                    {displayedReviews.map((r, index) => (
                        <div
                            key={r.id}
                            className={`bg-white rounded-lg p-4 border-b border-dashed last:border-b-0 border-gray-500 hover:shadow-md transition-all duration-300 ease-in-out ${index >= 5 && !showAllReviews ? 'hidden' : ''
                                }`}
                            style={{
                                animationDelay: `${index * 100}ms`,
                                animation: showAllReviews ? 'slideInUp 0.5s ease-out forwards' : 'none'
                            }}
                        >
                            <div className='flex items-start gap-4'>
                                {/* <div className='w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-semibold text-sm'>
                                    {(r.user_name || 'A').charAt(0).toUpperCase()}
                                </div> */}
                                <div className='flex-1'>
                                    <div className='flex items-center justify-between mb-2'>
                                        <div className='flex items-center gap-3'>
                                            <h3 className='font-medium capitalize text-[#2D2D2D]'>{r.user_name || 'Anonymous'}</h3>
                                            <Rating
                                                name="rating-read"
                                                value={Number(r.star_ratting) || 0}
                                                precision={0.5}
                                                readOnly
                                                size="small"
                                                className='text-green-500'
                                            />
                                        </div>
                                        <span className='text-xs text-black bg-gray-100 px-2 py-1 rounded-full'>
                                            {timeAgo(r.created_at)}
                                        </span>
                                    </div>
                                    <p className='text-[#3B3B3B] text-[15px] leading-relaxed'>{r.review}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {reviews.length > 5 && (
                    <div className='flex justify-center pt-4'>
                        <Button
                            onClick={() => setShowAllReviews(!showAllReviews)}
                            variant="outline"
                            className='flex text-[15px] font-medium items-center gap-2 px-6 py-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 hover:scale-105 active:scale-95 hover:cursor-pointer hover:text-gray-900'
                        >
                            {showAllReviews ? (
                                <>
                                    <ChevronUp className='w-4 h-4' />
                                    Show Less
                                </>
                            ) : (
                                <>
                                    <ChevronDown className='w-4 h-4' />
                                    See More ({reviews.length - 5} more)
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </div>
        )
    }, [loading, error, reviews, productId, displayedReviews, showAllReviews])

    return (
        <div>
            {content}
        </div>
    )
}

export default CustomerReviews
