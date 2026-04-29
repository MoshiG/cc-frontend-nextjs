import Link from "next/link"
import { ShieldCheck } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4" />
          <span>MyChetiChain — Tamper-proof Academic Certificates on Blockchain</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Powered by Hyperledger FireFly · EIP-5192 Soul-Bound NFTs</span>
          <Link href="/privacy" className="hover:text-foreground transition-colors underline underline-offset-2">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  )
}
