// Mock data removed - using empty arrays by default

const STORAGE_KEY = 'subscriptio_people';

/**
 * People Repository
 * Handles CRUD operations for people with localStorage persistence
 * 
 * TODO: Replace localStorage implementation with actual API calls
 * Example: fetch('/api/people', { headers: { 'Authorization': `Bearer ${token}` } })
 */
class PeopleRepository {
  constructor() {
    this.initializeStorage();
  }

  /**
   * Initialize storage (empty by default)
   */
  initializeStorage() {
    // Force clear existing mock data and start fresh
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }

  /**
   * Get all people
   * @returns {Promise<Array>} Array of person objects
   */
  async list() {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      return [];
    }
  }

  /**
   * Get a person by ID
   * @param {string} id - Person ID
   * @returns {Promise<Object|null>} Person object or null
   */
  async get(id) {
    try {
      const people = await this.list();
      return people.find(person => person.id === id) || null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Create a new person
   * @param {Object} person - Person object
   * @returns {Promise<Object>} Created person with ID
   */
  async create(person) {
    try {
      const people = await this.list();
      const newPerson = {
        ...person,
        id: person.id || `person_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString()
      };
      
      people.push(newPerson);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(people));
      
      return newPerson;
    } catch (error) {
      throw new Error('Failed to create person');
    }
  }

  /**
   * Update an existing person
   * @param {string} id - Person ID
   * @param {Object} updates - Updated person data
   * @returns {Promise<Object>} Updated person
   */
  async update(id, updates) {
    try {
      const people = await this.list();
      const index = people.findIndex(person => person.id === id);
      
      if (index === -1) {
        throw new Error('Person not found');
      }
      
      const updatedPerson = {
        ...people[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      people[index] = updatedPerson;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(people));
      
      return updatedPerson;
    } catch (error) {
      throw new Error('Failed to update person');
    }
  }

  /**
   * Delete a person
   * @param {string} id - Person ID
   * @returns {Promise<boolean>} Success status
   */
  async delete(id) {
    try {
      const people = await this.list();
      const filteredPeople = people.filter(person => person.id !== id);
      
      if (filteredPeople.length === people.length) {
        throw new Error('Person not found');
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredPeople));
      return true;
    } catch (error) {
      throw new Error('Failed to delete person');
    }
  }

  /**
   * Search people by name, email, or notes
   * @param {string} query - Search query
   * @returns {Promise<Array>} Array of matching people
   */
  async search(query) {
    try {
      const people = await this.list();
      const lowerQuery = query.toLowerCase();
      
      return people.filter(person => 
        person.name.toLowerCase().includes(lowerQuery) ||
        person.email.toLowerCase().includes(lowerQuery) ||
        person.notes.toLowerCase().includes(lowerQuery)
      );
    } catch (error) {
      return [];
    }
  }

  /**
   * Get people by subscription participation
   * @param {string} subscriptionId - Subscription ID
   * @param {Array} subscriptions - Array of all subscriptions
   * @returns {Promise<Array>} Array of people participating in subscription
   */
  async getBySubscription(subscriptionId, subscriptions) {
    try {
      const subscription = subscriptions.find(sub => sub.id === subscriptionId);
      
      if (!subscription || !subscription.people) {
        return [];
      }
      
      // I membri sono ora direttamente nell'abbonamento
      return subscription.people || [];
    } catch (error) {
      return [];
    }
  }

  /**
   * Get people with pending payments
   * @param {Array} payments - Array of all payments
   * @returns {Promise<Array>} Array of people with pending payments
   */
  async getWithPendingPayments(payments) {
    try {
      const people = await this.list();
      const peopleWithPending = new Set();
      
      payments.forEach(payment => {
        if (!payment.paid && payment.splits) {
          payment.splits.forEach(split => {
            if (!split.paid) {
              peopleWithPending.add(split.personId);
            }
          });
        }
      });
      
      return people.filter(person => peopleWithPending.has(person.id));
    } catch (error) {
      return [];
    }
  }

  /**
   * Clear all people
   * @returns {Promise<boolean>} Success status
   */
  async clearAll() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const peopleRepo = new PeopleRepository();
