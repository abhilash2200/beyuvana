"use client";

import HeaderText from "@/components/common/HeaderText";

const Page = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-[#1A2819] leading-relaxed">
      <HeaderText
        textalign="text-center"
        heading="Privacy Policy"
        textcolor="text-[#1A2819]"
      />

      <p className="mt-6">
        At <strong>Beyuvana</strong>, we value your privacy and are committed to protecting
        the personal information you share with us. This Privacy Policy explains
        how we collect, use, and safeguard your information when you visit our
        website or make a purchase.
      </p>

      <h2 className="mt-8 font-semibold text-lg">1. Information We Collect</h2>
      <p className="mt-2">
        We may collect the following types of information:
      </p>
      <ul className="list-disc ml-6 mt-2">
        <li>Personal details such as name, email, phone number, and shipping address.</li>
        <li>Payment information, which is securely processed by our payment gateway.</li>
        <li>Order history and preferences to improve your shopping experience.</li>
        <li>Cookies and browsing data to understand website usage.</li>
      </ul>

      <h2 className="mt-8 font-semibold text-lg">2. How We Use Your Information</h2>
      <p className="mt-2">
        Your information is used for the following purposes:
      </p>
      <ul className="list-disc ml-6 mt-2">
        <li>Processing and fulfilling your orders.</li>
        <li>Providing customer support and responding to inquiries.</li>
        <li>Sending promotional emails or updates (you can unsubscribe anytime).</li>
        <li>Improving website functionality and user experience.</li>
      </ul>

      <h2 className="mt-8 font-semibold text-lg">3. Data Security</h2>
      <p className="mt-2">
        We implement industry-standard security measures to protect your personal
        information from unauthorized access, disclosure, or alteration. Payment
        details are handled securely by trusted third-party gateways and are
        not stored on our servers.
      </p>

      <h2 className="mt-8 font-semibold text-lg">4. Sharing Your Information</h2>
      <p className="mt-2">
        We do not sell or rent your personal information to third parties. Your
        data may be shared only with trusted partners or service providers to
        fulfill orders, deliver products, or provide customer support.
      </p>

      <h2 className="mt-8 font-semibold text-lg">5. Cookies</h2>
      <p className="mt-2">
        Our website uses cookies to enhance your browsing experience and analyze
        website traffic. You can choose to disable cookies in your browser
        settings, but some features of the website may not function properly.
      </p>

      <h2 className="mt-8 font-semibold text-lg">6. Your Rights</h2>
      <p className="mt-2">
        You have the right to access, update, or request deletion of your
        personal information. To exercise these rights, please contact our
        support team.
      </p>

      <h2 className="mt-8 font-semibold text-lg">7. Contact Us</h2>
      <p className="mt-2">
        If you have questions or concerns about this Privacy Policy, please contact us at{" "}
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
