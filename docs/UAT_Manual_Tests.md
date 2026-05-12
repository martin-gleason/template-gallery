# UAT Manual Test Scripts — Template Gallery

**Project:** CCJCPS Template Gallery
**Version:** Sprint 13
**Prerequisites:** Dev server running at `http://localhost:5173` (`npm run dev`)
**Total Tests:** 10
**Estimated Time:** 15–20 minutes

---

## How to Use These Scripts

1. Start the dev server: `npm run dev`
2. Open `http://localhost:5173` in your browser
3. Follow each test step-by-step
4. Mark Pass/Fail in the UAT Tracker document
5. Add notes about anything confusing, slow, or broken

---

## UAT-M01: Browse the Full Gallery

**Estimated Time:** 2 minutes

**Steps:**

1. Open `http://localhost:5173` in your browser
2. Wait for the page to finish loading
3. Verify you see a header that says **"Template Gallery"** with subtitle **"CCJCPS Training Flyer Templates"**
4. Count the template cards displayed in the grid
5. Scroll down to see all cards
6. Look at the left sidebar — verify you see filter sections for **Status**, **Program**, **Audience**, and **Compliance**

**Expected Results:**

- [ ] Page loads without errors
- [ ] Header shows "Template Gallery" and "CCJCPS Training Flyer Templates"
- [ ] Exactly **12** template cards are visible
- [ ] Each card shows a template name, category, color swatch, and status badge
- [ ] Sidebar shows filter sections with checkboxes and tag counts

---

## UAT-M02: Filter by Approval Status

**Estimated Time:** 2 minutes

**Steps:**

1. Start from the gallery view (all 12 templates visible)
2. In the sidebar under **Status**, click the **"Approved"** radio button
3. Count the visible cards
4. Click the **"Draft"** radio button
5. Count the visible cards
6. Click the **"Archived"** radio button
7. Count the visible cards
8. Click **"All"** to return to the full gallery

**Expected Results:**

- [ ] Approved shows exactly **7** cards
- [ ] Draft shows exactly **3** cards
- [ ] Archived shows exactly **2** cards
- [ ] All shows **12** cards again

---

## UAT-M03: Search for a Training Topic

**Estimated Time:** 1 minute

**Steps:**

1. Start from the gallery view (all 12 templates visible)
2. Click in the **search box** at the top of the sidebar
3. Type **"Wellness"**
4. Observe the cards that appear

**Expected Results:**

- [ ] Cards filter as you type
- [ ] Only templates with "Wellness" in their name appear
- [ ] You should see **3** Wellness templates (Mindfulness, Yoga & Stretching, Nutrition Basics)
- [ ] No non-Wellness templates are shown

---

## UAT-M04: Filter by Program Tag

**Estimated Time:** 1 minute

**Steps:**

1. Clear the search box if anything is typed (or refresh the page)
2. In the sidebar under **Program**, check the box next to **"ILEPS/CCP"**
3. Count the visible cards

**Expected Results:**

- [ ] Exactly **4** templates appear
- [ ] All visible templates are ILEPS-related (Basic Training, Advanced Supervision, Annual Refresher, Introduction to Probation)
- [ ] The ILEPS/CCP checkbox shows a check mark

---

## UAT-M05: Combine Multiple Filters

**Estimated Time:** 2 minutes

**Steps:**

1. Clear all filters first — click the **"Clear All Filters"** button in the sidebar
2. Under **Program**, check the box next to **"C5"**
3. Count the visible cards (should be 2)
4. Under **Audience**, check the box next to **"Line Staff"**
5. Count the visible cards

**Expected Results:**

- [ ] With only C5 selected: **2** templates appear
- [ ] After adding Line Staff: the results narrow further (AND behavior across categories)
- [ ] Both C5 and Line Staff checkboxes show check marks
- [ ] Only templates that have BOTH the C5 program tag AND the Line Staff audience tag are shown

---

## UAT-M06: Clear All Filters

**Estimated Time:** 1 minute

**Steps:**

1. If filters aren't already applied, check a few boxes (e.g., a Program and an Audience filter)
2. Verify the card count is less than 12
3. Click the **"Clear All Filters"** button in the sidebar
4. Observe the gallery

**Expected Results:**

- [ ] All checkboxes become unchecked
- [ ] Status returns to "All"
- [ ] Search box is cleared
- [ ] All **12** templates are visible again
- [ ] The URL bar no longer shows filter parameters

---

## UAT-M07: View Template Details

**Estimated Time:** 2 minutes

**Steps:**

1. Start from the gallery view (all 12 templates visible)
2. Click on any template card (e.g., **"ILEPS-CCP Basic Training Flyer"**)
3. Observe the detail view that appears
4. Look for the following information sections:
   - Preview image area
   - Metadata (category, layout, font, color, WCAG compliance)
   - Tags grouped by category (Program, Audience, Compliance)
   - Audit trail (created date, approval info)
   - Action buttons (Download PDF, Export HTML)

**Expected Results:**

- [ ] Gallery grid is replaced by a detail view
- [ ] Template name is prominently displayed
- [ ] Metadata section shows category, layout pattern, font family, and color label
- [ ] Tags are grouped under their category headings (Program, Audience, Compliance)
- [ ] Audit trail shows CREATED date and APPROVED by information (for approved templates)
- [ ] Download PDF and Export HTML buttons are visible

---

## UAT-M08: Navigate Back from Detail

**Estimated Time:** 1 minute

**Steps:**

1. From the detail view (if not there, click any template card first)
2. Click the **"Back to Gallery"** button
3. Observe the gallery view

**Expected Results:**

- [ ] Gallery grid reappears with all previously visible templates
- [ ] The detail view is no longer shown
- [ ] If you had filters applied before opening the detail, those filters are still active

---

## UAT-M09: Click a Tag in Detail to Filter

**Estimated Time:** 2 minutes

**Steps:**

1. Start from the gallery view (all 12 templates visible, no filters)
2. Click on **"ILEPS-CCP Basic Training Flyer"** to open its detail
3. In the Tags section, find the **Program** tags
4. Click the **"ILEPS/CCP"** tag chip
5. Observe what happens

**Expected Results:**

- [ ] Detail view closes automatically
- [ ] Gallery returns with the ILEPS/CCP program filter active
- [ ] Only **4** ILEPS templates are shown
- [ ] The ILEPS/CCP checkbox in the sidebar is checked
- [ ] The URL bar shows `?program=ileps`

---

## UAT-M10: Share a Filtered View via URL

**Estimated Time:** 2 minutes

**Steps:**

1. Start from the gallery view
2. Apply a filter — check **"ILEPS/CCP"** under Program
3. Verify only 4 templates show
4. Look at the browser URL bar — it should contain `?program=ileps`
5. **Copy the full URL** from the address bar
6. Open a **new browser tab**
7. **Paste the URL** and press Enter
8. Observe the gallery in the new tab

**Expected Results:**

- [ ] The new tab loads with the ILEPS/CCP filter already active
- [ ] Only **4** ILEPS templates are visible (not all 12)
- [ ] The ILEPS/CCP checkbox is checked in the sidebar
- [ ] The filtered view matches exactly what was shown in the original tab
