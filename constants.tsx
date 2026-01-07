
import { Transaction } from './types';

export const NU_PURPLE = '#820ad1';
export const NU_DARK = '#000000';
export const NU_GRAY = '#1a1a1a';
export const NU_LIGHT_GRAY = '#f5f5f5';

export const INITIAL_BALANCE = 10534.69;

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    title: 'Transferência enviada',
    description: 'Marina Silva',
    amount: -150.00,
    date: 'Hoje',
    type: 'pix',
    status: 'completed'
  },
  {
    id: '2',
    title: 'Pagamento de fatura',
    description: 'Cartão Nubank',
    amount: -1245.90,
    date: 'Ontem',
    type: 'payment',
    status: 'completed'
  },
  {
    id: '3',
    title: 'Transferência recebida',
    description: 'João Souza',
    amount: 500.00,
    date: '22 MAI',
    type: 'pix',
    status: 'completed'
  }
];
