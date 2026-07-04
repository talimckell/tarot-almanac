# Privacy Policy

**The Tarot Almanac**
Effective date: July 3, 2026
Last updated: July 4, 2026

This Privacy Policy explains what personal information The Tarot Almanac ("we," "us," "our," "the Almanac") collects when you use tarotalmanac.com (the "Service"), how we use it, who we share it with, and the choices you have. It's written to be actually readable, in keeping with how the rest of the site works: if something here is unclear, privacy@tarotalmanac.com gets you a real answer.

If you're a resident of the EU/UK, California, or another jurisdiction with specific privacy rights, see the **"Your Rights"** section below for what applies to you.

---

## 1. Who we are

The Tarot Almanac is operated by Tali Beesley, a sole proprietor doing business as The Tarot Almanac, based in North Carolina. You can reach us at privacy@tarotalmanac.com with any privacy question or request.

---

## 2. Information we collect

### 2.1 Information you give us directly

- **Email address** — required to create an account (we use passwordless "magic link" sign-in, so we don't store a password).
- **Name** — optional, if you choose to add one to your profile.
- **Birth date** — required to generate your personal Bearing, natal chart, and daily/monthly personal readings. This is the core input the math runs on.
- **Payment information** — handled entirely by our payment processor, Stripe. We never see or store your card number. We do store a few Stripe-issued references (your Stripe customer ID, subscription ID, subscription status, and renewal date) so your account reflects your subscription correctly.

### 2.2 Information you give us about other people

If you save a chart for someone else (a partner, parent, friend, child) using our chart library feature, you provide **that person's name and birth date**. This is information about a third party, not about you.

**By entering another person's birth date, you represent that you have their permission to do so** (or, if they're a minor in your care, that you're their parent or legal guardian). We treat this data the same way we treat your own — same security, same retention rules — but we want to be upfront that we're relying on you, not on that person, for the underlying permission to hold it.

### 2.3 Information collected automatically

- **Birthday cookie.** If you use the time-travel / personal-reading link format (URLs with a `?b=` birth date parameter), we set a cookie storing that birth date for about a year, so the personalized reading persists across visits without requiring an account. This is set even if you're not logged in.
- **Session cookies.** Our authentication provider (Supabase) sets cookies necessary to keep you logged in.
- **Payment flow cookies.** Stripe sets cookies during checkout to process your payment securely.
- **Server logs.** Like most web services, our hosting provider (Vercel) automatically logs basic technical information (IP address, browser type, request timing) for security and reliability purposes.

### 2.4 Analytics (planned)

We plan to add **Google Analytics** to understand site usage. Once live, Google Analytics will set cookies (typically `_ga` / `_gid`) and collect information such as your IP address, device type, and on-site behavior, which is sent to Google. We'll update this policy and, where required by your location (including the EU, UK, and California), provide a cookie consent mechanism before this is active.

We may also use **Google Search Console**, which reads publicly available crawl and search-ranking data about our site. It does not collect personal information about individual visitors.

---

## 3. How we use your information

We use the information above to:

- Create and maintain your account
- Calculate and display your Bearing, natal chart, and daily/monthly/yearly readings
- Generate the AI-synthesized interpretive layer of certain readings (such as the monthly reading) through our AI provider, Anthropic. To do this we send Anthropic only the *derived* results of the math (card names, elements, and the relevant dates) — never your name, birth date, or email
- Process subscription payments and one-off purchases through Stripe
- Send you transactional emails (magic-link sign-in, receipts, service notices) through our email provider, Resend
- Maintain your saved chart library
- Keep the Service secure and working correctly
- Understand aggregate usage patterns (once analytics is live) to improve the Service

We do not use your birth date or chart data to make automated decisions that produce legal or similarly significant effects on you, and we do not sell your personal information.

---

## 4. Who we share information with

We share information with the following categories of service providers (sometimes called "sub-processors"), each of whom processes it only to provide their specific function to us:

| Provider | Purpose | What they process |
|---|---|---|
| **Supabase** | Authentication and database hosting | Email, birth date, profile and chart data |
| **Vercel** | Application hosting | Server logs, IP addresses (incidental to hosting) |
| **Stripe** | Payment processing | Payment details, billing contact info |
| **Resend** | Transactional email delivery | Email address, message content (magic links, receipts) |
| **Anthropic** | AI-synthesized reading generation | Derived reading data only (card names, elements, and relevant dates) — no name, birth date, or email |
| **Google (Analytics, Search Console)** | Site analytics and search indexing (planned) | Device/behavior data (Analytics only); no personal data (Search Console) |

Anthropic processes the data we send only to generate the reading text we request; and, under its commercial terms, does not use the data we submit through the API to train its models.

We do not share your information with third parties for their own marketing purposes, and we do not sell it.

We may disclose information if required by law, to protect the rights or safety of the Almanac or our users, or in connection with a merger, acquisition, or sale of assets (in which case we'll notify you).

---

## 5. International data transfers

Because Supabase, Vercel, Stripe, Resend, Anthropic, and Google may process data outside your home country, your information may be transferred internationally. Each of these providers maintains its own compliance mechanisms for cross-border transfers (such as Standard Contractual Clauses for EU data). If you're in the EU/UK and want details on a specific provider's transfer mechanism, contact us.

---

## 6. Data retention

We keep your account information for as long as your account is active. If you delete your account, your profile and saved charts are deleted as well (saved charts are tied to your profile and are removed when it is). We may retain minimal records where required for legal, tax, or fraud-prevention purposes even after account deletion.

The birthday cookie expires automatically after about a year, or you can clear it by clearing your browser cookies.

---

## 7. Your rights and choices

**Access, correction, deletion.** You can update your profile information (name, birth date) directly in your account settings. You can request deletion of your account and associated data at any time by contacting privacy@tarotalmanac.com or using the in-app delete option.

**EU/UK (GDPR) residents.** You have the right to access, correct, delete, restrict, or port your personal data, and to object to certain processing. Our legal basis for processing your birth date and profile information is performance of a contract (providing the Service you signed up for); for optional analytics, it will be consent, once implemented.

**California (CCPA/CPRA) residents.** You have the right to know what personal information we collect, request deletion, and opt out of "sale" or "sharing" of personal information. We do not sell personal information. To exercise these rights, contact privacy@tarotalmanac.com.

**Cookies.** You can control or delete cookies through your browser settings. Blocking essential cookies (like the auth session cookie) may prevent you from staying logged in.

---

## 8. Children's privacy

The Tarot Almanac is not directed at children, and you must be at least 16 years old to create an account. We chose 16 as our floor deliberately: it clears the U.S. COPPA threshold (which applies to children under 13) and matches the highest age-of-consent standard used by any EU member state under GDPR, so a single global minimum keeps us compliant everywhere without country-by-country rules. We do not knowingly collect personal information from anyone under 16 in connection with an account. If you believe someone under 16 has created an account without appropriate consent, contact us at privacy@tarotalmanac.com and we'll remove the relevant data.

This age minimum applies to account holders. It does not prevent an account holder from saving a chart for a minor in their care (for example, a parent saving a chart for their child) as described in Section 2.2 above.

---

## 9. Security

We rely on our providers' security infrastructure (Supabase, Vercel, Stripe) to protect your data, including encryption in transit. No system is perfectly secure, and we can't guarantee absolute security, but we don't store payment card data ourselves and we limit what we collect to what the Service actually needs.

If you believe you've discovered a security vulnerability in the Service, please report it to security@tarotalmanac.com before disclosing it publicly, so we can investigate and address it. We appreciate responsible disclosure.

---

## 10. Changes to this policy

We may update this Privacy Policy as the Service evolves (for example, when Google Analytics goes live). We'll update the "Last updated" date above, and for material changes, we'll provide more prominent notice (such as an email or in-app notification).

---

## 11. Contact

Questions, requests, or concerns about this policy or your data: **privacy@tarotalmanac.com**
