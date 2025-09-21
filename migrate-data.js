// Script di migrazione per trasferire abbonamenti esistenti a un utente specifico
// Esegui questo script una volta per trasferire i dati

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, doc, query, where } from "firebase/firestore";

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

async function migrateSubscriptionsToUser(targetUserId) {
  try {
    console.log('🔄 Inizio migrazione abbonamenti...');
    
    // 1. Ottieni tutti gli abbonamenti esistenti (senza userId)
    const subscriptionsRef = collection(db, 'subscriptions');
    const q = query(subscriptionsRef, where('userId', '==', null));
    const querySnapshot = await getDocs(q);
    
    console.log(`📊 Trovati ${querySnapshot.docs.length} abbonamenti da migrare`);
    
    // 2. Aggiorna ogni abbonamento con l'userId
    const updatePromises = querySnapshot.docs.map(async (docSnapshot) => {
      const docRef = doc(db, 'subscriptions', docSnapshot.id);
      await updateDoc(docRef, {
        userId: targetUserId,
        migratedAt: new Date().toISOString()
      });
      console.log(`✅ Migrato abbonamento: ${docSnapshot.data().name}`);
    });
    
    await Promise.all(updatePromises);
    
    console.log('🎉 Migrazione completata con successo!');
    console.log(`📈 ${querySnapshot.docs.length} abbonamenti trasferiti all'utente: ${targetUserId}`);
    
  } catch (error) {
    console.error('❌ Errore durante la migrazione:', error);
  }
}

// ISTRUZIONI PER L'USO:
// 1. Sostituisci 'TARGET_USER_ID' con l'UID dell'utente che deve ricevere gli abbonamenti
// 2. Esegui: node migrate-data.js

// Esempio:
// migrateSubscriptionsToUser('abc123def456ghi789'); // Sostituisci con l'UID reale

export { migrateSubscriptionsToUser };
