# Firebase Firestore Integration Guide - NoVa Elite

## Overview
This integration automatically saves customer form data to Firebase Firestore whenever a user proceeds to the payment step (Step 3). All data is captured before Stripe payment is initiated.

---

## Setup Steps

### 1. Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Create a project"** or select existing project
3. Name it (e.g., "NoVa Elite Website")
4. Accept the terms and click **"Create project"**
5. Wait for initialization to complete

### 2. Get Your Firebase Config
1. In Firebase Console, go to **Project Settings** (gear icon, top left)
2. Click the **"General"** tab
3. Scroll down to find your app configuration
4. If you don't have an app registered, click **"Add app"** → **"Web"** (</> icon)
5. Copy your `firebaseConfig` object:
   ```javascript
   {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT_ID.appspot.com",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   }
   ```

### 3. Enable Firestore Database
1. In Firebase Console, go to **Firestore Database** (left sidebar)
2. Click **"Create Database"**
3. Choose **"Start in production mode"**
4. Select your region (default is fine)
5. Click **"Create"**

### 4. Set Firestore Security Rules (Important!)
By default, production mode blocks all reads/writes. Update the rules:

1. In Firestore, go to the **"Rules"** tab
2. Replace the rules with:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Allow anyone to write to the payments collection
       // (in production, use authentication to restrict further)
       match /payments/{document=**} {
         allow write: if request.time < timestamp.date(2026, 12, 31);
         allow read: if false;
       }
     }
   }
   ```
3. Click **"Publish"**

**Note:** The `allow write` rule above is permissive for development. In production, you may want to:
- Use Google Sign-in to authenticate users
- Add rate limiting
- Validate data on the backend
- Add a secret token to requests

### 5. Update Your `pay.html`
Replace the Firebase config placeholder in `pay.html` with your actual credentials:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",  // Your actual API key
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

---

## Data Structure

When a user proceeds to Step 3 (Payment), the following data is saved to Firestore in a collection called **`payments`**:

```json
{
  "firstName": "Alex",
  "lastName": "Chen",
  "email": "alex@email.com",
  "currentGrade": "12",
  "highSchool": "Thomas Jefferson",
  "gpa": 3.92,
  "satScore": 1510,
  "selectedPackage": "flagship",
  "packageName": "Full Application Partner",
  "basePrice": 1949,
  "finalPrice": 1949,
  "meritDiscountApplied": 0,
  "notes": "Interested in Ivies",
  "submissionTime": "2026-01-15T14:32:00.000Z",
  "timestamp": "2026-01-15T14:32:00.000Z",
  "status": "pending_payment",
  "stripeLink": "https://buy.stripe.com/..."
}
```

### Field Descriptions:
- **firstName, lastName, email**: Customer personal info
- **currentGrade**: Student's current grade (9-12 or null)
- **highSchool**: High school name
- **gpa, satScore**: Test scores (null if not provided)
- **selectedPackage**: Package ID (flagship, longgame, targeted)
- **packageName**: Human-readable package name
- **basePrice**: Original package price
- **finalPrice**: Price after merit discount
- **meritDiscountApplied**: Discount percentage applied (0 = no discount)
- **notes**: Optional customer notes
- **submissionTime**: ISO timestamp when form was submitted
- **timestamp**: Firestore server timestamp (better for sorting)
- **status**: Payment status (pending_payment, completed, failed)
- **stripeLink**: Stripe checkout URL used

---

## Viewing Your Data

### In Firebase Console:
1. Go to **Firestore Database**
2. Look for the **`payments`** collection
3. Click to expand and view documents
4. Each document has a unique auto-generated ID

---

## Next Steps (Optional Enhancements)

### 1. Stripe Webhook Integration (Recommended for Production)
To update payment status automatically after successful payment:

1. Set up a backend server (Node.js, Python, etc.)
2. Create a Stripe webhook endpoint to listen for `payment_intent.succeeded`
3. Update the Firestore document status to "completed"
4. Send a confirmation email

Example Node.js webhook:
```javascript
app.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const event = req.body;
  
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const email = session.customer_email;
    
    // Find and update the Firestore document
    const querySnapshot = await db.collection('payments')
      .where('email', '==', email)
      .orderBy('submissionTime', 'desc')
      .limit(1)
      .get();
    
    if (!querySnapshot.empty) {
      await querySnapshot.docs[0].ref.update({
        status: 'completed',
        paymentCompletedTime: admin.firestore.FieldValue.serverTimestamp(),
        stripeSessionId: session.id
      });
    }
  }
  
  res.json({received: true});
});
```

### 2. Send Confirmation Emails
- Integrate with Brevo, SendGrid, or Firebase Cloud Functions
- Automatically email customer after payment confirmation
- Include order details from Firestore

### 3. Create an Admin Dashboard
- Build a page to view all submissions and payment statuses
- Filter by date, package, status, etc.
- Export data to CSV

### 4. Add User Authentication
- Add Google/email sign-in to prevent spam
- Associate submissions with authenticated users
- Create customer dashboards where users can view their submissions

---

## Troubleshooting

### Data Not Saving?
1. Check browser console for errors (F12 → Console tab)
2. Verify Firebase config is correct
3. Check Firestore security rules allow writes
4. Ensure Firestore database is created

### "Permission denied" Error?
- Update your Firestore security rules (step 4 above)
- Make sure the `payments` collection exists

### Firebase Config Not Loading?
- Verify the Firebase SDK script loads correctly
- Check for CORS issues (should be fine for this setup)
- Ensure no browser extensions block the request

---

## Security Notes

⚠️ **Important**: The current setup exposes your Firebase config in client-side code, which is fine for this use case, but here are best practices:

1. **API Key Restrictions** (Recommended):
   - In Firebase Console → Project Settings → API keys
   - Click on the default API key
   - Under "Application restrictions": Select "HTTP referrers (web sites)"
   - Add your domain(s) only (e.g., `novaelite.com`, `www.novaelite.com`)
   - This prevents unauthorized API usage from other domains

2. **Firestore Security Rules**:
   - The current rules allow writes from anywhere (with time limit)
   - For production, implement authentication

3. **Data Privacy**:
   - Store payment info in Stripe, not Firestore
   - Firestore data is submitted before payment is processed
   - Don't store credit card data anywhere

---

## Testing

### Test Your Integration:
1. Open pay.html in browser
2. Select a package
3. Enter form details
4. Click "Proceed to secure payment"
5. Check Firestore Console → payments collection
6. New document should appear with your test data

### Test Data Example:
```json
{
  "firstName": "Test",
  "lastName": "User",
  "email": "test@example.com",
  "currentGrade": "12",
  "highSchool": "Test HS",
  "gpa": 3.8,
  "satScore": 1500,
  "selectedPackage": "longgame",
  "packageName": "The Long Game",
  "basePrice": 949,
  "finalPrice": 949,
  "meritDiscountApplied": 0
}
```

---

## Support & Questions

If you need help:
1. Check Firestore documentation: https://firebase.google.com/docs/firestore
2. Check Firebase console error messages
3. Ensure your Firebase project is on the free Spark plan or higher

---

## Files Modified

- **pay.html**: Added Firebase SDK + Firestore integration code
- **firebase-config.js**: Standalone config file (optional, for reference)
- **firestore-integration.js**: Firestore helper functions (optional, for reference)

---

## Version Info
- Firebase SDK: v11.0.1
- Last Updated: 2026
