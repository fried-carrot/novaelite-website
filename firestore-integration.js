// Firestore integration for NoVa Elite
// Saves form data to Firebase Firestore when user proceeds to payment

/**
 * Saves user payment data to Firestore
 * Called when user proceeds to Step 3 (payment)
 */
async function saveFormDataToFirestore() {
  // Get form values
  const firstName = document.getElementById('f-first').value.trim();
  const lastName = document.getElementById('f-last').value.trim();
  const email = document.getElementById('f-email').value.trim();
  const grade = document.getElementById('f-grade').value;
  const school = document.getElementById('f-school').value.trim();
  const gpa = document.getElementById('f-gpa').value.trim();
  const sat = document.getElementById('f-sat').value.trim();
  const note = document.getElementById('f-note').value.trim();

  // Get selected package info
  const pkg = PACKAGES[selectedPkg];
  
  if (!firstName || !email || !selectedPkg) {
    console.error('Missing required fields for Firestore save');
    return false;
  }

  try {
    // Create document data
    const formData = {
      // Personal info
      firstName: firstName,
      lastName: lastName,
      email: email,
      
      // Academic info
      currentGrade: grade || null,
      highSchool: school || null,
      gpa: gpa ? parseFloat(gpa) : null,
      satScore: sat ? parseInt(sat) : null,
      
      // Package info
      selectedPackage: selectedPkg,
      packageName: pkg.name,
      basePrice: pkg.basePrice,
      finalPrice: Math.round(pkg.basePrice * (1 - meritDiscount)),
      meritDiscountApplied: meritDiscount,
      
      // Additional
      notes: note || null,
      submissionTime: new Date().toISOString(),
      timestamp: serverTimestamp(),
      
      // Status tracking
      status: 'pending_payment',
      stripeLink: pkg.stripe_url
    };

    // Save to Firestore
    const docRef = await addDoc(collection(db, 'payments'), formData);
    
    console.log('Form data saved to Firestore with ID:', docRef.id);
    
    // Store the doc ID in sessionStorage for later reference
    sessionStorage.setItem('novaelite_submission_id', docRef.id);
    sessionStorage.setItem('novaelite_customer_email', email);
    
    return true;
  } catch (error) {
    console.error('Error saving to Firestore:', error);
    // Don't block the user from paying - just log the error
    return false;
  }
}

/**
 * Optional: Update payment status after successful Stripe payment
 * This can be called via Stripe webhook (recommended for production)
 * or via Stripe's return URL redirect
 */
async function updatePaymentStatus(submissionId, status) {
  try {
    const docRef = doc(db, 'payments', submissionId);
    await updateDoc(docRef, {
      status: status,
      paymentCompletedTime: serverTimestamp()
    });
    console.log('Payment status updated to:', status);
  } catch (error) {
    console.error('Error updating payment status:', error);
  }
}

/**
 * Optional: Fetch submission data from Firestore
 */
async function getSubmissionData(submissionId) {
  try {
    const docRef = doc(db, 'payments', submissionId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log('No document found');
      return null;
    }
  } catch (error) {
    console.error('Error fetching submission:', error);
    return null;
  }
}
