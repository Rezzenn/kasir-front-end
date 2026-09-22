import React from 'react';
import { Sale } from '../types';
import { Printer, X, CheckCircle } from 'lucide-react';

interface ReceiptModalProps {
    sale: Sale | null;
    onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ sale, onClose }) => {
    if (!sale) return null;

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs">
                        <CheckCircle className="w-4 h-4" />
                        <span>Transaksi Berhasil</span>
                    </div>
                    <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Format Cetak Struk Thermal */}
                <div className="receipt-paper bg-slate-50 border border-dashed border-slate-300 p-5 rounded-2xl font-mono text-[11px] text-slate-800 space-y-3">
                    <div className="text-center space-y-0.5">
                        <h3 className="font-black text-sm tracking-wider uppercase">TOKO BERKAH POS</h3>
                        <p className="text-[10px] text-slate-500">Jl. Raya Merdeka No. 45, Jakarta</p>
                        <p className="text-[10px] text-slate-500">Telp: 0812-3456-7890</p>
                    </div>

                    <div className="border-t border-b border-dashed border-slate-300 py-1.5 space-y-0.5 text-[10px]">
                        <div className="flex justify-between">
                            <span>No Faktur:</span>
                            <span className="font-bold">{sale.invoice_no}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Waktu:</span>
                            <span>{new Date(sale.created_at).toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Metode:</span>
                            <span className="uppercase font-bold">{sale.payment_method}</span>
                        </div>
                    </div>

                    <div className="space-y-1.5 pt-1">
                        {sale.details?.map((item, idx) => (
                            <div key={idx} className="space-y-0.5">
                                <div className="font-bold truncate">{item.product_name}</div>
                                <div className="flex justify-between text-slate-600 text-[10px]">
                                    <span>
                                        {item.quantity} x Rp {item.sell_price.toLocaleString('id-ID')}
                                    </span>
                                    <span className="font-bold">Rp {item.subtotal.toLocaleString('id-ID')}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-dashed border-slate-300 pt-2 space-y-1 text-xs">
                        <div className="flex justify-between text-slate-600">
                            <span>Subtotal:</span>
                            <span>Rp {sale.subtotal.toLocaleString('id-ID')}</span>
                        </div>
                        {sale.discount > 0 && (
                            <div className="flex justify-between text-rose-600">
                                <span>Diskon:</span>
                                <span>-Rp {sale.discount.toLocaleString('id-ID')}</span>
                            </div>
                        )}
                        <div className="flex justify-between font-black text-sm pt-1 border-t border-dashed border-slate-300">
                            <span>TOTAL:</span>
                            <span className="text-emerald-700">Rp {sale.grand_total.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between text-slate-600 text-[11px]">
                            <span>Bayar:</span>
                            <span>Rp {sale.cash_paid.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between text-slate-600 text-[11px]">
                            <span>Kembalian:</span>
                            <span>Rp {sale.change_due.toLocaleString('id-ID')}</span>
                        </div>
                    </div>

                    <div className="text-center pt-3 border-t border-dashed border-slate-300 text-[10px] text-slate-500 space-y-0.5">
                        <p>Terima kasih atas kunjungan Anda!</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => window.print()}
                        className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs"
                    >
                        <Printer className="w-4 h-4" />
                        Cetak Struk Thermal
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};