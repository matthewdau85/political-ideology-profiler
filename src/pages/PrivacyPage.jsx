export default function PrivacyPage() {
  return (
    <main style={{ maxWidth: '768px', margin: '0 auto', padding: '48px 24px', color: '#1f2937' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>Privacy Policy</h1>
      <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '32px' }}>Effective: 4 April 2026 | Operator: Matthew Donovan, Queensland, Australia | Contact: matthew4surfers@gmail.com</p>

      <section style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>1. Sensitive Information — Political Opinions</h2>
        <p>Your quiz responses constitute political opinions, which is a category of sensitive personal information under the Australian Privacy Act 1988. We collect this information only with your explicit consent (provided at quiz start). We use it solely to generate your political profile and improve the quiz.</p>
      </section>

      <section style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>2. What We Collect</h2>
        <p>We collect: quiz responses (political opinions), account information (email, password via Supabase), payment information (processed by Stripe), usage data (Google Analytics/AdSense), and server logs (IP address, browser type).</p>
      </section>

      <section style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>3. Third-Party Services</h2>
        <p>Google AdSense and Google Analytics (advertising and analytics), Supabase (authentication and data storage), Stripe (payment processing for premium features), Vercel (hosting). Each service has its own privacy policy.</p>
      </section>

      <section style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>4. Australian Privacy Principles</h2>
        <p>We comply with the 13 Australian Privacy Principles (APPs) under the Privacy Act 1988 (Cth). You have the right to access, correct, or request deletion of your personal information including all quiz results. Contact: matthew4surfers@gmail.com</p>
      </section>

      <section style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>5. GDPR (EU Users)</h2>
        <p>If you are located in the European Union, you have additional rights under GDPR including the right to erasure, data portability, and restriction of processing. Contact us to exercise these rights.</p>
      </section>

      <section style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>6. Governing Law</h2>
        <p>This policy is governed by the laws of Queensland, Australia.</p>
      </section>
    </main>
  )
}