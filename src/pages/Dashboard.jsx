import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  UserPlus, 
  BarChart3, 
  Calendar,
  TrendingUp,
  Users,
  CreditCard,
  AlertTriangle
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../components/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import subscriptionsRepo from '../repositories/subscriptionsRepo';
import { paymentsRepo } from '../repositories/paymentsRepo';
import { peopleRepo } from '../repositories/peopleRepo';
import { monthlyEquivalent, forecast, calculateCategoryBreakdown, computePersonBalances } from '../utils/finance';
import { formatDate } from '../utils/dates';

const Dashboard = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSubscriptions: 0,
    activeSubscriptions: 0,
    monthlyExpenses: 0,
    pendingPayments: 0,
    overduePayments: 0,
    totalPeople: 0
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [subs, pays, pers] = await Promise.all([
          subscriptionsRepo.list(),
          paymentsRepo.list(),
          peopleRepo.list()
        ]);
        
        setSubscriptions(subs);
        setPayments(pays);
        setPeople(pers);
        
        // Calculate statistics
        const activeSubs = subs.filter(s => s.status === 'active');
        const monthlyExp = activeSubs.reduce((total, sub) => total + monthlyEquivalent(sub), 0);
        const pending = pays.filter(p => !p.paid);
        const overdue = pays.filter(p => !p.paid && new Date(p.dateDue) < new Date());
        
        setStats({
          totalSubscriptions: subs.length,
          activeSubscriptions: activeSubs.length,
          monthlyExpenses: monthlyExp,
          pendingPayments: pending.length,
          overduePayments: overdue.length,
          totalPeople: pers.length
        });
        
        setLoading(false);
          } catch (error) {
      setLoading(false);
    }
    };
    
    loadData();
  }, []);

  const forecastData = forecast(subscriptions, 6);
  const categoryData = calculateCategoryBreakdown(subscriptions);
  const personBalances = computePersonBalances(people, subscriptions, payments);

  const COLORS = ['#111827', '#374151', '#6B7280', '#9CA3AF', '#D1D5DB', '#E5E7EB'];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] space-y-4">
        <div className="loading-circle h-12 w-12"></div>
        <p className="text-gray-600 dark:text-gray-400 text-sm">Caricamento in corso...</p>
      </div>
    );
  }

  return (
    <motion.div
      className="section-spacing"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Page Header */}
      <div>
        <h1 className="h1">Dashboard</h1>
        <p className="muted">Panoramica della gestione degli abbonamenti</p>
      </div>

      {/* Stats Cards */}
      <div className="card-grid-4">
        <Card hover>
          <CardBody className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {stats.totalSubscriptions}
            </div>
            <div className="muted mt-1">
              Abbonamenti Totali
            </div>
          </CardBody>
        </Card>

        <Card hover>
          <CardBody className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {stats.activeSubscriptions}
            </div>
            <div className="muted mt-1">
              Abbonamenti Attivi
            </div>
          </CardBody>
        </Card>

        <Card hover>
          <CardBody className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              €{stats.monthlyExpenses.toFixed(2)}
            </div>
            <div className="muted mt-1">
              Spese Mensili
            </div>
          </CardBody>
        </Card>

        <Card hover>
          <CardBody className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {stats.pendingPayments}
            </div>
            <div className="muted mt-1">
              Pagamenti in Sospeso
            </div>
          </CardBody>
        </Card>

        <Card hover>
          <CardBody className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {stats.overduePayments}
            </div>
            <div className="muted mt-1">
              Pagamenti Scaduti
            </div>
          </CardBody>
        </Card>

        <Card hover>
          <CardBody className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {stats.totalPeople}
            </div>
            <div className="muted mt-1">
              Persone Totali
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="card-grid-2">
        {/* Monthly Forecast Chart */}
        <Card>
          <CardHeader>
            <h3 className="h3">Previsione Mensile</h3>
            <p className="muted">Spese previste per i prossimi 6 mesi</p>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="monthName" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  formatter={(value) => [`€${value}`, 'Importo']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line type="monotone" dataKey="total" stroke="#111827" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Category Breakdown Chart */}
        <Card>
          <CardHeader>
            <h3 className="h3">Ripartizione per Categoria</h3>
            <p className="muted">Spese mensili per categoria</p>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="category" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  formatter={(value) => [`€${value}`, 'Mensile']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="monthlyEquivalent" fill="#111827" />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="card-grid-2">
        {/* Recent Payments */}
        <Card>
          <CardHeader>
            <h3 className="h3">Pagamenti Recenti</h3>
            <p className="muted">Ultime attività di pagamento</p>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {payments.slice(0, 5).map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
                >
                  <div>
                    <p className="font-medium text-black dark:text-white">
                      Pagamento #{payment.id.slice(-8)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Scadenza: {formatDate(payment.dateDue)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-black dark:text-white">
                      €{payment.amount}
                    </p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                      payment.paid 
                        ? 'bg-gray-800 text-white'
                        : 'bg-gray-600 text-white'
                    }`}>
                      {payment.paid ? 'Pagato' : 'In Sospeso'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Person Balances */}
        <Card>
          <CardHeader>
            <h3 className="h3">Saldi delle Persone</h3>
            <p className="muted">Saldi attuali per tutte le persone</p>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {Object.values(personBalances).slice(0, 5).map((balance) => (
                <div
                  key={balance.personId}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
                >
                  <div>
                    <p className="font-medium text-black dark:text-white">
                      {balance.personName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {balance.pendingPayments.length} pagamenti in sospeso
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${
                      balance.netBalance >= 0 
                        ? 'text-gray-900 dark:text-gray-100' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      €{balance.netBalance.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {balance.netBalance >= 0 ? 'Credito' : 'Debito'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <h3 className="h3">Azioni Rapide</h3>
          <p className="muted">Attività comuni e scorciatoie</p>
        </CardHeader>
        <CardBody>
          <div className="card-grid-4">
            <button className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-center clickable">
              <div className="flex justify-center mb-3">
                <Plus className="h-8 w-8 text-gray-900 dark:text-gray-100" />
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Aggiungi Abbonamento
              </div>
            </button>
            
            <button className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-center clickable">
              <div className="flex justify-center mb-3">
                <UserPlus className="h-8 w-8 text-gray-900 dark:text-gray-100" />
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Aggiungi Persona
              </div>
            </button>
            
            <button className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-center clickable">
              <div className="flex justify-center mb-3">
                <BarChart3 className="h-8 w-8 text-gray-900 dark:text-gray-100" />
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Visualizza Report
              </div>
            </button>
            
            <button className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-center clickable">
              <div className="flex justify-center mb-3">
                <Calendar className="h-8 w-8 text-gray-900 dark:text-gray-100" />
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Vista Calendario
              </div>
            </button>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default Dashboard;
