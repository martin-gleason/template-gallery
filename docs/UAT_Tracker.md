# UAT Tracker — Template Gallery

**Project:** CCJCPS Template Gallery
**Sprint:** 13
**Testing Period:** February 25 – March 7, 2026
**Dev Server URL:** `http://localhost:5173`
**Test Specs:** See `UAT_Manual_Tests.md` (10 manual) and `test/uat-automated.test.tsx` (10 automated)

---

## Instructions for Testers

1. Start the dev server: `npm run dev`
2. Open `http://localhost:5173` in your browser
3. Run through each test in `UAT_Manual_Tests.md`
4. Copy the **Tester Template** section below and fill it in
5. Use the comfort level scale for each test
6. Add any notes about confusing UI, slow behavior, or unexpected results

### Comfort Level Scale

| Score | Meaning |
|---|---|
| 1 | Very confused — could not complete without help |
| 2 | Struggled — completed but had to re-read instructions |
| 3 | Neutral — completed but some things weren't obvious |
| 4 | Comfortable — completed easily with minor hesitation |
| 5 | Very comfortable — intuitive, no issues at all |

---

## Automated Test Results

Run: `npx vitest run test/uat-automated.test.tsx --reporter=verbose`

| Test ID | Test Name | Result | Date |
|---|---|---|---|
| UAT-A01 | App shows loading state before data arrives | | |
| UAT-A02 | App shows error state when fetch fails | | |
| UAT-A03 | Status filter shows correct count per status | | |
| UAT-A04 | OR within category: ileps + wellness → 7 | | |
| UAT-A05 | AND across categories: ileps + aoic-required → 4 | | |
| UAT-A06 | Search matches source filename (case-insensitive) | | |
| UAT-A07 | Empty state for impossible filter combo | | |
| UAT-A08 | Card click opens detail, back returns to gallery | | |
| UAT-A09 | Tag click in detail filters gallery and closes detail | | |
| UAT-A10 | URL round-trip preserves filters | | |

---

## Tester Template

> Copy everything between the lines below for each new tester.

---

### Tester: [Name]

**Role:** [Admin / Approver / General Staff / Other]
**Date:** [YYYY-MM-DD]
**Browser:** [Chrome / Firefox / Safari / Edge + version]

| Test ID | Result | Comfort (1-5) | Notes |
|---|---|---|---|
| UAT-M01 | | | |
| UAT-M02 | | | |
| UAT-M03 | | | |
| UAT-M04 | | | |
| UAT-M05 | | | |
| UAT-M06 | | | |
| UAT-M07 | | | |
| UAT-M08 | | | |
| UAT-M09 | | | |
| UAT-M10 | | | |

**Overall Experience:**
> [Free text — What was your general impression? Anything frustrating or delightful?]

**Would you feel comfortable using this daily?** [ ] Yes [ ] No

---

## Summary (filled in after all testing is complete)

### Aggregate Results

| Test ID | Total Testers | Pass | Fail | Blocked | Pass Rate |
|---|---|---|---|---|---|
| UAT-M01 | | | | | |
| UAT-M02 | | | | | |
| UAT-M03 | | | | | |
| UAT-M04 | | | | | |
| UAT-M05 | | | | | |
| UAT-M06 | | | | | |
| UAT-M07 | | | | | |
| UAT-M08 | | | | | |
| UAT-M09 | | | | | |
| UAT-M10 | | | | | |

### Common Issues

1. _[To be filled after testing]_
2. _[To be filled after testing]_
3. _[To be filled after testing]_

### Average Comfort Scores

| Test ID | Avg Comfort | Min | Max |
|---|---|---|---|
| UAT-M01 | | | |
| UAT-M02 | | | |
| UAT-M03 | | | |
| UAT-M04 | | | |
| UAT-M05 | | | |
| UAT-M06 | | | |
| UAT-M07 | | | |
| UAT-M08 | | | |
| UAT-M09 | | | |
| UAT-M10 | | | |

**Overall Average Comfort Score:** _[To be calculated]_
**Testers who would use daily:** _[X / Y]_
