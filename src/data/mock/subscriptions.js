import { v4 as uuidv4 } from 'uuid';

export const mockSubscriptions = [
  {
    id: uuidv4(),
    name: 'Netflix',
    category: 'Streaming',
    amountType: 'fixed',
    amount: 19.99,
    invoices: [],
    recurrence: {
      type: 'monthly',
      interval: 1,
      day: 15
    },
    startDate: '2024-01-01',
    numberOfInstallments: null,
    endDate: null,
    shared: true,
    participants: [
      { personId: 'person_1', shareType: 'percent', value: 25 },
      { personId: 'person_2', shareType: 'percent', value: 25 },
      { personId: 'person_3', shareType: 'percent', value: 25 }
    ],
    status: 'active',
    notes: 'Premium plan, shared with 3 people',
    attachments: []
  },
  {
    id: uuidv4(),
    name: 'Spotify Premium',
    category: 'Music',
    amountType: 'fixed',
    amount: 9.99,
    invoices: [],
    recurrence: {
      type: 'monthly',
      interval: 1,
      day: 20
    },
    startDate: '2024-01-01',
    numberOfInstallments: null,
    endDate: null,
    shared: true,
    participants: [
      { personId: 'person_1', shareType: 'percent', value: 33.33 },
      { personId: 'person_3', shareType: 'percent', value: 33.33 },
      { personId: 'person_4', shareType: 'percent', value: 33.34 }
    ],
    status: 'active',
    notes: 'Family plan shared with 3 people',
    attachments: []
  },
  {
    id: uuidv4(),
    name: 'Energia Elettrica',
    category: 'Utilities',
    amountType: 'variable',
    amount: 0,
    invoices: [
      { id: uuidv4(), date: '2024-01-15', amount: 45.20, note: 'Winter consumption' },
      { id: uuidv4(), date: '2024-02-15', amount: 38.50, note: 'February bill' },
      { id: uuidv4(), date: '2024-03-15', amount: 42.80, note: 'March bill' },
      { id: uuidv4(), date: '2024-04-15', amount: 35.90, note: 'Spring consumption' },
      { id: uuidv4(), date: '2024-05-15', amount: 28.40, note: 'May bill' },
      { id: uuidv4(), date: '2024-06-15', amount: 31.60, note: 'June bill' }
    ],
    recurrence: {
      type: 'monthly',
      interval: 1,
      day: 15
    },
    startDate: '2024-01-01',
    numberOfInstallments: null,
    endDate: null,
    shared: true,
    participants: [
      { personId: 'person_1', shareType: 'percent', value: 40 },
      { personId: 'person_3', shareType: 'percent', value: 60 }
    ],
    status: 'active',
    notes: 'Shared apartment electricity bill',
    attachments: []
  },
  {
    id: uuidv4(),
    name: 'Palestra Fitness',
    category: 'Health',
    amountType: 'fixed',
    amount: 89.99,
    invoices: [],
    recurrence: {
      type: 'annual',
      interval: 1,
      day: 1
    },
    startDate: '2024-01-01',
    numberOfInstallments: null,
    endDate: null,
    shared: true,
    participants: [
      { personId: 'person_1', shareType: 'percent', value: 50 },
      { personId: 'person_2', shareType: 'percent', value: 50 }
    ],
    status: 'active',
    notes: 'Annual gym membership, shared with Lucia',
    attachments: []
  },
  {
    id: uuidv4(),
    name: 'Finanziamento Auto',
    category: 'Transport',
    amountType: 'fixed',
    amount: 299.99,
    invoices: [],
    recurrence: {
      type: 'monthly',
      interval: 1,
      day: 5
    },
    startDate: '2023-06-01',
    numberOfInstallments: 36,
    endDate: '2026-06-01',
    shared: false,
    participants: [],
    status: 'active',
    notes: 'Car loan, 36 monthly payments',
    attachments: []
  },
  {
    id: uuidv4(),
    name: 'Domain & Hosting',
    category: 'Technology',
    amountType: 'fixed',
    amount: 119.99,
    invoices: [],
    recurrence: {
      type: 'annual',
      interval: 1,
      day: 1
    },
    startDate: '2024-01-01',
    numberOfInstallments: null,
    endDate: null,
    shared: false,
    participants: [],
    status: 'active',
    notes: 'Website domain and hosting renewal',
    attachments: []
  }
];
