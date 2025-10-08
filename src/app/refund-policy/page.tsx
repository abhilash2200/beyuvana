"use client";

import HeaderText from "@/components/common/HeaderText";

const Page = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-[#1A2819] leading-relaxed">
      <HeaderText
        textalign="text-center"
        heading="Refund Policy"
        textcolor="text-[#1A2819]"
      />

      <p className="mt-6">
        At <strong>Beyuvana</strong>, we are committed to ensuring your satisfaction
        with our collagen products. Please read our refund policy carefully before
        making a purchase.
      </p>

      <h2 className="mt-8 font-semibold text-lg">1. Eligibility for Refund</h2>
      <p className="mt-2">
        Refunds are applicable only in the following cases:
      </p>
      <ul className="list-disc ml-6 mt-2">
        <li>Products received are damaged during shipping.</li>
        <li>Incorrect or wrong product was delivered.</li>
        <li>Defective product due to manufacturing issues.</li>
      </ul>

      <h2 className="mt-8 font-semibold text-lg">2. Non-Refundable Items</h2>
      <p className="mt-2">
        Please note that we <strong>do not accept returns or refunds</strong> for:
      </p>
      <ul className="list-disc ml-6 mt-2">
        <li>Products that have been opened or used.</li>
        <li>Products damaged due to mishandling by the customer.</li>
        <li>Change of mind after receiving the product.</li>
      </ul>

      <h2 className="mt-8 font-semibold text-lg">3. Refund Process</h2>
      <p className="mt-2">
        To request a refund, please contact our support team within <strong>48 hours</strong> of
        receiving the product. Provide your order number, product details, and
        photos showing the issue (if applicable). Upon verification, we will
        process your refund within <strong>7–10 business days</strong> using the original
        payment method.
      </p>

      <h2 className="mt-8 font-semibold text-lg">4. Replacement Policy</h2>
      <p className="mt-2">
        If you receive a damaged or incorrect item, you may request a replacement
        instead of a refund. We will ship the replacement at no additional cost.
      </p>

      <h2 className="mt-8 font-semibold text-lg">5. Contact Us</h2>
      <p className="mt-2">
        For any questions or refund requests, please contact us at{" "}
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
