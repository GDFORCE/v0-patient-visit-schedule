# Site Performance Scoring — Methodology

> Status: **Approved methodology, pending implementation.**
> Scope: Sponsor Dashboard → "Site Performance". This score may influence site-selection
> decisions, so it must be **target-based, time-normalized, direction-aware, confidence-adjusted,
> recency-weighted, transparent, and configurable**.

This model follows **ICH E6(R2) risk-based monitoring**, scoring each active site on
Key Performance / Risk Indicators (KPIs/KRIs) grouped into domains, then combining them
into one auditable composite score.

---

## 1. Design principles

1. **Target-based, not relative.** Each site is scored against pre-agreed thresholds, not
   ranked against peers. (Peer percentile may be shown alongside, but never drives the score —
   a weak peer group must not make a mediocre site look good.)
2. **Time-normalized recruitment.** Enrollment is measured against the **expected recruitment
   curve as of today** (`expectedByNow`), not raw `enrolled / target`. A site 3 months in is not
   penalized against one 12 months in.
3. **Direction-aware.** Lower-is-better KPIs (screen-fail, deviations, query rate, dropout,
   resolution time, data-entry lag) are inverted before normalization.
4. **Confidence / maturity adjustment.** Below a minimum sample size (`N_min`), the site shows
   **"Insufficient data"** rather than a misleading score.
5. **Recency-weighted.** KPIs are computed over a rolling window (default 90 days) so a site that
   fixed its issues is not haunted by old data. A trend arrow compares vs the previous window.
6. **Transparent & configurable.** Every sub-score is visible; all weights and thresholds live in
   a single config object (see §6) so the study team can tune them without touching logic.

---

## 2. Domains, weights & KPIs

| Domain | Weight | KPI | Formula | Direction | Threshold (→100 / →0) |
|---|---|---|---|---|---|
| **Recruitment** | 25% | Enrollment vs expected | `enrolled / expectedByNow` | ↑ | ≥100% → 100, ≤50% → 0 |
| | | Enrollment rate | patients / site / month vs planned | ↑ | ≥plan → 100, ≤50% plan → 0 |
| | | Screen-failure rate | `screenFail / screened` | ↓ | ≤15% → 100, ≥40% → 0 |
| **Conduct / Compliance** | 25% | Visit-window compliance | `visitsInWindow / totalVisits` | ↑ | ≥95% → 100, ≤70% → 0 |
| | | Protocol deviations | `deviations / patient` | ↓ | 0 → 100, ≥0.5 → 0 |
| | | Overdue visits | `overdueVisits / activePatients` | ↓ | 0 → 100, ≥0.3 → 0 |
| **Data quality** | 20% | Query rate | `openQueries / dataPoints` | ↓ | ≤0.02 → 100, ≥0.15 → 0 |
| | | Query resolution time | median days to close | ↓ | ≤7d → 100, ≥30d → 0 |
| | | Data-entry lag | days visit → eCRF entry | ↓ | ≤5d → 100, ≥21d → 0 |
| **Safety** | 15% | SAE reporting timeliness | `% SAEs reported ≤24h` | ↑ | 100% → 100, ≤80% → 0 |
| **Retention** | 15% | Retention | `1 − (withdrawn + dropouts) / enrolled` | ↑ | ≥90% → 100, ≤70% → 0 |

Domain weights sum to **100%**. KPI weights within a domain default to **equal** unless overridden
in config.

---

## 3. Normalization

Each KPI value is normalized to 0–100 against its `best`/`worst` thresholds, then clamped:

```
norm = clamp( (value − worst) / (best − worst) × 100, 0, 100 )
```

For **lower-is-better** KPIs, `best < worst` (e.g. screen-fail best = 0.15, worst = 0.40),
which naturally inverts the scale. `clamp(x, 0, 100)` bounds outliers.

---

## 4. Composite computation

```
DomainScore_d = Σ_k ( kpiWeight_{d,k} × norm_{d,k} )      // weighted avg of the domain's KPIs
SiteScore     = Σ_d ( domainWeight_d × DomainScore_d )    // weighted avg of domains

Confidence    = min( enrolled / N_min, 1 )                // 0..1
Displayed     = enrolled < N_min ? "Insufficient data" : round(SiteScore)
Trend         = SiteScore − prevWindowScore               // ▲ / ▼ / ▬
```

### Rating bands
| Score | Band | Color |
|---|---|---|
| ≥ 85 | Excellent | green |
| 70–84 | Good | amber |
| 55–69 | Watch | orange |
| < 55 | At-risk | red |

A site below `N_min` shows **"Insufficient data"** with a neutral chip (no band/color).

---

## 5. Required per-site data

| Field | Exists today? | Notes |
|---|---|---|
| `enrolled`, `target`, `patients` | ✅ | |
| `visitCompliance` | ✅ | already a % |
| `overdueVisits` | ✅ | |
| `expectedByNow` | ❌ add | or derive from `siteActivationDate` + planned curve |
| `screened`, `screenFail` | ❌ add | currently trial-level only |
| `withdrawn`, `dropouts` | ❌ add | currently trial-level only |
| `deviations` | ❌ add | |
| `openQueries`, `dataPoints`, `queryResolutionDays`, `dataEntryLagDays` | ❌ add | data-quality domain |
| `saeOnTimePct` | ❌ add | safety domain |
| `prevWindowScore` | ❌ add | for trend arrow (mock for prototype) |

For the prototype these can be plausible mock values; the formulas are unchanged when real data
is wired in.

---

## 6. Config object (single source of truth for weights & thresholds)

Implementation should expose one named config so weights/thresholds are tunable without editing
logic. Proposed shape (`lib/site-scoring.ts`):

```ts
export const SITE_SCORING_CONFIG = {
  nMin: 10,                 // min enrolled before a score is shown
  windowDays: 90,           // rolling window for recency
  domains: {
    recruitment: { weight: 0.25, kpis: {
      enrollmentVsExpected: { best: 1.00, worst: 0.50 },   // ratio
      enrollmentRate:       { best: 1.00, worst: 0.50 },   // ratio vs plan
      screenFailRate:       { best: 0.15, worst: 0.40 },   // lower-is-better
    }},
    compliance: { weight: 0.25, kpis: {
      visitWindowCompliance:{ best: 0.95, worst: 0.70 },
      deviationsPerPatient: { best: 0.00, worst: 0.50 },   // lower-is-better
      overduePerActive:     { best: 0.00, worst: 0.30 },   // lower-is-better
    }},
    dataQuality: { weight: 0.20, kpis: {
      queryRate:            { best: 0.02, worst: 0.15 },   // lower-is-better
      queryResolutionDays:  { best: 7,    worst: 30 },     // lower-is-better
      dataEntryLagDays:     { best: 5,    worst: 21 },     // lower-is-better
    }},
    safety: { weight: 0.15, kpis: {
      saeOnTimePct:         { best: 1.00, worst: 0.80 },
    }},
    retention: { weight: 0.15, kpis: {
      retention:            { best: 0.90, worst: 0.70 },
    }},
  },
  bands: [
    { min: 85, label: "Excellent",  color: "green"  },
    { min: 70, label: "Good",       color: "amber"  },
    { min: 55, label: "Watch",      color: "orange" },
    { min: 0,  label: "At-risk",    color: "red"    },
  ],
} as const
```

KPI weights default to equal within a domain; add an optional `weight` per KPI to override.

---

## 7. UI (Site Performance section)

Replace the single enrollment bar with, per site:
- **Composite score (0–100) + rating band chip + trend arrow**, or "Insufficient data".
- Expandable **domain breakdown** (Recruitment / Compliance / Data quality / Safety / Retention)
  showing each domain score and the KPI values that drove it — so the sponsor sees *why*.
- Same score reused on the **Sites tab** cards and Site Detail for consistency.

---

## 8. Open decisions before/while implementing

- Confirm `N_min`, window length, weights, and thresholds above (defaults are reasonable starting points).
- Source of `expectedByNow` — explicit field vs derived from site activation date + planned curve.
- Whether to surface peer percentile (display-only) next to the absolute score.
