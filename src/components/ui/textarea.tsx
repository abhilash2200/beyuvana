import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "w-full rounded-xl border-0 border-b border-b-[#1E2C1E] bg-transparent px-4 py-2 text-black placeholder:text-gray-400",
        "focus:outline-none",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
