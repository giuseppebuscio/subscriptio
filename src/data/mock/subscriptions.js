import { v4 as uuidv4 } from 'uuid';

export const mockSubscriptions = [
  {
    id: uuidv4(),
    name: 'Netflix',
    category: 'Streaming',
    amount: 19.99,
    invoices: [],
    recurrence: {
      type: 'monthly',
      interval: 1,
      day: 15
    },
    shared: true,
    participants: [
      { personId: 'person_1', shareType: 'percent', value: 25 },
      { personId: 'person_2', shareType: 'percent', value: 25 },
      { personId: 'person_3', shareType: 'percent', value: 25 }
    ],
    status: 'active',
    attachments: []
  },
  {
    id: uuidv4(),
    name: 'Spotify Premium',
    category: 'Music',
    amount: 9.99,
    invoices: [],
    recurrence: {
      type: 'monthly',
      interval: 1,
      day: 20
    },
    shared: true,
    participants: [
      { personId: 'person_1', shareType: 'percent', value: 33.33 },
      { personId: 'person_3', shareType: 'percent', value: 33.33 },
      { personId: 'person_4', shareType: 'percent', value: 33.34 }
    ],
    status: 'active',
    attachments: []
  },
  {
    id: uuidv4(),
    name: 'Energia Elettrica',
    category: 'Utilities',
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
    shared: true,
    participants: [
      { personId: 'person_1', shareType: 'percent', value: 40 },
      { personId: 'person_3', shareType: 'percent', value: 60 }
    ],
    status: 'active',
    attachments: []
  },
  {
    id: uuidv4(),
    name: 'Palestra Fitness',
    category: 'Health',
    amount: 89.99,
    invoices: [],
    recurrence: {
      type: 'annual',
      interval: 1,
      day: 1
    },
    shared: true,
    participants: [
      { personId: 'person_1', shareType: 'percent', value: 50 },
      { personId: 'person_2', shareType: 'percent', value: 50 }
    ],
    status: 'active',
    attachments: []
  },
  {
    id: uuidv4(),
    name: 'Finanziamento Auto',
    category: 'Transport',
    amount: 299.99,
    invoices: [],
    recurrence: {
      type: 'monthly',
      interval: 1,
      day: 5
    },
    shared: false,
    participants: [],
    status: 'active',
    attachments: []
  },
  {
    id: uuidv4(),
    name: 'Domain & Hosting',
    category: 'Technology',
    amount: 119.99,
    invoices: [],
    recurrence: {
      type: 'annual',
      interval: 1,
      day: 1
    },
    shared: false,
    participants: [],
    status: 'active',
    attachments: []
  }
];
