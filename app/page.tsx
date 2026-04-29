import Link from "next/link"
import { ShieldCheck, Search, Briefcase, CheckCircle2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { apiFetch } from "@/lib/api"
import type { University, HealthDetailed } from "@/lib/types"

async function getStats() {
  try {
    const health = await apiFetch<HealthDetailed>("/health/detailed")
    return health.orchestrator ?? null
  } catch {
    return null
  }
}

async function getUniversities() {
  try {
    return await apiFetch<University[]>("/universities")
  } catch {
    return []
  }
}

export default async function HomePage() {
  const [stats, universities] = await Promise.all([getStats(), getUniversities()])

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 to-primary/5 border-b py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <div className="flex justify-center">
            <ShieldCheck className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Tamper-proof Academic Certificates
            <br className="hidden md:block" /> on Blockchain
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            MyChetiChain issues soul-bound NFT certificates (EIP-5192) on Hyperledger FireFly.
            Universities issue — students own — employers verify instantly.
          </p>

          {/* Stats bar */}
          {stats && (
            <div className="flex flex-wrap justify-center gap-6 text-sm font-medium">
              <span>
                <span className="text-primary text-2xl font-bold">{stats.total_universities}</span>
                {" "}universities
              </span>
              <span className="text-muted-foreground">·</span>
              <span>
                <span className="text-primary text-2xl font-bold">{stats.total_students}</span>
                {" "}students
              </span>
              <span className="text-muted-foreground">·</span>
              <span>
                <span className="text-primary text-2xl font-bold">{stats.total_certificates}</span>
                {" "}certificates
              </span>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Button asChild size="lg">
              <Link href="/verify">
                <Search className="h-4 w-4 mr-2" />
                Verify a Certificate
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/verifier">
                <Briefcase className="h-4 w-4 mr-2" />
                Employer Portal
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA cards */}
      <section className="container mx-auto max-w-3xl px-4 py-14 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Verify a Certificate
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Check any certificate&apos;s authenticity instantly — no account needed.
            </p>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/verify">
                Go to Verification <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Employer Portal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Register as a verified employer to access Tier-2 document hash verification with a full audit trail.
            </p>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/verifier">
                Login / Register <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>

      </section>

      {/* How it works */}
      <section className="bg-muted/30 border-y py-14 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-center mb-10">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "University Issues",
                desc: "An accredited university issues a certificate as a soul-bound NFT on the blockchain. The certificate is non-transferable and tamper-proof.",
                icon: ShieldCheck,
              },
              {
                step: "2",
                title: "Student Gets QR",
                desc: "The student receives a QR code linking to their on-chain certificate. The QR encodes the token ID and manifest hash for instant verification.",
                icon: CheckCircle2,
              },
              {
                step: "3",
                title: "Employer Verifies",
                desc: "Employers scan the QR or enter the token ID to instantly verify authenticity against the blockchain — no forgery possible.",
                icon: Briefcase,
              },
            ].map(({ step, title, desc, icon: Icon }) => (
              <div key={step} className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  {step}
                </div>
                <Icon className="h-8 w-8 text-primary" />
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Participating universities */}
      {universities.length > 0 && (
        <section className="container mx-auto max-w-4xl px-4 py-14">
          <h2 className="text-2xl font-bold text-center mb-8">Participating Universities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {universities.map((uni) => (
              <Card key={uni.university_code} className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-sm">{uni.name}</p>
                    <p className="text-xs text-muted-foreground uppercase font-mono mt-0.5">
                      {uni.university_code}
                    </p>
                  </div>
                  <Badge variant={uni.is_active ? "default" : "secondary"}>
                    {uni.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
