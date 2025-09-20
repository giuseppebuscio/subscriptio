// Categorie degli abbonamenti in italiano
export const categories = [
  'Streaming',
  'Musica',
  'Utilità',
  'Salute',
  'Trasporti',
  'Tecnologia',
  'Sport',
  'Formazione',
  'Shopping',
  'Altro'
];

// Mappa per tradurre le categorie dall'inglese all'italiano
export const categoryTranslations = {
  'Streaming': 'Streaming',
  'Music': 'Musica',
  'Utilities': 'Utilità',
  'Health': 'Salute',
  'Transport': 'Trasporti',
  'Technology': 'Tecnologia',
  'Sports': 'Sport',
  'Education': 'Formazione',
  'Shopping': 'Shopping',
  'Other': 'Altro',
  'Entertainment': 'Intrattenimento'
};

// Funzione per tradurre una categoria
export const translateCategory = (category) => {
  return categoryTranslations[category] || category;
};

// Funzione per ottenere tutte le categorie tradotte
export const getTranslatedCategories = () => {
  return categories;
};
