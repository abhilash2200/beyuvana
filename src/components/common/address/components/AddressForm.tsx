/**
 * Address Form Component
 * Reusable address form input fields
 */

import type { AddressFormData } from "../hooks/useAddressForm";

interface AddressFormProps {
    form: AddressFormData;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    variant?: "desktop" | "mobile";
}

/**
 * Component for address form input fields
 */
export function AddressForm({ form, onChange, variant = "desktop" }: AddressFormProps) {
    const inputClasses = variant === "mobile"
        ? "w-full border border-gray-300 rounded-lg p-3 text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#057A37] focus:ring-1 focus:ring-[#057A37]"
        : "w-full border border-gray-500 rounded-[5px] leading-tight inline-flex p-2 placeholder:text-gray-400 placeholder:text-[13px] focus:outline-none";

    return (
        <div className={variant === "mobile" ? "space-y-3" : "space-y-3"}>
            <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                className={inputClasses}
                value={form.fullName}
                onChange={onChange}
                required
            />
            <input
                type="email"
                name="email"
                placeholder="Email Address"
                className={inputClasses}
                value={form.email}
                onChange={onChange}
                required
            />
            <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                className={inputClasses}
                value={form.phone}
                onChange={onChange}
                required
            />
            <input
                type="text"
                name="address1"
                placeholder="Address Line 1"
                className={inputClasses}
                value={form.address1}
                onChange={onChange}
                required
            />
            <input
                type="text"
                name="address2"
                placeholder="Landmark"
                className={inputClasses}
                value={form.address2}
                onChange={onChange}
                required
            />
            <div className={variant === "mobile" ? "flex gap-3" : "flex gap-2"}>
                <input
                    type="text"
                    name="city"
                    placeholder="City"
                    className={`${inputClasses} ${variant === "mobile" ? "flex-1 !w-42" : ""}`}
                    value={form.city}
                    onChange={onChange}
                    required
                />
                <input
                    type="text"
                    name="pincode"
                    placeholder="Pincode"
                    className={`${inputClasses} ${variant === "mobile" ? "flex-1 !w-42" : ""}`}
                    value={form.pincode}
                    onChange={onChange}
                    required
                />
            </div>
        </div>
    );
}

