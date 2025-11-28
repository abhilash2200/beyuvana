"use client"

import React from "react"
import type { InvoiceData } from "@/lib/api/types"
import Image from "next/image"

interface InvoiceDisplayProps {
    invoiceData: InvoiceData
    invoiceNumber?: string
}

const InvoiceDisplay = ({
    invoiceData,
    invoiceNumber,
}: InvoiceDisplayProps) => {
    const {
        sold_by,
        bill_to,
        ship_to,
        items,
        summary,
        signature,
        invoice_date,
        order_date,
        order_id,
        invoice_number,
        payment_reference,
    } = invoiceData || {}

    // Format date (handles DD-MM-YYYY format)
    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return "N/A"
        try {
            // If already in DD-MM-YYYY format, return as is
            if (dateString.includes("-") && dateString.length === 10) {
                return dateString
            }
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

    // Extract PAN from GSTIN (first 10 characters before last 3)
    const extractPan = (gstin: string | undefined) => {
        if (gstin && gstin.length >= 10) {
            return gstin.substring(2, 12)
        }
        return "AABCN1929K"
    }

    // Provide default values for missing data
    const soldBy = sold_by || {
        name: "BTPL Distribution Private Limited",
        address: "Mouza Malipanchghara, JL. 17, LR. Dag no. 562, Howrah, Kolkata, West Bengal - 711204",
        gstin: "19AABCN1929K1Z8",
        irn: ""
    }

    const billTo = bill_to || {
        name: "",
        business: "",
        address: "",
        phone: "",
        gstin: null
    }

    const shipTo = ship_to || {
        name: "",
        address: "",
        phone: ""
    }

    const invoiceItems = items || []
    const invoiceSummary = summary || {
        total_items: 0,
        total_amount_before_discount: 0,
        total_discount: 0,
        taxable_value: 0,
        cgst: 0,
        sgst_utgst: 0,
        grand_total: 0
    }

    const pan = extractPan(soldBy.gstin)

    return (
        <div className="invoice-section bg-white p-6 md:p-8 max-w-5xl mx-auto shadow-lg print:shadow-none print:p-4 print:max-w-full print:mx-0">
            {/* Header Section */}
            <div className="border-b-2 border-gray-400 pb-4 mb-6 print:border-black invoice-section">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    {/* Left: Company Info */}
                    <div className="flex-1 min-w-0">
                        <div className="mb-2">
                            <p className="text-sm font-medium text-gray-700 mb-1">Sold By: {soldBy.name}</p>
                            <p className="text-xs text-gray-600 mb-1">Ship-from Address:</p>
                            <p className="text-xs text-gray-700 leading-relaxed">{soldBy.address}</p>
                        </div>
                        <div className="mt-3 space-y-1">
                            <p className="text-xs text-gray-700">GSTIN - {soldBy.gstin}</p>
                            {soldBy.irn && <p className="text-xs text-gray-700">IRN - {soldBy.irn}</p>}
                        </div>
                    </div>

                    {/* Center: Title */}
                    <div className="flex-1 text-center order-first md:order-none">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Tax Invoice</h1>
                    </div>

                    {/* Right: Invoice Number */}
                    <div className="flex-1 text-right min-w-0">
                        <p className="text-sm font-semibold text-gray-700">
                            Invoice Number #{invoiceNumber || invoice_number || "N/A"}
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
                        <p><span className="font-medium">Order ID:</span> {order_id || invoice_number || "N/A"}</p>
                        <p><span className="font-medium">Order Date:</span> {formatDate(order_date)}</p>
                        <p><span className="font-medium">Invoice Date:</span> {formatDate(invoice_date)}</p>
                        {payment_reference && <p><span className="font-medium">Payment Reference:</span> {payment_reference}</p>}
                        <p><span className="font-medium">PAN:</span> {pan}</p>
                    </div>
                </div>

                {/* Bill To */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-800 mb-3">Bill To</h3>
                    <div className="space-y-1 text-xs text-gray-700 capitalize">
                        <p className="font-medium text-gray-900">Name : {billTo.name || "N/A"}</p>
                        {billTo.business && <p className="text-gray-600">Business : {billTo.business}</p>}
                        <p>Address : {billTo.address || "N/A"}</p>
                        <p>Phone : {billTo.phone || "N/A"}</p>
                        {billTo.gstin && <p className="mt-2 font-medium">GSTIN: {billTo.gstin}</p>}
                    </div>
                </div>

                {/* Ship To */}
                <div className="capitalize">
                    <h3 className="text-sm font-semibold text-gray-800 mb-3">Ship To</h3>
                    <div className="space-y-1 text-xs text-gray-700 capitalize">
                        <p className="font-medium text-gray-900">Name : {shipTo.name || "N/A"}</p>
                        <p>Address : {shipTo.address || "N/A"}</p>
                        <p>Phone : {shipTo.phone || "N/A"}</p>
                        <p className="text-xs text-gray-500 mt-3 italic leading-relaxed">
                            *Keep this invoice and manufacturer box for warranty purposes.
                        </p>
                    </div>
                </div>
            </div>

            {/* Product Details Table */}
            <div className="mb-6 invoice-section">
                <p className="text-sm font-medium text-gray-700 mb-3 print:text-black">Total items: {invoiceSummary.total_items}</p>
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
                            {invoiceItems.map((item, index) => {
                                return (
                                    <tr key={index} className="border-b border-gray-300 print:border-black">
                                        <td className="p-2 border-r border-gray-400 print:border-black print:text-black">
                                            <div className="space-y-1">
                                                <p className="font-medium text-gray-900 print:text-black">{item.product}</p>
                                                <p className="text-gray-600 text-[10px] print:text-black">FSN: {item.fsn}</p>
                                                <p className="text-gray-600 text-[10px] print:text-black">HSN/SAC: {item.hsn_sac}</p>
                                            </div>
                                        </td>
                                        <td className="p-2 border-r border-gray-400 print:border-black print:text-black">
                                            <div className="space-y-1">
                                                <p className="text-gray-900 print:text-black">{item.title}</p>
                                                <p className="text-gray-600 text-[10px] print:text-black">Warranty: {item.warranty}</p>
                                                <p className="text-gray-600 text-[10px] print:text-black">
                                                    CGST: {item.cgst > 0 ? ((item.cgst / item.taxable_value) * 100).toFixed(1) : "0"}%
                                                </p>
                                                <p className="text-gray-600 text-[10px] print:text-black">
                                                    SGST/UTGST: {item.sgst_utgst > 0 ? ((item.sgst_utgst / item.taxable_value) * 100).toFixed(1) : "0"}%
                                                </p>
                                            </div>
                                        </td>
                                        <td className="text-center p-2 border-r border-gray-400 print:border-black print:text-black">{item.qty}</td>
                                        <td className="text-right p-2 border-r border-gray-400 print:border-black print:text-black">{item.gross_amount.toFixed(2)}</td>
                                        <td className="text-right p-2 border-r border-gray-400 print:border-black print:text-black">{item.discount.toFixed(2)}</td>
                                        <td className="text-right p-2 border-r border-gray-400 print:border-black print:text-black">{item.taxable_value.toFixed(2)}</td>
                                        <td className="text-right p-2 border-r border-gray-400 print:border-black print:text-black">{item.cgst.toFixed(2)}</td>
                                        <td className="text-right p-2 border-r border-gray-400 print:border-black print:text-black">{item.sgst_utgst.toFixed(2)}</td>
                                        <td className="text-right p-2 font-medium print:text-black">{item.total.toFixed(2)}</td>
                                    </tr>
                                )
                            })}

                            {/* Total Row */}
                            <tr className="bg-gray-100 border-t-2 border-gray-400 font-semibold print:bg-gray-200 print:border-black">
                                <td className="p-2 border-r border-gray-400 print:border-black"></td>
                                <td className="p-2 border-r border-gray-400 print:border-black print:text-black">Total</td>
                                <td className="text-center p-2 border-r border-gray-400 print:border-black print:text-black">{invoiceSummary.total_items}</td>
                                <td className="text-right p-2 border-r border-gray-400 print:border-black print:text-black">{invoiceSummary.total_amount_before_discount.toFixed(2)}</td>
                                <td className="text-right p-2 border-r border-gray-400 print:border-black print:text-black">-{invoiceSummary.total_discount.toFixed(2)}</td>
                                <td className="text-right p-2 border-r border-gray-400 print:border-black print:text-black">{invoiceSummary.taxable_value.toFixed(2)}</td>
                                <td className="text-right p-2 border-r border-gray-400 print:border-black print:text-black">{invoiceSummary.cgst.toFixed(2)}</td>
                                <td className="text-right p-2 border-r border-gray-400 print:border-black print:text-black">{invoiceSummary.sgst_utgst.toFixed(2)}</td>
                                <td className="text-right p-2 print:text-black">{invoiceSummary.grand_total.toFixed(2)}</td>
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
                            <p className="text-xl font-bold text-gray-900">₹{invoiceSummary.grand_total.toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-gray-300">
                        <div className="mb-2">
                            <p className="text-sm font-semibold text-gray-800">{signature || "Authorized Signatory - BTPL Distribution Private Limited"}</p>
                        </div>
                        <div className="mt-2">
                            <Image src="/assets/img/signature.jpg" alt="Signature" width={100} height={100} className="w-48 h-48 object-contain" />
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
