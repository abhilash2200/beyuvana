import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-semibold transition-colors duration-300 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffc917] disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default:
          "bg-[#fff] hover:border-none hover:cursor-pointer",
        outline:
          "border border-[#ffc917] text-[#ffc917] hover:bg-[#ffc917] hover:text-white",
        ghost:
          "bg-transparent text-[#ffc917] hover:bg-[#ffc917] hover:text-white",
        link:
          "text-[#ffc917] underline-offset-4 hover:underline",
      },
      size: {
        default: "p-0",
        md: "p-0",
        lg: "p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
