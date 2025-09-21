// Script per resettare tutti i dati e far partire tutti gli utenti da zero
// Esegui questo script una volta per cancellare tutti i dati esistenti

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";

// Configurazione Firebase (usa la stessa del tuo progetto)
const firebaseConfig = {
  apiKey: "AIzaSyBiGmsyzU4gQwbVPKQASwTgAdn_h3Xb8X0",
  authDomain: "subscriptio-956da.firebaseapp.com",
  projectId: "subscriptio-956da",
  storageBucket: "subscriptio-956da.firebasestorage.app",
  messagingSenderId: "80790017006",
  appId: "1:80790017006:web:6bdeccd6ffd43db0d8f4ff",
  measurementId: "G-YFC5FT4BHT"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function resetAllData() {
  try {
    console.log('🗑️ Inizio reset completo dei dati...');
    
    // 1. Cancella tutti gli abbonamenti
    console.log('📱 Cancellando abbonamenti...');
    const subscriptionsRef = collection(db, 'subscriptions');
    const subscriptionsSnapshot = await getDocs(subscriptionsRef);
    
    const deleteSubscriptionsPromises = subscriptionsSnapshot.docs.map(async (docSnapshot) => {
      await deleteDoc(doc(db, 'subscriptions', docSnapshot.id));
      console.log(`✅ Cancellato abbonamento: ${docSnapshot.data().name || docSnapshot.id}`);
    });
    
    await Promise.all(deleteSubscriptionsPromises);
    console.log(`📊 Cancellati ${subscriptionsSnapshot.docs.length} abbonamenti`);
    
    // 2. Cancella tutti i pagamenti
    console.log('💳 Cancellando pagamenti...');
    const paymentsRef = collection(db, 'payments');
    const paymentsSnapshot = await getDocs(paymentsRef);
    
    const deletePaymentsPromises = paymentsSnapshot.docs.map(async (docSnapshot) => {
      await deleteDoc(doc(db, 'payments', docSnapshot.id));
      console.log(`✅ Cancellato pagamento: ${docSnapshot.id}`);
    });
    
    await Promise.all(deletePaymentsPromises);
    console.log(`📊 Cancellati ${paymentsSnapshot.docs.length} pagamenti`);
    
    // 3. Cancella tutte le persone
    console.log('👥 Cancellando persone...');
    const peopleRef = collection(db, 'people');
    const peopleSnapshot = await getDocs(peopleRef);
    
    const deletePeoplePromises = peopleSnapshot.docs.map(async (docSnapshot) => {
      await deleteDoc(doc(db, 'people', docSnapshot.id));
      console.log(`✅ Cancellata persona: ${docSnapshot.data().name || docSnapshot.id}`);
    });
    
    await Promise.all(deletePeoplePromises);
    console.log(`📊 Cancellate ${peopleSnapshot.docs.length} persone`);
    
    // 4. Cancella tutte le notifiche
    console.log('🔔 Cancellando notifiche...');
    const notificationsRef = collection(db, 'notifications');
    const notificationsSnapshot = await getDocs(notificationsRef);
    
    const deleteNotificationsPromises = notificationsSnapshot.docs.map(async (docSnapshot) => {
      await deleteDoc(doc(db, 'notifications', docSnapshot.id));
      console.log(`✅ Cancellata notifica: ${docSnapshot.id}`);
    });
    
    await Promise.all(deleteNotificationsPromises);
    console.log(`📊 Cancellate ${notificationsSnapshot.docs.length} notifiche`);
    
    // 5. Cancella tutte le impostazioni
    console.log('⚙️ Cancellando impostazioni...');
    const settingsRef = collection(db, 'settings');
    const settingsSnapshot = await getDocs(settingsRef);
    
    const deleteSettingsPromises = settingsSnapshot.docs.map(async (docSnapshot) => {
      await deleteDoc(doc(db, 'settings', docSnapshot.id));
      console.log(`✅ Cancellata impostazione: ${docSnapshot.id}`);
    });
    
    await Promise.all(deleteSettingsPromises);
    console.log(`📊 Cancellate ${settingsSnapshot.docs.length} impostazioni`);
    
    console.log('🎉 Reset completato con successo!');
    console.log('✨ Tutti gli utenti ora partiranno da zero');
    console.log('📈 Dati cancellati:');
    console.log(`   - ${subscriptionsSnapshot.docs.length} abbonamenti`);
    console.log(`   - ${paymentsSnapshot.docs.length} pagamenti`);
    console.log(`   - ${peopleSnapshot.docs.length} persone`);
    console.log(`   - ${notificationsSnapshot.docs.length} notifiche`);
    console.log(`   - ${settingsSnapshot.docs.length} impostazioni`);
    
  } catch (error) {
    console.error('❌ Errore durante il reset:', error);
  }
}

// ISTRUZIONI PER L'USO:
// 1. Esegui: node reset-all-data.js
// 2. Conferma che tutti i dati siano stati cancellati
// 3. Tutti gli utenti (esistenti e nuovi) partiranno da zero

// ATTENZIONE: Questa operazione è IRREVERSIBILE!
// Assicurati di voler cancellare TUTTI i dati esistenti

export { resetAllData };

// Esegui il reset
resetAllData();
