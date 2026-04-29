# MyChetiChain — User Manual

**Version 1.0 · February 2026**

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Public Portal](#2-public-portal)
   - 2.1 [Home Page](#21-home-page)
   - 2.2 [Verify a Certificate (Public)](#22-verify-a-certificate-public)
   - 2.3 [QR Code Verification Landing](#23-qr-code-verification-landing)
   - 2.4 [Student Certificate List](#24-student-certificate-list)
3. [Admin Portal](#3-admin-portal)
   - 3.1 [Logging In](#31-logging-in)
   - 3.2 [Dashboard](#32-dashboard)
   - 3.3 [University Management](#33-university-management)
   - 3.4 [Student Management](#34-student-management)
   - 3.5 [Certificate Management](#35-certificate-management)
   - 3.6 [Verification Audit Log](#36-verification-audit-log)
4. [Employer Portal (Verifier)](#4-employer-portal-verifier)
   - 4.1 [Registering as an Employer](#41-registering-as-an-employer)
   - 4.2 [Logging In](#42-logging-in)
   - 4.3 [Tier-2 Verification Dashboard](#43-tier-2-verification-dashboard)
5. [How Verification Works](#5-how-verification-works)
6. [Glossary](#6-glossary)

---

## 1. System Overview

**MyChetiChain** is a blockchain-based academic certificate management platform built on Hyperledger FireFly. Universities issue certificates as **soul-bound NFTs** (non-transferable digital tokens, EIP-5192 standard) on a private Ethereum blockchain. Certificates cannot be altered, duplicated, or transferred — making forgery impossible.

### Who Uses MyChetiChain?

| User Type | What They Do |
|-----------|-------------|
| **System Admin** | Registers universities, manages students, issues and revokes certificates |
| **Employer / Verifier** | Registers an account, performs Tier-2 document verification |
| **General Public** | Verifies a certificate by Token ID or QR code, no account required |
| **Student** | Views their certificate list on a public page |

### The Three-Step Flow

```
1. ISSUE   — Admin registers the student and issues a certificate on-chain.
             A QR code is generated and shared with the student.

2. PRESENT — Student presents their certificate (physical or digital) with the QR code
             or Token ID to a prospective employer.

3. VERIFY  — Employer scans the QR code or visits the verification page.
             The blockchain confirms authenticity in seconds.
```

### Key Concepts

- **Token ID** — A unique 7-character alphanumeric identifier (e.g. `AB12345`) assigned to each certificate. This is what appears in QR codes and verification URLs.
- **Manifest Hash** — A SHA-256 cryptographic fingerprint of the certificate document. Employers use this to confirm the document has not been tampered with.
- **Tier-1 Verification** — Public, no login required. Confirms the certificate is valid on the blockchain. Does not reveal student name.
- **Tier-2 Verification** — Requires an employer account. Includes student name, document hash check, and writes an auditable log entry.
- **Soul-bound** — The NFT certificate is permanently tied to the student's wallet address. It cannot be transferred, sold, or faked.

---

## 2. Public Portal

### 2.1 Home Page

**URL:** `https://gateway.co.tz/`

The home page provides an overview of the system and live statistics.

**Live Statistics Bar**
Displayed beneath the main headline:
- Number of registered universities
- Number of registered students
- Number of certificates issued

**Navigation Options**

| Button | Destination |
|--------|-------------|
| Verify a Certificate | `/verify` — Public verification form |
| Employer Portal | `/verifier` — Employer login and registration |

**Participating Universities**
The bottom of the page lists all registered universities with their status (Active / Inactive).

---

### 2.2 Verify a Certificate (Public)

**URL:** `https://gateway.co.tz/verify`

Anyone can verify a certificate without creating an account.

#### Steps

1. Navigate to `https://gateway.co.tz/verify`.
2. Enter the **Certificate Token ID** in the text field (e.g. `AB12345`).
   - Alternatively, click the **QR scanner icon** to scan a QR code using your device camera.
3. Click **Verify Certificate**.
4. The result appears below the form.

#### Result States

| Status | Meaning |
|--------|---------|
| **VALID ✓** (green) | Certificate is authentic and active on the blockchain |
| **REVOKED** (amber) | Certificate was revoked by the issuing university; shows reason |
| **INVALID ✗** (red) | Certificate exists on chain but is not valid |
| **NOT FOUND** (red) | No certificate with that Token ID exists |

#### Tier-1 Result Details

A valid result shows:
- Issuing university
- Certificate type
- Issue date
- On-chain manifest hash (truncated)

> **Note:** Student name is **not shown** to the public. To see the full result including student name and document hash verification, log in as an Employer.

#### Employer Upsell
After any result, a card appears:
> *"Need to verify the actual document? Employers can log in to compare the document hash and get a cryptographically verified result — with a full audit trail."*
Click **Log in as Employer** to go to the Employer Portal.

---

### 2.3 QR Code Verification Landing

**URL:** `https://gateway.co.tz/v?t=<TOKEN_ID>&h=<MANIFEST_HASH>`

This page is the destination for QR codes printed on or attached to certificates. When a user scans a certificate QR code, they are taken directly to this page.

The verification is performed automatically — no input required.

- The page displays the Token ID and the full verification result.
- If the certificate is valid, an **"Login as Employer →"** button appears for employers who wish to do full document hash verification.
- A **"← Manual verification"** link returns to the standard verify page.

---

### 2.4 Student Certificate List

**URL:** `https://gateway.co.tz/student/<STUDENT_ID>`

A public page that lists all certificates issued to a specific student by their student ID (e.g. `UDSM2024001`). No login is required.

Each certificate card shows the degree title, issuing university, graduation date, and status.

---

## 3. Admin Portal

The Admin Portal is used exclusively by system administrators to manage universities, students, and certificates.

### 3.1 Logging In

**URL:** `https://gateway.co.tz/admin`

| Field | Description |
|-------|-------------|
| Username | Your admin username (e.g. `novaya-admin`) |
| Password | Your admin password |

Click **Login**. On success you are redirected to the Admin Dashboard. Failed logins display an error message below the form.

> **Session:** Your login session is stored in a secure httpOnly cookie. You remain logged in until you click **Logout** in the top navigation bar.

---

### 3.2 Dashboard

**URL:** `https://gateway.co.tz/admin/dashboard`

The dashboard provides an at-a-glance summary of the system.

#### Statistics Cards

| Card | What It Shows |
|------|---------------|
| Universities | Total number of registered universities |
| Students | Total number of registered students |
| Certificates | Total number of certificates issued |
| Active Universities | Number of universities currently active on-chain |

Click any card to go to the corresponding management page.

#### Quick Actions

| Button | Action |
|--------|--------|
| Issue Certificate | Go to single certificate issuance form |
| Register Student | Go to student registration form |
| Register University | Go to university registration form |
| Batch Issue | Go to batch certificate issuance form |

#### Recent Certificates

A table of the 10 most recently issued certificates. Click a **Token ID** to open the full certificate detail page.

---

### 3.3 University Management

#### 3.3.1 University List

**URL:** `https://gateway.co.tz/admin/universities`

Displays all registered universities in a table.

| Column | Description |
|--------|-------------|
| Code | Short university code (e.g. `UDSM`) |
| Name | Full university name |
| Ethereum Address | On-chain wallet address |
| Status | Active / Inactive |
| Registered | Date of registration |

**Buttons:**
- **Contract Status** — Shows the live on-chain registration status for all universities (compares DB vs blockchain).
- **Register** — Opens the registration form.

---

#### 3.3.2 Register a University

**URL:** `https://gateway.co.tz/admin/universities/register`

Fill in all required fields (*) and click **Register University**.

| Field | Required | Description |
|-------|----------|-------------|
| University Code | ✓ | Short code (2–10 characters), e.g. `udsm`. Used as the identifier throughout the system. |
| University Name | ✓ | Full official name, e.g. *University of Dar es Salaam* |
| Ethereum Address | ✓ | The university's blockchain wallet address (`0x…`). This address is granted the ISSUER_ROLE on the smart contract to sign certificate transactions. |
| Registration Number | ✓ | Official government registration number. A SHA-256 hash of this is stored on-chain as the accreditation ID. |
| Country | — | Country of the university |
| Contact Email | — | Official contact email address |
| Website | — | Official website URL |
| Notes | — | Internal notes (not shown publicly) |

**After registration:**
- The university is written to the database and registered on the blockchain (this may take a few seconds).
- The university appears in the universities list with **Active** status.

---

#### 3.3.3 University Detail

**URL:** `https://gateway.co.tz/admin/universities/<CODE>`

Displays full information about a university:
- Ethereum address, Accreditation ID, Registration Number, FireFly DID
- Can Issue Certificates status
- Full audit history (every change recorded with action, performed by, transaction hash, and timestamp)

**Actions available on this page:**
- **Update Accreditation** — Change the accreditation ID on-chain (e.g. if the registration number changes).
- **Deactivate / Reactivate** — Suspends or restores the university's ability to issue certificates.

---

### 3.4 Student Management

#### 3.4.1 Student List

**URL:** `https://gateway.co.tz/admin/students`

Displays all registered students in a searchable table.

| Column | Description |
|--------|-------------|
| Student ID | Unique student identifier |
| Name | First and last name |
| Email | Student email address |
| University | Associated university (uppercase code) |
| Program | Enrolled programme |
| Registered | Date of registration |

Click **View** on any row to open the student detail page.

---

#### 3.4.2 Register a Student

**URL:** `https://gateway.co.tz/admin/students/register`

| Field | Required | Description |
|-------|----------|-------------|
| Student ID | ✓ | Unique student identifier (3–50 characters), e.g. `UDSM2024001` |
| First Name | ✓ | Student's first name |
| Last Name | ✓ | Student's last name |
| Email | ✓ | Student's email address |
| University | ✓ | Select from registered active universities |
| Programme | ✓ | Enrolled programme/degree name |
| Year | — | Current year of study |

Click **Register Student**. The system automatically:
1. Creates the student record in the database.
2. Generates a dedicated Ethereum wallet for the student (used as the NFT holder address for all their certificates).

---

#### 3.4.3 Student Detail

**URL:** `https://gateway.co.tz/admin/students/<STUDENT_ID>`

Shows full student profile including Ethereum address, programme details, and all certificates issued to the student.

**Wallet Handover**
Students who want to control their own wallet (e.g. to use MetaMask) can receive their private key through the handover process. Click **Hand Over Account** — this generates a one-time download of the encrypted keystore file along with the decryption passphrase.

> ⚠️ **Handover is irreversible.** The student becomes solely responsible for their private key after handover. The passphrase cannot be recovered if lost.

**Anonymise (GDPR / Right to Erasure)**
Click **Anonymise** to permanently delete the student's personally identifiable information (name, email, ID) from the database, in compliance with data protection regulations. The blockchain certificate record remains immutable, but PII is removed from the off-chain database.

> ⚠️ **This action is permanent and cannot be undone.**

---

### 3.5 Certificate Management

#### 3.5.1 Certificate List

**URL:** `https://gateway.co.tz/admin/certificates`

Displays all certificates with filtering options.

| Column | Description |
|--------|-------------|
| Token ID | Unique alphanumeric certificate identifier |
| Student | Student's full name |
| University | Issuing university code |
| Type | Certificate type (e.g. *Bachelor's Degree*) |
| Graduation | Graduation date |
| Status | `issued` or `revoked` |

**Buttons:**
- **Issue Certificate** — Open single issuance form.
- **Batch Issue** — Open batch issuance form for up to 100 certificates at once.

---

#### 3.5.2 Issue a Single Certificate

**URL:** `https://gateway.co.tz/admin/certificates/issue`

| Field | Required | Description |
|-------|----------|-------------|
| Student ID | ✓ | The student's ID (must already be registered) |
| University | ✓ | Select the issuing university from the dropdown |
| Certificate Type | ✓ | Type of award, e.g. *Bachelor's Degree*, *Diploma*, *Certificate* |
| Degree Title | ✓ | Full degree name, e.g. *Bachelor of Science in Computer Science* |
| Graduation Date | ✓ | Date of graduation |
| GPA | — | Grade Point Average on the 0.0–5.0 scale |

Click **Issue Certificate**. A toast notification appears:
> *"Issuing certificate on blockchain… this can take up to 15 seconds."*

**On success:**
- A green confirmation box displays the Token ID.
- A **QR code** is shown — save or print this and share it with the student.
- Buttons: **View Certificate**, **Download Certificate & QR**, **Issue Another**.

---

#### 3.5.3 Batch Issue Certificates

**URL:** `https://gateway.co.tz/admin/certificates/batch`

Issue up to **100 certificates** for a single university in one operation.

**Step 1:** Select the **Issuing University** from the dropdown.

**Step 2:** Fill in the certificate rows. Each row requires:
- Student ID, Certificate Type, Degree Title, Graduation Date
- GPA (optional)

**Step 3:** Click **Add Certificate** to add more rows. Click the **trash icon** to remove a row.

**Step 4:** Click **Issue X Certificate(s)**. A toast notification shows estimated processing time (scales with batch size).

**Results screen** shows:
- Total requested, successful, and failed counts.
- An error list for any failed items (with reason).

---

#### 3.5.4 Certificate Detail

**URL:** `https://gateway.co.tz/admin/certificates/<TOKEN_ID>`

Full certificate information split into two panels:

**Certificate Info**
- Student name, Student ID, Certificate Type, Issuing University, Graduation Date, GPA, Honors, Issue date/time

**Blockchain Info**
- Manifest Hash, Transaction Hash, IPFS Hash, Holder Ethereum Address

**QR Code**
- Displays the verification QR code for the certificate.
- Click **Download QR PNG** to save the QR code image.
- The verification URL is shown below the QR code.

**Download Certificate PDF**
- Click **Download Certificate PDF** to generate and download a formal academic certificate document (PDF) including the QR code, blockchain proof, and full certificate details.

**Revoke Certificate**
Displayed only for active (non-revoked) certificates. To revoke:
1. Enter a reason for revocation.
2. Click **Revoke Certificate**.
3. Confirm the action.

> ⚠️ **Revocation is permanent.** A revoked certificate shows as REVOKED on verification, with the reason displayed. This action is recorded on the blockchain and cannot be undone.

---

### 3.6 Verification Audit Log

**URL:** `https://gateway.co.tz/admin/audit-log`

A complete record of all **Tier-2 verifications** performed by employers.

| Column | Description |
|--------|-------------|
| Organisation | The employer/verifier organisation name |
| Token ID | The certificate that was verified |
| Result | Valid / Invalid |
| IP Address | IP address of the verifier |
| Verified At | Date and time of verification |

Use this log to:
- Monitor which employers are verifying which certificates.
- Detect suspicious verification patterns.
- Provide evidence in dispute resolution.

---

## 4. Employer Portal (Verifier)

Employers (HR departments, background check agencies) can register a free account to perform **Tier-2 verification** — a full cryptographic verification that includes the student's name and a document hash check.

### 4.1 Registering as an Employer

**URL:** `https://gateway.co.tz/verifier` → click the **Register** tab

| Field | Required | Description |
|-------|----------|-------------|
| Organisation Name | ✓ | Your company or organisation name (2–200 characters) |
| Email | ✓ | Your work email address |
| Password | ✓ | Minimum 8 characters |

Click **Create Account**. On success, a confirmation message appears. Switch to the **Login** tab to sign in.

---

### 4.2 Logging In

**URL:** `https://gateway.co.tz/verifier` → **Login** tab

| Field | Description |
|-------|-------------|
| Email | Your registered email address |
| Password | Your password |

Click **Login**. On success you are redirected to the Tier-2 Verification Dashboard.

> Your session is stored in a secure cookie. Click **Logout** in the top navigation bar when done.

---

### 4.3 Tier-2 Verification Dashboard

**URL:** `https://gateway.co.tz/verifier/dashboard`

This is the full cryptographic verification tool for employers.

#### Steps to Verify a Certificate

**Step 1 — Obtain the Token ID**
Ask the candidate for their Token ID (printed on the certificate or in the QR code URL). You can also click the **QR scanner icon** to scan a QR code directly with your device camera.

**Step 2 — Obtain the Document Hash**
Ask the candidate to provide the **document manifest hash** of the certificate document they have submitted. This is a SHA-256 hash of the certificate file. If the candidate's file has been altered in any way, the hash will not match the on-chain record.

**Step 3 — Submit for Verification**
Enter both values and click **Verify (Tier 2)**.

#### Tier-2 Result

The result card shows:
- **Status**: VALID ✓, REVOKED, or INVALID ✗
- **Issuing University**
- **Certificate Type**
- **Student Name** *(only shown in Tier-2)*
- **Issue Date**
- **Document Hash**: **Verified ✓** (hashes match — document is authentic) or **Mismatch ✗** (document has been altered)

> Every Tier-2 verification is permanently recorded in the system's audit log, including your organisation name, IP address, and the result.

#### Session History

All verifications performed during your current session are displayed in a table below the form, so you can review multiple verifications without losing earlier results.

---

## 5. How Verification Works

### Tier-1 (Public)

```
User enters Token ID
        ↓
System queries blockchain for certificate metadata
        ↓
Returns: validity, issuing university, certificate type, issue date
        (Student name NOT disclosed)
```

### Tier-2 (Employer, audited)

```
Employer logs in + enters Token ID + Document Hash
        ↓
System checks employer JWT authentication
        ↓
Queries blockchain for certificate metadata
        ↓
Compares submitted document hash against on-chain manifest hash
        ↓
Returns: all Tier-1 data + student name + hash match result
        ↓
Audit log entry written (organisation, token, result, IP, timestamp)
```

### Why Blockchain?

| Traditional System | MyChetiChain |
|-------------------|--------------|
| Paper certificates can be forged | On-chain NFTs are cryptographically immutable |
| Central database can be hacked or altered | Decentralised ledger — no single point of failure |
| Verification requires contacting the university | Instant verification by anyone, anywhere |
| Revoked certificates may still circulate | On-chain revocation is instant and permanent |

---

## 6. Glossary

| Term | Definition |
|------|-----------|
| **Accreditation ID** | A SHA-256 hash of the university's registration number, stored on the blockchain to verify university identity |
| **Blockchain** | A decentralised, immutable ledger of transactions. MyChetiChain uses a Hyperledger FireFly-managed private Ethereum network |
| **EIP-5192** | The Ethereum standard for soul-bound (non-transferable) tokens |
| **Ethereum Address** | A 42-character hexadecimal identifier (`0x…`) representing a wallet on the blockchain |
| **FireFly** | Hyperledger FireFly — the enterprise blockchain middleware used by MyChetiChain |
| **Keystore** | An encrypted file containing a private key. Students receive this during wallet handover |
| **Manifest Hash** | A SHA-256 cryptographic fingerprint of the certificate document, stored on-chain at issuance |
| **NFT** | Non-Fungible Token — a unique digital asset on the blockchain |
| **Revocation** | The permanent cancellation of a certificate on the blockchain |
| **Soul-bound Token** | An NFT that is permanently tied to one address and cannot be transferred |
| **Tier-1 Verification** | Public certificate validity check (no login, no student name) |
| **Tier-2 Verification** | Full employer verification with student name, hash match, and audit log |
| **Token ID** | A unique 7-character alphanumeric identifier for each certificate (e.g. `AB12345`) |
| **Transaction Hash** | A unique identifier for the blockchain transaction that created or modified the certificate |
| **UUPS Proxy** | The upgradeable smart contract pattern used — allows the contract to be updated without losing data |
| **Wallet** | A cryptographic key pair (public + private key) used to sign blockchain transactions |
