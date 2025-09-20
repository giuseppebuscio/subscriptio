import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon,
  Sun, 
  Moon, 
  Bell, 
  Eye, 
  Download, 
  Upload, 
  RotateCcw,
  Globe,
  Palette,
  Database
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../components/Card';
import Button from '../components/Button';
import { settingsRepo } from '../repositories/settingsRepo';
import { AnimatePresence } from 'framer-motion';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await settingsRepo.getAll();
      setSettings(data);
    } catch (error) {
      // Gestione silenziosa dell'errore
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = async (key, value) => {
    try {
      setSaving(true);
      await settingsRepo.update(key, value);
      setSettings(prev => ({ ...prev, [key]: value }));
    } catch (error) {
      // Gestione silenziosa dell'errore
    } finally {
      setSaving(false);
    }
  };

  const handleMultipleSettingsChange = async (updates) => {
    try {
      setSaving(true);
      await settingsRepo.updateMultiple(updates);
      setSettings(prev => ({ ...prev, ...updates }));
    } catch (error) {
      // Gestione silenziosa dell'errore
    } finally {
      setSaving(false);
    }
  };

  const handleResetData = async () => {
    if (window.confirm('Sei sicuro di voler resettare tutti i dati? Questa azione non può essere annullata.')) {
      try {
        setSaving(true);
        // Reset repositories
        await Promise.all([
          settingsRepo.resetToDefaults(),
          // Add other repository resets here when implemented
        ]);
        await loadSettings();
        alert('I dati sono stati resettati ai valori predefiniti.');
          } catch (error) {
      alert('Errore nel resettare i dati. Riprova.');
    } finally {
        setSaving(false);
      }
    }
  };

  const handleExportSettings = async () => {
    try {
      const exported = await settingsRepo.export();
      const blob = new Blob([JSON.stringify(exported, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'subscriptio-impostazioni.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Errore nell\'esportare le impostazioni. Riprova.');
    }
  };

  const handleImportSettings = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const imported = JSON.parse(text);
      await settingsRepo.import(imported);
      await loadSettings();
      alert('Impostazioni importate con successo.');
    } catch (error) {
      alert('Errore nell\'importare le impostazioni. Controlla il formato del file.');
    }
  };

  const tabs = [
    { id: 'general', label: 'Generale', icon: SettingsIcon },
    { id: 'notifications', label: 'Notifiche', icon: Bell },
    { id: 'display', label: 'Visualizzazione', icon: Eye },
    { id: 'data', label: 'Gestione Dati', icon: Database }
  ];

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
        <h1 className="h1">Impostazioni</h1>
        <p className="muted">Configura la tua esperienza SUBSCRIPTIO</p>
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
          {activeTab === 'general' && (
            <div className="section-spacing">
              {/* Theme Settings */}
              <Card>
                <CardHeader>
                  <h3 className="h3 flex items-center">
                    <Palette className="h-5 w-5 mr-2" />
                    Tema e Aspetto
                  </h3>
                  <p className="muted">Personalizza l\'aspetto dell\'applicazione</p>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div>
                    <label className="label">Tema</label>
                    <div className="flex space-x-3 mt-2">
                      <button
                        onClick={() => handleSettingChange('theme', 'light')}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl border-2 transition-all ${
                          settings.theme === 'light'
                            ? 'border-gray-900 bg-gray-900 text-white'
                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                        }`}
                      >
                        <Sun className="h-4 w-4" />
                        <span>Chiaro</span>
                      </button>
                      <button
                        onClick={() => handleSettingChange('theme', 'dark')}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl border-2 transition-all ${
                          settings.theme === 'dark'
                            ? 'border-gray-900 bg-gray-900 text-white'
                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                        }`}
                      >
                        <Moon className="h-4 w-4" />
                        <span>Scuro</span>
                      </button>
                      <button
                        onClick={() => handleSettingChange('theme', 'auto')}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl border-2 transition-all ${
                          settings.theme === 'auto'
                            ? 'border-gray-900 bg-gray-900 text-white'
                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                        }`}
                      >
                        <Globe className="h-4 w-4" />
                        <span>Automatico</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="label">Lingua</label>
                    <select
                      value={settings.language || 'it'}
                      onChange={(e) => handleSettingChange('language', e.target.value)}
                      className="form-select mt-2"
                    >
                      <option value="it">Italiano</option>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">Valuta</label>
                    <select
                      value={settings.currency || 'EUR'}
                      onChange={(e) => handleSettingChange('currency', e.target.value)}
                      className="form-select mt-2"
                    >
                      <option value="EUR">Euro (€)</option>
                      <option value="USD">Dollaro USA ($)</option>
                      <option value="GBP">Sterlina Britannica (£)</option>
                      <option value="JPY">Yen Giapponese (¥)</option>
                    </select>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="section-spacing">
              {/* Notification Settings */}
              <Card>
                <CardHeader>
                  <h3 className="h3 flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    Preferenze Notifiche
                  </h3>
                  <p className="muted">Configura quando e come ricevi le notifiche</p>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div>
                    <label className="label">Giorni di Promemoria</label>
                    <p className="muted mb-2">Giorni prima della scadenza del pagamento per inviare promemoria</p>
                    <div className="flex space-x-2">
                      {[1, 3, 7, 14, 30].map((days) => (
                        <button
                          key={days}
                          onClick={() => handleSettingChange('reminderDays', days)}
                          className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                            settings.reminderDays === days
                              ? 'bg-gray-900 text-white'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                          }`}
                        >
                          {days} giorno{days !== 1 ? 'i' : ''}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="label">Notifiche Email</label>
                        <p className="muted">Ricevi notifiche via email</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications !== false}
                        onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                        className="form-checkbox"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="label">Notifiche Push</label>
                        <p className="muted">Ricevi notifiche nel browser</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.pushNotifications !== false}
                        onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                        className="form-checkbox"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="label">Avvisi Sonori</label>
                        <p className="muted">Riproduci suoni per notifiche importanti</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.soundAlerts !== false}
                        onChange={(e) => handleSettingChange('soundAlerts', e.target.checked)}
                        className="form-checkbox"
                      />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}

          {activeTab === 'display' && (
            <div className="section-spacing">
              {/* Display Settings */}
              <Card>
                <CardHeader>
                  <h3 className="h3 flex items-center">
                    <Eye className="h-5 w-5 mr-2" />
                    Opzioni di Visualizzazione
                  </h3>
                  <p className="muted">Personalizza come vengono visualizzate le informazioni</p>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="label">Modalità Compatta</label>
                        <p className="muted">Riduci gli spazi per più contenuti sullo schermo</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.compactMode === true}
                        onChange={(e) => handleSettingChange('compactMode', e.target.checked)}
                        className="form-checkbox"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="label">Mostra Importi</label>
                        <p className="muted">Visualizza importi monetari in liste e schede</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.showAmounts !== false}
                        onChange={(e) => handleSettingChange('showAmounts', e.target.checked)}
                        className="form-checkbox"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="label">Mostra Date di Scadenza</label>
                        <p className="muted">Visualizza le scadenze dei pagamenti in evidenza</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.showDueDates !== false}
                        onChange={(e) => handleSettingChange('showDueDates', e.target.checked)}
                        className="form-checkbox"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="label">Stato Codificato a Colori</label>
                        <p className="muted">Usa colori per indicare lo stato di pagamenti e abbonamenti</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.colorCodedStatus !== false}
                        onChange={(e) => handleSettingChange('colorCodedStatus', e.target.checked)}
                        className="form-checkbox"
                      />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="section-spacing">
              {/* Data Management */}
              <Card>
                <CardHeader>
                  <h3 className="h3 flex items-center">
                    <Database className="h-5 w-5 mr-2" />
                    Gestione Dati
                  </h3>
                  <p className="muted">Esporta, importa e gestisci i tuoi dati</p>
                </CardHeader>
                <CardBody className="space-y-6">
                  <div className="card-grid-2">
                    <div className="text-center">
                      <Button
                        onClick={handleExportSettings}
                        variant="secondary"
                        fullWidth
                        className="mb-2"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Esporta Impostazioni
                      </Button>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Scarica le tue impostazioni attuali come file JSON
                      </p>
                    </div>

                    <div className="text-center">
                      <label className="block">
                        <Button
                          variant="secondary"
                          fullWidth
                          className="mb-2"
                          as="span"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Importa Impostazioni
                        </Button>
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleImportSettings}
                          className="hidden"
                        />
                      </label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Importa impostazioni da un file precedentemente esportato
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h4 className="h4 mb-4 text-gray-900 dark:text-gray-100">Zona Pericolo</h4>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4">
                      <div className="flex items-start space-x-3">
                        <RotateCcw className="h-5 w-5 text-gray-700 mt-0.5" />
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                            Resetta Tutti i Dati
                          </h5>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                            Questo resettarà tutti gli abbonamenti, pagamenti, persone e impostazioni ai loro valori predefiniti. 
                            Questa azione non può essere annullata.
                          </p>
                          <Button
                            onClick={handleResetData}
                            variant="danger"
                            size="sm"
                            disabled={saving}
                          >
                            {saving ? 'Resettando...' : 'Resetta Tutti i Dati'}
                          </Button>
                        </div>
                      </div>
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

export default Settings;
