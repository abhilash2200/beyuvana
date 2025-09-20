"use client"

interface BillingPriceProps {
    userName: string;
    order: {
        address: string;
        bagPrice: number;
        discount: number;
        deliveryPrice: number;
    };
}

const BillingPrice = ({ userName, order }: BillingPriceProps) => {
    return (
        <div>
            <div className="bg-green-50 px-6 py-10 rounded-[20px] shadow-sm space-y-4">
                <h3 className="text-[18px] font-[Grafiels] text-[#1A2819]">Billing Information</h3>
                <p className="text-sm text-gray-600 capitalize">
                    {userName} <br />
                    {order.address}
                </p>

                <div className="mt-4 space-y-1 text-sm text-gray-700">
                    <h3 className="text-[18px] font-[Grafiels] text-[#1A2819]">Order Summary</h3>
                    <div className="flex justify-between"><span>Bag Price</span><span>₹{order.bagPrice.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Discounted Price</span><span>- ₹{order.discount.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Delivery Price</span><span>₹{order.deliveryPrice.toFixed(2)}</span></div>

                    <hr className="my-2 border-gray-300" />

                    {(() => {
                        const totalPrice = order.bagPrice - order.discount + order.deliveryPrice;
                        const gst = totalPrice * 0.18; // 18% GST
                        const total = totalPrice + gst;
                        const roundOff = Math.round(total) - total;
                        const totalPayable = total + roundOff;

                        return (
                            <>
                                <div className="flex justify-between"><span>Total Price</span><span>₹{totalPrice.toFixed(2)}</span></div>
                                <div className="flex justify-between"><span>GST (18%)</span><span>₹{gst.toFixed(2)}</span></div>
                                <div className="flex justify-between"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
                                <div className="flex justify-between"><span>Round Off</span><span>₹{roundOff.toFixed(2)}</span></div>
                                <div className="flex justify-between font-semibold text-green-700"><span>Total Payable</span><span>₹{totalPayable.toFixed(2)}</span></div>
                            </>
                        );
                    })()}
                </div>
            </div>
        </div>
    )
}

export default BillingPrice