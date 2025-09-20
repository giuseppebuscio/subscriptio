import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Smartphone, 
  Edit, 
  Trash2, 
  Image, 
  Plus, 
  Users, 
  Calendar,
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Upload,
  X,
  Info,
  Settings,
  DollarSign,
  Check,
  Pencil,
  Share2,
  Copy
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { useParams, useNavigate } from 'react-router-dom';
import subscriptionsRepo from '../repositories/subscriptionsRepo';
import { paymentsRepo } from '../repositories/paymentsRepo';
import { findBestLogo, getAvailableLogos, getDefaultLogo } from '../utils/logoMatcher';
import { translateCategory } from '../utils/categories';

const SubscriptionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showAddPersonModal, setShowAddPersonModal] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [paymentStatus, setPaymentStatus] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [showPaymentReminder, setShowPaymentReminder] = useState(false);
  const [daysUntilDue, setDaysUntilDue] = useState(0);
  const [payments, setPayments] = useState([]);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [showEditPaymentModal, setShowEditPaymentModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);

  // Funzione per caricare i pagamenti
  const loadPayments = async () => {
    try {
      setLoadingPayments(true);
      const paymentsData = await paymentsRepo.getBySubscription(id);
      setPayments(paymentsData);
    } catch (error) {
      console.error('Errore nel caricamento dei pagamenti:', error);
      setPayments([]);
    } finally {
      setLoadingPayments(false);
    }
  };

  useEffect(() => {
    const loadSubscription = async () => {
      try {
        setLoading(true);
        const data = await subscriptionsRepo.get(id);
        
        if (data) {

          
          // Trasforma i dati del repository nel formato della pagina
          const transformedSubscription = {
            ...data,
            logo: findBestLogo(data.name) || getDefaultLogo(),
            // Non sovrascrivere il campo type se recurrence è presente
            type: data.recurrence?.type || data.type || 'monthly',
            periodicity: data.recurrence?.type || data.type || 'monthly',
            startDate: data.startDate || '2024-01-01',
            duration: data.numberOfInstallments ? `${data.numberOfInstallments} rate` : (data.endDate ? data.endDate : '∞'),
            people: data.people || data.participants?.map((p, index) => ({
              id: p.personId || `person_${index + 1}`,
              name: p.name || `Persona ${index + 1}`,
              quota: data.amount * (p.value / 100),
              quotaType: p.shareType === 'percent' ? 'percentage' : 'fixed',
              paymentStatus: p.paymentStatus || 'pending'
            })) || [],
            payments: data.payments || [],
            upcomingPayments: data.upcomingPayments || [],
            paymentStatus: data.paymentStatus || {}
          };
          

          
          setSubscription(transformedSubscription);
          // Carica i pagamenti salvati se esistono
          if (transformedSubscription.paymentStatus) {
            setPaymentStatus(transformedSubscription.paymentStatus);
          }
          
          // Controlla se mostrare il popup di notifica scadenza
          checkPaymentReminder(transformedSubscription);
          
          // Carica i pagamenti per questo abbonamento
          loadPayments();
        } else {
          // Fallback con dati di esempio se non trova nulla
          const fallbackData = {
            id: id,
            name: 'Abbonamento di Esempio',
            logo: findBestLogo('Abbonamento di Esempio') || getDefaultLogo(),
            type: 'monthly',
            amount: 17.99,
            amountType: 'fixed',
            periodicity: 'monthly',
               startDate: '2024-01-01',
            duration: '∞',
               category: 'Intrattenimento',
            status: 'active',
            people: [
              { id: '1', name: 'Giuseppe', quota: 8.99, quotaType: 'fixed', paymentStatus: 'paid' },
              { id: '2', name: 'Marco', quota: 9.00, quotaType: 'fixed', paymentStatus: 'pending' }
            ],
            payments: [],
            upcomingPayments: [],
            paymentStatus: {}
          };
          setSubscription(fallbackData);
        }
      } catch (error) {
                                     // Fallback con dati di esempio in caso di errore
           const fallbackData = {
             id: id,
             name: 'Abbonamento di Esempio',
             logo: findBestLogo('Abbonamento di Esempio') || getDefaultLogo(),
          type: 'monthly',
          amount: 17.99,
          amountType: 'fixed',
          periodicity: 'monthly',
          nextDue: '2025-02-15',
          duration: '∞',
          category: 'Intrattenimento',
          status: 'active',
          people: [
            { id: '1', name: 'Giuseppe', quota: 8.99, quotaType: 'fixed', paymentStatus: 'paid' },
            { id: '2', name: 'Marco', quota: 9.00, quotaType: 'fixed', paymentStatus: 'pending' }
          ],
          payments: [],
          upcomingPayments: []
        };
        setSubscription(fallbackData);
      } finally {
        setLoading(false);
      }
    };
    
    loadSubscription();
  }, [id]);


  // Funzione per salvare i dati dell'abbonamento
  const saveSubscription = async (dataToSave) => {
    try {
      await subscriptionsRepo.update(id, dataToSave);
    } catch (error) {
      // Gestione silenziosa dell'errore
    }
  };

  const handleDelete = async () => {
    try {
      await subscriptionsRepo.delete(id);
      setShowDeleteModal(false);
      navigate('/subscriptions');
    } catch (error) {
      alert('Errore nell\'eliminare l\'abbonamento. Riprova.');
    }
  };

  const handleMarkAsPaid = async (personId) => {
    try {
      const updatedSubscription = {
        ...subscription,
        people: subscription.people.map(p => 
          p.id === personId ? { ...p, paymentStatus: 'paid' } : p
        )
      };
      
      setSubscription(updatedSubscription);
      
      // Salva i cambiamenti nel repository
      await saveSubscription({ people: updatedSubscription.people });
    } catch (error) {
      // Gestione silenziosa dell'errore
    }
  };

  const handleRemovePerson = async (personId) => {
    try {
      const updatedSubscription = {
        ...subscription,
        people: subscription.people.filter(p => p.id !== personId)
      };
      
      setSubscription(updatedSubscription);
      
      // Salva i cambiamenti nel repository
      await saveSubscription({ people: updatedSubscription.people });
    } catch (error) {
      // Gestione silenziosa dell'errore
    }
  };

  // Genera i prossimi pagamenti basandosi sulla data di inizio e frequenza
  const generateUpcomingPayments = (subscription) => {
    try {
      if (!subscription || !subscription.startDate) return [];
      
      const startDate = new Date(subscription.startDate);
      const startDay = startDate.getDate();
      const now = new Date();
      const upcomingPayments = [];
      
      // Determina la frequenza corretta
      const frequency = subscription.recurrence?.type || subscription.type || 'monthly';
      
      // Genera pagamenti per i prossimi 3 anni o 36 mesi
      const maxPeriods = frequency === 'annual' ? 3 : 36;
      
      for (let i = 1; i <= maxPeriods; i++) {
        let paymentDate;
        
        if (frequency === 'monthly') {
          paymentDate = new Date(startDate);
          paymentDate.setMonth(startDate.getMonth() + i);
        } else if (frequency === 'annual') {
          paymentDate = new Date(startDate);
          paymentDate.setFullYear(startDate.getFullYear() + i);
        } else if (frequency === 'custom' && subscription.recurrence?.interval) {
          paymentDate = new Date(startDate);
          paymentDate.setMonth(startDate.getMonth() + (i * subscription.recurrence.interval));
        }
        
        // Imposta il giorno corretto
        paymentDate.setDate(startDay);
        
        // Solo pagamenti futuri
        if (paymentDate > now) {
          const monthNames = [
            'Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu',
            'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'
          ];
          
          upcomingPayments.push({
            id: `upcoming_${i}`,
            date: paymentDate.toISOString(),
            amount: subscription.amount || 0,
            month: monthNames[paymentDate.getMonth()],
            year: paymentDate.getFullYear(),
            day: startDay,
            isOverdue: false,
            frequency: frequency
          });
        }
      }
      
      return upcomingPayments.slice(0, 12); // Mostra solo i prossimi 12
    } catch (error) {
      return [];
    }
  };

  // Controlla se mostrare il popup di notifica scadenza
  const checkPaymentReminder = (subscription) => {
    try {
      if (!subscription.startDate || subscription.status !== 'active') return;
      
      const now = new Date();
      const startDate = new Date(subscription.startDate);
      const startDay = startDate.getDate();
      
      // Se la data di inizio è nel futuro, non mostrare avvisi
      if (startDate > now) {
        return;
      }
      
      // Determina la frequenza corretta
      const frequency = subscription.recurrence?.type || subscription.type || 'monthly';
      
      // Calcola la prossima scadenza
      let nextDueDate;
      
      if (frequency === 'monthly') {
        nextDueDate = new Date(now.getFullYear(), now.getMonth(), startDay);
        // Se la scadenza di questo mese è già passata, usa il prossimo mese
        if (nextDueDate <= now) {
          nextDueDate.setMonth(nextDueDate.getMonth() + 1);
        }
      } else if (frequency === 'annual') {
        nextDueDate = new Date(now.getFullYear(), startDate.getMonth(), startDay);
        // Se la scadenza di quest'anno è già passata, usa il prossimo anno
        if (nextDueDate <= now) {
          nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);
        }
      } else {
        // Per frequenze personalizzate, usa la logica mensile come fallback
        nextDueDate = new Date(now.getFullYear(), now.getMonth(), startDay);
        if (nextDueDate <= now) {
          nextDueDate.setMonth(nextDueDate.getMonth() + 1);
        }
      }
      
      // Calcola quanti giorni mancano alla scadenza
      const daysUntilDue = Math.ceil((nextDueDate - now) / (1000 * 60 * 60 * 24));
      
      // Mostra il popup se mancano 5 giorni o meno
      if (daysUntilDue <= 5 && daysUntilDue >= 0) {
        // Salva i giorni rimanenti per mostrarli nel popup
        setDaysUntilDue(daysUntilDue);
        setShowPaymentReminder(true);
      }
    } catch (error) {
      // Gestione silenziosa dell'errore
    }
  };

  // Gestisce il click su "Vai ai Pagamenti" nel popup
  const handleGoToPayments = () => {
    setShowPaymentReminder(false);
    setActiveTab('payments');
  };

  // Funzione per aggiungere un nuovo pagamento
  const handleAddPayment = async (paymentData) => {
    try {
      const newPayment = {
        subscriptionId: id,
        date: paymentData.date,
        amount: parseFloat(paymentData.amount),
        people: paymentData.people || [],
        notes: paymentData.notes || ''
      };
      
      await paymentsRepo.create(newPayment);
      setShowAddPaymentModal(false);
      loadPayments(); // Ricarica la lista dei pagamenti
    } catch (error) {
      console.error('Errore nell\'aggiunta del pagamento:', error);
    }
  };

  // Funzione per modificare un pagamento
  const handleEditPayment = async (paymentId, updatedData) => {
    try {
      // Validazione dei dati prima di salvare
      if (!updatedData.amount || !updatedData.date) {
        alert('Inserisci tutti i campi obbligatori');
        return;
      }
      
      const amount = parseFloat(updatedData.amount);
      if (isNaN(amount) || amount <= 0) {
        alert('Inserisci un importo valido');
        return;
      }
      
      await paymentsRepo.update(paymentId, updatedData);
      loadPayments(); // Ricarica la lista dei pagamenti
    } catch (error) {
      console.error('Errore nella modifica del pagamento:', error);
      alert('Errore nel salvare le modifiche. Riprova.');
    }
  };

  // Funzione per eliminare un pagamento
  const handleDeletePayment = async (paymentId) => {
    if (window.confirm('Sei sicuro di voler eliminare questo pagamento?')) {
      try {
        await paymentsRepo.delete(paymentId);
        loadPayments(); // Ricarica la lista dei pagamenti
      } catch (error) {
        console.error('Errore nell\'eliminazione del pagamento:', error);
        alert('Errore nell\'eliminazione del pagamento: ' + error.message);
      }
    }
  };

  // Funzione per generare il link di condivisione
  const handleGenerateShareLink = async () => {
    try {
      setIsGeneratingLink(true);
      
      // Genera un token univoco per questo abbonamento
      const shareToken = `share_${subscription.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Crea il link di condivisione
      const baseUrl = window.location.origin;
      const shareUrl = `${baseUrl}/subscription/${subscription.id}/join?token=${shareToken}`;
      
      setShareLink(shareUrl);
      setShowSharePopup(true);
      
      // Salva il token nel database (opzionale, per validazione)
      await subscriptionsRepo.update(subscription.id, { 
        shareToken: shareToken,
        shareTokenExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 giorni
      });
      
    } catch (error) {
      console.error('Errore nella generazione del link:', error);
      alert('Errore nella generazione del link di condivisione');
    } finally {
      setIsGeneratingLink(false);
    }
  };

  // Funzione per copiare il link negli appunti
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      alert('Link copiato negli appunti!');
    } catch (error) {
      console.error('Errore nella copia del link:', error);
      // Fallback per browser che non supportano clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = shareLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Link copiato negli appunti!');
    }
  };

  // Funzione per rimuovere un membro
  const handleRemoveMember = async (memberId) => {
    if (window.confirm('Sei sicuro di voler rimuovere questo membro?')) {
      try {
        const updatedPeople = subscription.people.filter(person => person.id !== memberId);
        await subscriptionsRepo.update(subscription.id, { people: updatedPeople });
        
        // Aggiorna lo stato locale
        setSubscription(prev => ({ ...prev, people: updatedPeople }));
        
      } catch (error) {
        console.error('Errore nella rimozione del membro:', error);
        alert('Errore nella rimozione del membro');
      }
    }
  };





  // Gestisce il pagamento del mese corrente
  const handleMarkCurrentMonthAsPaid = async (monthInfo) => {
    try {
      const newPayment = {
        id: `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        date: monthInfo.date.toISOString(),
        amount: subscription.amount || 0,
        status: 'completed',
        paidBy: 'Tu',
        subscriptionName: subscription.name || 'Abbonamento',
        month: monthInfo.month || 'Gennaio',
        year: monthInfo.year || new Date().getFullYear()
      };

      const updatedSubscription = {
        ...subscription,
        payments: [...(subscription.payments || []), newPayment]
      };

      setSubscription(updatedSubscription);

      // Salva i cambiamenti nel repository
      try {
        await subscriptionsRepo.update(id, { payments: updatedSubscription.payments });
          } catch (error) {
      // Gestione silenziosa dell'errore
    }
    } catch (error) {
      // Gestione silenziosa dell'errore
    }
  };

  const handleStartEdit = () => {
    setEditForm({
      name: subscription.name || '',
      notes: subscription.notes || '',
      startDate: subscription.startDate || '',
      amount: subscription.amount || ''
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({});
  };

  const handleSaveEdit = async () => {
    try {
      setIsSaving(true);
      
      // Prepara i dati per il salvataggio, mantenendo solo i campi essenziali
      const dataToSave = {
        name: editForm.name,
        notes: editForm.notes,
        startDate: editForm.startDate,
        amount: parseFloat(editForm.amount),
        paymentStatus: paymentStatus
      };

      // Se il nome è cambiato, aggiorna anche il logo
      let updatedLogo = subscription.logo;
      if (editForm.name !== subscription.name) {
        updatedLogo = findBestLogo(editForm.name) || getDefaultLogo();
      }

      const updatedSubscription = {
        ...subscription,
        ...dataToSave,
        logo: updatedLogo
      };
      
      setSubscription(updatedSubscription);
      setIsEditing(false);
      setEditForm({});
      
      // Aggiorna l'avviso di scadenza con la nuova data di inizio
      checkPaymentReminder(updatedSubscription);
      
      // Salva i cambiamenti nel repository
      const finalDataToSave = { ...dataToSave, logo: updatedLogo };
      await saveSubscription(finalDataToSave);
    } catch (error) {
      // Gestione silenziosa dell'errore
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'info', label: 'Informazioni', icon: Info },
    { id: 'quotes', label: 'Membri', icon: Users },
    { id: 'payments', label: 'Pagamenti', icon: CreditCard },
    { id: 'settings', label: 'Impostazioni', icon: Settings }
  ];

  const getLogoIcon = (logoPath) => {
    if (logoPath && logoPath.startsWith('/assets/logos/')) {
      return (
        <img 
          src={logoPath} 
          alt="Logo" 
          className="w-full h-full rounded-xl object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            const fallback = e.target.parentElement.querySelector('.fallback-icon');
            if (fallback) fallback.style.display = 'block';
          }}
        />
      );
    }
    // If no logo path or logo not found, show fallback icon
    return <Smartphone className="w-12 h-12 text-gray-400" />;
  };

  const translateRecurrenceType = (type) => {
    switch (type) {
      case 'monthly': return 'Mensile';
      case 'annual': return 'Annuale';
      case 'custom': return 'Personalizzato';
      default: return type;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };



  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] space-y-4">
        <div className="loading-circle h-12 w-12"></div>
        <p className="text-gray-600 dark:text-gray-400 text-sm">Caricamento in corso...</p>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="text-center py-12">
        <h2 className="h2 mb-4">Abbonamento non trovato</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">ID: {id}</p>
        <Button onClick={() => navigate('/subscriptions')}>
          Torna agli Abbonamenti
        </Button>
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


      {/* Header del Dettaglio */}
      <SubscriptionHeader 
        subscription={subscription}
        onEdit={() => navigate(`/subscriptions/edit/${id}`)}
        onDelete={() => setShowDeleteModal(true)}
        onChangeLogo={() => setShowIconPicker(true)}
        getLogoIcon={getLogoIcon}
      />

      {/* Indicatore di Stato Auto-Save */}
      <div className="mb-4">
        {isSaving && (
          <div className="flex items-center space-x-2 text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span>Salvando modifiche...</span>
          </div>
        )}
        

      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-black p-1 rounded-2xl mb-6">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
              }`}
            >
              <IconComponent className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'info' && (
            <div className="space-y-6">
              {/* Informazioni Principali */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="h3">Informazioni principali</h3>
                      <p className="muted">Dettagli essenziali dell'abbonamento</p>
                    </div>
                    {!isEditing ? (
                      <Button variant="secondary" size="sm" onClick={handleStartEdit}>
                        <Edit className="h-4 w-4 mr-2" />
                        Modifica
                      </Button>
                    ) : (
                      <div className="flex space-x-2">
                        <Button variant="success" size="sm" onClick={handleSaveEdit} disabled={isSaving}>
                          {isSaving ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Salvando...
                            </>
                          ) : (
                            <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Salva
                            </>
                          )}
                        </Button>
                        <Button variant="secondary" size="sm" onClick={handleCancelEdit}>
                          <X className="h-4 w-4 mr-2" />
                          Annulla
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Nome Abbonamento */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Nome abbonamento
                      </label>
                      {!isEditing ? (
                        <p className="text-lg text-gray-900 dark:text-gray-100">
                          {subscription.name || 'Non specificato'}
                        </p>
                      ) : (
                        <input
                          type="text"
                          value={editForm.name || ''}
                          onChange={(e) => {
                            const newName = e.target.value;
                            setEditForm(prev => ({ ...prev, name: newName }));
                            
                            // Aggiorna il logo in tempo reale se il nome è cambiato
                            if (newName !== subscription.name) {
                              const newLogo = findBestLogo(newName) || getDefaultLogo();
                              setSubscription(prev => ({ ...prev, logo: newLogo }));
                            }
                          }}
                          className="form-input w-full h-10 py-0"
                          placeholder="Nome dell'abbonamento"
                        />
                      )}
                    </div>
                    
                    {/* Note */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Note
                      </label>
                      {!isEditing ? (
                        <p className="text-lg text-gray-900 dark:text-gray-100">
                          {subscription.notes || 'Nessuna nota'}
                        </p>
                      ) : (
                        <textarea
                          value={editForm.notes || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                          className="form-input w-full h-10 py-0 resize-none flex items-center"
                          placeholder="Aggiungi note..."
                          rows="1"
                          style={{ lineHeight: '2.5rem' }}
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Data di Inizio
                      </label>
                      {!isEditing ? (
                        <p className="text-lg text-gray-900 dark:text-gray-100">
                          {subscription.startDate ? formatDate(subscription.startDate) : 'Non specificata'}
                        </p>
                      ) : (
                        <input
                          type="date"
                          value={editForm.startDate}
                          onChange={(e) => setEditForm(prev => ({ ...prev, startDate: e.target.value }))}
                          className="form-input w-full h-10 py-0"
                        />
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Costo
                      </label>
                      {!isEditing ? (
                        <div className="flex items-end space-x-2">
                          <p className="text-lg text-gray-900 dark:text-gray-100">
                            €{subscription.amount}
                          </p>
                        </div>
                      ) : (
                        <input
                          type="number"
                          step="0.01"
                          value={editForm.amount}
                          onChange={(e) => setEditForm(prev => ({ ...prev, amount: e.target.value }))}
                          className="form-input w-full h-10 py-0"
                          placeholder="0.00"
                        />
                      )}
                    </div>
                    
                    
                    



                  </div>
                </CardBody>
              </Card>

              {/* Sezione Membri */}
              <Card>
                <CardHeader>
                  <h3 className="h3">Membri</h3>
                  <p className="muted">Gestisci i membri che condividono questo abbonamento</p>
                </CardHeader>
                <CardBody>
                  {subscription.people && subscription.people.length > 0 ? (
                    <div className="space-y-3">
                      {subscription.people.map((person, index) => (
                        <div key={person.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                              <Users className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                            </div>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {person.name}
                            </span>
                          </div>
                          <Badge variant="secondary" size="sm">
                            Membro
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <h4 className="h4 mb-2">Sei da solo</h4>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Spostati nella sezione membri per aggiungere altri membri
                      </p>
                      <Button size="sm" onClick={() => setActiveTab('quotes')}>
                        <Plus className="h-4 w-4 mr-2" />
                        Aggiungi
                      </Button>
                    </div>
                  )}
                </CardBody>
              </Card>

                    </div>
          )}

          {activeTab === 'quotes' && (
            <div className="space-y-6">
              {/* Lista Membri Attuali */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="h3">Membri attuali</h3>
                      <p className="muted">Persone che partecipano a questo abbonamento</p>
                    </div>
                    <Button onClick={handleGenerateShareLink} disabled={isGeneratingLink} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      {isGeneratingLink ? 'Generando...' : 'Invita'}
                    </Button>
                  </div>
                </CardHeader>
                <CardBody>
                  {subscription.people && subscription.people.length > 0 ? (
                    <div className="space-y-3">
                      {subscription.people.map((person, index) => (
                        <div key={person.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <span className="font-medium text-gray-900 dark:text-gray-100">
                                {person.name}
                              </span>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {index === 0 ? 'Proprietario' : 'Membro'}
                      </p>
                    </div>
                  </div>
                          {index > 0 && (
                            <Button 
                              variant="secondary" 
                              size="sm" 
                              onClick={() => handleRemoveMember(person.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Users className="h-20 w-20 mx-auto mb-6 text-gray-300" />
                      <h4 className="h4 mb-3">Sei da solo</h4>
                      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                        Non ci sono ancora altri membri. Invita i tuoi amici tramite il link di condivisione per condividere questo abbonamento.
                      </p>
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>
          )}

          {activeTab === 'payments' && subscription && (
            <div className="space-y-6">
              {/* Area Tutti i pagamenti */}
               <AllPaymentsSection 
                 payments={payments}
                 loading={loadingPayments}
                 onAddPayment={() => setShowAddPaymentModal(true)}
                 onEditPayment={(payment) => {
                   setEditingPayment(payment);
                   setShowEditPaymentModal(true);
                 }}
                 onDeletePayment={handleDeletePayment}
                 onReloadPayments={loadPayments}
                 subscription={subscription}
              />
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Impostazioni */}
              <Card>
                <CardHeader>
                  <h3 className="h3">Impostazioni</h3>
                  <p className="muted">Configura lo stato, le notifiche e la contabilità dell'abbonamento</p>
                </CardHeader>
                <CardBody>
                  <div className="space-y-6">
                    {/* Stato Abbonamento */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          Abbonamento {subscription.status === 'active' ? 'attivo' : 'non attivo'}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {subscription.status === 'active' 
                            ? 'L\'abbonamento è attualmente attivo e genera pagamenti' 
                            : 'L\'abbonamento è inattivo e non genera nuovi pagamenti'
                          }
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          const newStatus = subscription.status === 'active' ? 'inactive' : 'active';
                          setSubscription(prev => ({ ...prev, status: newStatus }));
                          // TODO: Salvare i cambiamenti nel repository
                          // await subscriptionsRepo.update(id, { status: newStatus });
                        }}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 ${
                          subscription.status === 'active' ? 'bg-black' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                            subscription.status === 'active' ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Separatore */}
                    <div className="border-t border-gray-200 dark:border-gray-900"></div>

                    {/* Notifiche */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          Notifiche {subscription.notificationsEnabled ? 'attive' : 'non attive'}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {subscription.notificationsEnabled 
                            ? 'Riceverai notifiche per scadenze e pagamenti' 
                            : 'Non riceverai notifiche per questo abbonamento'
                          }
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          const newNotifications = !subscription.notificationsEnabled;
                          setSubscription(prev => ({ ...prev, notificationsEnabled: newNotifications }));
                          // TODO: Salvare i cambiamenti nel repository
                          // await subscriptionsRepo.update(id, { notificationsEnabled: newNotifications });
                        }}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 ${
                          subscription.notificationsEnabled ? 'bg-black' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                            subscription.notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Separatore */}
                    <div className="border-t border-gray-200 dark:border-gray-900"></div>

                    {/* Contabilizzazione */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          Contabilizzazione {subscription.accountingEnabled ? 'attiva' : 'non attiva'}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {subscription.accountingEnabled 
                            ? 'L\'abbonamento viene incluso nei report contabili' 
                            : 'L\'abbonamento non viene incluso nei report contabili'
                          }
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          const newAccounting = !subscription.accountingEnabled;
                          setSubscription(prev => ({ ...prev, accountingEnabled: newAccounting }));
                          // TODO: Salvare i cambiamenti nel repository
                          // await subscriptionsRepo.update(id, { accountingEnabled: newAccounting });
                        }}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 ${
                          subscription.accountingEnabled ? 'bg-black' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                            subscription.accountingEnabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Gestione Logo */}
              <Card>
                <CardHeader>
                  <h3 className="h3">Logo</h3>
                  <p className="muted">Personalizza l'aspetto dell'abbonamento</p>
                </CardHeader>
                <CardBody className="pt-2">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center relative overflow-hidden">
                      {getLogoIcon(subscription.logo)}
                      <Smartphone className="h-12 h-12 text-gray-400 absolute fallback-icon" style={{ display: 'none' }} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        Logo Attuale
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Clicca il pulsante seguente per cambiare il logo dell'abbonamento
                      </p>
                    </div>
                    <Button
                      variant="secondary"
                      onClick={() => setShowIconPicker(true)}
                    >
                      <Image className="h-4 w-4 mr-2" />
                      Cambia Logo
                    </Button>
                  </div>
                </CardBody>
              </Card>

              {/* Danger Zone */}
              <Card className="border-red-200 dark:border-red-800">
                <CardHeader className="bg-red-50 dark:bg-red-900/10 rounded-t-xl">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    <h3 className="h3 text-red-800 dark:text-red-200">Danger Zone</h3>
                  </div>
                  <p className="muted text-red-700 dark:text-red-300">Questa è un'azione che eliminerà definitivamente l'abbonamento e tutti i dati associati. Non può essere annullata.</p>
                </CardHeader>
                <CardBody className="bg-red-50 dark:bg-red-900/10 rounded-b-xl pt-2">
                  <Button 
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowDeleteModal(true)}
                    className="bg-red-100 hover:bg-red-200 text-red-800 dark:bg-red-800 dark:hover:bg-red-700 dark:text-red-200 border-red-300 dark:border-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Elimina Abbonamento
                  </Button>
                </CardBody>
              </Card>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Modali */}
      <DeleteConfirmationModal 
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        subscriptionName={subscription.name}
      />

      <IconPickerModal 
        isOpen={showIconPicker}
        onClose={() => setShowIconPicker(false)}
        onSelect={async (icon) => {
          try {
            setSubscription(prev => ({ ...prev, logo: icon }));
            
            // TODO: Salvare i cambiamenti nel repository
            // await subscriptionsRepo.update(id, { logo: icon });
            
            setShowIconPicker(false);
          } catch (error) {
      // Gestione silenziosa dell'errore
          }
        }}
      />

      <AddPersonModal 
        isOpen={showAddPersonModal}
        onClose={() => setShowAddPersonModal(false)}
        onAdd={async (person) => {
          try {
            setSubscription(prev => ({
              ...prev,
              people: [...prev.people, { ...person, id: Date.now().toString() }]
            }));
            
            // TODO: Salvare i cambiamenti nel repository
            // await subscriptionsRepo.update(id, { people: subscription.people });
            
            setShowAddPersonModal(false);
          } catch (error) {
      // Gestione silenziosa dell'errore
          }
        }}
      />

      {/* Modale Notifica Scadenza Pagamento */}
      <PaymentReminderModal 
        isOpen={showPaymentReminder} 
        onClose={() => setShowPaymentReminder(false)} 
        onGoToPayments={handleGoToPayments}
        daysUntilDue={daysUntilDue}
      />

       {/* Modale Aggiungi Pagamento */}
       <AddPaymentModal 
         isOpen={showAddPaymentModal}
         onClose={() => setShowAddPaymentModal(false)}
         onSave={handleAddPayment}
         subscription={subscription}
       />

       {/* Modale Modifica Pagamento */}
       {showEditPaymentModal && editingPayment && (
         <EditPaymentModal 
           isOpen={showEditPaymentModal}
           onClose={() => {
             setShowEditPaymentModal(false);
             setEditingPayment(null);
           }}
           onSave={(updatedData) => {
             handleEditPayment(editingPayment.id, updatedData);
             setShowEditPaymentModal(false);
             setEditingPayment(null);
           }}
           payment={editingPayment}
           subscription={subscription}
         />
       )}

       {/* Popup Condivisione Link */}
       <ShareLinkPopup
         isOpen={showSharePopup}
         onClose={() => setShowSharePopup(false)}
         shareLink={shareLink}
         onCopyLink={handleCopyLink}
      />
    </motion.div>
  );
};

// Componente Header
const SubscriptionHeader = ({ subscription, onEdit, onDelete, onChangeLogo, getLogoIcon }) => (
  <div className="flex items-start justify-between mb-8">
    <div className="flex items-center space-x-4">
      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center relative overflow-hidden">
        {getLogoIcon(subscription.logo)}
        <Smartphone className="w-12 h-12 text-gray-400 absolute fallback-icon" style={{ display: 'none' }} />
      </div>
      <div>
        <h1 className="h1 mb-2">{subscription.name}</h1>
        <div className="flex items-center space-x-2">
          <Badge variant="info" size="sm">
            {translateCategory(subscription.category)}
          </Badge>
          <Badge 
            variant={subscription.status === 'active' ? 'success' : 'warning'}
            size="sm"
          >
            {subscription.status === 'active' ? 'Attivo' : 'Inattivo'}
          </Badge>
        </div>
      </div>
    </div>
    
    <div className="flex space-x-3">
      {/* Header vuoto - pulsanti spostati nella tab Impostazioni */}
    </div>
  </div>
);

// Componente Info Principali
const SubscriptionInfoCard = ({ subscription, translateRecurrenceType }) => (
  <Card>
    <CardHeader>
      <h3 className="h3">Informazioni Principali</h3>
    </CardHeader>
    <CardBody>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Tipo Abbonamento
          </label>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-1">
            {translateRecurrenceType(subscription.type)}
          </p>
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Importo
          </label>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-1">
            €{subscription.amount}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {subscription.amountType === 'fixed' ? 'Fisso' : 'Variabile'}
          </p>
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Prossima Scadenza
          </label>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-1">
            {formatDate(subscription.nextDue)}
          </p>
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Durata
          </label>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-1">
                                    {subscription.duration === '∞' ? 'Senza scadenza' : formatDate(subscription.duration)}
          </p>
        </div>
      </div>
    </CardBody>
  </Card>
);


// Componente Pagamento Mese Corrente
const CurrentMonthPayment = ({ subscription, onMarkAsPaid }) => {
  const [showPaidBanner, setShowPaidBanner] = useState(true);
  const [showInPari, setShowInPari] = useState(false);

  const getMonthsToPay = () => {
    try {
      if (!subscription.startDate) return [];
      
      const now = new Date();
      const startDate = new Date(subscription.startDate);
      const startDay = startDate.getDate();
      const monthsToPay = [];
      
      // Calcola tutti i mesi da pagare dall'inizio dell'abbonamento
      let currentDate = new Date(startDate);
      currentDate.setDate(startDay);
      
      while (currentDate <= now) {
        const monthNames = [
          'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
          'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
        ];
        
        const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;
        const isPaid = (subscription.payments || []).some(p => {
          try {
            const paymentDate = new Date(p.date);
            return paymentDate.getMonth() === currentDate.getMonth() && 
                   paymentDate.getFullYear() === currentDate.getFullYear();
          } catch (error) {
            return false;
          }
        });
        
        if (!isPaid) {
          monthsToPay.push({
            month: monthNames[currentDate.getMonth()],
            year: currentDate.getFullYear(),
            day: startDay,
            date: new Date(currentDate),
            isOverdue: currentDate < now
          });
        }
        
        // Passa al mese successivo
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
      
      return monthsToPay;
    } catch (error) {
      return [];
    }
  };

  const monthsToPay = getMonthsToPay();
  const hasOverduePayments = monthsToPay.some(m => m.isOverdue);

  // Gestisce il pagamento e nasconde il banner dopo 5 secondi
  const handlePayment = async (monthInfo) => {
    await onMarkAsPaid(monthInfo);
    
    // Nasconde il banner verde dopo 5 secondi
    setTimeout(() => {
      setShowPaidBanner(false);
      setShowInPari(true);
    }, 5000);
  };

  // Se ci sono pagamenti in arretrato, mostra quelli
  if (hasOverduePayments) {
    return (
  <Card>
        <CardHeader className="pb-1">
          <h3 className="h3">Pagamenti in corso</h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            {monthsToPay.filter(m => m.isOverdue).map((month, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                    <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {month.month} {month.year}
                    </p>
                    <p className="text-sm text-red-600 dark:text-red-400">
                      Scaduto il {month.day} {month.month}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="danger" 
                  size="sm" 
                  onClick={() => handlePayment(month)}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Pagato
        </Button>
      </div>
            ))}
          </div>
        </CardBody>
      </Card>
    );
  }

  // Se non ci sono pagamenti in arretrato, mostra il mese corrente
  const currentMonthInfo = monthsToPay.length > 0 ? monthsToPay[0] : null;

  if (currentMonthInfo && currentMonthInfo.isPaid && showPaidBanner) {
    return (
      <Card>
        <CardHeader className="pb-1">
          <h3 className="h3">Pagamenti in corso</h3>
    </CardHeader>
    <CardBody>
          <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  Hai già pagato {currentMonthInfo.month} {currentMonthInfo.year}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Pagamento registrato per il {currentMonthInfo.day} {currentMonthInfo.month}
                </p>
              </div>
            </div>
            <Badge variant="secondary" size="lg">
              Pagato
              </Badge>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (currentMonthInfo && currentMonthInfo.isPaid && showInPari) {
    return (
      <Card>
        <CardHeader className="pb-1">
          <h3 className="h3">Pagamenti in corso</h3>
        </CardHeader>
        <CardBody>
          <div className="flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </div>
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Sei in pari con tutti i pagamenti
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Continua così!
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (currentMonthInfo) {
    return (
      <Card>
        <CardHeader className="pb-1">
          <h3 className="h3">Pagamenti in corso</h3>
        </CardHeader>
        <CardBody>
          <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  Hai pagato {currentMonthInfo.month} {currentMonthInfo.year}?
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Scadenza: {currentMonthInfo.day} {currentMonthInfo.month} {currentMonthInfo.year}
                </p>
              </div>
            </div>
                <Button 
                  variant="success" 
              size="lg" 
              onClick={() => handlePayment(currentMonthInfo)}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
              Pagato
                </Button>
          </div>
        </CardBody>
      </Card>
    );
  }

  // Se non ci sono mesi da pagare, mostra che sei in pari
  return (
    <Card>
              <CardHeader className="pb-1">
          <h3 className="h3">Pagamenti in corso</h3>
        </CardHeader>
        <CardBody>
          <div className="flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <div className="text-center">
                          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </div>
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Sei in pari con tutti i pagamenti
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Continua così!
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );

  return (
    <Card>
      <CardHeader>
        <h3 className="h3">Pagamento Mese Corrente</h3>
      </CardHeader>
      <CardBody>
        <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                Hai pagato {monthInfo.month} {monthInfo.year}?
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Scadenza: {monthInfo.day} {monthInfo.month} {monthInfo.year}
              </p>
            </div>
          </div>
          <Button 
            variant="success" 
            size="lg" 
            onClick={() => handlePayment(monthInfo)}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Pagato
          </Button>
      </div>
    </CardBody>
  </Card>
);
};

// Componente Storico Pagamenti
const PaymentHistory = ({ payments }) => {
  // Calcola il totale dei pagamenti
  const totalAmount = payments && payments.length > 0 
    ? payments.reduce((total, payment) => total + (payment.amount || 0), 0)
    : 0;

  return (
  <Card>
      <CardHeader className="pb-1">
      <h3 className="h3">Storico Pagamenti</h3>
        <p className="muted">Cronologia di tutti i pagamenti effettuati</p>
    </CardHeader>
    <CardBody>
        {/* Lista pagamenti */}
      <div className="space-y-3">
          {payments && payments.length > 0 ? (
            payments.map((payment) => (
          <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                payment.status === 'completed' 
                      ? 'bg-gray-100 dark:bg-gray-700' 
                  : 'bg-yellow-100 dark:bg-yellow-900'
              }`}>
                {payment.status === 'completed' ? (
                      <CheckCircle className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  €{payment.amount}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                      {payment.month && payment.year ? `${payment.month} ${payment.year}` : formatDate(payment.date)}
                </p>
                    {payment.paidBy && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Pagato da {payment.paidBy}
                      </p>
                    )}
              </div>
            </div>
            
            <div className="text-right">
              <Badge 
                variant={payment.status === 'completed' ? 'success' : 'warning'}
                size="sm"
              >
                {payment.status === 'completed' ? 'Completato' : 'In Attesa'}
              </Badge>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatDate(payment.date)}
                </p>
            </div>
          </div>
            ))
          ) : (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            <CreditCard className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">Nessun pagamento registrato</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                I pagamenti verranno mostrati qui dopo aver cliccato "Pagato"
              </p>
          </div>
        )}
      </div>

        {/* Riepilogo totale alla fine */}
        {payments && payments.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Totale pagamenti: €{totalAmount.toFixed(2)}
            </p>
          </div>
        )}
    </CardBody>
  </Card>
);
};

// Genera i prossimi pagamenti basandosi sulla data di inizio e frequenza
const generateUpcomingPayments = () => {
  if (!subscription.startDate) return [];
  
  const startDate = new Date(subscription.startDate);
  const startDay = startDate.getDate();
  const now = new Date();
  const upcomingPayments = [];
  
  // Determina la frequenza corretta
  const frequency = subscription.recurrence?.type || subscription.type || 'monthly';
  
  // Genera pagamenti per i prossimi 3 anni o 36 mesi
  const maxPeriods = frequency === 'annual' ? 3 : 36;
  
  for (let i = 1; i <= maxPeriods; i++) {
    let paymentDate;
    
    if (frequency === 'monthly') {
      paymentDate = new Date(startDate);
      paymentDate.setMonth(startDate.getMonth() + i);
    } else if (frequency === 'annual') {
      paymentDate = new Date(startDate);
      paymentDate.setFullYear(startDate.getFullYear() + i);
    } else if (frequency === 'custom' && subscription.recurrence?.interval) {
      paymentDate = new Date(startDate);
      paymentDate.setMonth(startDate.getMonth() + (i * subscription.recurrence.interval));
    }
    
    // Imposta il giorno corretto
    paymentDate.setDate(startDay);
    
    // Solo pagamenti futuri
    if (paymentDate > now) {
      const monthNames = [
        'Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu',
        'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'
      ];
      
      upcomingPayments.push({
        id: `upcoming_${i}`,
        date: paymentDate.toISOString(),
        amount: subscription.amount,
        month: monthNames[paymentDate.getMonth()],
        year: paymentDate.getFullYear(),
        day: startDay,
        isOverdue: false,
        frequency: frequency
      });
    }
  }
  
  return upcomingPayments.slice(0, 12); // Mostra solo i prossimi 12
};

// Componente Pagamenti Futuri
const UpcomingPayments = ({ payments }) => (
  <Card>
    <CardHeader className="pb-1">
      <h3 className="h3">Prossimi Pagamenti</h3>
      <p className="muted">Prossimi pagamenti basati sulla frequenza dell'abbonamento</p>
    </CardHeader>
    <CardBody>
      <div className="space-y-3">
        {payments && payments.length > 0 ? (
          <>
            {/* Mostra solo i primi 3 pagamenti */}
            {payments.slice(0, 3).map((payment) => (
          <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                      €{payment.amount || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                      {payment.day || 1} {payment.month || 'Gen'} {payment.year || new Date().getFullYear()}
                </p>
              </div>
            </div>
            
            <Badge variant="info" size="sm">
                  {payment.isOverdue ? 'Scaduto' : 'In Arrivo'}
            </Badge>
          </div>
        ))}
        
            {/* Mostra "Altri" se ci sono più di 3 pagamenti */}
            {payments.length > 3 && (
              <div className="text-center py-3 text-gray-500 dark:text-gray-400">
                <p className="text-sm">Altri pagamenti in futuro</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">Nessun pagamento futuro</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Verifica la data di inizio e la frequenza dell'abbonamento
            </p>
          </div>
        )}
      </div>
    </CardBody>
  </Card>
);

// Componente Azioni Extra
const ExtraActions = ({ subscription, onEdit, onDelete, onChangeLogo }) => (
  <Card>
    <CardHeader>
      <h3 className="h3">Azioni</h3>
    </CardHeader>
    <CardBody>
      <div className="space-y-3">
        <Button variant="secondary" fullWidth onClick={onEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Modifica Abbonamento
        </Button>
        
        <Button variant="secondary" fullWidth onClick={onChangeLogo}>
          <Image className="h-4 w-4 mr-2" />
          Cambia Logo/Icona
        </Button>
        
        <Button variant="danger" fullWidth onClick={onDelete}>
          <Trash2 className="h-4 w-4 mr-2" />
          Elimina Abbonamento
        </Button>
      </div>
    </CardBody>
  </Card>
);

// Modale Conferma Eliminazione
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, subscriptionName }) => (
  <Modal isOpen={isOpen} onClose={onClose} size="md">
    <div className="text-center p-6">
      <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
      </div>
      
      <h3 className="h3 mb-2">Elimina Abbonamento</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Sei sicuro di voler eliminare l'abbonamento <strong>{subscriptionName}</strong>? 
        Questa azione non può essere annullata.
      </p>
      
      <div className="flex space-x-3 justify-center">
        <Button variant="secondary" onClick={onClose}>
          Annulla
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Elimina
        </Button>
      </div>
    </div>
  </Modal>
);

// Modale Notifica Scadenza Pagamento
const PaymentReminderModal = ({ isOpen, onClose, onGoToPayments, daysUntilDue }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="text-center p-6">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="h-8 w-8 text-gray-600 dark:text-gray-400" />
        </div>
        
        <h3 className="h3 mb-2">Abbonamento in Scadenza</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          L'abbonamento è in scadenza tra <strong>{daysUntilDue} {daysUntilDue === 1 ? 'giorno' : 'giorni'}</strong>. Ricordati di pagarlo!
        </p>
        
        <div className="flex space-x-3 justify-center">
          <Button variant="secondary" onClick={onClose}>
            Chiudi
          </Button>
          <Button variant="primary" onClick={onGoToPayments}>
            Vai ai Pagamenti
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// Modale Selezione Icona
const IconPickerModal = ({ isOpen, onClose, onSelect }) => {
  const availableIcons = getAvailableLogos();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6">
        <h3 className="h3 mb-4">Seleziona Logo/Icona</h3>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          {availableIcons.map((icon) => (
            <button
              key={icon.name}
              onClick={() => onSelect(icon.path)}
              className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
            >
              <img src={icon.path} alt={icon.name} className="w-full h-12 mx-auto mb-2 object-cover rounded-lg" />
              <p className="text-sm text-gray-600 dark:text-gray-400">{icon.name}</p>
            </button>
          ))}
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="text-center">
            <Button variant="secondary" fullWidth>
              <Upload className="h-4 w-4 mr-2" />
              Carica Logo Personalizzato
            </Button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Formati supportati: SVG, PNG, JPG (max 2MB)
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

// Modale Aggiungi Persona
const AddPersonModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    quota: '',
    quotaType: 'fixed'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.quota) {
      onAdd({
        ...formData,
        quota: parseFloat(formData.quota),
        paymentStatus: 'pending'
      });
      setFormData({ name: '', quota: '', quotaType: 'fixed' });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <form onSubmit={handleSubmit} className="p-6">
        <h3 className="h3 mb-4">Aggiungi Persona</h3>
        
        <div className="space-y-4">
          <div>
            <label className="label">Nome</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input"
              placeholder="Nome della persona"
              required
            />
          </div>
          
          <div>
            <label className="label">Quota</label>
            <input
              type="number"
              step="0.01"
              value={formData.quota}
              onChange={(e) => setFormData({ ...formData, quota: e.target.value })}
              className="form-input"
              placeholder="0.00"
              required
            />
          </div>
          
          <div>
            <label className="label">Tipo Quota</label>
            <select
              value={formData.quotaType}
              onChange={(e) => setFormData({ ...formData, quotaType: e.target.value })}
              className="form-select"
            >
              <option value="fixed">Fissa</option>
              <option value="percentage">Percentuale</option>
            </select>
          </div>
        </div>
        
        <div className="flex space-x-3 mt-6">
          <Button variant="secondary" onClick={onClose} type="button">
            Annulla
          </Button>
          <Button type="submit">
            Aggiungi
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// Funzione helper per formattare le date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Componente Area Tutti i Pagamenti
const AllPaymentsSection = ({ payments, loading, onAddPayment, onEditPayment, onDeletePayment, onReloadPayments, subscription }) => {
  // Ordina i pagamenti per data (dal più vecchio al più recente)
  const sortedPayments = React.useMemo(() => {
    try {
      const paymentsArray = [...(payments || [])];
      
      // Rimuovi duplicati basati sull'ID
      const uniquePayments = paymentsArray.filter((payment, index, self) => 
        index === self.findIndex(p => p.id === payment.id)
      );
      
      return uniquePayments.sort((a, b) => new Date(a.date) - new Date(b.date));
    } catch (error) {
      console.error('Errore nell\'ordinamento dei pagamenti:', error);
      return [];
    }
  }, [payments]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="h3">Tutti i pagamenti</h3>
            <p className="muted">Gestisci tutti i pagamenti per questo abbonamento</p>
          </div>
          <Button size="sm" onClick={onAddPayment}>
            <Plus className="h-4 w-4 mr-2" />
            Aggiungi
          </Button>
        </div>
      </CardHeader>
      <CardBody>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-3">
            <div className="loading-circle h-8 w-8"></div>
            <span className="text-gray-600 dark:text-gray-400 text-sm">Caricamento pagamenti...</span>
          </div>
        ) : sortedPayments.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h4 className="h4 mb-2">Non sono stati registrati ancora dei pagamenti</h4>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Inizia aggiungendo il tuo primo pagamento per questo abbonamento
            </p>
             <Button size="sm" onClick={onAddPayment}>
               <Plus className="h-4 w-4 mr-2" />
               Aggiungi
             </Button>
          </div>
        ) : (
           <div className="space-y-3">
             {sortedPayments.map((payment) => {
               try {
                 return (
                   <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                     <div className="flex items-center space-x-4">
                       <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                         <CheckCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                       </div>
                       <div>
                         <p className="font-medium text-gray-900 dark:text-gray-100">
                           €{(payment.amount || 0).toFixed(2)}
                         </p>
                         <p className="text-sm text-gray-600 dark:text-gray-400">
                           {payment.date ? formatDate(payment.date) : 'Data non disponibile'}
                         </p>
                         {payment.people && payment.people.length > 0 && (
                           <p className="text-xs text-gray-500 dark:text-gray-400">
                             Persone coinvolte: {payment.people.join(', ')}
                           </p>
                         )}
                         {payment.notes && (
                           <p className="text-xs text-gray-500 dark:text-gray-400">
                             Note: {payment.notes}
                           </p>
                         )}
                       </div>
                     </div>
                     <div className="flex items-center space-x-2">
                       <div className="flex space-x-1">
                         <Button
                           variant="secondary"
                           size="sm"
                           onClick={() => onEditPayment(payment)}
                           className="p-2"
                         >
                           <Pencil className="h-4 w-4" />
                         </Button>
                         <Button
                           variant="secondary"
                           size="sm"
                           onClick={() => onDeletePayment(payment.id)}
                           className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                         >
                           <Trash2 className="h-4 w-4" />
                         </Button>
                       </div>
                     </div>
                   </div>
                 );
               } catch (error) {
                 console.error('Errore nel rendering del pagamento:', error, payment);
                 return null;
               }
             })}
           </div>
        )}
        
      </CardBody>
    </Card>
  );
};

// Componente Modal Aggiungi Pagamento
const AddPaymentModal = ({ isOpen, onClose, onSave, subscription }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0], // Data odierna come default
    amount: '',
    people: [],
    notes: ''
  });
  const [newPerson, setNewPerson] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.amount && formData.date) {
      onSave(formData);
      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        people: [],
        notes: ''
      });
      setNewPerson('');
    }
  };

  const addPerson = () => {
    if (newPerson.trim() && !formData.people.includes(newPerson.trim())) {
      setFormData(prev => ({
        ...prev,
        people: [...prev.people, newPerson.trim()]
      }));
      setNewPerson('');
    }
  };

  const removePerson = (personToRemove) => {
    setFormData(prev => ({
      ...prev,
      people: prev.people.filter(person => person !== personToRemove)
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <form onSubmit={handleSubmit} className="p-6">
        <h3 className="h3 mb-4">Aggiungi pagamento</h3>
        
        <div className="space-y-4">
          {/* Data del pagamento */}
          <div>
            <label className="label">Data del pagamento *</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="form-input"
              required
            />
          </div>

          {/* Costo */}
          <div>
            <label className="label">Costo *</label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              className="form-input"
              placeholder="0.00"
              required
            />
          </div>

          {/* Persone coinvolte */}
          <div>
            <label className="label">Persone coinvolte</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newPerson}
                onChange={(e) => setNewPerson(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addPerson();
                  }
                }}
                className="form-input flex-1"
                placeholder="Aggiungi persona"
              />
              <Button type="button" variant="secondary" onClick={addPerson}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Lista persone aggiunte */}
            {formData.people.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.people.map((person, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-md"
                  >
                    {person}
                    <button
                      type="button"
                      onClick={() => removePerson(person)}
                      className="ml-2 text-gray-500 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Note */}
          <div>
            <label className="label">Note</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="form-input"
              rows="3"
              placeholder="Note aggiuntive..."
            />
          </div>
        </div>
        
        <div className="flex space-x-3 mt-6">
          <Button variant="secondary" onClick={onClose} type="button">
            Annulla
          </Button>
          <Button type="submit">
            Salva
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// Componente Modal Modifica Pagamento
const EditPaymentModal = ({ isOpen, onClose, onSave, payment, subscription }) => {
  const [formData, setFormData] = useState({
    date: '',
    amount: '',
    people: [],
    notes: ''
  });
  const [newPerson, setNewPerson] = useState('');

  // Inizializza il form quando il pagamento cambia
  React.useEffect(() => {
    if (payment) {
      setFormData({
        date: payment.date ? payment.date.split('T')[0] : '',
        amount: payment.amount ? payment.amount.toString() : '0',
        people: payment.people || [],
        notes: payment.notes || ''
      });
    }
  }, [payment]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.amount && formData.date) {
      // Assicurati che amount sia un numero valido
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        alert('Inserisci un importo valido');
        return;
      }
      
      const dataToSave = {
        ...formData,
        amount: amount
      };
      onSave(dataToSave);
    }
  };

  const addPerson = () => {
    if (newPerson.trim() && !formData.people.includes(newPerson.trim())) {
      setFormData(prev => ({
        ...prev,
        people: [...prev.people, newPerson.trim()]
      }));
      setNewPerson('');
    }
  };

  const removePerson = (personToRemove) => {
    setFormData(prev => ({
      ...prev,
      people: prev.people.filter(person => person !== personToRemove)
    }));
  };

  if (!payment) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <form onSubmit={handleSubmit} className="p-6">
        <h3 className="h3 mb-4">Modifica pagamento</h3>
        
        <div className="space-y-4">
          {/* Data del pagamento */}
          <div>
            <label className="label">Data del pagamento *</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="form-input"
              required
            />
          </div>

          {/* Costo */}
          <div>
            <label className="label">Costo *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => {
                const value = e.target.value;
                // Permetti solo numeri positivi e decimali
                if (value === '' || (!isNaN(parseFloat(value)) && parseFloat(value) >= 0)) {
                  setFormData(prev => ({ ...prev, amount: value }));
                }
              }}
              className="form-input"
              placeholder="0.00"
              required
            />
          </div>

          {/* Persone coinvolte */}
          <div>
            <label className="label">Persone coinvolte</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newPerson}
                onChange={(e) => setNewPerson(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addPerson();
                  }
                }}
                className="form-input flex-1"
                placeholder="Aggiungi persona"
              />
              <Button type="button" variant="secondary" onClick={addPerson}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Lista persone aggiunte */}
            {formData.people.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.people.map((person, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-md"
                  >
                    {person}
                    <button
                      type="button"
                      onClick={() => removePerson(person)}
                      className="ml-2 text-gray-500 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Note */}
          <div>
            <label className="label">Note</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="form-input"
              rows="3"
              placeholder="Note aggiuntive..."
            />
          </div>
        </div>
        
        <div className="flex space-x-3 mt-6">
          <Button variant="secondary" onClick={onClose} type="button">
            Annulla
          </Button>
          <Button type="submit">
            Salva modifiche
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// Popup Condivisione Link
const ShareLinkPopup = ({ isOpen, onClose, shareLink, onCopyLink }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Condividi abbonamento
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Condividi questo link con i tuoi amici per permettere loro di unirsi all'abbonamento:
          </p>
          
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={shareLink}
              readOnly
              className="form-input text-sm bg-gray-50 dark:bg-gray-700 h-8"
            />
            <Button variant="secondary" onClick={onCopyLink} className="p-2">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={onClose}>
              Chiudi
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionDetail;
