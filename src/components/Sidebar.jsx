import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  Smartphone, 
  CreditCard, 
  TrendingUp, 
  Calendar, 
  Users, 
  Settings, 
  HelpCircle,
  Inbox,
  Sun,
  Moon,
  User,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';
import Badge from './Badge';

const navItems = [
  { path: '/', label: 'Dashboard', icon: BarChart3 },
  { path: '/subscriptions', label: 'Abbonamenti', icon: Smartphone },
  { path: '/payments', label: 'Pagamenti', icon: CreditCard },
  { path: '/accounting', label: 'Contabilità', icon: TrendingUp },
  { path: '/calendar', label: 'Calendario', icon: Calendar },
  { path: '/people', label: 'Persone', icon: Users },
  { path: '/settings', label: 'Impostazioni', icon: Settings },
  { path: '/help', label: 'Aiuto', icon: HelpCircle }
];

const Sidebar = ({ 
  isCollapsed = false, 
  onToggleCollapse,
  notifications = [], 
  currentTheme = 'light',
  onThemeToggle,
  onNotificationClick 
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const count = notifications.filter(n => !n.read).length;
    setUnreadCount(count);
  }, [notifications]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'payment_due':
        return '💰';
      case 'payment_overdue':
        return '⚠️';
      case 'subscription_expiring':
        return '📱';
      case 'reminder':
        return '🔔';
      default:
        return 'ℹ️';
    }
  };

  return (
    <motion.aside
      className={`bg-gray-100 dark:bg-black border-r border-gray-200 dark:border-gray-900 flex flex-col h-screen transition-all duration-300 ${
        isCollapsed ? 'w-16 sidebar-collapsed' : 'w-64'
      }`}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header della sidebar */}
      <div className="border-b border-gray-200 dark:border-gray-900 px-2 py-4">
        <motion.div
          className={`flex items-center ${
            isCollapsed ? 'justify-center' : 'justify-between'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {!isCollapsed && (
            <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
              SUBSCRIPTIO
            </div>
          )}
          <button 
            onClick={onToggleCollapse}
            className="w-11 h-11 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-900 rounded-[0.75rem] transition-colors duration-200 flex items-center justify-center p-3"
            title={isCollapsed ? 'Espandi sidebar' : 'Comprimi sidebar'}
          >
            <PanelLeft className="h-4 w-4" />
          </button>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-2">
        {navItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'nav-link-active' : ''} ${
                    isCollapsed ? 'justify-center' : ''
                  }`
                }
                title={isCollapsed ? item.label : ''}
              >
                <IconComponent className="h-4 w-4" />
                {!isCollapsed && (
                  <span className="text-sm font-normal">{item.label}</span>
                )}
              </NavLink>
            </motion.div>
          );
        })}
      </nav>

      {/* Controlli come menu della sidebar */}
      <div className="border-t border-gray-200 dark:border-gray-900 p-2 space-y-2">
        {/* Inbox/Notifiche */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="relative"
        >
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`nav-link w-full relative ${
              isCollapsed ? 'justify-center' : 'justify-start'
            }`}
            title={isCollapsed ? 'Inbox' : ''}
          >
            <Inbox className="h-4 w-4" />
            {!isCollapsed && (
              <span className="text-sm font-normal">Inbox</span>
            )}
            {unreadCount > 0 && (
              <Badge
                variant="danger"
                size="sm"
                className={`min-w-[20px] h-5 flex items-center justify-center ${
                  isCollapsed 
                    ? 'absolute -top-1 -right-1' 
                    : 'absolute right-2 top-1/2 transform -translate-y-1/2'
                }`}
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </button>

          {/* Dropdown Notifiche - Apre verso destra solo se sidebar aperta */}
          <AnimatePresence>
            {showNotifications && !isCollapsed && (
              <motion.div
                className="absolute left-full top-0 ml-2 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 z-50"
                initial={{ opacity: 0, scale: 0.95, x: -10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="h4">Inbox</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Le tue notifiche</p>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      Nessuna notifica
                    </div>
                  ) : (
                    notifications.map((notification, index) => (
                      <motion.div
                        key={notification.id || index}
                        className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                          !notification.read ? 'bg-gray-50 dark:bg-gray-800' : ''
                        }`}
                        onClick={() => {
                          if (onNotificationClick) onNotificationClick(notification);
                          setShowNotifications(false);
                        }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-black dark:text-white">
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                              {new Date(notification.timestamp).toLocaleString('it-IT')}
                            </p>
                          </div>
                          {!notification.read && (
                            <Badge variant="info" size="sm">
                              Nuovo
                            </Badge>
                          )}
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
                
                {notifications.length > 0 && (
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 text-sm font-medium"
                      onClick={() => setShowNotifications(false)}
                    >
                      Chiudi
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Toggle Tema */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={onThemeToggle}
            className={`nav-link w-full ${
              isCollapsed ? 'justify-center' : 'justify-start'
            }`}
            title={isCollapsed ? (currentTheme === 'light' ? 'Tema Scuro' : 'Tema Chiaro') : ''}
          >
            {currentTheme === 'light' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
            {!isCollapsed && (
              <span className="text-sm font-normal">
                {currentTheme === 'light' ? 'Tema Scuro' : 'Tema Chiaro'}
              </span>
            )}
          </button>
        </motion.div>

        {/* Account */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <button 
            className={`nav-link w-full ${
              isCollapsed ? 'justify-center' : 'justify-start'
            }`} 
            title={isCollapsed ? 'Account' : ''}
          >
            <User className="h-4 w-4" />
            {!isCollapsed && (
              <span className="text-sm font-normal">Account</span>
            )}
          </button>
        </motion.div>
      </div>



      {/* Copyright - Sezione separata */}
      <div className="border-t border-gray-200 dark:border-gray-900 p-2">
        <motion.div
          className="text-center text-sm text-gray-500 dark:text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <p>{isCollapsed ? '©' : '© 2025 SUBSCRIPTIO'}</p>
        </motion.div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
