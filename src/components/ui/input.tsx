import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "w-full rounded-xl border-0 border-b border-b-[#1E2C1E] bg-transparent px-4 py-2 text-black placeholder:text-gray-400",
        "focus:outline-none", // ensures no blue outline
        className
      )}
      {...props}
    />
  )
}

export { Input }
