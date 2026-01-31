import React, { useState } from 'react';
import { Header, MinimalButton } from '../components/UI';
import { CreditCard, Check } from 'lucide-react';

const PaymentScreen = ({ item, navigate }) => {
  const [isLinked, setIsLinked] = useState(false); // สถานะว่าเชื่อมบัตรหรือยัง

  return (
    <div className="bg-zinc-50 min-h-full pb-24">
      <Header title="ชำระเงิน" onBack={() => navigate('home')} />
      <div className="p-6">
        {!isLinked ? (
          /* 4.1 หน้าเชื่อมบัตรครั้งแรก */
          <div className="text-center">
            <CreditCard size={64} className="mx-auto mb-4 text-zinc-300" />
            <h3 className="font-bold text-lg mb-2">เชื่อมต่อบัตรเครดิต</h3>
            <p className="text-zinc-500 text-sm mb-6">เชื่อมต่อบัตรของคุณเพื่อความสะดวกในการรับ Coin</p>
            <MinimalButton fullWidth onClick={() => setIsLinked(true)}>เพิ่มบัตรเครดิต</MinimalButton>
          </div>
        ) : (
          /* หน้าชำระเงินหลัก */
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border-2 border-zinc-900">
               <p className="text-xs text-zinc-400 uppercase font-bold">บัตรที่เชื่อมต่อแล้ว</p>
               <p className="font-bold mt-1">•••• •••• •••• 4455</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-zinc-100">
              <div className="flex justify-between font-bold"><span>ยอดชำระ</span><span>{item?.price || '฿0'}</span></div>
              <p className="text-xs text-green-500 mt-2">* คุณจะได้รับ {item?.coins || 0} Coins หลังชำระเงิน</p>
            </div>
            <MinimalButton fullWidth onClick={() => { alert("ชำระเงินสำเร็จ!"); navigate('home'); }}>ยืนยันชำระเงิน</MinimalButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentScreen;