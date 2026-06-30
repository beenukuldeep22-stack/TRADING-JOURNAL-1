export interface Trade {
  id: number;
  pair: string;
  dir: 'Buy' | 'Sell';
  entry: number;
  exit: number;
  lots: number;
  date: string;
  pnl: number;
  status: 'Win' | 'Loss' | 'Open';
  note: string;
  photo: string | null;
}

export interface TradingNote {
  id: number;
  text: string;
  date: string;
}
