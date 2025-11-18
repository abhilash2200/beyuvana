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
            <div>
                <label htmlFor="address-fullName" className="sr-only">
                    Full Name
                </label>
                <input
                    id="address-fullName"
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    className={inputClasses}
                    value={form.fullName}
                    onChange={onChange}
                    required
                    aria-label="Full Name"
                />
            </div>
            <div>
                <label htmlFor="address-email" className="sr-only">
                    Email Address
                </label>
                <input
                    id="address-email"
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    className={inputClasses}
                    value={form.email}
                    onChange={onChange}
                    required
                    aria-label="Email Address"
                />
            </div>
            <div>
                <label htmlFor="address-phone" className="sr-only">
                    Phone Number
                </label>
                <input
                    id="address-phone"
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    className={inputClasses}
                    value={form.phone}
                    onChange={onChange}
                    required
                    aria-label="Phone Number"
                />
            </div>
            <div>
                <label htmlFor="address-address1" className="sr-only">
                    Address Line 1
                </label>
                <input
                    id="address-address1"
                    type="text"
                    name="address1"
                    placeholder="Address Line 1"
                    className={inputClasses}
                    value={form.address1}
                    onChange={onChange}
                    required
                    aria-label="Address Line 1"
                />
            </div>
            <div>
                <label htmlFor="address-address2" className="sr-only">
                    Landmark
                </label>
                <input
                    id="address-address2"
                    type="text"
                    name="address2"
                    placeholder="Landmark"
                    className={inputClasses}
                    value={form.address2}
                    onChange={onChange}
                    required
                    aria-label="Landmark"
                />
            </div>
            <div className={variant === "mobile" ? "flex gap-3" : "flex gap-2"}>
                <div className="flex-1">
                    <label htmlFor="address-city" className="sr-only">
                        City
                    </label>
                    <input
                        id="address-city"
                        type="text"
                        name="city"
                        placeholder="City"
                        className={`${inputClasses} ${variant === "mobile" ? "flex-1 !w-42" : ""}`}
                        value={form.city}
                        onChange={onChange}
                        required
                        aria-label="City"
                    />
                </div>
                <div className="flex-1">
                    <label htmlFor="address-pincode" className="sr-only">
                        Pincode
                    </label>
                    <input
                        id="address-pincode"
                        type="text"
                        name="pincode"
                        placeholder="Pincode"
                        className={`${inputClasses} ${variant === "mobile" ? "flex-1 !w-42" : ""}`}
                        value={form.pincode}
                        onChange={onChange}
                        required
                        aria-label="Pincode"
                    />
                </div>
            </div>
        </div>
    );
}

