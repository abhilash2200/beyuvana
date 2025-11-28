"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { invoiceApi } from "@/lib/api/invoice"
import { orderDetailsApi } from "@/lib/api/orders"
import type { InvoiceData } from "@/lib/api/types"
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
    const orderNoParam = searchParams.get("orderNo") || searchParams.get("orderId")

    const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { user, sessionKey } = useAuth()

    useEffect(() => {
        const fetchInvoice = async () => {
            if (!orderNoParam) {
                setError("No order number provided")
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

                const userId = parseInt(user.id)
                if (isNaN(userId)) {
                    throw new Error("Invalid user ID")
                }

                // Check if orderNoParam is a numeric ID or an order number
                // Order numbers typically start with "ORD" or similar prefix
                // If it's just a number, we need to fetch order details first to get the order number
                let actualOrderNo = orderNoParam
                const isNumericId = /^\d+$/.test(orderNoParam || "")

                if (isNumericId && orderNoParam) {
                    // It's a numeric ID, fetch order details to get the order number
                    try {
                        const orderDetailsResponse = await orderDetailsApi.getOrderDetails(
                            orderNoParam,
                            user.id.toString(),
                            sessionKey
                        )

                        if (orderDetailsResponse && orderDetailsResponse.status && orderDetailsResponse.data) {
                            actualOrderNo = orderDetailsResponse.data.order_details.order_no
                        } else {
                            throw new Error(orderDetailsResponse?.message || "Failed to fetch order details. Please check the order ID.")
                        }
                    } catch (orderError) {
                        throw new Error(`Failed to fetch order details: ${orderError instanceof Error ? orderError.message : "Unknown error"}`)
                    }
                }

                const response = await invoiceApi.getInvoice(userId, actualOrderNo, sessionKey)

                // Check if response is valid
                if (!response) {
                    setError("No response received from server")
                    toast.error("No response received from server")
                    return
                }

                // The API returns: { status: true, message: "...", code: 200, data: {...} }
                // When record is found: data is an object
                // When record is not found: data is an empty array [] and message is "Record not found"

                if (response.status === true && response.data) {
                    // Check if data is an array (record not found case)
                    if (Array.isArray(response.data)) {
                        if (response.data.length === 0) {
                            // Empty array means record not found
                            const errorMsg = response.message || "Invoice not found. Please check the order number."
                            setError(errorMsg)
                            toast.error(errorMsg)
                            return
                        }
                        // If array has items, it's unexpected - show error
                        setError("Invalid invoice data format received from server")
                        toast.error("Invalid invoice data format received from server")
                        return
                    }

                    // Check if data has the expected structure (object)
                    if (typeof response.data === 'object' && response.data !== null) {
                        setInvoiceData(response.data as InvoiceData)
                    } else {
                        setError("Invalid invoice data received from server")
                        toast.error("Invalid invoice data received from server")
                    }
                } else {
                    // Handle case where status is false or data is missing
                    const errorMsg = response?.message || `Failed to load invoice. Status: ${response?.status}, Has data: ${!!response?.data}`
                    setError(errorMsg)
                    toast.error(errorMsg)
                }
            } catch (err) {
                logger.error("Failed to fetch invoice", err, "invoice/page")
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

        fetchInvoice()
    }, [orderNoParam, user, sessionKey])

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

    if (!invoiceData) {
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
                            invoiceData={invoiceData}
                            invoiceNumber={invoiceData.invoice_number}
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
