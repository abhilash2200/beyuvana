"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { orderDetailsApi } from "@/lib/api/orders"
import type { OrderDetailsData } from "@/lib/api/types"
import { useAuth } from "@/context/AuthProvider"
import { toast } from "react-toastify"
import { ErrorBoundary } from "@/components/common/ErrorBoundary"
import { logger } from "@/lib/logger"
import { handleError } from "@/lib/error-handling"
import { LoadingSpinner } from "@/components/common/LoadingSpinner"
import { Button } from "@/components/ui/button"
import InvoiceDisplay from "@/components/invoice/InvoiceDisplay"
import { PiFilePdfBold } from "react-icons/pi"

function InvoicePageContent() {
    const searchParams = useSearchParams()
    const orderIdParam = searchParams.get("orderId")

    const [orderDetails, setOrderDetails] = useState<OrderDetailsData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { user, sessionKey } = useAuth()

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!orderIdParam) {
                setError("No order ID provided")
                setLoading(false)
                return
            }

            if (!user || !sessionKey) {
                setError("Please log in to view your invoice")
                toast.warning("Please log in to view your invoice")
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                setError(null)

                const response = await orderDetailsApi.getOrderDetails(orderIdParam, user.id.toString(), sessionKey)

                if (response && response.status && response.data) {
                    setOrderDetails(response.data)
                } else {
                    setError(response?.message || "Failed to load invoice details")
                    toast.error(response?.message || "Failed to load invoice details")
                }
            } catch (err) {
                logger.error("Failed to fetch order details", err, "invoice/page")
                const appError = handleError(err, {
                    context: "invoice/page",
                    userMessage: "Failed to load invoice. Please try again.",
                })
                setError(appError.userMessage || "Failed to load invoice")
                toast.error(appError.userMessage || "Failed to load invoice")
            } finally {
                setLoading(false)
            }
        }

        fetchOrderDetails()
    }, [orderIdParam, user, sessionKey])

    const handleSaveAsPdf = () => {
        // Trigger browser print dialog
        window.print()
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20 min-h-[400px]">
                <LoadingSpinner size="lg" text="Loading invoice..." />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex justify-center items-center py-20 min-h-[400px]">
                <div className="text-center max-w-md">
                    <div className="text-red-600">
                        <p className="text-lg font-semibold mb-2">Error</p>
                        <p>{error}</p>
                    </div>
                </div>
            </div>
        )
    }

    if (!orderDetails) {
        return (
            <div className="flex justify-center items-center py-20 min-h-[400px]">
                <div className="text-center max-w-md">
                    <div className="text-gray-600">
                        <p className="text-lg font-semibold mb-2">Invoice Not Found</p>
                        <p>The invoice you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
                    @media print {
                        @page {
                            size: A4;
                            margin: 0.5cm;
                        }
                        
                        body {
                            margin: 0 !important;
                            padding: 0 !important;
                            background: white !important;
                        }
                        
                        /* Hide button */
                        .no-print {
                            display: none !important;
                        }
                        
                        /* Ensure invoice container is visible */
                        .invoice-container {
                            display: block !important;
                            width: 100% !important;
                            max-width: 100% !important;
                            margin: 0 !important;
                            padding: 0 !important;
                            background: white !important;
                        }
                        
                        /* Remove shadows */
                        .invoice-container * {
                            box-shadow: none !important;
                        }
                        
                        /* Force three-column layout for Order Details, Bill To, Ship To */
                        .grid {
                            display: grid !important;
                            grid-template-columns: repeat(3, 1fr) !important;
                            gap: 1rem !important;
                        }
                        
                        /* Ensure grid items don't collapse */
                        .grid > div {
                            width: 100% !important;
                            min-width: 0 !important;
                            max-width: 100% !important;
                        }
                        
                        /* Ensure table doesn't break */
                        table {
                            page-break-inside: avoid !important;
                            break-inside: avoid !important;
                        }
                        
                        thead {
                            display: table-header-group !important;
                        }
                        
                        tbody {
                            display: table-row-group !important;
                        }
                        
                        tr {
                            page-break-inside: avoid !important;
                            break-inside: avoid !important;
                        }
                        
                        /* Prevent page breaks in middle of sections */
                        .invoice-section {
                            page-break-inside: avoid !important;
                            break-inside: avoid !important;
                        }
                        
                        /* Keep Grand Total and Signature together on one page */
                        .grand-total-section {
                            page-break-inside: avoid !important;
                            break-inside: avoid !important;
                            page-break-before: auto !important;
                        }
                        
                        /* Ensure Grand Total and Signature don't break apart */
                        .grand-total-wrapper {
                            page-break-inside: avoid !important;
                            break-inside: avoid !important;
                        }
                        
                        .grand-total-section > div {
                            page-break-inside: avoid !important;
                            break-inside: avoid !important;
                        }
                        
                        /* Print colors */
                        * {
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                            color-adjust: exact !important;
                        }
                    }
                `
            }} />
            <div className="h-screen">
                <div className="container mx-auto px-4">
                    {/* Invoice Display */}
                    <div className="invoice-container px-4 md:px-6 rounded-lg mb-6">
                        <InvoiceDisplay
                            orderDetails={orderDetails}
                            invoiceNumber={orderDetails.order_details.order_no}
                        />
                    </div>

                    {/* Save as PDF Button */}
                    <div className="flex justify-center no-print">
                        <Button
                            onClick={handleSaveAsPdf}
                            variant="default"
                            className="flex items-center gap-2 bg-[#057A37] hover:bg-[#04662a] text-white px-8 py-3 text-base font-medium"
                        >
                            <PiFilePdfBold size={20} />
                            <span>Save as PDF</span>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}

const InvoicePage = () => {
    return (
        <ErrorBoundary>
            <Suspense
                fallback={
                    <div className="flex justify-center items-center py-20 min-h-[400px]">
                        <LoadingSpinner size="lg" text="Loading..." />
                    </div>
                }
            >
                <InvoicePageContent />
            </Suspense>
        </ErrorBoundary>
    )
}

export default InvoicePage
