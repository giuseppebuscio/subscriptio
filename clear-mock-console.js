// Script per pulire i dati mock - Esegui questo nella console del browser
console.log('🧹 Inizio pulizia dati mock...');

// Lista delle chiavi da pulire
const keysToClear = [
  'subscriptio_payments',
  'subscriptio_people',
  'subscriptio_notifications', 
  'subscriptio_settings'
];

let clearedCount = 0;
let notFoundCount = 0;

// Pulisci ogni chiave
keysToClear.forEach(key => {
  if (localStorage.getItem(key)) {
    const data = JSON.parse(localStorage.getItem(key));
    console.log(`📦 Trovato ${key}:`, data.length, 'elementi');
    localStorage.removeItem(key);
    clearedCount++;
    console.log(`✅ Rimosso: ${key}`);
  } else {
    notFoundCount++;
    console.log(`ℹ️  Non trovato: ${key}`);
  }
});

console.log('🎉 Pulizia completata!');
console.log(`✅ Rimosse ${clearedCount} chiavi`);
console.log(`ℹ️  ${notFoundCount} chiavi non trovate`);
console.log('🔄 Ora ricarica la pagina per vedere i risultati');

// Mostra anche le chiavi rimanenti
console.log('📋 Chiavi rimanenti nel localStorage:');
Object.keys(localStorage).forEach(key => {
  if (key.startsWith('subscriptio_')) {
    console.log(`⚠️  Ancora presente: ${key}`);
  }
});
