// /components/auth/AuthDialog.tsx
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";
// import OtpVerifyForm from "./OtpVerifyForm"; // OTP temporarily disabled
import { useAuth } from "@/context/AuthProvider";
import LogoutButton from "./LogoutButton";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AuthDialog() {
    const { user } = useAuth();
    const [step, setStep] = useState<"login" | "register" | null>("login"); 
    // default step = login

    return (
        <Dialog onOpenChange={(o) => !o && setStep("login")}>
            <DialogTrigger asChild>
                {user ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">{user.name || "Account"}</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                            <DropdownMenuItem>Settings</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <LogoutButton />
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <Button variant="default">Login / Register</Button>
                )}
            </DialogTrigger>

            {!user && (
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            Login or Register
                        </DialogTitle>
                    </DialogHeader>

                    <Tabs value={step ?? "login"} onValueChange={(val) => setStep(val as "login" | "register")} className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="login">Login</TabsTrigger>
                            <TabsTrigger value="register">Register</TabsTrigger>
                        </TabsList>

                        <TabsContent value="login">
                            <LoginForm />
                        </TabsContent>
                        <TabsContent value="register">
                            <RegisterForm />
                        </TabsContent>
                    </Tabs>
                </DialogContent>
            )}
        </Dialog>
    );
}
