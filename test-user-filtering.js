// Script di test per verificare che il filtro per utente funzioni
// Questo script mostra come ogni utente dovrebbe vedere solo i propri abbonamenti

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";

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

async function testUserFiltering() {
  try {
    console.log('🔍 Test filtro per utente...');
    
    // 1. Ottieni tutti gli abbonamenti (senza filtro)
    console.log('📱 Abbonamenti totali nel database:');
    const allSubscriptionsRef = collection(db, 'subscriptions');
    const allSubscriptionsSnapshot = await getDocs(allSubscriptionsRef);
    
    allSubscriptionsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      console.log(`  - ${data.name} (ID: ${doc.id})`);
      console.log(`    UserId: ${data.userId || 'NON IMPOSTATO'}`);
      console.log(`    Creato: ${data.createdAt?.toDate?.() || 'N/A'}`);
      console.log('');
    });
    
    // 2. Raggruppa per userId
    const subscriptionsByUser = {};
    allSubscriptionsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      const userId = data.userId || 'NO_USER_ID';
      
      if (!subscriptionsByUser[userId]) {
        subscriptionsByUser[userId] = [];
      }
      
      subscriptionsByUser[userId].push({
        id: doc.id,
        name: data.name,
        category: data.category
      });
    });
    
    // 3. Mostra raggruppamento
    console.log('👥 Abbonamenti raggruppati per utente:');
    Object.entries(subscriptionsByUser).forEach(([userId, subs]) => {
      console.log(`\n👤 Utente: ${userId}`);
      console.log(`   Abbonamenti: ${subs.length}`);
      subs.forEach(sub => {
        console.log(`     - ${sub.name} (${sub.category})`);
      });
    });
    
    // 4. Test filtro per un utente specifico (se esiste)
    const userIds = Object.keys(subscriptionsByUser).filter(id => id !== 'NO_USER_ID');
    if (userIds.length > 0) {
      const testUserId = userIds[0];
      console.log(`\n🧪 Test filtro per utente: ${testUserId}`);
      
      const userSubscriptionsRef = collection(db, 'subscriptions');
      const userQuery = query(userSubscriptionsRef, where('userId', '==', testUserId));
      const userSubscriptionsSnapshot = await getDocs(userQuery);
      
      console.log(`   Risultati filtrati: ${userSubscriptionsSnapshot.docs.length}`);
      userSubscriptionsSnapshot.docs.forEach(doc => {
        const data = doc.data();
        console.log(`     - ${data.name} (${data.category})`);
      });
    }
    
    console.log('\n✅ Test completato!');
    console.log('\n📋 Riepilogo:');
    console.log(`   - Abbonamenti totali: ${allSubscriptionsSnapshot.docs.length}`);
    console.log(`   - Utenti unici: ${Object.keys(subscriptionsByUser).length}`);
    console.log(`   - Abbonamenti senza userId: ${subscriptionsByUser['NO_USER_ID']?.length || 0}`);
    
  } catch (error) {
    console.error('❌ Errore durante il test:', error);
  }
}

// Esegui il test
testUserFiltering();
