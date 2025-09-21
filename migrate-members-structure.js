// Script di migrazione per allineare il database con il sistema semplificato
// - Rimuove la collection 'people' (rubrica globale)
// - Rinomina 'participants' in 'people' negli abbonamenti
// - Aggiorna la struttura dei dati membri

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, doc, deleteDoc, writeBatch } from "firebase/firestore";

// Configurazione Firebase
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

async function migrateMembersStructure() {
  try {
    console.log('🔄 Inizio migrazione struttura membri...');
    
    // 1. Ottieni tutti gli abbonamenti
    console.log('📱 Recuperando abbonamenti...');
    const subscriptionsRef = collection(db, 'subscriptions');
    const subscriptionsSnapshot = await getDocs(subscriptionsRef);
    
    if (subscriptionsSnapshot.empty) {
      console.log('ℹ️ Nessun abbonamento trovato. Migrazione completata.');
      return;
    }
    
    console.log(`📊 Trovati ${subscriptionsSnapshot.docs.length} abbonamenti`);
    
    // 2. Migra ogni abbonamento
    const batch = writeBatch(db);
    let migratedCount = 0;
    
    for (const docSnapshot of subscriptionsSnapshot.docs) {
      const subscriptionId = docSnapshot.id;
      const subscriptionData = docSnapshot.data();
      
      console.log(`🔄 Migrando abbonamento: ${subscriptionData.name || subscriptionId}`);
      
      // Prepara i nuovi dati
      const updatedData = { ...subscriptionData };
      
      // Se ha participants, convertili in people
      if (subscriptionData.participants && Array.isArray(subscriptionData.participants)) {
        console.log(`  - Convertendo ${subscriptionData.participants.length} participants in people`);
        
        // Converti participants in people con struttura semplificata
        updatedData.people = subscriptionData.participants.map((participant, index) => ({
          id: `member_${subscriptionId}_${index + 1}`,
          name: participant.name || `Membro ${index + 1}`,
          email: participant.email || '',
          shareType: participant.shareType || 'percent',
          value: participant.value || 0
        }));
        
        // Rimuovi il campo participants
        delete updatedData.participants;
      } else if (subscriptionData.people && Array.isArray(subscriptionData.people)) {
        console.log(`  - Aggiornando ${subscriptionData.people.length} people esistenti`);
        
        // Aggiorna la struttura dei people esistenti
        updatedData.people = subscriptionData.people.map((person, index) => ({
          id: person.id || `member_${subscriptionId}_${index + 1}`,
          name: person.name || `Membro ${index + 1}`,
          email: person.email || '',
          shareType: person.shareType || person.quotaType || 'percent',
          value: person.value || person.quota || 0
        }));
      } else {
        console.log(`  - Nessun membro trovato, creando struttura vuota`);
        updatedData.people = [];
      }
      
      // Aggiorna il documento
      const subscriptionRef = doc(db, 'subscriptions', subscriptionId);
      batch.update(subscriptionRef, updatedData);
      
      migratedCount++;
    }
    
    // 3. Esegui il batch update
    console.log('💾 Salvataggio modifiche...');
    await batch.commit();
    
    console.log(`✅ Migrati ${migratedCount} abbonamenti`);
    
    // 4. Rimuovi la collection people (se esiste)
    console.log('🗑️ Rimuovendo collection people...');
    try {
      const peopleRef = collection(db, 'people');
      const peopleSnapshot = await getDocs(peopleRef);
      
      if (!peopleSnapshot.empty) {
        const deleteBatch = writeBatch(db);
        peopleSnapshot.docs.forEach(docSnapshot => {
          deleteBatch.delete(doc(db, 'people', docSnapshot.id));
        });
        await deleteBatch.commit();
        console.log(`🗑️ Rimossi ${peopleSnapshot.docs.length} documenti dalla collection people`);
      } else {
        console.log('ℹ️ Collection people già vuota o non esistente');
      }
    } catch (error) {
      console.log('ℹ️ Collection people non trovata o già rimossa');
    }
    
    console.log('🎉 Migrazione completata con successo!');
    console.log('📋 Riepilogo:');
    console.log(`   - ${migratedCount} abbonamenti migrati`);
    console.log(`   - Campo 'participants' rinominato in 'people'`);
    console.log(`   - Struttura membri semplificata`);
    console.log(`   - Collection 'people' rimossa`);
    
  } catch (error) {
    console.error('❌ Errore durante la migrazione:', error);
    throw error;
  }
}

// Funzione per verificare la migrazione
async function verifyMigration() {
  try {
    console.log('🔍 Verifica migrazione...');
    
    const subscriptionsRef = collection(db, 'subscriptions');
    const subscriptionsSnapshot = await getDocs(subscriptionsRef);
    
    let totalSubscriptions = 0;
    let totalMembers = 0;
    
    subscriptionsSnapshot.docs.forEach(docSnapshot => {
      const data = docSnapshot.data();
      totalSubscriptions++;
      
      if (data.people && Array.isArray(data.people)) {
        totalMembers += data.people.length;
        console.log(`  - ${data.name || docSnapshot.id}: ${data.people.length} membri`);
      }
    });
    
    console.log(`📊 Verifica completata:`);
    console.log(`   - ${totalSubscriptions} abbonamenti`);
    console.log(`   - ${totalMembers} membri totali`);
    
  } catch (error) {
    console.error('❌ Errore durante la verifica:', error);
  }
}

// ISTRUZIONI PER L'USO:
// 1. Esegui: node migrate-members-structure.js
// 2. Verifica: node -e "import('./migrate-members-structure.js').then(m => m.verifyMigration())"
// 3. Controlla che tutti gli abbonamenti abbiano il campo 'people' invece di 'participants'

// ATTENZIONE: Questa operazione è IRREVERSIBILE!
// Assicurati di aver fatto un backup prima di eseguire

export { migrateMembersStructure, verifyMigration };

// Esegui la migrazione
migrateMembersStructure()
  .then(() => {
    console.log('✅ Migrazione completata!');
    return verifyMigration();
  })
  .catch(error => {
    console.error('❌ Migrazione fallita:', error);
    process.exit(1);
  });
