import type { Metadata } from "next"
import Link from "next/link"
import { Shield } from "lucide-react"

export const metadata: Metadata = {
  title: "Privacy Policy | MyChetiChain",
  description:
    "How MyChetiChain collects, uses, and protects personal data in compliance with GDPR and the Tanzania Personal Data Protection Act 2022.",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-primary">
          <Shield className="h-6 w-6" />
          <span className="text-sm font-semibold uppercase tracking-wide">Privacy &amp; Data Protection</span>
        </div>
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="text-muted-foreground text-sm">
          Last updated: 25 February 2026 &nbsp;|&nbsp; Version 1.0
        </p>
        <p className="text-sm text-muted-foreground">
          This policy applies to{" "}
          <strong>MyChetiChain</strong> — a blockchain-based academic certificate
          management platform operated on behalf of participating universities
          in Tanzania. It covers how we collect, use, store, and protect personal
          data in accordance with the{" "}
          <strong>EU General Data Protection Regulation (GDPR 2016/679)</strong>{" "}
          and the{" "}
          <strong>Tanzania Personal Data Protection Act 2022 (PDPA)</strong>.
        </p>
      </div>

      <hr />

      {/* 1. Data Controller */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">1. Data Controller</h2>
        <p className="text-sm text-muted-foreground">
          The data controller for MyChetiChain is the consortium of participating
          universities. Each issuing university acts as an independent data
          controller for the personal data of its own students. The system
          operator (MyChetiChain engineering team) acts as a data processor on
          behalf of those universities.
        </p>
        <p className="text-sm text-muted-foreground">
          <strong>Data Protection Officer contact:</strong>{" "}
          <a href="mailto:dpo@mychetichain.example" className="underline">
            dpo@mychetichain.example
          </a>
        </p>
      </section>

      {/* 2. What data we collect */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">2. What Personal Data We Collect</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4 font-semibold">Category</th>
                <th className="text-left py-2 pr-4 font-semibold">Examples</th>
                <th className="text-left py-2 font-semibold">Collected from</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b">
                <td className="py-2 pr-4 align-top">Student identity</td>
                <td className="py-2 pr-4 align-top">Name, email, phone, student ID, university program</td>
                <td className="py-2 align-top">University registrar</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 align-top">Blockchain wallet</td>
                <td className="py-2 pr-4 align-top">Ethereum address (custodial or self-managed)</td>
                <td className="py-2 align-top">Auto-generated or student-provided</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 align-top">Certificate metadata</td>
                <td className="py-2 pr-4 align-top">Degree title, graduation date, GPA, honours</td>
                <td className="py-2 align-top">University academic records</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 align-top">Verifier contact details</td>
                <td className="py-2 pr-4 align-top">Organisation name, email (self-registered)</td>
                <td className="py-2 align-top">Employer / verification agency (self-registration)</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 align-top">Audit log</td>
                <td className="py-2 pr-4 align-top">IP address, token verified, result, timestamp</td>
                <td className="py-2 align-top">Tier-2 verification requests</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 align-top">Cookies</td>
                <td className="py-2 pr-4 align-top">Session cookie (JWT bearer token)</td>
                <td className="py-2 align-top">Admin / verifier login</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. Legal basis */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">3. Legal Basis for Processing</h2>
        <ul className="space-y-2 text-sm text-muted-foreground list-disc list-outside ml-5">
          <li>
            <strong>Contract (GDPR Art. 6(1)(b)):</strong> Processing student
            data is necessary to issue and manage their academic certificates.
          </li>
          <li>
            <strong>Legitimate interest (GDPR Art. 6(1)(f)):</strong> Logging
            Tier-2 verifications is in the legitimate interest of universities
            to detect fraudulent certificate use.
          </li>
          <li>
            <strong>Legal obligation (GDPR Art. 6(1)(c)):</strong> Maintaining
            security audit records may be required by applicable law.
          </li>
          <li>
            <strong>Consent (PDPA 2022 s.5):</strong> Student consent for
            certificate issuance is obtained by the issuing university before
            any data is entered into this system.
          </li>
        </ul>
      </section>

      {/* 4. Retention */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">4. How Long We Keep Your Data</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4 font-semibold">Data type</th>
                <th className="text-left py-2 font-semibold">Retention period</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b">
                <td className="py-2 pr-4">Student PII (name, email, phone)</td>
                <td className="py-2">Duration of enrolment + 10 years, then anonymised on request</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">IP addresses in verification log</td>
                <td className="py-2">30 days, then automatically nullified</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">JWT revocation blacklist entries</td>
                <td className="py-2">Until token expiry, then purged automatically</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">Session cookies</td>
                <td className="py-2">60 minutes (session), cleared on logout</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">On-chain certificate records</td>
                <td className="py-2">
                  <strong>Indefinite</strong> — see blockchain immutability note below
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. Blockchain immutability */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">5. Blockchain Immutability Disclosure</h2>
        <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
          <p>
            <strong>Important:</strong> When a certificate is issued, a
            non-transferable ERC-721 token (soul-bound NFT) is created on a
            permissioned Ethereum blockchain. The token URI and associated
            manifest hash recorded on-chain <em>cannot be deleted or modified</em>{" "}
            after issuance.
          </p>
          <p className="mt-2">
            The manifest hash is a cryptographic hash (SHA-256) of the certificate
            document; it does not directly identify a person. However, in
            conjunction with off-chain data, it may be linkable to an individual.
            By accepting issuance of a certificate, you acknowledge this limitation
            of the right to erasure (GDPR Art. 17(3)(b) — public interest in
            the archiving of authentic academic records).
          </p>
        </div>
      </section>

      {/* 6. Sharing & third parties */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">6. Sharing Your Data</h2>
        <ul className="space-y-2 text-sm text-muted-foreground list-disc list-outside ml-5">
          <li>
            <strong>Registered employers (verifiers):</strong> Tier-2 verification
            reveals the student name and hash-match result to the authenticated
            verifier, and records the verification in an audit log accessible
            only to administrators.
          </li>
          <li>
            <strong>Hyperledger FireFly network:</strong> Certificate metadata is
            stored on a private IPFS instance accessible only to participating
            university nodes.
          </li>
          <li>
            <strong>No advertising or marketing sharing:</strong> We do not sell,
            rent, or share personal data with any third party for commercial
            purposes.
          </li>
        </ul>
      </section>

      {/* 7. Your rights */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">7. Your Rights</h2>
        <p className="text-sm text-muted-foreground">
          Under GDPR and the Tanzania PDPA 2022, you have the following rights:
        </p>
        <ul className="space-y-1.5 text-sm text-muted-foreground list-disc list-outside ml-5">
          <li><strong>Access</strong> — request a copy of your personal data</li>
          <li><strong>Rectification</strong> — correct inaccurate data</li>
          <li>
            <strong>Erasure</strong> — request deletion of your off-chain data
            (subject to the blockchain immutability limitation above)
          </li>
          <li><strong>Portability</strong> — receive your data in a machine-readable format</li>
          <li><strong>Objection</strong> — object to processing based on legitimate interest</li>
          <li><strong>Restriction</strong> — request that processing be limited</li>
        </ul>
        <p className="text-sm text-muted-foreground">
          To exercise any of these rights, contact your issuing university or
          email our DPO at{" "}
          <a href="mailto:dpo@mychetichain.example" className="underline">
            dpo@mychetichain.example
          </a>
          . We will respond within 30 days.
        </p>
      </section>

      {/* 8. Cookies */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">8. Cookies &amp; Local Storage</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4 font-semibold">Name</th>
                <th className="text-left py-2 pr-4 font-semibold">Type</th>
                <th className="text-left py-2 pr-4 font-semibold">Purpose</th>
                <th className="text-left py-2 font-semibold">Expiry</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b">
                <td className="py-2 pr-4 font-mono text-xs">admin_token</td>
                <td className="py-2 pr-4">httpOnly cookie</td>
                <td className="py-2 pr-4">Admin session authentication</td>
                <td className="py-2">60 minutes</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-mono text-xs">verifier_token</td>
                <td className="py-2 pr-4">httpOnly cookie</td>
                <td className="py-2 pr-4">Verifier session authentication</td>
                <td className="py-2">60 minutes</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">cookie_consent</td>
                <td className="py-2 pr-4">localStorage</td>
                <td className="py-2 pr-4">Remember cookie-banner dismissal</td>
                <td className="py-2">Persistent (cleared by browser reset)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground">
          We use <strong>no tracking, advertising, or analytics cookies</strong>.
          The session cookies are strictly necessary for the operation of the
          admin and employer portals and do not require separate consent under the
          ePrivacy Directive.
        </p>
      </section>

      {/* 9. Security */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">9. Security Measures</h2>
        <ul className="space-y-1.5 text-sm text-muted-foreground list-disc list-outside ml-5">
          <li>TLS encryption in transit for all API communications</li>
          <li>Passwords hashed with bcrypt (cost factor 12)</li>
          <li>JWTs signed with HS256 and revoked on logout</li>
          <li>httpOnly cookies prevent JavaScript access to session tokens</li>
          <li>Student private keys encrypted in AES-128-CTR keystore (v3 format)</li>
          <li>Permissioned blockchain — only authorised university nodes participate</li>
        </ul>
      </section>

      {/* 10. Contact & complaints */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">10. Contact &amp; Complaints</h2>
        <p className="text-sm text-muted-foreground">
          For privacy questions or to exercise your rights, contact:
        </p>
        <ul className="text-sm text-muted-foreground list-none space-y-1">
          <li>📧 <a href="mailto:dpo@mychetichain.example" className="underline">dpo@mychetichain.example</a></li>
        </ul>
        <p className="text-sm text-muted-foreground mt-2">
          If you are not satisfied with our response, you may lodge a complaint
          with the{" "}
          <a
            href="https://www.tcra.go.tz"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Tanzania Communications Regulatory Authority (TCRA)
          </a>
          , which is the designated supervisory authority for the PDPA 2022 in
          Tanzania. EU residents may also contact their national data protection
          supervisory authority.
        </p>
      </section>

      <hr />

      <p className="text-xs text-muted-foreground text-center">
        MyChetiChain Privacy Policy · Version 1.0 · 25 February 2026 ·{" "}
        <Link href="/" className="underline">Return to home</Link>
      </p>
    </div>
  )
}
