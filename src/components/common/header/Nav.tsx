"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const links = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Product", href: "/product" },
  { label: "Contact", href: "/contact" }
]

const Nav = () => {
  const pathname = usePathname()

  return (
    <nav className="flex flex-wrap gap-4">
      {links.map(({ label, href }, index) => {
        const isActive = pathname === href
        return (
          <Link
            key={index}
            href={href}
            className={`px-3 py-3 text-sm font-medium rounded-md transition-colors duration-200
              ${isActive 
                ? "decoration-1.5 decoration-[#1E2C1E] text-[#1E2C1E]"
                : "hover:decoration-1.5 hover:decoration-[#1E2C1E] hover:text-[#1E2C1E] text-black"
              }`}
          >
            {label}
          </Link>
        )
      })}
    </nav>
  )
}

export default Nav