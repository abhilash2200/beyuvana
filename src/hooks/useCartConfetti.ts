/**
 * Hook for managing confetti animation in cart
 */

import { useState, useEffect } from "react";
import { toast } from "react-toastify";

interface UseCartConfettiReturn {
  showConfetti: boolean;
  setLastIncreaseTime: (time: number) => void;
}

export function useCartConfetti(): UseCartConfettiReturn {
  const [showConfetti, setShowConfetti] = useState(false);
  const [lastIncreaseTime, setLastIncreaseTime] = useState<number>(0);

  useEffect(() => {
    if (lastIncreaseTime > 0) {
      const timer = setTimeout(() => {
        setShowConfetti(true);
        toast.success("🎉 Great choice! Adding more to your cart!", {
          position: "bottom-center",
          autoClose: 2000,
        });
        setTimeout(() => setShowConfetti(false), 5000);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [lastIncreaseTime]);

  return {
    showConfetti,
    setLastIncreaseTime,
  };
}
