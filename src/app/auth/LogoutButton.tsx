"use client";

import { useState, cloneElement, isValidElement } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthProvider";
import { toast } from "react-toastify";

interface LogoutButtonProps {
  children?: React.ReactNode;
}

export default function LogoutButton({ children }: LogoutButtonProps) {
  const { user, sessionKey, logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (!user || !sessionKey) {
      toast.warning("No user logged in.");
      return;
    }

    setLoading(true);
    try {
      // 🔹 Use the logout function from AuthProvider (it handles both API call and local cleanup)
      await logout();
      toast.success("You have been logged out successfully.");
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (children && isValidElement(children)) {
    return cloneElement(children as React.ReactElement<{ onClick?: (...args: unknown[]) => void; disabled?: boolean }>, {
      onClick: (...args: unknown[]) => {
        (children as React.ReactElement<{ onClick?: (...args: unknown[]) => void }>).props?.onClick?.(...args);
        handleLogout();
      },
      disabled: loading || (children as React.ReactElement<{ disabled?: boolean }>).props?.disabled,
    });
  }

  return (
    <Button
      onClick={handleLogout}
      variant="default"
      className="w-full"
      disabled={loading}
    >
      {loading ? "Logging out..." : "Logout"}
    </Button>
  );
}
