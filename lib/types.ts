// TypeScript interfaces matching the MyChetiChain backend API

export interface University {
  university_code: string
  name: string
  ethereum_address: string
  firefly_org_id: string | null
  firefly_did: string
  accreditation_id: string | null
  is_active: boolean
  can_issue_certificates: boolean
  total_students?: number | null
  total_certificates_issued?: number | null
  registration_number?: string
  history_count?: number
  created_at?: string
}

export interface UniversityHistoryEntry {
  id: string
  action: string
  performed_by: string
  transaction_hash: string | null
  old_value: Record<string, unknown> | null
  new_value: Record<string, unknown> | null
  created_at: string
}

export interface ContractStatus {
  contract_api_name: string
  university_registrations: Array<{
    university_code: string
    name: string
    ethereum_address: string
    on_chain_active: boolean | null
    accreditation_id_on_chain: string | null
    accreditation_id_db: string | null
    error: string | null
  }>
  queried_at: string
}

export interface Student {
  student_id: string
  first_name: string
  last_name: string
  email: string
  university_code: string
  program: string
  year: number | null
  ethereum_address: string
  wallet_created: boolean
  created_at: string
  updated_at: string
}

export interface StudentListResponse {
  students: Student[]
  total: number
  limit: number
  offset: number
}

export interface Certificate {
  certificate_id: string
  token_id: string
  student_id: string
  student_name: string
  ethereum_address: string
  certificate_type: string
  degree_title: string
  graduation_date: string
  gpa: number | null
  honors: string | null
  manifest_hash: string
  firefly_data_id: string | null
  ipfs_hash: string | null
  transaction_hash: string | null
  firefly_operation_id: string | null
  issuer_university: string
  status: string
  revoke_reason: string | null
  revoked_at: string | null
  issued_at: string
  verification_url?: string | null
  qr_code_png?: string | null
}

export interface CertificateListResponse {
  certificates: Certificate[]
  total: number
  limit: number
  offset: number
}

export interface CertificateBatchResponse {
  total_requested: number
  successful: number
  failed: number
  certificates: Certificate[]
  errors: Array<{ student_id: string; error: string }>
}

export interface VerifyResult {
  token_id: string
  valid: boolean
  revoked: boolean
  on_chain_issuer: string | null
  on_chain_manifest_hash: string | null
  version: number | null
  issuer_university: string | null
  student_name: string | null
  certificate_type: string | null
  issued_at: string | null
  revoke_reason: string | null
  manifest_hash_matched: boolean | null
  verified_at: string
}

export interface Verifier {
  id: string
  organisation_name: string
  email: string
  created_at: string
}

export interface VerificationLog {
  id: string
  verifier_id: string
  token_id: string
  tier: number
  result: boolean
  ip_address: string | null
  verified_at: string
  organisation_name?: string
}

export interface VerificationLogListResponse {
  logs: VerificationLog[]
  total: number
  limit: number
  offset: number
}

export interface HealthDetailed {
  orchestrator: {
    status: string
    uptime_seconds: number
    total_students: number
    total_certificates: number
    total_universities: number
  }
  firefly_node: { status: string; response_time_ms?: number; node?: string }
  database: { status: string; response_time_ms?: number }
  contract: { status: string; api_name?: string }
  universities: Array<{
    code: string
    name: string
    ethereum_address: string
    on_chain_active: boolean
  }>
}

export interface TokenResponse {
  access_token: string
  token_type: string
  expires_in: number
}
