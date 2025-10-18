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

    if (!user) {
      toast.warning("No user logged in.");
      return;
    }

    if (!sessionKey) {
      // User exists but no session key - do local logout only
      try {
        // Clear localStorage
        localStorage.removeItem("user");
        localStorage.removeItem("session_key");

        // Clear user-specific cart data
        if (user.id) {
          localStorage.removeItem(`cart_${user.id}`);
        }

        toast.success("You have been logged out successfully.");
        router.push("/");
        return;
      } catch (error) {
        console.error("Local logout failed:", error);
        toast.error("Logout failed. Please try again.");
        return;
      }
    }

    setLoading(true);
    try {
      // 🔹 Use the logout function from AuthProvider (it handles both API call and local cleanup)
      await logout();
      toast.success("You have been logged out successfully.");
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if logout API fails, the AuthProvider should have cleared local state
      // Check if user is still logged in
      if (user || sessionKey) {
        toast.error("Logout failed. Please try again.");
      } else {
        // Local logout was successful even if API failed
        toast.success("You have been logged out successfully.");
        router.push("/");
      }
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
