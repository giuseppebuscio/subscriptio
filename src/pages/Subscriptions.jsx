import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Grid3X3, 
  List, 
  Eye, 
  Trash2,
  Smartphone,
  X
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import subscriptionsRepo from '../repositories/subscriptionsRepo';
import { monthlyEquivalent } from '../utils/finance';
import { useNavigate } from 'react-router-dom';
import { getTranslatedCategories, translateCategory } from '../utils/categories';
import { formatDate } from '../utils/dates';

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Funzione per tradurre i tipi di ricorrenza
  const translateRecurrenceType = (type) => {
    switch (type) {
      case 'monthly':
        return 'Mensile';
      case 'annual':
        return 'Annuale';
      case 'custom':
        return 'Personalizzato';
      default:
        return type;
    }
  };

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      const data = await subscriptionsRepo.list();
      setSubscriptions(data);
    } catch (error) {
      // Gestione silenziosa dell'errore
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubscription = async (subscriptionData) => {
    try {
      await subscriptionsRepo.create(subscriptionData);
      setShowAddModal(false);
      loadSubscriptions();
    } catch (error) {
      // Gestione silenziosa dell'errore
    }
  };

  const handleEditSubscription = async (id, updates) => {
    try {
      await subscriptionsRepo.update(id, updates);
      setEditingSubscription(null);
      loadSubscriptions();
    } catch (error) {
      // Gestione silenziosa dell'errore
    }
  };

  const handleDeleteSubscription = async (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questo abbonamento?')) {
      try {
        await subscriptionsRepo.delete(id);
        loadSubscriptions();
          } catch (error) {
      // Gestione silenziosa dell'errore
    }
    }
  };

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sub.notes.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || sub.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = getTranslatedCategories();

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="h1">Abbonamenti</h1>
          <p className="muted">Gestisci i tuoi abbonamenti e spese condivise</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Aggiungi
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Inizia a cercare..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input w-full pl-10"
          />
        </div>
        
        {/* Category Filter */}
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="form-select w-48"
        >
          <option value="all">Tutte le Categorie</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        
        {/* View Toggle */}
        <div className="flex border border-gray-300 dark:border-gray-900 rounded-xl overflow-hidden">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center justify-center ${
              viewMode === 'grid'
                ? 'bg-gray-900 text-white'
                : 'bg-white dark:bg-black text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900'
            }`}
          >
            <Grid3X3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center justify-center ${
              viewMode === 'list'
                ? 'bg-gray-900 text-white'
                : 'bg-white dark:bg-black text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900'
            }`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Subscriptions Display */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div
            key="grid"
            className="card-grid-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {filteredSubscriptions.map((subscription) => (
              <SubscriptionCard
                key={subscription.id}
                subscription={subscription}
                onDelete={() => handleDeleteSubscription(subscription.id)}
                translateRecurrenceType={translateRecurrenceType}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {filteredSubscriptions.map((subscription) => (
              <SubscriptionRow
                key={subscription.id}
                subscription={subscription}
                onDelete={() => handleDeleteSubscription(subscription.id)}
                translateRecurrenceType={translateRecurrenceType}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {filteredSubscriptions.length === 0 && (
        <Card>
          <CardBody className="text-center py-12">
            <div className="flex justify-center mb-4">
              <Smartphone className="h-16 w-16 text-gray-400" />
            </div>
            <h3 className="h3 mb-2">Nessun abbonamento trovato</h3>
            <p className="muted mb-6">
              {searchQuery || filterCategory !== 'all'
                ? 'Prova a modificare la ricerca o i filtri'
                : 'Inizia aggiungendo il tuo primo abbonamento'
              }
            </p>
            {!searchQuery && filterCategory === 'all' && (
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Aggiungi primo abbonamento
              </Button>
            )}
          </CardBody>
        </Card>
      )}

      {/* Add/Edit Modal */}
      <SubscriptionModal
        isOpen={showAddModal || !!editingSubscription}
        onClose={() => {
          setShowAddModal(false);
          setEditingSubscription(null);
        }}
        subscription={editingSubscription}
        onSave={editingSubscription 
          ? (data) => handleEditSubscription(editingSubscription.id, data)
          : handleAddSubscription
        }
      />
    </motion.div>
  );
};

// Subscription Card Component (Grid View)
const SubscriptionCard = ({ subscription, onDelete, translateRecurrenceType }) => {
  const monthlyCost = monthlyEquivalent(subscription);
  const nextPayment = subscription.nextPayment || 'N/A';
  
  


  return (
    <Card hover className="cursor-pointer" onClick={() => window.location.href = `/subscription/${subscription.id}`}>
      <CardBody>
        <Badge variant="info" size="sm" className="mb-3">
          {subscription.category}
        </Badge>
        
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="h4 mb-1">{subscription.name}</h3>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              €{subscription.amount}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {translateRecurrenceType(subscription.recurrence?.type)}
            </div>
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Stato:</span>
            <Badge 
              variant={subscription.status === 'active' ? 'success' : 'warning'}
              size="sm"
            >
              {subscription.status === 'active' ? 'Attivo' : 'Inattivo'}
            </Badge>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 mt-4">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={(e) => { e.stopPropagation(); window.location.href = `/subscription/${subscription.id}`; }}
            className="w-8 h-8 p-0 flex items-center justify-center bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 shadow-none"
            title="Visualizza dettagli"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="danger" 
            size="sm" 
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="w-8 h-8 p-0 flex items-center justify-center bg-transparent hover:bg-red-200 text-red-600 dark:text-red-400 shadow-none"
            title="Elimina"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

// Subscription Row Component (List View)
const SubscriptionRow = ({ subscription, onDelete, translateRecurrenceType }) => {
  const monthlyCost = monthlyEquivalent(subscription);

  return (
    <Card hover className="cursor-pointer" onClick={() => window.location.href = `/subscription/${subscription.id}`}>
      <CardBody>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
              <Smartphone className="h-6 w-6 text-gray-900 dark:text-gray-100" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="h4 mb-1">{subscription.name}</h3>
              <div className="flex items-center space-x-2">
                <Badge variant="info" size="sm">
                  {subscription.category}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="text-right mr-4">
            <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
              €{subscription.amount}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Mensile: €{monthlyCost.toFixed(2)}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge 
              variant={subscription.status === 'active' ? 'success' : 'warning'}
              size="sm"
            >
              {subscription.status === 'active' ? 'Attivo' : 'Inattivo'}
            </Badge>
            
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={(e) => { e.stopPropagation(); window.location.href = `/subscription/${subscription.id}`; }}
              className="w-8 h-8 p-0 flex items-center justify-center bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 shadow-none"
              title="Visualizza dettagli"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button 
              variant="danger" 
              size="sm" 
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="w-8 h-8 p-0 flex items-center justify-center bg-transparent hover:bg-red-200 text-red-600 dark:text-red-400 shadow-none"
              title="Elimina"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

// Subscription Modal Component
const SubscriptionModal = ({ isOpen, onClose, subscription, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    amount: '',
    amountType: 'fixed',
    recurrence: {
      type: 'monthly',
      interval: 1,
      day: 15
    },
    startDate: '',
    numberOfInstallments: null,
    endDate: null,
    notes: '',
    status: 'active'
  });

  useEffect(() => {
    if (subscription) {
      setFormData(subscription);
    } else {
      setFormData({
        name: '',
        category: '',
        amount: '',
        amountType: 'fixed',
        recurrence: {
          type: 'monthly',
          interval: 1,
          day: 15
        },
        startDate: '',
        numberOfInstallments: null,
        endDate: null,
        notes: '',
        status: 'active'
      });
    }
  }, [subscription]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };


  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={subscription ? 'Modifica abbonamento' : 'Aggiungi abbonamento'}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nome e Categoria */}
        <div className="card-grid-2">
          <div>
            <label className="label">Nome *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input h-10 py-0"
              placeholder="Netflix, Spotify, ecc."
            />
          </div>
          
          <div>
            <label className="label">Categoria *</label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="form-select h-10 py-0"
            >
              <option value="">Seleziona categoria</option>
              <option value="Streaming">Streaming</option>
              <option value="Musica">Musica</option>
              <option value="Utilità">Utilità</option>
              <option value="Salute">Salute</option>
              <option value="Trasporti">Trasporti</option>
              <option value="Tecnologia">Tecnologia</option>
              <option value="Sport">Sport</option>
              <option value="Formazione">Formazione</option>
              <option value="Shopping">Shopping</option>
              <option value="Altro">Altro</option>
            </select>
          </div>
        </div>

        {/* Data di Inizio e Costo */}
        <div className="card-grid-2">
          <div>
            <label className="label">Data di Inizio</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="form-input h-10 py-0"
            />
          </div>
          
          <div>
            <label className="label">Costo *</label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="form-input h-10 py-0"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Tipo di Importo e Frequenza */}
        <div className="card-grid-2">
          <div>
            <label className="label">Tipo di importo</label>
            <select
              value={formData.amountType}
              onChange={(e) => setFormData({ ...formData, amountType: e.target.value })}
              className="form-select h-10 py-0"
            >
              <option value="fixed">Fisso</option>
              <option value="variable">Variabile</option>
            </select>
          </div>
          
          <div>
            <label className="label">Frequenza</label>
            <div className="space-y-2">
              <select
                value={formData.recurrence.type}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  recurrence: { ...prev.recurrence, type: e.target.value }
                }))}
                className="form-select h-10 py-0"
              >
                <option value="monthly">Mensile</option>
                <option value="annual">Annuale</option>
                <option value="custom">Personalizzato</option>
              </select>
              
              {formData.recurrence.type === 'custom' && (
                <div className="flex space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400 self-center">Ogni</span>
                  <input
                    type="number"
                    min="1"
                    value={formData.recurrence.interval || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      recurrence: { 
                        ...prev.recurrence, 
                        interval: parseInt(e.target.value) || 1 
                      }
                    }))}
                    className="form-input w-20 h-10 py-0"
                    placeholder="1"
                  />
                  <select
                    value="months"
                    className="form-select w-32 h-10 py-0"
                    disabled
                  >
                    <option value="months">mesi</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* N. Rate */}
        <div>
          <label className="label">N. Rate</label>
          <input
            type="text"
            value={formData.numberOfInstallments === null ? '' : formData.numberOfInstallments}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              numberOfInstallments: e.target.value ? parseInt(e.target.value) : null 
            }))}
            className="form-input h-10 py-0"
            placeholder="Inserisci il numero di rate"
          />
        </div>


        {/* Note - Occupa entrambe le colonne */}
        <div>
          <label className="label">Note</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="form-input w-full"
            rows="3"
            placeholder="Note aggiuntive..."
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="secondary" onClick={onClose}>
            Annulla
          </Button>
          <Button type="submit">
            {subscription ? 'Aggiorna' : 'Crea Abbonamento'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default Subscriptions;
