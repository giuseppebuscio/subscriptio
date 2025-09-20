/**
 * Utility for automatically matching subscription names with logo files
 * Finds the best logo match based on consecutive character matching
 */

// Available logo files with their extensions
const AVAILABLE_LOGOS = [
  'iliad.jpg',
  'spotify.png', 
  'netflix.png',
  'disneyplus.png',
  'amazonprime.png',
  'starlink.jpeg',
  'inglese.png',
  'dentista.jpg',
  'jujitsu.jpg',
  'bolloaci.png',
  'assicurazione.jpg',
  'tagliando.jpeg',
  'palestra.jpg',
  'dermatologo.png'
];

// Supported image extensions
const SUPPORTED_EXTENSIONS = ['png', 'jpg', 'jpeg', 'svg', 'eps'];

/**
 * Finds the best match between two strings using sliding window approach
 * @param {string} str1 - First string (subscription name)
 * @param {string} str2 - Second string (logo filename)
 * @returns {number} - Best match score
 */
const findBestMatch = (str1, str2) => {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  
  console.log(`  📝 Confronto: "${str1}" vs "${str2}"`);
  console.log(`  🔤 Dopo lowercase: "${s1}" vs "${str2}"`);
  
  let bestScore = 0;
  
  // Check if any word from str1 is contained in str2
  const words1 = s1.split(/[^a-z0-9]+/).filter(word => word.length >= 3);
  const words2 = s2.split(/[^a-z0-9]+/).filter(word => word.length >= 3);
  
  console.log(`  📚 Parole estratte da "${str1}":`, words1);
  console.log(`  📚 Parole estratte da "${str2}":`, words2);
  
  // Check each word from subscription name against logo filename
  for (const word1 of words1) {
    if (word1.length >= 3) {
      // Check if this word is contained in the logo filename
      if (s2.includes(word1)) {
        const newScore = word1.length;
        bestScore = Math.max(bestScore, newScore);
        console.log(`    ✅ Parola "${word1}" trovata in logo, score: ${newScore}`);
      }
      
      // Check if any word from logo filename is contained in this word
      for (const word2 of words2) {
        if (word2.length >= 3 && word1.includes(word2)) {
          const newScore = word2.length;
          bestScore = Math.max(bestScore, newScore);
          console.log(`    ✅ Parola logo "${word2}" trovata in abbonamento, score: ${newScore}`);
        }
      }
    }
  }
  
  // Check for ANY 3+ consecutive characters from subscription name in logo filename
  // This is the key improvement - find ANY substring match
  for (let i = 0; i < s1.length - 2; i++) {
    for (let len = 3; len <= s1.length - i; len++) {
      const substring = s1.substr(i, len);
      if (s2.includes(substring)) {
        bestScore = Math.max(bestScore, len);
        console.log(`    🔍 Sottostringa "${substring}" trovata in logo, score: ${len}`);
      }
    }
  }
  
  // Also check for consecutive character matches as fallback
  for (let i = 0; i < s1.length - 2; i++) {
    for (let j = 0; j < s2.length - 2; j++) {
      let length = 0;
      while (
        i + length < s1.length && 
        j + length < s2.length && 
        s1[i + length] === s2[j + length]
      ) {
        length++;
      }
      if (length >= 3) {
        bestScore = Math.max(bestScore, length);
        console.log(`    🔤 Sottostringa consecutiva trovata: "${s1.substr(i, length)}", score: ${length}`);
      }
    }
  }
  
  console.log(`  🎯 Score finale per "${str1}" vs "${str2}": ${bestScore}`);
  return bestScore;
};

/**
 * Automatically finds the best logo for a subscription name
 * @param {string} subscriptionName - Name of the subscription
 * @returns {string|null} - Path to the best matching logo or null if no match found
 */
export const findBestLogo = (subscriptionName) => {
  if (!subscriptionName) return null;
  
  console.log('🔍 findBestLogo chiamata con:', subscriptionName);
  console.log('📁 Loghi disponibili:', AVAILABLE_LOGOS);
  
  let bestMatch = null;
  let bestScore = 0;
  
  AVAILABLE_LOGOS.forEach(logoFile => {
    // Remove extension from logo filename
    const logoName = logoFile.replace(/\.[^/.]+$/, '');
    
    console.log(`\n🔍 Controllo logo: ${logoFile} (nome: ${logoName})`);
    
    // Find best match score
    const matchScore = findBestMatch(subscriptionName, logoName);
    
    console.log(`📊 Score per ${logoFile}: ${matchScore}`);
    
    // Score based on match (minimum 3 characters)
    if (matchScore >= 3) {
      if (matchScore > bestScore) {
        bestScore = matchScore;
        bestMatch = logoFile;
        console.log(`✅ Nuovo miglior match: ${logoFile} con score ${bestScore}`);
      }
    }
  });
  
  console.log(`🎯 Risultato finale: ${bestMatch ? `/assets/logos/${bestMatch}` : 'null'}`);
  
  return bestMatch ? `/assets/logos/${bestMatch}` : null;
};

/**
 * Gets all available logos for display purposes
 * @returns {Array} - Array of logo objects with name and path
 */
export const getAvailableLogos = () => {
  return AVAILABLE_LOGOS.map(logoFile => ({
    name: logoFile.replace(/\.[^/.]+$/, ''),
    path: `/assets/logos/${logoFile}`,
    filename: logoFile
  }));
};

/**
 * Dynamically discovers logo files in the logos directory
 * This function can be called to refresh the available logos list
 * @returns {Promise<Array>} - Promise that resolves to array of discovered logo files
 */
export const discoverLogoFiles = async () => {
  try {
    // In a real implementation, this would scan the directory
    // For now, we'll return the manually maintained list
    // TODO: Implement dynamic directory scanning when backend supports it
    return AVAILABLE_LOGOS;
  } catch (error) {
    console.warn('Could not discover logo files dynamically:', error);
    return AVAILABLE_LOGOS;
  }
};

/**
 * Gets a default logo path when no match is found
 * @returns {string} - Path to default logo
 */
export const getDefaultLogo = () => {
  return '/assets/logos/default.svg';
};
