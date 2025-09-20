import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Modal from './components/Modal';
import Button from './components/Button';
import ExpiringSubscriptionsModal from './components/ExpiringSubscriptionsModal';
import { 
  CreditCard, 
  AlertTriangle,
  PanelLeft
} from 'lucide-react';
import { paymentsRepo } from './repositories/paymentsRepo';
import subscriptionsRepo from './repositories/subscriptionsRepo';
import { upcomingDuePayments, getExpiringSubscriptions } from './utils/finance';
import { formatDate } from './utils/dates';


// Pages
import Dashboard from './pages/Dashboard';
import Subscriptions from './pages/Subscriptions';
import Payments from './pages/Payments';
import Accounting from './pages/Accounting';
import CalendarPage from './pages/CalendarPage';
import People from './pages/People';
import Settings from './pages/Settings';
import Help from './pages/Help';
import SubscriptionDetail from './pages/SubscriptionDetail';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState('light');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showUpcomingPayments, setShowUpcomingPayments] = useState(false);
  const [upcomingPayments, setUpcomingPayments] = useState([]);
  const [showExpiringSubscriptions, setShowExpiringSubscriptions] = useState(false);
  const [expiringSubscriptions, setExpiringSubscriptions] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    
    // Check for upcoming payments and expiring subscriptions on app load
    checkUpcomingPayments();
    checkExpiringSubscriptions();
  }, []);

  // Detect mobile and set default sidebar state
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768; // md breakpoint
      setIsMobile(mobile);
      
      // On mobile, sidebar should be collapsed by default and always visible
      if (mobile) {
        setIsSidebarCollapsed(true); // Always collapsed on mobile
        setIsMobileSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Controlla le scadenze quando cambia la route
  useEffect(() => {
    checkExpiringSubscriptions();
  }, [location.pathname]);

  const checkUpcomingPayments = async () => {
    try {
      const payments = await paymentsRepo.list();
      const upcoming = upcomingDuePayments(payments, 7); // Next 7 days
      
      if (upcoming.length > 0) {
        setUpcomingPayments(upcoming);
        setShowUpcomingPayments(true);
        
        // Add notifications
        const newNotifications = upcoming.map(payment => ({
          id: `payment-${payment.id}`,
          type: 'payment_due',
          title: 'Pagamento in Scadenza',
          message: `Il pagamento per ${payment.subscriptionName} scade il ${formatDate(payment.dateDue)}`,
          timestamp: new Date().toISOString(),
          read: false
        }));
        
        setNotifications(prev => [...prev, ...newNotifications]);
      }
    } catch (error) {
      // Gestione silenziosa dell'errore
    }
  };

  const checkExpiringSubscriptions = async () => {
    try {
      const subscriptions = await subscriptionsRepo.getActive();
      const expiring = getExpiringSubscriptions(subscriptions, 7); // Next 7 days
      
      if (expiring.length > 0) {
        setExpiringSubscriptions(expiring);
        
        // Mostra il modal solo se siamo nella dashboard
        const isDashboard = location.pathname === '/';
        
        if (isDashboard) {
          setShowExpiringSubscriptions(true);
        } else {
          setShowExpiringSubscriptions(false);
        }
        
        // Add notifications for expiring subscriptions
        const newNotifications = expiring.map(subscription => ({
          id: `subscription-${subscription.id}`,
          type: 'subscription_expiring',
          title: 'Abbonamento in Scadenza',
          message: `${subscription.name} si rinnova tra ${subscription.daysUntilRenewal} giorni`,
          timestamp: new Date().toISOString(),
          read: false
        }));
        
        setNotifications(prev => [...prev, ...newNotifications]);
      } else {
        // Se non ci sono abbonamenti in scadenza, nascondi il modal
        setShowExpiringSubscriptions(false);
        setExpiringSubscriptions([]);
      }
    } catch (error) {
      // Gestione silenziosa dell'errore
    }
  };

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleSidebarToggle = () => {
    if (isMobile) {
      // On mobile, toggle the expanded overlay
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
      // On desktop, toggle collapsed state
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  const handleMobileSidebarClose = () => {
    setIsMobileSidebarOpen(false);
  };

  // Close mobile sidebar when route changes
  useEffect(() => {
    if (isMobile) {
      setIsMobileSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  const handleNotificationClick = (notification) => {
    // Mark as read
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
    );
    
    // Handle different notification types
    switch (notification.type) {
      case 'payment_due':
        setShowUpcomingPayments(true);
        break;
      case 'subscription_expiring':
        setShowExpiringSubscriptions(true);
        break;
      default:
        break;
    }
  };

  const handleViewSubscription = (subscriptionId) => {
    navigate(`/subscription/${subscriptionId}`);
    // Il modal si nasconderà automaticamente quando cambia la route
  };

  // Esponi la funzione globalmente per permettere il refresh delle scadenze
  useEffect(() => {
    window.refreshExpiringSubscriptions = checkExpiringSubscriptions;
    
    return () => {
      delete window.refreshExpiringSubscriptions;
    };
  }, []);

  const handleMarkAsPaid = async (paymentId) => {
    try {
      await paymentsRepo.update(paymentId, { paid: true, paidDate: new Date().toISOString() });
      
      // Remove from upcoming payments
      setUpcomingPayments(prev => prev.filter(p => p.id !== paymentId));
      
      // Update notifications
      setNotifications(prev => 
        prev.map(n => n.id === `payment-${paymentId}` ? { ...n, read: true } : n)
      );
      
      // If no more upcoming payments, close modal
      if (upcomingPayments.length <= 1) {
        setShowUpcomingPayments(false);
      }
    } catch (error) {
      // Gestione silenziosa dell'errore
    }
  };

  const handleSendReminder = (payment) => {
    // Placeholder for reminder functionality
    alert(`Promemoria inviato per il pagamento di ${payment.subscriptionName}`);
  };

  return (
    <div className={`min-h-screen bg-white dark:bg-black transition-colors duration-200 ${theme}`}>
        <div className="flex h-screen relative">
          {/* Mobile Overlay - Only when expanded */}
          {isMobile && isMobileSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={handleMobileSidebarClose}
            />
          )}
          
          {/* Sidebar - Always visible on mobile (collapsed), normal behavior on desktop */}
          <Sidebar 
            isCollapsed={isSidebarCollapsed}
            isMobile={isMobile}
            isMobileOpen={isMobileSidebarOpen}
            onToggleCollapse={handleSidebarToggle}
            onMobileClose={handleMobileSidebarClose}
            notifications={notifications}
            currentTheme={theme}
            onThemeToggle={handleThemeToggle}
            onNotificationClick={handleNotificationClick}
          />
          
          <main className="flex-1 overflow-y-auto content-padding">
            
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/subscriptions" element={<Subscriptions />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/accounting" element={<Accounting />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/people" element={<People />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/help" element={<Help />} />
              <Route path="/subscription/:id" element={<SubscriptionDetail />} />
            </Routes>
          </main>
        </div>

        {/* Upcoming Payments Modal */}
        <AnimatePresence>
          {showUpcomingPayments && (
            <Modal
              isOpen={showUpcomingPayments}
              onClose={() => setShowUpcomingPayments(false)}
              title="Pagamenti in Scadenza"
              size="lg"
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 mb-4">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-medium">
                    Hai {upcomingPayments.length} pagamento{upcomingPayments.length !== 1 ? 'i' : ''} in scadenza nei prossimi 7 giorni
                  </span>
                </div>
                
                <div className="space-y-3">
                  {upcomingPayments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-gray-900 dark:text-gray-100" />
                        </div>
                        <div>
                          <h4 className="font-medium text-black dark:text-white">
                            {payment.subscriptionName}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Scade il {formatDate(payment.dateDue)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="text-right mr-4">
                          <div className="text-lg font-bold text-black dark:text-white">
                            €{payment.amount}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {payment.shared ? 'Condiviso' : 'Personale'}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleMarkAsPaid(payment.id)}
                          >
                            Segna come Pagato
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleSendReminder(payment)}
                          >
                            Invia Promemoria
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="secondary"
                    onClick={() => setShowUpcomingPayments(false)}
                  >
                    Chiudi
                  </Button>
                </div>
              </div>
            </Modal>
          )}
        </AnimatePresence>

        {/* Expiring Subscriptions Modal */}
        <ExpiringSubscriptionsModal
          isOpen={showExpiringSubscriptions}
          onClose={() => setShowExpiringSubscriptions(false)}
          expiringSubscriptions={expiringSubscriptions}
          onViewSubscription={handleViewSubscription}
        />
      </div>
  );
}

export default App;
