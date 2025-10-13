"use client";

import HeaderText from "@/components/common/HeaderText";

const Page = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-10 text-[#1A2819] leading-relaxed">
            <HeaderText
                textalign="text-center"
                heading="Terms and Conditions"
                textcolor="text-[#1A2819]"
            />

            <div className="mt-3 text-center">
                <p className="mt-3">
                    Effective Date: October 2025
                </p>
            </div>


            <p className="mt-6">
                Welcome to <strong>BEYUVANA™</strong>, a premium wellness brand offering supplements made with plant-based actives and lab-tested ingredients.
            </p>
            <p className="mt-1">
                By accessing or purchasing from our website (the “Site”), you agree to the following Terms & Conditions.
            </p>

            <h2 className="mt-8 font-semibold text-lg">1. General</h2>
            <p className="mt-2">
                These Terms apply to all users of the website, including browsers and customers.
            </p>
            <p className="mt-1">
                BEYUVANA™ reserves the right to update or modify these Terms at any time without prior notice.
            </p>

            <h2 className="mt-8 font-semibold text-lg">2. Product Information</h2>
            <p className="mt-2">
                Our products are formulated using scientifically backed, lab-tested plant-based actives designed to promote inner wellness and beauty.
            </p>
            <p className="mt-1">
                While we ensure accurate product details, minor variations in packaging or formulation may occur due to quality improvements or ingredient updates.
            </p>

            <h2 className="mt-8 font-semibold text-lg">3. Use of Website</h2>
            <p className="mt-2">
                By using this site, you confirm that you are 18 years or older and agree to use it lawfully. Any misuse, data scraping, or unauthorized use of our content is strictly prohibited.
            </p>

            <h2 className="mt-8 font-semibold text-lg">4. Orders & Payments</h2>
            <p className="mt-2">
                All prices are in INR (Indian Rupees) and inclusive of GST.
            </p>
            <p className="mt-1">
                We accept UPI, Credit/Debit Cards, Net Banking, and Cash on Delivery (COD) (where available).
            </p>
            <p className="mt-1">
                BEYUVANA™ reserves the right to cancel any order in case of payment failure, suspected fraud, or stock unavailability.
            </p>

            <h2 className="mt-8 font-semibold text-lg">5. Shipping & Delivery</h2>
            <p className="mt-2">
                Orders are dispatched within 24 hours and delivered across India through Shiprocket.
            </p>
            <p className="mt-1">
                Delivery timelines are estimated and may vary due to courier delays, weather conditions, or regional restrictions.
            </p>

            <h2 className="mt-8 font-semibold text-lg">6. Returns, Refunds & Replacements</h2>
            <p className="mt-2">
                Due to hygiene and safety standards, returns and refunds are not accepted after delivery.
            </p>
            <p className="mt-1">
                In case of a damaged or wrong product, please report it within 24 hours with photos at <a href="mailto:info.beyuvana@gmail.com" className="text-[#057A37] hover:underline">info.beyuvana@gmail.com</a> or call <a href="tel:+918777377060" className="text-[#057A37] hover:underline">+91 8777377060</a>.
            </p>
            <p className="mt-1">
                After verification, we’ll replace the product at no cost.
            </p>

            <h2 className="mt-8 font-semibold text-lg">7. Intellectual Property</h2>
            <p className="mt-2">
                All website content — including text, product visuals, logos, videos, and graphics — is the exclusive property of BEYUVANA™.
            </p>
            <p className="mt-1">
                Unauthorized reproduction, distribution, or use of any content is prohibited.
            </p>

            <h2 className="mt-8 font-semibold text-lg">8. Limitation of Liability</h2>
            <p className="mt-2">
                BEYUVANA™ shall not be liable for any indirect, incidental, or consequential damages resulting from product use or website access.
                Users are advised to consult a healthcare professional before consuming any supplement.
            </p>
            <h2 className="mt-8 font-semibold text-lg">9. Governing Law</h2>
            <p className="mt-2">
                These Terms are governed by and construed under the laws of India.
            </p>
            <p className="mt-1">
                All disputes shall be subject to the exclusive jurisdiction of the courts of Kolkata, West Bengal.
            </p>
            <h2 className="mt-8 font-semibold text-lg">10. Contact Us</h2>
            <p className="mt-2">
            For any questions or concerns, please reach out to:
            </p>
            <p className="mt-1">
                All disputes shall be subject to the exclusive jurisdiction of the courts of Kolkata, West Bengal.
            </p>
            <p className="mt-1">
            Email: <a href="mailto:info.beyuvana@gmail.com" className="text-[#057A37] hover:underline">info.beyuvana@gmail.com</a>
            </p>
            <p className="mt-1">
                Phone: <a href="tel:+918777377060" className="text-[#057A37] hover:underline">+91 8777377060</a>
            </p>
            <p className="mt-1">
                Address: BEYUVANA™ Building No./Flat No.: MOUZA-106, DAG-315 Road/Street: Benaras Road, Chamrail District: Howrah State: West Bengal PIN Code: 711114
            </p>

        </div>
    );
};

export default Page;
