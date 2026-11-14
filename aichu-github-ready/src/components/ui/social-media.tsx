import React from "react"
import { AtSign, Instagram, Mail, Phone, Send } from "lucide-react"

export interface SocialItem {
  href: string
  ariaLabel: string
  tooltip: string
  icon: "instagram" | "threads" | "telegram" | "email" | "phone"
}

export interface SocialTooltipProps extends React.HTMLAttributes<HTMLUListElement> {
  items: SocialItem[]
}

const icons = {
  instagram: Instagram,
  threads: AtSign,
  telegram: Send,
  email: Mail,
  phone: Phone,
}

const SocialTooltip = React.forwardRef<HTMLUListElement, SocialTooltipProps>(
  ({ className = "", items, ...props }, ref) => (
    <ul ref={ref} className={`flex flex-wrap items-center justify-center gap-5 sm:gap-7 ${className}`} {...props}>
      {items.map((item) => {
        const Icon = icons[item.icon]
        const external = item.href.startsWith("https://")
        return (
          <li key={item.href} className="group relative">
            <a
              href={item.href}
              aria-label={`${item.ariaLabel}: ${item.tooltip}`}
              title={item.tooltip}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-current/20 bg-transparent text-current transition-transform duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FDC21E] sm:h-16 sm:w-16"
            >
              <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0 bg-[#FDC21E] transition-[height] duration-300 ease-out group-hover:h-full group-focus-within:h-full" />
              <Icon aria-hidden="true" className="relative z-10 h-6 w-6 transition-colors duration-300 group-hover:text-[#07142D] group-focus-within:text-[#07142D]" strokeWidth={1.7} />
            </a>
            <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-full z-20 mt-3 max-w-[min(80vw,260px)] -translate-x-1/2 translate-y-[-5px] whitespace-nowrap rounded-md bg-[#FDC21E] px-3 py-1.5 text-xs font-medium text-[#07142D] opacity-0 shadow-lg transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
              {item.tooltip}
            </span>
          </li>
        )
      })}
    </ul>
  )
)

SocialTooltip.displayName = "SocialTooltip"
export { SocialTooltip }
export default SocialTooltip
