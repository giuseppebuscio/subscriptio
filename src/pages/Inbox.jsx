import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Inbox, 
  CheckCircle,
  Trash2
} from 'lucide-react';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { formatDate } from '../utils/dates';
import { notificationsRepo } from '../repositories/notificationsRepo';

const InboxPage = ({ notifications = [], onNotificationClick, onMarkAsRead, onMarkAllAsRead, onDeleteNotification }) => {
  const [localNotifications, setLocalNotifications] = useState(notifications);
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  // Sincronizza le notifiche locali con quelle passate come props
  useEffect(() => {
    setLocalNotifications(notifications);
  }, [notifications]);



  const handleNotificationClick = (notification) => {
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
    
    if (!notification.read) {
      handleMarkAsReadLocal(notification.id);
    }
  };



  const handleMarkAsReadLocal = async (id) => {
    try {
      await notificationsRepo.markAsRead(id);
      setLocalNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
      if (onMarkAsRead) onMarkAsRead(id);
    } catch (error) {
      console.error('Errore nel segnare come letto:', error);
    }
  };

  const handleDeleteNotificationLocal = async (id) => {
    try {
      await notificationsRepo.delete(id);
      setLocalNotifications(prev => prev.filter(n => n.id !== id));
      if (onDeleteNotification) onDeleteNotification(id);
    } catch (error) {
      console.error('Errore nell\'eliminazione:', error);
    }
  };

  const handleSelectNotification = (notificationId) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId) 
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === localNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(localNotifications.map(n => n.id));
    }
  };

  const handleBulkMarkAsRead = async () => {
    try {
      for (const id of selectedNotifications) {
        await notificationsRepo.markAsRead(id);
        if (onMarkAsRead) onMarkAsRead(id);
      }
      setLocalNotifications(prev => 
        prev.map(n => selectedNotifications.includes(n.id) ? { ...n, read: true } : n)
      );
      setSelectedNotifications([]);
    } catch (error) {
      console.error('Errore nel segnare come lette:', error);
    }
  };

  const handleBulkDelete = async () => {
    try {
      for (const id of selectedNotifications) {
        await notificationsRepo.delete(id);
        if (onDeleteNotification) onDeleteNotification(id);
      }
      setLocalNotifications(prev => prev.filter(n => !selectedNotifications.includes(n.id)));
      setSelectedNotifications([]);
    } catch (error) {
      console.error('Errore nell\'eliminazione:', error);
    }
  };

  const unreadCount = localNotifications.filter(n => !n.read).length;
  const totalCount = localNotifications.length;

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <h1 className="h1">Inbox</h1>
        <p className="muted">
          {unreadCount > 0 ? `${unreadCount} notifiche non lette` : 'Tutte le notifiche sono state lette'}
        </p>
      </div>

      {/* Barra azioni per notifiche selezionate */}
      {localNotifications.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="rounded-3xl"
        >
          <div className="flex items-center justify-between">
            <button
              onClick={handleSelectAll}
              className="text-sm font-bold text-black dark:text-white hover:underline"
            >
              {selectedNotifications.length === localNotifications.length ? 'Deseleziona tutto' : 'Seleziona tutto'}
            </button>
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleBulkMarkAsRead}
                variant="secondary"
                size="sm"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Segna come lette
              </Button>
              <Button
                onClick={handleBulkDelete}
                variant="danger"
                size="sm"
                className="bg-black hover:bg-gray-800"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Elimina
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Notifications List */}
      <div className="space-y-3">
        {localNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Inbox className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="h3 mb-2">Nessuna notifica</h3>
            <p className="muted">
              Le tue notifiche appariranno qui quando ci saranno pagamenti in scadenza o abbonamenti da rinnovare.
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {localNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <div 
                  className={`flex items-center justify-between p-3 rounded-2xl transition-all duration-200 ${
                    !notification.read ? 'bg-gray-50 dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedNotifications.includes(notification.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleSelectNotification(notification.id);
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-center space-x-2">
                        <p className={`text-gray-900 dark:text-gray-100 ${
                          !notification.read ? 'font-bold' : 'font-medium'
                        }`}>
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <Badge variant="info" size="sm">
                            Nuovo
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNotificationLocal(notification.id);
                      }}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-gray-400" />
                    </button>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formatDate(notification.timestamp)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
};

export default InboxPage;
