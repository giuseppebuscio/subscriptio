import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle,
  Play,
  Star,
  MessageCircle,
  Info,
  BookOpen,
  Users,
  CreditCard,
  BarChart3,
  Calendar,
  Settings,
  Download,
  Upload
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../components/Card';

const Help = () => {
  const [activeTab, setActiveTab] = useState('getting-started');

  const tabs = [
    { id: 'getting-started', label: 'Iniziare', icon: Play },
    { id: 'features', label: 'Funzionalità', icon: Star },
    { id: 'faq', label: 'FAQ', icon: MessageCircle },
    { id: 'about', label: 'Informazioni', icon: Info }
  ];

  const faqs = [
    {
      question: "Come aggiungo un nuovo abbonamento?",
      answer: "Vai alla pagina Abbonamenti e clicca sul pulsante 'Aggiungi Abbonamento'. Compila le informazioni richieste inclusi nome, categoria, importo e pattern di ricorrenza."
    },
    {
      question: "Posso condividere abbonamenti con altre persone?",
      answer: "Sì! Quando crei o modifichi un abbonamento, seleziona l'opzione 'Abbonamento condiviso' e aggiungi i partecipanti. L'app calcolerà automaticamente i pagamenti divisi."
    },
    {
      question: "Come sono configurati i promemoria di pagamento?",
      answer: "Vai su Impostazioni > Notifiche per configurare i giorni di promemoria. Puoi impostare promemoria per 1, 3, 7, 14 o 30 giorni prima della scadenza del pagamento."
    },
    {
      question: "Posso esportare i miei dati?",
      answer: "Sì, puoi esportare i tuoi dati in formato CSV dalle rispettive pagine. Vai su Impostazioni > Gestione Dati per le opzioni di esportazione in massa."
    },
    {
      question: "Come cambio il tema?",
      answer: "Vai su Impostazioni > Generale e scegli tra i temi Chiaro, Scuro o Automatico. Il tema Automatico segue la tua preferenza di sistema."
    },
    {
      question: "Quali valute sono supportate?",
      answer: "Le valute attualmente supportate includono Euro (€), Dollaro USA ($), Sterlina Britannica (£) e Yen Giapponese (¥). Puoi cambiare questo in Impostazioni > Generale."
    }
  ];

  const features = [
    {
      icon: BookOpen,
      title: "Gestione Abbonamenti",
      description: "Aggiungi, modifica e organizza facilmente i tuoi abbonamenti con categorie e pattern di ricorrenza personalizzati."
    },
    {
      icon: Users,
      title: "Spese Condivise",
      description: "Dividi abbonamenti con coinquilini, familiari o amici. Calcoli automatici dei pagamenti e tracciamento dei saldi."
    },
    {
      icon: CreditCard,
      title: "Tracciamento Pagamenti",
      description: "Monitora le scadenze dei pagamenti, segna i pagamenti come completati e traccia i pagamenti parziali."
    },
    {
      icon: BarChart3,
      title: "Analisi Finanziarie",
      description: "Visualizza pattern di spesa, previsioni mensili e ripartizioni per categoria con grafici interattivi."
    },
    {
      icon: Calendar,
      title: "Vista Calendario",
      description: "Calendario visivo che mostra tutti i pagamenti imminenti e le scadenze per una migliore pianificazione."
    },
    {
      icon: Settings,
      title: "Impostazioni Personalizzabili",
      description: "Personalizza temi, notifiche e preferenze di visualizzazione per adattarle al tuo flusso di lavoro."
    }
  ];

  return (
    <motion.div
      className="section-spacing"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Page Header */}
      <div>
        <h1 className="h1">Aiuto e Supporto</h1>
        <p className="muted">Ottieni aiuto con SUBSCRIPTIO e scopri le sue funzionalità</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
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
          {activeTab === 'getting-started' && (
            <div className="section-spacing">
              <Card>
                <CardHeader>
                  <h3 className="h3 flex items-center">
                    <Play className="h-5 w-5 mr-2" />
                    Guida Rapida
                  </h3>
                  <p className="muted">Inizia a usare SUBSCRIPTIO in pochi minuti</p>
                </CardHeader>
                <CardBody className="space-y-6">
                  <div className="card-grid-2">
                    <div className="space-y-4">
                      <h4 className="h4">1. Aggiungi il Tuo Primo Abbonamento</h4>
                      <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <li>Vai alla pagina Abbonamenti</li>
                        <li>Clicca "Aggiungi Abbonamento"</li>
                        <li>Compila i dettagli dell'abbonamento</li>
                        <li>Imposta l'importo e la ricorrenza</li>
                        <li>Salva il tuo abbonamento</li>
                      </ol>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="h4">2. Aggiungi Persone (Opzionale)</h4>
                      <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <li>Naviga alla pagina Persone</li>
                        <li>Aggiungi familiari o coinquilini</li>
                        <li>Includi le loro informazioni di contatto</li>
                        <li>Imposta abbonamenti condivisi</li>
                      </ol>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="h4">3. Configura le Impostazioni</h4>
                    <div className="card-grid-3">
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center mx-auto mb-3">
                          <Calendar className="h-6 w-6 text-gray-900 dark:text-gray-100" />
                        </div>
                        <h5 className="font-medium mb-2">Imposta Promemoria</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Configura quando vuoi i promemoria di pagamento
                        </p>
                      </div>
                      
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center mx-auto mb-3">
                          <Settings className="h-6 w-6 text-gray-900 dark:text-gray-100" />
                        </div>
                        <h5 className="font-medium mb-2">Scegli il Tema</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Seleziona tema chiaro, scuro o automatico
                        </p>
                      </div>
                      
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center mx-auto mb-3">
                          <Download className="h-6 w-6 text-gray-900 dark:text-gray-100" />
                        </div>
                        <h5 className="font-medium mb-2">Esporta Dati</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Fai backup dei tuoi dati regolarmente
                        </p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="section-spacing">
              <Card>
                <CardHeader>
                  <h3 className="h3 flex items-center">
                    <Star className="h-5 w-5 mr-2" />
                    Funzionalità Principali
                  </h3>
                  <p className="muted">Scopri cosa rende SUBSCRIPTIO potente</p>
                </CardHeader>
                <CardBody>
                  <div className="card-grid-3">
                    {features.map((feature, index) => {
                      const IconComponent = feature.icon;
                      return (
                        <motion.div
                          key={index}
                          className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl text-center"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <IconComponent className="h-8 w-8 text-gray-900 dark:text-gray-100" />
                          </div>
                          <h4 className="h4 mb-2">{feature.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {feature.description}
                          </p>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardBody>
              </Card>
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="section-spacing">
              <Card>
                <CardHeader>
                  <h3 className="h3 flex items-center">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Domande Frequenti
                  </h3>
                  <p className="muted">Trova risposte alle domande comuni</p>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <motion.div
                        key={index}
                        className="border border-gray-200 dark:border-gray-700 rounded-2xl p-4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <h4 className="h4 mb-2 text-black dark:text-white">
                          {faq.question}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          {faq.answer}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="section-spacing">
              <Card>
                <CardHeader>
                  <h3 className="h3 flex items-center">
                    <Info className="h-5 w-5 mr-2" />
                    Informazioni su SUBSCRIPTIO
                  </h3>
                  <p className="muted">Scopri di più sull'applicazione</p>
                </CardHeader>
                <CardBody className="space-y-6">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gray-900 dark:bg-white rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <span className="text-white dark:text-black text-3xl font-bold">S</span>
                    </div>
                    <h4 className="h2 mb-2">SUBSCRIPTIO</h4>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                      Gestione professionale degli abbonamenti resa semplice
                    </p>
                  </div>

                  <div className="card-grid-2">
                    <div>
                      <h5 className="h4 mb-3">Informazioni Versione</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Versione:</span>
                          <span className="font-medium">1.0.0</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Data Build:</span>
                          <span className="font-medium">{new Date().toLocaleDateString('it-IT')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Licenza:</span>
                          <span className="font-medium">MIT</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="h4 mb-3">Stack Tecnologico</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Frontend:</span>
                          <span className="font-medium">React 18</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Styling:</span>
                          <span className="font-medium">Tailwind CSS</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Build Tool:</span>
                          <span className="font-medium">Vite</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h5 className="h4 mb-3">Contatto e Supporto</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Hai bisogno di aiuto o hai suggerimenti? Ci piacerebbe sentire da te.
                    </p>
                    <div className="flex space-x-4">
                      <Button variant="secondary" size="sm">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Contatta Supporto
                      </Button>
                      <Button variant="secondary" size="sm">
                        <HelpCircle className="h-4 w-4 mr-2" />
                        Documentazione
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default Help;
