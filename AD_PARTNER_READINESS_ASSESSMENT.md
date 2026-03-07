# Ad Partner Readiness Assessment

Date: 2026-03-07
Scope: Third-party ad network readiness and immediate partner recommendations.

## Executive answer
- **Does it meet third-party ad partner baseline now?**
  - **Partially.** It is structurally ready for basic display ads, but policy/compliance documentation and consent rigor should be tightened for stronger approval durability.

## Current strengths
- Existing ad placement model documented.
- Non-intrusive ad UX guardrails described.
- `public/ads.txt` exists.

## Current risks for partner review
1. Privacy/consent language still has risky absolutes in user-facing text.
2. No dedicated ad policy compliance checklist document yet.
3. Sensitive-topic context (politics) needs stricter advertiser safety controls and moderation policy.
4. Limited explicit CMP/consent-mode implementation detail for regions requiring stricter consent handling.

## Partners you can add now (pragmatic order)

## Tier 1 (add now)
1. **Google AdSense**
   - Best first step for low-ops setup.
   - Requires strong policy compliance and stable traffic quality.

2. **Carbon Ads (if accepted in your category)**
   - Works for clean, non-intrusive placements.
   - Strong fit for educational/analysis audience if inventory is accepted.

## Tier 2 (after traffic + policy maturity)
3. **Media.net**
   - Alternative contextual network; requires content quality and compliance review.

4. **Freestar / Raptive / Mediavine-style managed partners**
   - Usually require significant traffic thresholds and stricter editorial/compliance maturity.

## Tier 3 (sponsorship and direct)
5. **Direct sponsorships**
   - Best for niche political/education audiences once brand safety and disclosure standards are formalized.

## What to implement before scaling ad partners
1. Add dedicated `AD_POLICY_COMPLIANCE.md` with:
   - sensitive content rules,
   - ad placement rules,
   - prohibited categories,
   - complaint and takedown process.
2. Add CMP/consent process documentation with region-aware behavior.
3. Add advertiser-safety controls for UGC/share content surfaces.
4. Add ad performance and policy incident runbook.

## Practical recommendation
- Start with AdSense + direct sponsors.
- Add one additional network only after consent/legal docs and policy operations are tightened.

