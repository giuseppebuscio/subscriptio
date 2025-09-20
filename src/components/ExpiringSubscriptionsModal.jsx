import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

const ExpiringSubscriptionsModal = ({ 
  isOpen, 
  onClose, 
  expiringSubscriptions = [],
  onViewSubscription 
}) => {
  if (!isOpen || !expiringSubscriptions.length) return null;

  const getDaysText = (days) => {
    if (days === 0) return 'oggi';
    if (days === 1) return 'domani';
    return `${days} giorni`;
  };

  const getTimeText = (days) => {
    if (days === 0) return 'oggi';
    if (days === 1) return 'domani';
    return `tra ${days} giorni`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="rounded-xl">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mr-4">
            <AlertTriangle className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Scadenza
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Abbonamento in scadenza
            </p>
          </div>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            Attenzione! Ricordati di pagare i seguenti abbonamenti:
          </p>
          <div className="space-y-3">
            {expiringSubscriptions.map((subscription, index) => (
              <div key={subscription.id} className="flex items-center">
                <span className="text-gray-700 dark:text-gray-300">
                  <strong>{subscription.name}</strong> è in scadenza
                </span>
                <span className="bg-yellow-50 dark:bg-yellow-800 text-yellow-700 dark:text-yellow-100 px-3 py-1 rounded-full text-sm font-medium ml-2">
                  {getTimeText(subscription.daysUntilRenewal)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Button variant="secondary" onClick={onClose} type="button" size="sm">
            Chiudi
          </Button>
          <Button 
            onClick={() => {
              window.location.href = '/payments';
            }}
            size="sm"
          >
            Vai ai Pagamenti
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ExpiringSubscriptionsModal;
