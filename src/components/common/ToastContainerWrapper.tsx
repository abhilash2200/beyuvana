"use client";

import dynamic from "next/dynamic";
import "react-toastify/dist/ReactToastify.css";

// Dynamically import ToastContainer to reduce initial bundle size
const ToastContainer = dynamic(
    () => import("react-toastify").then((mod) => mod.ToastContainer),
    {
        ssr: false,
    }
);

export default function ToastContainerWrapper() {
    return (
        <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
        />
    );
}

