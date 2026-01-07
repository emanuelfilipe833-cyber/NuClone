
export interface Transaction {
  id: string;
  title: string;
  description: string;
  amount: number;
  date: string;
  type: 'pix' | 'transfer' | 'payment' | 'deposit';
  status: 'completed' | 'pending';
}

export enum ViewState {
  HOME = 'home',
  PIX_FLOW = 'pix_flow',
  SUCCESS = 'success',
  PROFILE = 'profile',
  ACCOUNT_DETAILS = 'account_details'
}
