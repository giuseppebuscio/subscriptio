import { v4 as uuidv4 } from 'uuid';
import { generateNextPayments } from '../../utils/finance.js';
import { mockSubscriptions } from './subscriptions.js';

// Generate payments for the next 12 months for each subscription
export const generateMockPayments = () => {
  const payments = [];
  const today = new Date();
  
  mockSubscriptions.forEach(subscription => {
    const subscriptionPayments = generateNextPayments(subscription, today, 12);
    payments.push(...subscriptionPayments);
  });
  
  // Mark some payments as paid for demo purposes
  const paidPayments = [
    {
      id: `payment_${mockSubscriptions[0].id}_0`,
      subscriptionId: mockSubscriptions[0].id,
      dateDue: '2024-01-15',
      amount: 12.99,
      splits: [
        { personId: 'person_1', amount: 6.50, paid: true, paymentId: uuidv4() },
        { personId: 'person_2', amount: 6.49, paid: true, paymentId: uuidv4() }
      ],
      paid: true,
      paidDate: '2024-01-15',
      payerId: 'person_1'
    },
    {
      id: `payment_${mockSubscriptions[1].id}_0`,
      subscriptionId: mockSubscriptions[1].id,
      dateDue: '2024-01-20',
      amount: 9.99,
      splits: [
        { personId: 'person_1', amount: 3.33, paid: true, paymentId: uuidv4() },
        { personId: 'person_3', amount: 3.33, paid: true, paymentId: uuidv4() },
        { personId: 'person_4', amount: 3.33, paid: true, paymentId: uuidv4() }
      ],
      paid: true,
      paidDate: '2024-01-20',
      payerId: 'person_1'
    }
  ];
  
  // Replace the first payments with paid ones
  payments.splice(0, 2, ...paidPayments);
  
  return payments;
};

export const mockPayments = generateMockPayments();
