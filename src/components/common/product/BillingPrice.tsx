"use client"

interface BillingPriceProps {
    userName: string;
    order: {
        address: string;
        bagPrice: number;
        discount: number;
        deliveryPrice: number;
    };
    orderDetails?: {
        order_details: {
            order_no: string;
            txn_id: string;
            created_date: string;
            pay_status: string;
            pay_mode: string;
            pay_gateway_name: string;
            paid_amount: string;
            discount_amount: string;
            gst_amount: string;
            gross_amount: string;
        };
        address: {
            fullname: string;
            address1: string;
            address2?: string;
            city: string;
            pincode: string;
            mobile: string;
            email: string;
        };
        item_list: Array<{
            product_name: string;
            sku_number: string;
            product_code: string;
            image: string;
            total_sale_price: string;
            qty: string;
            discount_amount: string;
        }>;
    };
}

const BillingPrice = ({ userName, order, orderDetails }: BillingPriceProps) => {
    return (
        <div>
            {/* Order Details Section */}
            {orderDetails && (
                <div className="bg-[#F2F9F3] border border-gray-200 rounded-[20px] p-6 mb-4 space-y-4">
                    <h3 className="text-lg font-[Grafiels] text-[#1A2819]">Order Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                            <p className="text-sm text-[#1A2819]">Order Number</p>
                            <p className="font-normal text-black text-[14px]">{orderDetails.order_details.order_no}</p>
                        </div>
                        <div>
                            <p className="text-sm text-[#1A2819]">Transaction ID</p>
                            <p className="font-normal text-black text-[14px]">{orderDetails.order_details.txn_id}</p>
                        </div>
                        <div>
                            <p className="text-sm text-[#1A2819]">Order Date</p>
                            <p className="font-normal text-black text-[14px]">{new Date(orderDetails.order_details.created_date).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-[#1A2819]">Payment Status</p>
                            <p className={`font-normal text-black text-[14px] ${orderDetails.order_details.pay_status === 'SUCCESS' ? 'text-green-600' : 'text-red-600'}`}>
                                {orderDetails.order_details.pay_status}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-[#1A2819]">Payment Method</p>
                            <p className="font-normal text-black text-[14px]">{orderDetails.order_details.pay_mode}</p>
                        </div>
                    </div>

                    {/* Payment Details */}
                    {/* <div className="mt-4">
                        <h4 className="text-md font-[Grafiels] text-[#1A2819] mb-2">Payment Details</h4>
                        <div className="p-4 rounded border border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div>
                                    <p className="text-sm text-gray-600">Gateway</p>
                                    <p className="font-medium">{orderDetails.order_details.pay_gateway_name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Amount Paid</p>
                                    <p className="font-medium">₹{orderDetails.order_details.paid_amount}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Discount</p>
                                    <p className="font-medium text-green-600">₹{orderDetails.order_details.discount_amount}</p>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>
            )}
            <div className="bg-[#F2F9F3] border border-gray-200 rounded-[20px] p-6 space-y-4">
                <h3 className="text-lg font-[Grafiels] text-[#1A2819]">Billing Information</h3>
                <p className="text-sm text-gray-600 capitalize">
                    {orderDetails?.address?.fullname || userName} <br />
                    {orderDetails?.address?.address1}, {orderDetails?.address?.address2 && `${orderDetails.address.address2}, `}{orderDetails?.address?.city} - {orderDetails?.address?.pincode}
                </p>

                <div className="mt-6 space-y-3">
                    <h3 className="text-lg font-[Grafiels] text-[#1A2819]">Price Summary</h3>

                    <div className="text-[13px]">
                        <div className="flex justify-between items-center py-1">
                            <span className="text-gray-700">Bag Price</span>
                            <span className="font-medium">₹{order.bagPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                            <span className="text-gray-700">Discounted Price</span>
                            <span className="font-medium text-green-600">-₹{order.discount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                            <span className="text-gray-700">Delivery Price</span>
                            <span className="font-medium">₹{order.deliveryPrice.toFixed(2)}</span>
                        </div>
                    </div>

                    <hr className="my-4 border-gray-200 border-dashed" />

                    <div className="text-[13px]">
                        <div className="flex justify-between items-center py-1">
                            <span className="text-gray-700">Total Price</span>
                            <span className="font-medium">₹{orderDetails?.order_details?.gross_amount || "0.00"}</span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                            <span className="text-gray-700">GST</span>
                            <span className="font-medium">₹{orderDetails?.order_details?.gst_amount || "0.00"}</span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                            <span className="text-gray-700">Total</span>
                            <span className="font-medium">₹{orderDetails?.order_details?.paid_amount || "0.00"}</span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                            <span className="text-gray-700">Round Off</span>
                            <span className="font-medium">₹0.00</span>
                        </div>
                        <hr className="my-3 border-gray-200 border-dashed" />
                        <div className="flex justify-between items-center py-2 px-3 rounded-md">
                            <span className="font-semibold text-green-700">Total Payable</span>
                            <span className="font-bold text-lg text-green-700">₹{orderDetails?.order_details?.paid_amount || "0.00"}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BillingPrice