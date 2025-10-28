# Quick Reference - Venue Saving Issue

## 📌 Problem
- **Error:** `400 Validation Error - "Name, location, and capacity are required"`
- **Current:** Frontend calling API, backend rejecting
- **Fix:** Backend validation logic needs update

---

## 🔍 What To Check (5 Seconds)

### Browser Console (F12):
```javascript
localStorage.getItem('auth_token')      // ✅ Should return token
```

### Network Tab:
- Find: `POST /api/venues`
- Check Headers: `Authorization: Bearer <token>` ✅
- Status: Currently `400 Bad Request` ⚠️

---

## 🎯 Root Cause

**Backend validation is checking:**
```javascript
if (!capacity)  // ❌ Rejects capacity: 0
```

**Should be:**
```javascript
if (capacity === undefined)  // ✅ Accepts 0
```

---

## ✅ Files

| What | Location |
|------|----------|
| **Frontend Code** | `src/pages/FieldManagement.tsx:581-649` |
| **API Call** | Line 615: `Authorization: Bearer <token>` |
| **Spec** | `BACKEND_API_SPECIFICATION.md:295-298` |
| **Schema** | Lines 924-955 |

---

## 📝 Quick Fix (Backend Dev)

```javascript
// OLD (Wrong):
if (!name || !location || !capacity) {
  return res.status(400).json({ error: "Required fields missing" });
}

// NEW (Correct):
if (!name || !location || capacity === undefined) {
  return res.status(400).json({ error: "Required fields missing" });
}
```

---

## 🚨 Action Required

1. **Frontend Dev:** ✅ Already done - using API
2. **Backend Dev:** ⚠️ Fix validation in `/api/venues`
3. **Senior Lead:** 📋 Approve & test

---

**Read Full Docs:**
- `EXECUTIVE_SUMMARY.md` - Overview
- `TECHNICAL_DEBUG_DOCUMENT.md` - Full details

