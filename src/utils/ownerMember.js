/**
 * Utility functions for managing owner members in subscriptions
 */

/**
 * Ensures Tu is always present as the owner member in a subscription's people array
 * @param {Array} people - Array of people/members
 * @returns {Array} Updated array with Tu as owner
 */
export const ensureOwnerMember = (people) => {
  if (!people || !Array.isArray(people)) {
    return [{
      id: 'owner_you',
      name: 'Tu',
      quota: 0,
      quotaType: 'fixed',
      paymentStatus: 'paid',
      isOwner: true
    }];
  }
  
  // Check if Tu is already present
  const hasTu = people.some(person => 
    person.name === 'Tu' || person.id === 'owner_you'
  );
  
  if (!hasTu) {
    // Add Tu as the first member (owner)
    return [{
      id: 'owner_you',
      name: 'Tu',
      quota: 0,
      quotaType: 'fixed',
      paymentStatus: 'paid',
      isOwner: true
    }, ...people];
  }
  
  // Ensure Tu is marked as owner and is first
  const updatedPeople = people.map(person => ({
    ...person,
    isOwner: person.name === 'Tu' || person.id === 'owner_you'
  }));
  
  // Sort to put Tu first
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
  return person && (person.name === 'Tu' || person.id === 'owner_you' || person.isOwner);
};
