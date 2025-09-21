// Script di debug per verificare che gli abbonamenti vengano caricati correttamente
// Questo script simula il comportamento della pagina Subscriptions

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

async function debugSubscriptions() {
  try {
    console.log('🔍 Debug caricamento abbonamenti...');
    
    // 1. Ottieni tutti gli abbonamenti (senza filtro)
    console.log('\n📱 Tutti gli abbonamenti nel database:');
    const allSubscriptionsRef = collection(db, 'subscriptions');
    const allSubscriptionsSnapshot = await getDocs(allSubscriptionsRef);
    
    allSubscriptionsSnapshot.docs.forEach((doc, index) => {
      const data = doc.data();
      console.log(`  ${index + 1}. ${data.name || 'Nome non disponibile'}`);
      console.log(`     ID: ${doc.id}`);
      console.log(`     UserId: ${data.userId || 'NON IMPOSTATO'}`);
      console.log(`     Categoria: ${data.category || 'N/A'}`);
      console.log(`     Importo: €${data.amount || 0}`);
      console.log(`     Stato: ${data.status || 'N/A'}`);
      console.log(`     Membri: ${data.people?.length || 0}`);
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
        category: data.category,
        amount: data.amount,
        status: data.status
      });
    });
    
    // 3. Mostra raggruppamento
    console.log('👥 Abbonamenti raggruppati per utente:');
    Object.entries(subscriptionsByUser).forEach(([userId, subs]) => {
      console.log(`\n👤 Utente: ${userId}`);
      console.log(`   Abbonamenti: ${subs.length}`);
      subs.forEach((sub, index) => {
        console.log(`     ${index + 1}. ${sub.name} (${sub.category}) - €${sub.amount} - ${sub.status}`);
      });
    });
    
    // 4. Test filtro per utenti specifici
    const userIds = Object.keys(subscriptionsByUser).filter(id => id !== 'NO_USER_ID');
    if (userIds.length > 0) {
      console.log('\n🧪 Test filtro per utenti specifici:');
      
      for (const userId of userIds) {
        console.log(`\n🔍 Filtro per utente: ${userId}`);
        
        const userSubscriptionsRef = collection(db, 'subscriptions');
        const userQuery = query(userSubscriptionsRef, where('userId', '==', userId));
        const userSubscriptionsSnapshot = await getDocs(userQuery);
        
        console.log(`   Risultati trovati: ${userSubscriptionsSnapshot.docs.length}`);
        userSubscriptionsSnapshot.docs.forEach((doc, index) => {
          const data = doc.data();
          console.log(`     ${index + 1}. ${data.name} (${data.category}) - €${data.amount}`);
        });
      }
    }
    
    console.log('\n✅ Debug completato!');
    console.log('\n📋 Riepilogo:');
    console.log(`   - Abbonamenti totali: ${allSubscriptionsSnapshot.docs.length}`);
    console.log(`   - Utenti unici: ${Object.keys(subscriptionsByUser).length}`);
    console.log(`   - Abbonamenti senza userId: ${subscriptionsByUser['NO_USER_ID']?.length || 0}`);
    
    // 5. Suggerimenti per la risoluzione
    if (subscriptionsByUser['NO_USER_ID']?.length > 0) {
      console.log('\n⚠️  PROBLEMA RILEVATO:');
      console.log('   Alcuni abbonamenti non hanno userId impostato!');
      console.log('   Questo può causare il problema che stai riscontrando.');
      console.log('\n💡 SOLUZIONE:');
      console.log('   1. Esegui: npm run migrate-members');
      console.log('   2. Oppure elimina e ricrea gli abbonamenti');
    }
    
  } catch (error) {
    console.error('❌ Errore durante il debug:', error);
  }
}

// Esegui il debug
debugSubscriptions();
