"use client";

import HeaderText from "@/components/common/HeaderText";

const Page = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-[#1A2819] leading-relaxed">
      <HeaderText
        textalign="text-center"
        heading="Cancellation Policy"
        textcolor="text-[#1A2819]"
      />

      <p className="mt-6">
        At <strong>Beyuvana</strong>, we understand that sometimes you may need to
        cancel your order. Please read our cancellation policy carefully to know
        your options.
      </p>

      <h2 className="mt-8 font-semibold text-lg">1.Order Cancelling Window</h2>
      <p className="mt-2">
        Orders can be canceled within <strong>2 hours</strong> of placing the order, before
        the order is processed for shipping. Once the order has been processed,
        it cannot be canceled.
      </p>

      <h2 className="mt-8 font-semibold text-lg">2. How to Cancel</h2>
      <p className="mt-2">
        To cancel an order, please contact our customer support team immediately
        via email or phone, providing your order number and cancellation reason.
        Our team will confirm the cancellation if it is within the allowed time
        frame.
      </p>

      <h2 className="mt-8 font-semibold text-lg">3. Refunds for Canceled Orders</h2>
      <p className="mt-2">
        If your order is successfully canceled within the allowed window, a full
        refund will be processed using the original payment method within{" "}
        <strong>7–10 business days</strong>. Refund processing times may vary based
        on your bank or payment provider.
      </p>

      <h2 className="mt-8 font-semibold text-lg">4. Orders Already Shipped</h2>
      <p className="mt-2">
        Once the order has been shipped, it cannot be canceled. You may refer
        to our <strong>Return & Refund Policy</strong> if you wish to return the
        product after delivery.
      </p>

      <h2 className="mt-8 font-semibold text-lg">5. Contact Us</h2>
      <p className="mt-2">
        For cancellations or inquiries regarding your order, please contact us at{" "}
        <a href="mailto:support@beyuvana.com" className="text-[#057A37]">
          support@beyuvana.com
        </a>.
      </p>

      <p className="mt-8 text-sm italic">
        © {new Date().getFullYear()} Beyuvana. All rights reserved.
      </p>
    </div>
  );
};

export default Page;
