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
  isMobile = false,
  isMobileOpen = false,
  onToggleCollapse,
  onMobileClose,
  notifications = [], 
  currentTheme = 'light',
  onThemeToggle
}) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const count = notifications.filter(n => !n.read).length;
    setUnreadCount(count);
  }, [notifications]);


  return (
    <>
      {/* Mobile Sidebar - Always visible when collapsed, expanded when open */}
      {isMobile && (
        <motion.aside
          className={`bg-gray-100 dark:bg-black border-r border-gray-200 dark:border-[rgb(34,34,34)] flex flex-col h-screen transition-all duration-300 ${
            isMobileOpen 
              ? 'fixed top-0 left-0 z-50 w-64 h-1/2 translate-x-0' 
              : 'w-16 sidebar-collapsed'
          }`}
          initial={{ x: -100, opacity: 0 }}
          animate={{ 
            x: isMobileOpen ? 0 : 0, 
            opacity: 1 
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Mobile Sidebar Content */}
          {isMobileOpen ? (
            // Expanded mobile sidebar
            <>
              {/* Header della sidebar */}
              <div className="border-b border-gray-200 dark:border-[rgb(34,34,34)] px-2 py-4">
                <motion.div
                  className="flex items-center justify-between"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    SUBSCRIPTIO
                  </div>
                  <button 
                    onClick={onMobileClose}
                    className="w-11 h-11 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[rgb(25,25,25)] rounded-[0.75rem] transition-colors duration-200 flex items-center justify-center p-3"
                    title="Chiudi"
                  >
                    <PanelLeftClose className="h-4 w-4" />
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
                          `nav-link ${isActive ? 'nav-link-active' : ''}`
                        }
                        onClick={onMobileClose}
                      >
                        <IconComponent className="h-4 w-4" />
                        <span className="text-sm font-normal">{item.label}</span>
                      </NavLink>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Controlli come menu della sidebar */}
              <div className="border-t border-gray-200 dark:border-[rgb(34,34,34)] p-2 space-y-2">
                {/* Inbox */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="relative"
                >
                  <NavLink
                    to="/inbox"
                    className="nav-link w-full relative justify-start"
                    onClick={onMobileClose}
                  >
                    <Inbox className="h-4 w-4" />
                    <span className="text-sm font-normal">Inbox</span>
                    {unreadCount > 0 && (
                      <Badge
                        variant="danger"
                        size="sm"
                        className="min-w-[16px] h-4 flex items-center justify-center text-xs ml-auto"
                      >
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </Badge>
                    )}
                  </NavLink>
                </motion.div>

                {/* Toggle Tema */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <button
                    onClick={onThemeToggle}
                    className="nav-link w-full justify-start"
                  >
                    {currentTheme === 'light' ? (
                      <Moon className="h-4 w-4" />
                    ) : (
                      <Sun className="h-4 w-4" />
                    )}
                    <span className="text-sm font-normal">
                      {currentTheme === 'light' ? 'Tema Scuro' : 'Tema Chiaro'}
                    </span>
                  </button>
                </motion.div>

                {/* Account */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <button 
                    className="nav-link w-full justify-start"
                  >
                    <User className="h-4 w-4" />
                    <span className="text-sm font-normal">Account</span>
                  </button>
                </motion.div>
              </div>

              {/* Copyright */}
              <div className="border-t border-gray-200 dark:border-[rgb(34,34,34)] p-2">
                <motion.div
                  className="text-center text-sm text-gray-500 dark:text-gray-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <p>© 2025 SUBSCRIPTIO</p>
                </motion.div>
              </div>
            </>
          ) : (
            // Collapsed mobile sidebar
            <>
              {/* Header della sidebar */}
              <div className="border-b border-gray-200 dark:border-[rgb(34,34,34)] px-2 py-4">
                <motion.div
                  className="flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <button 
                    onClick={onToggleCollapse}
                    className="w-11 h-11 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[rgb(25,25,25)] rounded-[0.75rem] transition-colors duration-200 flex items-center justify-center p-3"
                    title="Espandi sidebar"
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
                          `nav-link ${isActive ? 'nav-link-active' : ''} justify-center`
                        }
                        title={item.label}
                      >
                        <IconComponent className="h-4 w-4" />
                      </NavLink>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Controlli come menu della sidebar */}
              <div className="border-t border-gray-200 dark:border-[rgb(34,34,34)] p-2 space-y-2">
                {/* Inbox */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="relative"
                >
                  <NavLink
                    to="/inbox"
                    className="nav-link w-full relative justify-center"
                    title="Inbox"
                  >
                    <Inbox className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <Badge
                        variant="danger"
                        size="sm"
                        className="min-w-[16px] h-4 flex items-center justify-center text-xs absolute -top-1 -right-1"
                      >
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </Badge>
                    )}
                  </NavLink>
                </motion.div>

                {/* Toggle Tema */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <button
                    onClick={onThemeToggle}
                    className="nav-link w-full justify-center"
                    title={currentTheme === 'light' ? 'Tema Scuro' : 'Tema Chiaro'}
                  >
                    {currentTheme === 'light' ? (
                      <Moon className="h-4 w-4" />
                    ) : (
                      <Sun className="h-4 w-4" />
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
                    className="nav-link w-full justify-center"
                    title="Account"
                  >
                    <User className="h-4 w-4" />
                  </button>
                </motion.div>
              </div>

              {/* Copyright */}
              <div className="border-t border-gray-200 dark:border-[rgb(34,34,34)] p-2">
                <motion.div
                  className="text-center text-sm text-gray-500 dark:text-gray-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <p>©</p>
                </motion.div>
              </div>
            </>
          )}
        </motion.aside>
      )}

      {/* Desktop Sidebar - Normal behavior */}
      {!isMobile && (
        <motion.aside
          className={`bg-gray-100 dark:bg-black border-r border-gray-200 dark:border-[rgb(34,34,34)] flex flex-col h-screen transition-all duration-300 ${
            isCollapsed ? 'w-16 sidebar-collapsed' : 'w-64'
          }`}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header della sidebar */}
          <div className="border-b border-gray-200 dark:border-[rgb(34,34,34)] px-2 py-4">
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
                className="w-11 h-11 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[rgb(25,25,25)] rounded-[0.75rem] transition-colors duration-200 flex items-center justify-center p-3"
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
          <div className="border-t border-gray-200 dark:border-[rgb(34,34,34)] p-2 space-y-2">
            {/* Inbox */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <NavLink
                to="/inbox"
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
                    className={`min-w-[16px] h-4 flex items-center justify-center text-xs ${
                      isCollapsed 
                        ? 'absolute -top-1 -right-1' 
                        : 'ml-auto'
                    }`}
                  >
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Badge>
                )}
              </NavLink>
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
          <div className="border-t border-gray-200 dark:border-[rgb(34,34,34)] p-2">
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
      )}
    </>
  );
};

export default Sidebar;
