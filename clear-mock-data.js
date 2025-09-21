// Script per pulire tutti i dati mock dal localStorage
console.log('Pulizia dati mock in corso...');

// Chiavi da pulire
const keysToClear = [
  'subscriptio_payments',
  'subscriptio_people',
  'subscriptio_notifications',
  'subscriptio_settings'
];

// Pulisci ogni chiave
keysToClear.forEach(key => {
  if (localStorage.getItem(key)) {
    localStorage.removeItem(key);
    console.log(`✅ Rimosso: ${key}`);
  } else {
    console.log(`ℹ️  Non trovato: ${key}`);
  }
});

console.log('✅ Pulizia completata! Tutti i dati mock sono stati rimossi.');
console.log('Ricarica la pagina per vedere i risultati.');
