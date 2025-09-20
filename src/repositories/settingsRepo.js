const STORAGE_KEY = 'subscriptio_settings';

/**
 * Default application settings
 */
const DEFAULT_SETTINGS = {
  reminderDays: 7,
  currency: 'EUR',
  theme: 'light',
  language: 'en',
  notifications: {
    email: true,
    push: true,
    reminders: true
  },
  display: {
    compactMode: false,
    showAmounts: true,
    showDueDates: true
  },
  export: {
    defaultFormat: 'csv',
    includeArchived: false
  }
};

/**
 * Settings Repository
 * Handles application settings with localStorage persistence
 * 
 * TODO: Replace localStorage implementation with actual API calls
 * Example: fetch('/api/settings', { headers: { 'Authorization': `Bearer ${token}` } })
 */
class SettingsRepository {
  constructor() {
    this.initializeStorage();
  }

  /**
   * Initialize storage with default settings if empty
   */
  initializeStorage() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
    }
  }

  /**
   * Get all settings
   * @returns {Promise<Object>} Settings object
   */
  async getAll() {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : DEFAULT_SETTINGS;
    } catch (error) {
      return DEFAULT_SETTINGS;
    }
  }

  /**
   * Get a specific setting by key
   * @param {string} key - Setting key (supports dot notation)
   * @returns {Promise<any>} Setting value
   */
  async get(key) {
    try {
      const settings = await this.getAll();
      
      if (!key) return settings;
      
      // Support dot notation for nested keys
      const keys = key.split('.');
      let value = settings;
      
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          return undefined;
        }
      }
      
      return value;
    } catch (error) {
      return undefined;
    }
  }

  /**
   * Update a specific setting
   * @param {string} key - Setting key (supports dot notation)
   * @param {any} value - New setting value
   * @returns {Promise<Object>} Updated settings
   */
  async update(key, value) {
    try {
      const settings = await this.getAll();
      
      if (!key) {
        throw new Error('Setting key is required');
      }
      
      // Support dot notation for nested keys
      const keys = key.split('.');
      const lastKey = keys.pop();
      let target = settings;
      
      for (const k of keys) {
        if (!target[k] || typeof target[k] !== 'object') {
          target[k] = {};
        }
        target = target[k];
      }
      
      target[lastKey] = value;
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      
      return settings;
    } catch (error) {
      throw new Error('Failed to update setting');
    }
  }

  /**
   * Update multiple settings at once
   * @param {Object} updates - Object with setting updates
   * @returns {Promise<Object>} Updated settings
   */
  async updateMultiple(updates) {
    try {
      const settings = await this.getAll();
      const updatedSettings = { ...settings };
      
      for (const [key, value] of Object.entries(updates)) {
        const keys = key.split('.');
        const lastKey = keys.pop();
        let target = updatedSettings;
        
        for (const k of keys) {
          if (!target[k] || typeof target[k] !== 'object') {
            target[k] = {};
          }
          target = target[k];
        }
        
        target[lastKey] = value;
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSettings));
      
      return updatedSettings;
    } catch (error) {
      throw new Error('Failed to update settings');
    }
  }

  /**
   * Reset settings to defaults
   * @returns {Promise<Object>} Default settings
   */
  async resetToDefaults() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    } catch (error) {
      throw new Error('Failed to reset settings');
    }
  }

  /**
   * Export settings to JSON
   * @returns {Promise<string>} JSON string of settings
   */
  async export() {
    try {
      const settings = await this.getAll();
      return JSON.stringify(settings, null, 2);
    } catch (error) {
      throw new Error('Failed to export settings');
    }
  }

  /**
   * Import settings from JSON
   * @param {string} jsonString - JSON string of settings
   * @returns {Promise<Object>} Imported settings
   */
  async import(jsonString) {
    try {
      const settings = JSON.parse(jsonString);
      
      // Validate settings structure
      if (typeof settings !== 'object' || settings === null) {
        throw new Error('Invalid settings format');
      }
      
      // Merge with defaults to ensure all required keys exist
      const mergedSettings = { ...DEFAULT_SETTINGS, ...settings };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedSettings));
      
      return mergedSettings;
    } catch (error) {
      throw new Error('Failed to import settings');
    }
  }

  /**
   * Get reminder threshold in days
   * @returns {Promise<number>} Reminder threshold
   */
  async getReminderDays() {
    return await this.get('reminderDays');
  }

  /**
   * Set reminder threshold in days
   * @param {number} days - Number of days
   * @returns {Promise<Object>} Updated settings
   */
  async setReminderDays(days) {
    if (typeof days !== 'number' || days < 0 || days > 365) {
      throw new Error('Reminder days must be a number between 0 and 365');
    }
    
    return await this.update('reminderDays', days);
  }

  /**
   * Get current theme
   * @returns {Promise<string>} Theme name
   */
  async getTheme() {
    return await this.get('theme');
  }

  /**
   * Set theme
   * @param {string} theme - Theme name ('light' or 'dark')
   * @returns {Promise<Object>} Updated settings
   */
  async setTheme(theme) {
    if (!['light', 'dark'].includes(theme)) {
      throw new Error('Theme must be either "light" or "dark"');
    }
    
    return await this.update('theme', theme);
  }

  /**
   * Get current currency
   * @returns {Promise<string>} Currency code
   */
  async getCurrency() {
    return await this.get('currency');
  }

  /**
   * Set currency
   * @param {string} currency - Currency code
   * @returns {Promise<Object>} Updated settings
   */
  async setCurrency(currency) {
    if (!['EUR', 'USD', 'GBP'].includes(currency)) {
      throw new Error('Unsupported currency');
    }
    
    return await this.update('currency', currency);
  }
}

export const settingsRepo = new SettingsRepository();
