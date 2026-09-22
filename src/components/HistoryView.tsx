import React, { useState } from "react";
import { Sale, SummaryReport } from "../types";
import { History, Receipt, Search } from "lucide-react";

interface HistoryViewProps {
    sales: Sale[];
    summary: SummaryReport;
    onPrintReceipt: (sale: Sale) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
    sales,
    summary,
    onPrintReceipt,
}) => {
    const [search, setSearch] = useState("");

    const filteredSales = sales.filter(
        (s) =>
            s.invoice_no.toLowerCase().includes(search.toLowerCase()) ||
            (s.notes && s.notes.toLowerCase().includes(search.toLowerCase())),
    );

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
            {/* Ringkasan Omset */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Total Pendapatan
                    </span>
                    <div className="text-2xl font-black text-emerald-700 mt-1">
                        Rp {(summary?.total_omset || 0).toLocaleString("id-ID")}
                    </div>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Total Transaksi
                    </span>
                    <div className="text-2xl font-black text-slate-900 mt-1">
                        {summary?.total_transaksi || 0} Faktur
                    </div>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Barang Terjual
                    </span>
                    <div className="text-2xl font-black text-slate-900 mt-1">
                        {summary?.total_barang_terjual || 0} Item
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
                <div>
                    <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                        <History className="w-5 h-5 text-emerald-600" />
                        Riwayat Penjualan Kasir
                    </h2>
                    <p className="text-xs text-slate-500">
                        Daftar transaksi tersimpan di database MySQL.
                    </p>
                </div>

                <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari no faktur..."
                        className="pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-emerald-500"
                    />
                </div>
            </div>

            <div className="space-y-3">
                {filteredSales.map((s) => (
                    <div
                        key={s.id}
                        className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-slate-900 text-sm">
                                    {s.invoice_no}
                                </span>
                                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] uppercase font-bold">
                                    {s.payment_method}
                                </span>
                            </div>
                            <div className="text-xs text-slate-500">
                                Waktu:{" "}
                                <strong>
                                    {new Date(s.created_at).toLocaleString("id-ID")}
                                </strong>{" "}
                                • {s.notes || "Pelanggan Umum"}
                            </div>
                            <div className="text-xs text-slate-600 pt-1">
                                {s.details
                                    ?.map((d) => `${d.product_name} (${d.quantity}x)`)
                                    .join(", ")}
                            </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-4 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                            <div className="text-right">
                                <span className="text-[10px] text-slate-400 block font-semibold">
                                    Total Transaksi
                                </span>
                                <span className="font-black text-emerald-700 text-base">
                                    Rp {s.grand_total.toLocaleString("id-ID")}
                                </span>
                            </div>

                            <button
                                onClick={() => onPrintReceipt(s)}
                                className="px-4 py-2 bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 font-bold rounded-xl text-xs transition flex items-center gap-1.5"
                            >
                                <Receipt className="w-4 h-4" />
                                Cetak Struk
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
