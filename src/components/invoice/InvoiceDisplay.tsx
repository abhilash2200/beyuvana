"use client"

import React from "react"
import type { OrderDetailsData } from "@/lib/api/types"

interface InvoiceDisplayProps {
    orderDetails: OrderDetailsData
    invoiceNumber?: string
    gstin?: string
    irn?: string
    companyName?: string
    companyAddress?: string
    companyPan?: string
}

const InvoiceDisplay = ({
    orderDetails,
    invoiceNumber,
    gstin = "19AABCN1929K1Z8", // Placeholder - should be configured
    irn,
    companyName = "BEYUVANA™",
    companyAddress = "Kolkata, West Bengal, India",
    companyPan = "AABCN1929K",
}: InvoiceDisplayProps) => {
    const { order_details, item_list, address } = orderDetails

    // Format date
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString)
            return date.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            })
        } catch {
            return dateString
        }
    }

    // Calculate totals
    const grossAmount = parseFloat(order_details.gross_amount || "0")
    const discountAmount = parseFloat(order_details.discount_amount || "0")
    const gstAmount = parseFloat(order_details.gst_amount || "0")
    const paidAmount = parseFloat(order_details.paid_amount || "0")

    // Calculate taxable value (gross - discount, before GST)
    const taxableValue = grossAmount - discountAmount - gstAmount

    // Calculate CGST and SGST (assuming equal split, 9% each = 18% total)
    const cgstRate = 9.0
    const sgstRate = 9.0
    const cgstAmount = gstAmount / 2
    const sgstAmount = gstAmount / 2

    // Calculate shipping (if any)
    const shippingAmount = 0 // This would come from order details if available

    return (
        <div className="invoice-section bg-white p-6 md:p-8 max-w-5xl mx-auto shadow-lg print:shadow-none print:p-4 print:max-w-full print:mx-0">
            {/* Header Section */}
            <div className="border-b-2 border-gray-400 pb-4 mb-6 print:border-black invoice-section">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    {/* Left: Company Info */}
                    <div className="flex-1 min-w-0">
                        <div className="mb-2">
                            <p className="text-sm font-medium text-gray-700 mb-1">Sold By: {companyName}</p>
                            <p className="text-xs text-gray-600 mb-1">Ship-from Address:</p>
                            <p className="text-xs text-gray-700 leading-relaxed">{companyAddress}</p>
                        </div>
                        <div className="mt-3 space-y-1">
                            <p className="text-xs text-gray-700">GSTIN - {gstin}</p>
                            {irn && <p className="text-xs text-gray-700">IRN - {irn}</p>}
                        </div>
                    </div>

                    {/* Center: Title */}
                    <div className="flex-1 text-center order-first md:order-none">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Tax Invoice</h1>
                    </div>

                    {/* Right: Invoice Number & QR */}
                    <div className="flex-1 text-right min-w-0">
                        {/* <div className="mb-2 flex justify-end">
                            <div className="w-24 h-24 bg-gray-200 border-2 border-gray-400 flex items-center justify-center print:border-gray-600">
                                <span className="text-xs text-gray-500 text-center px-2">QR Code</span>
                            </div>
                        </div> */}
                        <p className="text-sm font-semibold text-gray-700">
                            Invoice Number #{invoiceNumber || order_details.order_no}
                        </p>
                    </div>
                </div>
            </div>

            {/* Order, Billing, Shipping Details - Three Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 pb-4 border-b-2 border-gray-300 print:border-black print:grid-cols-3 invoice-section">
                {/* Order Details */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-800 mb-3">Order Details</h3>
                    <div className="space-y-1.5 text-xs text-gray-700">
                        <p><span className="font-medium">Order ID:</span> {order_details.order_no}</p>
                        <p><span className="font-medium">Order Date:</span> {formatDate(order_details.created_date)}</p>
                        <p><span className="font-medium">Invoice Date:</span> {formatDate(order_details.created_date)}</p>
                        <p><span className="font-medium">PAN:</span> {companyPan}</p>
                    </div>
                </div>

                {/* Bill To */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-800 mb-3">Bill To</h3>
                    <div className="space-y-1 text-xs text-gray-700 capitalize">
                        <p className="font-medium text-gray-900">Name : {address.fullname}</p>
                        {address.email && <p className="text-gray-600">Email : {address.email}</p>}
                        <p>Address : {address.address1}<span>{address.address2 && <span>, {address.address2}</span>}</span></p>
                        <p>City : {address.city} {address.pincode} {address.city && "West Bengal"}</p>
                        <p>Phone : {address.mobile ? address.mobile.replace(/(\d{2})(\d{4})(\d{4})/, "xxxxxxxxxx") : "xxxxxxxxxx"}</p>
                        {order_details.gst_no && <p className="mt-2 font-medium">{order_details.gst_no}</p>}
                    </div>
                </div>

                {/* Ship To */}
                <div className="capitalize">
                    <h3 className="text-sm font-semibold text-gray-800 mb-3">Ship To</h3>
                    <div className="space-y-1 text-xs text-gray-700 capitalize">
                        <p className="font-medium text-gray-900">Name : {address.fullname}</p>
                        <p>Address : {address.address1}<span>{address.address2 && <span>, {address.address2}</span>}</span></p>
                        <p>City : {address.city} {address.pincode} {address.city && "West Bengal"}</p>
                        <p>Phone : {address.mobile ? address.mobile.replace(/(\d{2})(\d{4})(\d{4})/, "xxxxxxxxxx") : "xxxxxxxxxx"}</p>
                        <p className="text-xs text-gray-500 mt-3 italic leading-relaxed">
                            *Keep this invoice and manufacturer box for warranty purposes.
                        </p>
                    </div>
                </div>
            </div>

            {/* Product Details Table */}
            <div className="mb-6 invoice-section">
                <p className="text-sm font-medium text-gray-700 mb-3 print:text-black">Total items: {item_list.length}</p>
                <div className="overflow-x-auto print:overflow-visible">
                    <table className="w-full border-collapse text-xs border border-gray-400 print:border-black">
                        <thead>
                            <tr className="bg-gray-100 border-b-2 border-gray-400 print:bg-gray-200 print:border-black">
                                <th className="text-left p-2 border-r border-gray-400 font-semibold print:border-black print:text-black">Product</th>
                                <th className="text-left p-2 border-r border-gray-400 font-semibold print:border-black print:text-black">Title</th>
                                <th className="text-center p-2 border-r border-gray-400 font-semibold print:border-black print:text-black">Qty</th>
                                <th className="text-right p-2 border-r border-gray-400 font-semibold print:border-black print:text-black">Gross Amount ₹</th>
                                <th className="text-right p-2 border-r border-gray-400 font-semibold print:border-black print:text-black">Discounts /Coupons ₹</th>
                                <th className="text-right p-2 border-r border-gray-400 font-semibold print:border-black print:text-black">Taxable Value ₹</th>
                                <th className="text-right p-2 border-r border-gray-400 font-semibold print:border-black print:text-black">CGST ₹</th>
                                <th className="text-right p-2 border-r border-gray-400 font-semibold print:border-black print:text-black">SGST /UTGST ₹</th>
                                <th className="text-right p-2 font-semibold print:text-black">Total ₹</th>
                            </tr>
                        </thead>
                        <tbody>
                            {item_list.map((item, index) => {
                                const itemGross = parseFloat(item.total_sale_price || "0") + parseFloat(item.discount_amount || "0")
                                const itemDiscount = parseFloat(item.discount_amount || "0")
                                const itemGst = parseFloat(item.gst_amount || "0")
                                const itemTaxable = itemGross - itemDiscount - itemGst
                                const itemCgst = itemGst / 2
                                const itemSgst = itemGst / 2
                                const itemTotal = parseFloat(item.total_sale_price || "0")

                                return (
                                    <tr key={item.id || index} className="border-b border-gray-300 print:border-black">
                                        <td className="p-2 border-r border-gray-400 print:border-black print:text-black">
                                            <div className="space-y-1">
                                                <p className="font-medium text-gray-900 print:text-black">{item.product_name}</p>
                                                <p className="text-gray-600 text-[10px] print:text-black">FSN: {item.sku_number || item.product_code}</p>
                                                <p className="text-gray-600 text-[10px] print:text-black">HSN/SAC: 85176290</p>
                                            </div>
                                        </td>
                                        <td className="p-2 border-r border-gray-400 print:border-black print:text-black">
                                            <div className="space-y-1">
                                                <p className="text-gray-900 print:text-black">{item.product_name}</p>
                                                <p className="text-gray-600 text-[10px] print:text-black">Warranty: 1 Year Warranty on Product</p>
                                                <p className="text-gray-600 text-[10px] print:text-black">CGST: {cgstRate}%</p>
                                                <p className="text-gray-600 text-[10px] print:text-black">SGST/UTGST: {sgstRate}%</p>
                                            </div>
                                        </td>
                                        <td className="text-center p-2 border-r border-gray-400 print:border-black print:text-black">{item.qty}</td>
                                        <td className="text-right p-2 border-r border-gray-400 print:border-black print:text-black">{itemGross.toFixed(2)}</td>
                                        <td className="text-right p-2 border-r border-gray-400 print:border-black print:text-black">{itemDiscount.toFixed(2)}</td>
                                        <td className="text-right p-2 border-r border-gray-400 print:border-black print:text-black">{itemTaxable.toFixed(2)}</td>
                                        <td className="text-right p-2 border-r border-gray-400 print:border-black print:text-black">{itemCgst.toFixed(2)}</td>
                                        <td className="text-right p-2 border-r border-gray-400 print:border-black print:text-black">{itemSgst.toFixed(2)}</td>
                                        <td className="text-right p-2 font-medium print:text-black">{itemTotal.toFixed(2)}</td>
                                    </tr>
                                )
                            })}

                            {/* Shipping Row (if applicable) */}
                            {shippingAmount > 0 && (
                                <tr className="border-b border-gray-300">
                                    <td className="p-2 border-r border-gray-400"></td>
                                    <td className="p-2 border-r border-gray-400">Shipping And Handling Charges</td>
                                    <td className="text-center p-2 border-r border-gray-400">1</td>
                                    <td className="text-right p-2 border-r border-gray-400">{shippingAmount.toFixed(2)}</td>
                                    <td className="text-right p-2 border-r border-gray-400">-{shippingAmount.toFixed(2)}</td>
                                    <td className="text-right p-2 border-r border-gray-400">0.00</td>
                                    <td className="text-right p-2 border-r border-gray-400">0.00</td>
                                    <td className="text-right p-2 border-r border-gray-400">0.00</td>
                                    <td className="text-right p-2">0.00</td>
                                </tr>
                            )}

                            {/* Total Row */}
                            <tr className="bg-gray-100 border-t-2 border-gray-400 font-semibold print:bg-gray-200 print:border-black">
                                <td className="p-2 border-r border-gray-400 print:border-black"></td>
                                <td className="p-2 border-r border-gray-400 print:border-black print:text-black">Total</td>
                                <td className="text-center p-2 border-r border-gray-400 print:border-black print:text-black">{order_details.qty || item_list.length}</td>
                                <td className="text-right p-2 border-r border-gray-400 print:border-black print:text-black">{grossAmount.toFixed(2)}</td>
                                <td className="text-right p-2 border-r border-gray-400 print:border-black print:text-black">-{discountAmount.toFixed(2)}</td>
                                <td className="text-right p-2 border-r border-gray-400 print:border-black print:text-black">{taxableValue.toFixed(2)}</td>
                                <td className="text-right p-2 border-r border-gray-400 print:border-black print:text-black">{cgstAmount.toFixed(2)}</td>
                                <td className="text-right p-2 border-r border-gray-400 print:border-black print:text-black">{sgstAmount.toFixed(2)}</td>
                                <td className="text-right p-2 print:text-black">{paidAmount.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Grand Total and Signature */}
            <div className="border-t-2 border-gray-400 pt-6 mt-6 print:border-black invoice-section grand-total-section">
                <div className="grand-total-wrapper">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <p className="text-xl font-bold text-gray-900">Grand Total</p>
                        </div>
                        <div>
                            <p className="text-xl font-bold text-gray-900">₹{paidAmount.toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-gray-300">
                        <div className="mb-2">
                            <p className="text-sm font-semibold text-gray-800">{companyName}</p>
                        </div>
                        <div className="mt-16">
                            <div className="border-b-2 border-gray-600 w-48 mb-1"></div>
                            <p className="text-xs text-gray-600">Authorized Signatory</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InvoiceDisplay

