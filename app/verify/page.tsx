import { cookies } from "next/headers"
import { VerifyClient } from "./VerifyClient"

export default async function VerifyPage() {
  const cookieStore = await cookies()
  const isVerifier = !!cookieStore.get("verifier_token")?.value

  return <VerifyClient isVerifier={isVerifier} />
}
