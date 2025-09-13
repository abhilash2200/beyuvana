"use client";

const LoginPopup = () => {
    return (
        <form className="flex flex-col gap-4">
            <input
                type="text"
                placeholder="Your name"
                className="px-3 py-2 rounded-md bg-transparent border border-[#ffc917] text-white"
            />
            <input
                type="email"
                placeholder="Your email"
                className="px-3 py-2 rounded-md bg-transparent border border-[#ffc917] text-white"
            />
            <textarea
                placeholder="Your message"
                className="px-3 py-2 rounded-md bg-transparent border border-[#ffc917] text-white min-h-24"
            />
            <button
                type="submit"
                className="self-start px-4 py-2 rounded-md bg-[#ffc917] text-black font-medium"
            >
                Send
            </button>
        </form>
    );
};

export default LoginPopup;


