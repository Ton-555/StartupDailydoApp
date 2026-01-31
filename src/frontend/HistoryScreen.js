import React from 'react';
import { Header } from '../components/UI';
import { Clock, ChevronRight } from 'lucide-react';

const HistoryScreen = ({ navigate }) => {
  const history = [
    { id: 'ORD001', name: "น้ำดื่ม x2", date: "31 Jan 2026", coins: 20 },
    { id: 'ORD002', name: "Premium Package", date: "01 Jan 2026", coins: 500 }
  ];

  return (
    <div className="bg-zinc-50 min-h-full pb-24">
      <Header title="ประวัติการสั่งซื้อ" />
      <div className="p-4 space-y-3">
        {history.map(h => (
          <button key={h.id} className="w-full bg-white p-4 rounded-xl flex items-center justify-between border border-zinc-100">
            <div className="text-left">
              <p className="font-bold text-zinc-900">{h.name}</p>
              <p className="text-xs text-zinc-400 flex items-center gap-1"><Clock size={12}/> {h.date}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-red-500 font-bold">-{h.coins}</span>
              <ChevronRight size={16} className="text-zinc-300"/>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HistoryScreen;