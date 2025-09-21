// Repository per gestire le notifiche e i promemoria
class NotificationsRepository {
  constructor() {
    this.storageKey = 'subscriptio_notifications';
  }

  // Ottieni tutte le notifiche
  async list() {
    try {
      const notifications = localStorage.getItem(this.storageKey);
      return notifications ? JSON.parse(notifications) : [];
    } catch (error) {
      console.error('Errore nel recupero delle notifiche:', error);
      return [];
    }
  }

  // Salva tutte le notifiche
  async save(notifications) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(notifications));
      return true;
    } catch (error) {
      console.error('Errore nel salvataggio delle notifiche:', error);
      return false;
    }
  }

  // Aggiungi una nuova notifica
  async add(notification) {
    try {
      const notifications = await this.list();
      const newNotification = {
        id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        read: false,
        ...notification
      };
      
      notifications.unshift(newNotification); // Aggiungi all'inizio
      await this.save(notifications);
      return newNotification;
    } catch (error) {
      console.error('Errore nell\'aggiunta della notifica:', error);
      return null;
    }
  }

  // Aggiorna una notifica
  async update(id, updates) {
    try {
      const notifications = await this.list();
      const index = notifications.findIndex(n => n.id === id);
      
      if (index !== -1) {
        notifications[index] = { ...notifications[index], ...updates };
        await this.save(notifications);
        return notifications[index];
      }
      
      return null;
    } catch (error) {
      console.error('Errore nell\'aggiornamento della notifica:', error);
      return null;
    }
  }

  // Elimina una notifica
  async delete(id) {
    try {
      const notifications = await this.list();
      const filtered = notifications.filter(n => n.id !== id);
      await this.save(filtered);
      return true;
    } catch (error) {
      console.error('Errore nell\'eliminazione della notifica:', error);
      return false;
    }
  }

  // Elimina notifiche per un abbonamento specifico
  async deleteBySubscriptionId(subscriptionId) {
    try {
      const notifications = await this.list();
      const filtered = notifications.filter(n => n.subscriptionId !== subscriptionId);
      await this.save(filtered);
      return true;
    } catch (error) {
      console.error('Errore nell\'eliminazione delle notifiche per abbonamento:', error);
      return false;
    }
  }

  // Elimina notifiche per un pagamento specifico
  async deleteByPaymentId(paymentId) {
    try {
      const notifications = await this.list();
      const filtered = notifications.filter(n => n.id !== `payment-${paymentId}`);
      await this.save(filtered);
      return true;
    } catch (error) {
      console.error('Errore nell\'eliminazione delle notifiche per pagamento:', error);
      return false;
    }
  }

  // Segna come letto
  async markAsRead(id) {
    return this.update(id, { read: true });
  }

  // Segna tutte come lette
  async markAllAsRead() {
    try {
      const notifications = await this.list();
      const updated = notifications.map(n => ({ ...n, read: true }));
      await this.save(updated);
      return true;
    } catch (error) {
      console.error('Errore nel segnare tutte le notifiche come lette:', error);
      return false;
    }
  }


  // Crea una notifica per pagamento in scadenza
  async createPaymentDueNotification(payment) {
    // Check if notification already exists for this payment
    const existing = await this.getByType('payment_due');
    const alreadyExists = existing.some(n => 
      n.subscriptionId === payment.subscriptionId && 
      n.dueDate === payment.dateDue
    );

    if (alreadyExists) {
      return null; // Don't create duplicate
    }

    const notification = {
      type: 'payment_due',
      title: 'Pagamento in Scadenza',
      message: `Il pagamento per ${payment.subscriptionName} scade il ${payment.dateDue}`,
      subscriptionId: payment.subscriptionId,
      subscriptionName: payment.subscriptionName,
      amount: payment.amount,
      dueDate: payment.dateDue,
      priority: 'high'
    };

    return this.add(notification);
  }

  // Crea una notifica per abbonamento in scadenza
  async createSubscriptionExpiringNotification(subscription) {
    // Check if notification already exists for this subscription
    const existing = await this.getByType('subscription_expiring');
    const alreadyExists = existing.some(n => 
      n.subscriptionId === subscription.id && 
      n.renewalDate === subscription.nextRenewalDate
    );

    if (alreadyExists) {
      return null; // Don't create duplicate
    }

    const notification = {
      type: 'subscription_expiring',
      title: 'Abbonamento in Scadenza',
      message: `${subscription.name} si rinnova tra ${subscription.daysUntilRenewal} giorni`,
      subscriptionId: subscription.id,
      subscriptionName: subscription.name,
      renewalDate: subscription.nextRenewalDate,
      priority: 'medium'
    };

    return this.add(notification);
  }

  // Crea una notifica per pagamento scaduto
  async createPaymentOverdueNotification(payment) {
    const notification = {
      type: 'payment_overdue',
      title: 'Pagamento Scaduto',
      message: `Il pagamento per ${payment.subscriptionName} è scaduto il ${payment.dateDue}`,
      subscriptionId: payment.subscriptionId,
      subscriptionName: payment.subscriptionName,
      amount: payment.amount,
      dueDate: payment.dateDue,
      priority: 'high'
    };

    return this.add(notification);
  }

  // Ottieni notifiche non lette
  async getUnread() {
    const notifications = await this.list();
    return notifications.filter(n => !n.read);
  }

  // Ottieni notifiche per tipo
  async getByType(type) {
    const notifications = await this.list();
    return notifications.filter(n => n.type === type);
  }

  // Pulisci notifiche vecchie (più di 30 giorni)
  async cleanOldNotifications() {
    try {
      const notifications = await this.list();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const filtered = notifications.filter(n => {
        const notificationDate = new Date(n.timestamp);
        return notificationDate > thirtyDaysAgo;
      });
      
      await this.save(filtered);
      return true;
    } catch (error) {
      console.error('Errore nella pulizia delle notifiche vecchie:', error);
      return false;
    }
  }

  // Ottieni statistiche notifiche
  async getStats() {
    const notifications = await this.list();
    const unread = notifications.filter(n => !n.read).length;
    const byType = notifications.reduce((acc, n) => {
      acc[n.type] = (acc[n.type] || 0) + 1;
      return acc;
    }, {});
    
    return {
      total: notifications.length,
      unread,
      read: notifications.length - unread,
      byType
    };
  }
}

export const notificationsRepo = new NotificationsRepository();
export default notificationsRepo;
