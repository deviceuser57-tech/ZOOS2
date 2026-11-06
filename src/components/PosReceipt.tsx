import React from 'react';
import { Printer, X } from 'lucide-react';
import { PosSaleRecord } from '../types';
import { useStore } from '../context/StoreContext';

interface PosReceiptProps {
  sale: PosSaleRecord;
  onClose: () => void;
}

export const PosReceipt: React.FC<PosReceiptProps> = ({ sale, onClose }) => {
  const { lang, formatPrice } = useStore();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 print:p-0 print:bg-white print:relative">
      <div className="bg-white text-slate-950 p-8 rounded-2xl max-w-sm w-full space-y-6 font-mono shadow-2xl text-[11px] print:shadow-none print:w-full print:max-w-none print:rounded-none">
        
        {/* Header */}
        <div className="text-center space-y-1.5 border-b border-slate-200 pb-4">
          <h3 className="font-black text-lg tracking-widest uppercase">ZOOS ELECTRONICS</h3>
          <p className="text-[10px] text-slate-600 font-bold">X-Mall Partition · New Cairo</p>
          <div className="flex flex-col gap-0.5 text-[9px] text-slate-500">
            <span>Tax ID: 622-990-142</span>
            <span>Tel: +20 100 000 0000</span>
          </div>
          <div className="mt-2 inline-block px-3 py-1 bg-slate-950 text-white rounded text-[10px] font-black uppercase">
            Official POS Receipt
          </div>
        </div>

        {/* Info */}
        <div className="space-y-1 border-b border-slate-100 pb-4">
          <div className="flex justify-between">
            <span className="text-slate-500">Receipt #:</span>
            <span className="font-bold">{sale.receiptNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Date:</span>
            <span>{new Date(sale.timestamp).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Time:</span>
            <span>{new Date(sale.timestamp).toLocaleTimeString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Cashier:</span>
            <span>{sale.cashierName}</span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-slate-500">Payment:</span>
            <span className="bg-slate-100 px-2 py-0.5 rounded font-black text-[10px] uppercase">{sale.paymentMethod}</span>
          </div>
        </div>

        {/* Items */}
        <div className="space-y-3 py-2">
          <div className="flex justify-between font-black text-[9px] text-slate-400 uppercase border-b border-slate-50 pb-1">
            <span>Description</span>
            <span>Total</span>
          </div>
          {sale.items.map((it, idx) => (
            <div key={idx} className="space-y-0.5">
              <div className="flex justify-between font-bold">
                <span className="truncate pr-4">{it.product.titleEn}</span>
                <span className="shrink-0">{formatPrice(it.unitPriceUSD * it.quantity)}</span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>{it.quantity} x {formatPrice(it.unitPriceUSD)}</span>
                <span className="font-mono text-[9px]">{it.product.sku}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t-2 border-dashed border-slate-200 pt-4 space-y-2">
          <div className="flex justify-between text-xs font-black">
            <span>SUBTOTAL:</span>
            <span>{formatPrice(sale.totalUSD / 1.15)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span>VAT (15%):</span>
            <span>{formatPrice(sale.totalUSD - (sale.totalUSD / 1.15))}</span>
          </div>
          <div className="flex justify-between text-base font-black border-t-2 border-slate-900 pt-2 mt-2">
            <span>TOTAL PAID:</span>
            <span>{formatPrice(sale.totalUSD)}</span>
          </div>
        </div>

        {/* Footer Barcode */}
        <div className="pt-4 text-center space-y-2">
          <div className="h-10 bg-slate-950 rounded flex items-center justify-center tracking-[0.5em] text-white text-xs overflow-hidden">
            ||| || | |||| || | || |||| | ||| |
          </div>
          <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">
            {sale.id}
          </p>
          <div className="pt-2">
            <p className="text-[10px] font-bold">Thank you for shopping at Zoos!</p>
            <p className="text-[9px] text-slate-500">14-Day Warranty applies with this receipt.</p>
          </div>
        </div>

        {/* Print Actions (Hidden when printing) */}
        <div className="flex gap-2 pt-6 print:hidden">
          <button
            onClick={handlePrint}
            className="flex-1 py-3 bg-slate-950 hover:bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>{lang === 'ar' ? 'طباعة الإيصال الفوري' : 'Print Thermal Receipt'}</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-950 rounded-xl font-bold text-xs active:scale-95 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
