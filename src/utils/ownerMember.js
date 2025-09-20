/**
 * Utility functions for managing owner members in subscriptions
 */

/**
 * Ensures Giuseppe is always present as the owner member in a subscription's people array
 * @param {Array} people - Array of people/members
 * @returns {Array} Updated array with Giuseppe as owner
 */
export const ensureOwnerMember = (people) => {
  if (!people || !Array.isArray(people)) {
    return [{
      id: 'owner_giuseppe',
      name: 'Giuseppe',
      quota: 0,
      quotaType: 'fixed',
      paymentStatus: 'paid',
      isOwner: true
    }];
  }
  
  // Check if Giuseppe is already present
  const hasGiuseppe = people.some(person => 
    person.name === 'Giuseppe' || person.id === 'owner_giuseppe'
  );
  
  if (!hasGiuseppe) {
    // Add Giuseppe as the first member (owner)
    return [{
      id: 'owner_giuseppe',
      name: 'Giuseppe',
      quota: 0,
      quotaType: 'fixed',
      paymentStatus: 'paid',
      isOwner: true
    }, ...people];
  }
  
  // Ensure Giuseppe is marked as owner and is first
  const updatedPeople = people.map(person => ({
    ...person,
    isOwner: person.name === 'Giuseppe' || person.id === 'owner_giuseppe'
  }));
  
  // Sort to put Giuseppe first
  return updatedPeople.sort((a, b) => {
    if (a.isOwner) return -1;
    if (b.isOwner) return 1;
    return 0;
  });
};

/**
 * Checks if a person is the owner
 * @param {Object} person - Person object
 * @returns {boolean} True if the person is the owner
 */
export const isOwner = (person) => {
  return person && (person.name === 'Giuseppe' || person.id === 'owner_giuseppe' || person.isOwner);
};
