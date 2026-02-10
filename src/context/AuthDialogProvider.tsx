"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useAuthDialog } from "@/hooks/useAuthDialog";

// Define the shape of the context by inferring it from the hook's return type
// or by redefining the interface if necessary. To be safe and precise:
type UseAuthDialogReturn = ReturnType<typeof useAuthDialog>;

const AuthDialogContext = createContext<UseAuthDialogReturn | undefined>(
    undefined,
);

export const AuthDialogProvider = ({ children }: { children: ReactNode }) => {
    const authDialog = useAuthDialog();

    return (
        <AuthDialogContext.Provider value={authDialog}>
            {children}
        </AuthDialogContext.Provider>
    );
};

export const useAuthDialogContext = () => {
    const context = useContext(AuthDialogContext);
    if (!context) {
        throw new Error(
            "useAuthDialogContext must be used within AuthDialogProvider",
        );
    }
    return context;
};
