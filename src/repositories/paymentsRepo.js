import { mockPayments } from '../data/mock/payments.js';

const STORAGE_KEY = 'subscriptio_payments';

/**
 * Payments Repository
 * Handles CRUD operations for payments with localStorage persistence
 * 
 * TODO: Replace localStorage implementation with actual API calls
 * Example: fetch('/api/payments', { headers: { 'Authorization': `Bearer ${token}` } })
 */
class PaymentsRepository {
  constructor() {
    this.initializeStorage();
  }

  /**
   * Initialize storage with mock data if empty
   */
  initializeStorage() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockPayments));
    }
  }

  /**
   * Get all payments
   * @returns {Promise<Array>} Array of payment objects
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
   * Get a payment by ID
   * @param {string} id - Payment ID
   * @returns {Promise<Object|null>} Payment object or null
   */
  async get(id) {
    try {
      const payments = await this.list();
      return payments.find(payment => payment.id === id) || null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Create a new payment
   * @param {Object} payment - Payment object
   * @returns {Promise<Object>} Created payment with ID
   */
  async create(payment) {
    try {
      const payments = await this.list();
      const newPayment = {
        ...payment,
        id: payment.id || `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString()
      };
      
      payments.push(newPayment);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payments));
      
      return newPayment;
    } catch (error) {
      throw new Error('Failed to create payment');
    }
  }

  /**
   * Update an existing payment
   * @param {string} id - Payment ID
   * @param {Object} updates - Updated payment data
   * @returns {Promise<Object>} Updated payment
   */
  async update(id, updates) {
    try {
      const payments = await this.list();
      const index = payments.findIndex(payment => payment.id === id);
      
      if (index === -1) {
        throw new Error('Payment not found');
      }
      
      const updatedPayment = {
        ...payments[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      payments[index] = updatedPayment;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payments));
      
      return updatedPayment;
    } catch (error) {
      throw new Error('Failed to update payment');
    }
  }

  /**
   * Delete a payment
   * @param {string} id - Payment ID
   * @returns {Promise<boolean>} Success status
   */
  async delete(id) {
    try {
      const payments = await this.list();
      const filteredPayments = payments.filter(payment => payment.id !== id);
      
      if (filteredPayments.length === payments.length) {
        throw new Error('Payment not found');
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredPayments));
      return true;
    } catch (error) {
      throw new Error('Failed to delete payment');
    }
  }

  /**
   * Get payments by subscription ID
   * @param {string} subscriptionId - Subscription ID
   * @returns {Promise<Array>} Array of payments for subscription
   */
  async getBySubscription(subscriptionId) {
    try {
      const payments = await this.list();
      return payments.filter(payment => payment.subscriptionId === subscriptionId);
    } catch (error) {
      return [];
    }
  }

  /**
   * Get payments by person ID
   * @param {string} personId - Person ID
   * @returns {Promise<Array>} Array of payments involving person
   */
  async getByPerson(personId) {
    try {
      const payments = await this.list();
      return payments.filter(payment => 
        payment.splits?.some(split => split.personId === personId) ||
        payment.payerId === personId
      );
    } catch (error) {
      return [];
    }
  }

  /**
   * Get upcoming payments
   * @param {number} daysAhead - Number of days ahead to look
   * @returns {Promise<Array>} Array of upcoming payments
   */
  async getUpcoming(daysAhead = 30) {
    try {
      const payments = await this.list();
      const today = new Date();
      const futureDate = new Date(today.getTime() + (daysAhead * 24 * 60 * 60 * 1000));
      
      return payments.filter(payment => {
        if (payment.paid) return false;
        
        const dueDate = new Date(payment.dateDue);
        return dueDate >= today && dueDate <= futureDate;
      }).sort((a, b) => new Date(a.dateDue) - new Date(b.dateDue));
    } catch (error) {
      return [];
    }
  }

  /**
   * Get overdue payments
   * @returns {Promise<Array>} Array of overdue payments
   */
  async getOverdue() {
    try {
      const payments = await this.list();
      const today = new Date();
      
      return payments.filter(payment => {
        if (payment.paid) return false;
        
        const dueDate = new Date(payment.dateDue);
        return dueDate < today;
      }).sort((a, b) => new Date(a.dateDue) - new Date(b.dateDue));
    } catch (error) {
      return [];
    }
  }

  /**
   * Mark payment as paid
   * @param {string} id - Payment ID
   * @param {string} payerId - ID of person who paid
   * @returns {Promise<Object>} Updated payment
   */
  async markAsPaid(id, payerId) {
    try {
      const payment = await this.get(id);
      if (!payment) {
        throw new Error('Payment not found');
      }
      
      const updates = {
        paid: true,
        paidDate: new Date().toISOString(),
        payerId
      };
      
      return await this.update(id, updates);
    } catch (error) {
      throw new Error('Failed to mark payment as paid');
    }
  }

  /**
   * Mark split as paid
   * @param {string} paymentId - Payment ID
   * @param {string} personId - Person ID
   * @param {string} paymentId - Payment ID for the split
   * @returns {Promise<Object>} Updated payment
   */
  async markSplitAsPaid(paymentId, personId, splitPaymentId) {
    try {
      const payment = await this.get(paymentId);
      if (!payment) {
        throw new Error('Payment not found');
      }
      
      const updatedSplits = payment.splits.map(split => {
        if (split.personId === personId) {
          return { ...split, paid: true, paymentId: splitPaymentId };
        }
        return split;
      });
      
      const updates = { splits: updatedSplits };
      
      // Check if all splits are paid
      const allPaid = updatedSplits.every(split => split.paid);
      if (allPaid) {
        updates.paid = true;
        updates.paidDate = new Date().toISOString();
      }
      
      return await this.update(paymentId, updates);
    } catch (error) {
      throw new Error('Failed to mark split as paid');
    }
  }

  /**
   * Reset to mock data
   * @returns {Promise<boolean>} Success status
   */
  async resetToMock() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockPayments));
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const paymentsRepo = new PaymentsRepository();
