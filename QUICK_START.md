# Firebase Firestore - Quick Reference

## 5-Minute Setup

### Step 1: Create Firebase Project (2 min)
```
https://console.firebase.google.com
→ "Create project" → Name it → Accept terms → Done
```

### Step 2: Get Config (1 min)
```
Project Settings (gear icon) → General tab → Copy firebaseConfig
```

### Step 3: Update pay.html (1 min)
Find this in pay.html:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```
Paste your actual values.

### Step 4: Enable Firestore (1 min)
```
Firestore Database → Create Database → Production Mode → Create
```

### Step 5: Update Security Rules
Go to Firestore → Rules tab, paste:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /payments/{document=**} {
      allow write: if request.time < timestamp.date(2026, 12, 31);
      allow read: if false;
    }
  }
}
```
Click "Publish"

### Step 6: Test
1. Open pay.html in browser
2. Fill form → Click "Proceed to payment"
3. Check Firestore Console → payments collection
4. ✅ New document appears!

---

## What Gets Saved to Firestore

```javascript
{
  // User Info
  firstName: "Alex",
  lastName: "Chen",
  email: "alex@email.com",
  
  // School Info
  currentGrade: "12",
  highSchool: "Thomas Jefferson",
  gpa: 3.92,
  satScore: 1510,
  
  // Package Info
  selectedPackage: "flagship",
  packageName: "Full Application Partner",
  basePrice: 1949,
  finalPrice: 1949,
  meritDiscountApplied: 0,
  
  // Extras
  notes: "Optional notes...",
  submissionTime: "2026-01-15T14:32:00Z",
  timestamp: <Firestore Timestamp>,
  status: "pending_payment",
  stripeLink: "https://buy.stripe.com/..."
}
```

---

## Where Data is Saved

**Collection:** `payments`
**Location:** Firebase Console → Firestore Database → payments

Each user submission = 1 document with auto-generated ID

---

## Common Tasks

### View All Submissions
```
Firebase Console → Firestore Database → payments collection
```

### Export Data to CSV
1. Click "payments" collection
2. Select documents
3. Use Firebase export tools or third-party tools

### Find Submission by Email
1. Firestore Console
2. Create composite index if needed
3. Query: `email == "alex@email.com"`

### Update Status After Payment
Use Stripe webhook (see full guide) or manually:
1. Open document in Firestore
2. Click status field
3. Change to "completed"

---

## Firebase Console Quick Links

| Task | Path |
|------|------|
| View data | Firestore Database → payments collection |
| Update rules | Firestore Database → Rules tab |
| API keys | Project Settings → Service Accounts → API keys |
| Restrict keys | API Keys → Click default key → Add restrictions |
| Check errors | Cloud Functions → Logs (if using webhooks) |

---

## Troubleshooting Checklist

- [ ] Firebase config pasted correctly?
- [ ] Firestore database created?
- [ ] Security rules published?
- [ ] Browser console clear of errors? (F12)
- [ ] Test form fills and submits?
- [ ] Document appears in Firestore?

---

## Production Checklist

- [ ] API key restricted to your domain(s)
- [ ] Firestore rules updated for security
- [ ] Email confirmation system set up
- [ ] Stripe webhook configured (optional)
- [ ] Daily backup procedure planned
- [ ] Error monitoring enabled

---

## Help Links

- Firebase Docs: https://firebase.google.com/docs/firestore
- Stripe Docs: https://stripe.com/docs
- Firebase Support: https://firebase.google.com/support

---

## Cost Estimation

**Firebase Firestore Pricing (Free Tier):**
- 50K reads/day ✅ (plenty for most sites)
- 20K writes/day ✅ (enough for forms)
- 1GB storage ✅ (plenty for form data)
- **Cost:** $0 until you exceed free tier

---

## Next Steps

1. ✅ Complete 5-minute setup above
2. 📖 Read `FIREBASE_SETUP_GUIDE.md` for details
3. 🧪 Test with form submission
4. 🔒 Set API key restrictions
5. 📧 (Optional) Add email confirmations
6. 🔄 (Optional) Add Stripe webhooks

Done! 🎉
