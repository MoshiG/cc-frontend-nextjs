/**
 * CertificatePDF — react-pdf document component.
 * Rendered exclusively on the client (imported dynamically inside a click handler).
 * Uses @react-pdf/renderer primitives — no HTML elements, no Tailwind.
 */
import { Document, Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer"
import type { Certificate } from "@/lib/types"

interface Props {
  cert: Certificate
  universityName: string
  /** Data URL (data:image/png;base64,...) for the QR code image */
  qrDataUrl?: string
}

// ── palette ─────────────────────────────────────────────────────────────────
const NAVY   = "#1e3a5f"
const GOLD   = "#c8a84b"
const CREAM  = "#fdfcf7"
const DARK   = "#1a1a2e"
const MID    = "#4a4a6a"
const LIGHT  = "#f0eeea"

// ── helpers ──────────────────────────────────────────────────────────────────
function fmtLongDate(v: string | null | undefined): string {
  if (!v) return "—"
  try {
    return new Date(v).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })
  } catch { return v }
}
function fmtShortDatetime(v: string | null | undefined): string {
  if (!v) return "—"
  try {
    return new Date(v).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
  } catch { return v }
}
function trunc(s: string | null | undefined, n = 30): string {
  if (!s) return "—"
  return s.length <= n ? s : `${s.slice(0, n)}…`
}

// ── styles ────────────────────────────────────────────────────────────────────
const S = StyleSheet.create({
  page: {
    backgroundColor: CREAM,
    fontFamily: "Helvetica",
  },
  frame: {
    margin: 18,
    flex: 1,
    flexDirection: "column",
    borderWidth: 3,
    borderColor: NAVY,
    borderStyle: "solid",
  },

  // header
  header: {
    backgroundColor: NAVY,
    paddingHorizontal: 28,
    paddingVertical: 18,
    alignItems: "center",
  },
  headerLine1: {
    color: "#ffffff",
    fontSize: 7.5,
    letterSpacing: 3,
  },
  headerLine2: {
    color: GOLD,
    fontSize: 6.5,
    letterSpacing: 2,
    marginTop: 4,
  },

  goldStripe: {
    height: 3,
    backgroundColor: GOLD,
  },

  // body
  body: {
    flex: 1,
    paddingHorizontal: 44,
    paddingTop: 28,
    paddingBottom: 16,
    alignItems: "center",
  },
  universityName: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    textAlign: "center",
  },
  uniUnderline: {
    width: 80,
    height: 1,
    backgroundColor: MID,
    marginTop: 6,
  },
  certifyText: {
    fontSize: 10,
    fontFamily: "Helvetica-Oblique",
    color: MID,
    textAlign: "center",
    marginTop: 22,
  },
  studentName: {
    fontSize: 28,
    fontFamily: "Times-Bold",
    color: DARK,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 4,
  },
  goldBar: {
    height: 2,
    width: 160,
    backgroundColor: GOLD,
    marginVertical: 10,
  },
  awardedText: {
    fontSize: 9,
    fontFamily: "Helvetica-Oblique",
    color: MID,
    textAlign: "center",
  },
  degreeTitle: {
    fontSize: 17,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    textAlign: "center",
    marginTop: 10,
  },
  certType: {
    fontSize: 10,
    fontFamily: "Helvetica",
    color: MID,
    textAlign: "center",
    marginTop: 3,
  },

  // info cells
  infoRow: {
    flexDirection: "row",
    marginTop: 24,
  },
  infoCell: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  infoDivider: {
    borderLeftWidth: 1,
    borderLeftColor: "#cccccc",
    borderLeftStyle: "solid",
  },
  infoLabel: {
    fontSize: 7,
    fontFamily: "Helvetica",
    color: MID,
  },
  infoValue: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: DARK,
    marginTop: 3,
  },

  // blockchain section
  bcSection: {
    borderTopWidth: 2,
    borderTopColor: GOLD,
    borderTopStyle: "solid",
    backgroundColor: LIGHT,
    paddingHorizontal: 28,
    paddingVertical: 14,
  },
  bcHeading: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: 2,
  },
  bcRow: {
    flexDirection: "row",
  },
  qrImage: {
    width: 76,
    height: 76,
    marginRight: 16,
  },
  qrPlaceholder: {
    width: 76,
    height: 76,
    marginRight: 16,
    backgroundColor: "#dddddd",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#cccccc",
    borderStyle: "solid",
  },
  qrPlaceholderText: {
    fontSize: 7,
    fontFamily: "Helvetica",
    color: "#888888",
    textAlign: "center",
  },
  bcFields: {
    flex: 1,
    justifyContent: "center",
  },
  bcField: {
    flexDirection: "row",
    marginBottom: 5,
  },
  bcLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: MID,
    width: 82,
  },
  bcValue: {
    fontSize: 7,
    fontFamily: "Courier",
    color: DARK,
    flex: 1,
  },

  // footer
  footer: {
    backgroundColor: NAVY,
    paddingHorizontal: 28,
    paddingVertical: 9,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 6.5,
    fontFamily: "Helvetica",
    color: "#9999bb",
    flex: 1,
  },
  footerBrand: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: GOLD,
    marginLeft: 12,
  },
})

// ── component ─────────────────────────────────────────────────────────────────
export function CertificatePDF({ cert, universityName, qrDataUrl }: Props) {
  const infoCells: Array<{ label: string; value: string }> = [
    { label: "Graduation Date", value: fmtLongDate(cert.graduation_date) },
  ]
  if (cert.gpa != null)  infoCells.push({ label: "GPA", value: cert.gpa.toFixed(2) })
  if (cert.honors)       infoCells.push({ label: "Honors", value: cert.honors })

  return (
    <Document
      title={`MyChetiChain Certificate — ${cert.student_name}`}
      author="MyChetiChain"
      subject={cert.degree_title}
    >
      <Page size="A4" style={S.page}>
        <View style={S.frame}>

          {/* ── header ── */}
          <View style={S.header}>
            <Text style={S.headerLine1}>
              MYCHETICHAIN  ·  BLOCKCHAIN-VERIFIED ACADEMIC CERTIFICATE
            </Text>
            <Text style={S.headerLine2}>
              HYPERLEDGER FIREFLY  ·  EIP-5192 SOUL-BOUND NFT
            </Text>
          </View>
          <View style={S.goldStripe} />

          {/* ── body ── */}
          <View style={S.body}>
            <Text style={S.universityName}>{universityName.toUpperCase()}</Text>
            <View style={S.uniUnderline} />

            <Text style={S.certifyText}>This is to certify that</Text>

            <Text style={S.studentName}>{cert.student_name}</Text>

            <View style={S.goldBar} />

            <Text style={S.awardedText}>
              has successfully fulfilled all academic requirements and has been awarded the
            </Text>

            <Text style={S.degreeTitle}>{cert.degree_title}</Text>
            <Text style={S.certType}>{cert.certificate_type}</Text>

            {/* graduation / GPA / honors */}
            <View style={S.infoRow}>
              {infoCells.map((cell, i) => (
                <View key={cell.label} style={[S.infoCell, i > 0 ? S.infoDivider : {}]}>
                  <Text style={S.infoLabel}>{cell.label.toUpperCase()}</Text>
                  <Text style={S.infoValue}>{cell.value}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* ── blockchain ── */}
          <View style={S.bcSection}>
            <Text style={S.bcHeading}>BLOCKCHAIN VERIFICATION RECORD</Text>
            <View style={S.bcRow}>

              {/* QR */}
              {qrDataUrl ? (
                <Image style={S.qrImage} src={qrDataUrl} />
              ) : (
                <View style={S.qrPlaceholder}>
                  <Text style={S.qrPlaceholderText}>QR{"\n"}Unavailable</Text>
                </View>
              )}

              {/* fields */}
              <View style={S.bcFields}>
                <View style={S.bcField}>
                  <Text style={S.bcLabel}>Token ID:</Text>
                  <Text style={S.bcValue}>#{cert.token_id}</Text>
                </View>
                <View style={S.bcField}>
                  <Text style={S.bcLabel}>Manifest Hash:</Text>
                  <Text style={S.bcValue}>{trunc(cert.manifest_hash, 32)}</Text>
                </View>
                {cert.transaction_hash && (
                  <View style={S.bcField}>
                    <Text style={S.bcLabel}>Transaction:</Text>
                    <Text style={S.bcValue}>{trunc(cert.transaction_hash, 32)}</Text>
                  </View>
                )}
                <View style={S.bcField}>
                  <Text style={S.bcLabel}>Issued At:</Text>
                  <Text style={S.bcValue}>{fmtShortDatetime(cert.issued_at)}</Text>
                </View>
                {cert.verification_url && (
                  <View style={S.bcField}>
                    <Text style={S.bcLabel}>Verify URL:</Text>
                    <Text style={S.bcValue}>{cert.verification_url}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* ── footer ── */}
          <View style={S.footer}>
            <Text style={S.footerText}>
              This certificate is a soul-bound NFT (EIP-5192) recorded on MyChetiChain.
              Scan the QR code or visit the verify URL to confirm authenticity on the blockchain.
            </Text>
            <Text style={S.footerBrand}>MyChetiChain</Text>
          </View>

        </View>
      </Page>
    </Document>
  )
}
