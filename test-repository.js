// Script di test per verificare il funzionamento del repository
// Simula esattamente quello che fa la pagina Subscriptions

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where, addDoc, serverTimestamp } from "firebase/firestore";

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

// Simula la funzione list del repository
async function testRepositoryList(userId) {
  try {
    console.log('🔍 Test repository.list()');
    console.log('👤 User ID:', userId);
    
    if (!userId) {
      console.log('❌ Nessun userId fornito');
      return [];
    }
    
    const subscriptionsRef = collection(db, 'subscriptions');
    const q = query(
      subscriptionsRef,
      where('userId', '==', userId),
      // orderBy('updatedAt', 'desc') // Commentato per evitare errori di indice
    );
    
    console.log('📱 Eseguendo query...');
    const querySnapshot = await getDocs(q);
    
    console.log('📊 Risultati query:', querySnapshot.docs.length);
    
    const subscriptions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log('📋 Abbonamenti trovati:');
    subscriptions.forEach((sub, index) => {
      console.log(`  ${index + 1}. ${sub.name} (${sub.category}) - €${sub.amount}`);
      console.log(`     ID: ${sub.id}`);
      console.log(`     UserId: ${sub.userId}`);
      console.log(`     Status: ${sub.status}`);
      console.log('');
    });
    
    return subscriptions;
    
  } catch (error) {
    console.error('❌ Errore nel test repository:', error);
    return [];
  }
}

// Simula la funzione create del repository
async function testRepositoryCreate(subscriptionData, userId) {
  try {
    console.log('➕ Test repository.create()');
    console.log('📝 Dati abbonamento:', subscriptionData);
    console.log('👤 User ID:', userId);
    
    if (!userId) {
      console.log('❌ Nessun userId fornito');
      return null;
    }
    
    const dataToSave = {
      ...subscriptionData,
      userId: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    console.log('💾 Dati da salvare:', dataToSave);
    
    const subscriptionsRef = collection(db, 'subscriptions');
    const docRef = await addDoc(subscriptionsRef, dataToSave);
    
    console.log('✅ Abbonamento creato con ID:', docRef.id);
    
    return { id: docRef.id, ...dataToSave };
    
  } catch (error) {
    console.error('❌ Errore nella creazione:', error);
    return null;
  }
}

// Test completo
async function runTest() {
  try {
    console.log('🚀 Inizio test completo repository');
    
    // 1. Test con un userId di esempio
    const testUserId = 'test-user-123';
    console.log(`\n📱 Test 1: Lista abbonamenti per userId: ${testUserId}`);
    const subscriptions1 = await testRepositoryList(testUserId);
    console.log(`Risultato: ${subscriptions1.length} abbonamenti`);
    
    // 2. Test creazione abbonamento
    console.log(`\n➕ Test 2: Creazione abbonamento per userId: ${testUserId}`);
    const newSubscription = {
      name: 'Test Netflix',
      category: 'Streaming',
      amount: 15.99,
      recurrence: {
        type: 'monthly',
        interval: 1,
        day: 15
      },
      shared: false,
      people: [],
      status: 'active'
    };
    
    const created = await testRepositoryCreate(newSubscription, testUserId);
    if (created) {
      console.log('✅ Abbonamento creato con successo');
      
      // 3. Test lista dopo creazione
      console.log(`\n📱 Test 3: Lista abbonamenti dopo creazione`);
      const subscriptions2 = await testRepositoryList(testUserId);
      console.log(`Risultato: ${subscriptions2.length} abbonamenti`);
      
      if (subscriptions2.length > subscriptions1.length) {
        console.log('✅ L\'abbonamento è stato trovato nella lista!');
      } else {
        console.log('❌ L\'abbonamento NON è stato trovato nella lista!');
      }
    }
    
    // 4. Test con userId diverso
    console.log(`\n📱 Test 4: Lista abbonamenti per userId diverso`);
    const subscriptions3 = await testRepositoryList('altro-user-456');
    console.log(`Risultato: ${subscriptions3.length} abbonamenti (dovrebbe essere 0)`);
    
    console.log('\n✅ Test completato!');
    
  } catch (error) {
    console.error('❌ Errore durante il test:', error);
  }
}

// Esegui il test
runTest();
