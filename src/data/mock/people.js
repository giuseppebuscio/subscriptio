import { v4 as uuidv4 } from 'uuid';

export const mockPeople = [
  {
    id: uuidv4(),
    name: 'Mario Rossi',
    email: 'mario.rossi@email.com',
    phone: '+39 333 1234567',
    iban: 'IT60 X054 2811 1010 0000 0123 456',
    notes: 'Roommate, shares streaming services'
  },
  {
    id: uuidv4(),
    name: 'Lucia Bianchi',
    email: 'lucia.bianchi@email.com',
    phone: '+39 333 2345678',
    iban: 'IT60 X054 2811 1010 0000 0123 457',
    notes: 'Colleague, shares gym membership'
  },
  {
    id: uuidv4(),
    name: 'Paolo Verdi',
    email: 'paolo.verdi@email.com',
    phone: '+39 333 3456789',
    iban: 'IT60 X054 2811 1010 0000 0123 458',
    notes: 'Friend, shares energy bills'
  },
  {
    id: uuidv4(),
    name: 'Giulia Neri',
    email: 'giulia.neri@email.com',
    phone: '+39 333 4567890',
    iban: 'IT60 X054 2811 1010 0000 0123 459',
    notes: 'Sister, shares family subscriptions'
  },
  {
    id: uuidv4(),
    name: 'Owner',
    email: 'owner@subscriptio.com',
    phone: '+39 333 0000000',
    iban: 'IT60 X054 2811 1010 0000 0123 000',
    notes: 'App owner, manages all subscriptions'
  }
];
