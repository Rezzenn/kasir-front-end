import React, { useState } from "react";
import { Product, Category } from "../types";
import { Plus, Edit3, Trash2, X, Save, Search } from "lucide-react";

interface ProductsViewProps {
    products: Product[];
    categories: Category[];
    onSaveProduct: (p: Partial<Product>) => Promise<void>;
    onDeleteProduct: (id: number) => Promise<void>;
}

export const ProductsView: React.FC<ProductsViewProps> = ({
    products,
    categories,
    onSaveProduct,
    onDeleteProduct,
}) => {
    const [search, setSearch] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const [form, setForm] = useState({
        code: "",
        name: "",
        category_id: "",
        buy_price: "",
        sell_price: "",
        stock: "",
    });

    const handleOpenAdd = () => {
        setEditingProduct(null);
        setForm({
            code: `BRG-${Date.now().toString().slice(-4)}`,
            name: "",
            category_id: categories[0]?.id ? String(categories[0].id) : "1",
            buy_price: "",
            sell_price: "",
            stock: "",
        });
        setModalOpen(true);
    };

    const handleOpenEdit = (p: Product) => {
        setEditingProduct(p);
        setForm({
            code: p.code,
            name: p.name,
            category_id: String(p.category_id),
            buy_price: String(p.buy_price),
            sell_price: String(p.sell_price),
            stock: String(p.stock),
        });
        setModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSaveProduct({
            ...(editingProduct ? { id: editingProduct.id } : {}),
            code: form.code,
            name: form.name,
            category_id: Number(form.category_id),
            buy_price: Number(form.buy_price) || 0,
            sell_price: Number(form.sell_price) || 0,
            stock: Number(form.stock) || 0,
        });
        setModalOpen(false);
    };

    const filtered = products.filter(
        (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.code.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
                <div>
                    <h2 className="text-lg font-black text-slate-900">
                        Manajemen Produk
                    </h2>
                    <p className="text-xs text-slate-500">
                        Kelola master harga jual, modal, dan stok produk.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari produk..."
                            className="pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-emerald-500"
                        />
                    </div>
                    <button
                        onClick={handleOpenAdd}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Produk
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-700">
                        <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                            <tr>
                                <th className="py-3 px-4">Kode</th>
                                <th className="py-3 px-4">Nama Produk</th>
                                <th className="py-3 px-4">Kategori</th>
                                <th className="py-3 px-4">Harga Beli</th>
                                <th className="py-3 px-4">Harga Jual</th>
                                <th className="py-3 px-4">Stok</th>
                                <th className="py-3 px-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filtered.map((p) => (
                                <tr key={p.id} className="hover:bg-slate-50 transition">
                                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                                        {p.code}
                                    </td>
                                    <td className="py-3 px-4 font-bold text-slate-800">
                                        {p.name}
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="px-2 py-0.5 bg-slate-100 rounded text-[11px] font-semibold">
                                            {p.category?.name || "Umum"}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-slate-500">
                                        Rp {p.buy_price.toLocaleString("id-ID")}
                                    </td>
                                    <td className="py-3 px-4 font-black text-emerald-700">
                                        Rp {p.sell_price.toLocaleString("id-ID")}
                                    </td>
                                    <td className="py-3 px-4">
                                        <span
                                            className={`px-2 py-0.5 rounded font-bold text-[11px] ${p.stock <= 5
                                                    ? "bg-rose-100 text-rose-700"
                                                    : "bg-emerald-50 text-emerald-700"
                                                }`}
                                        >
                                            {p.stock}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-right space-x-1">
                                        <button
                                            onClick={() => handleOpenEdit(p)}
                                            className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (confirm(`Hapus produk "${p.name}"?`))
                                                    onDeleteProduct(p.id);
                                            }}
                                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {modalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                            <h3 className="font-black text-sm text-slate-900">
                                {editingProduct ? "Edit Produk" : "Tambah Produk Baru"}
                            </h3>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="p-1 text-slate-400 hover:text-slate-700"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="font-bold text-slate-600 block mb-1">
                                        Kode Barcode
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={form.code}
                                        onChange={(e) => setForm({ ...form, code: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="font-bold text-slate-600 block mb-1">
                                        Kategori
                                    </label>
                                    <select
                                        value={form.category_id}
                                        onChange={(e) =>
                                            setForm({ ...form, category_id: e.target.value })
                                        }
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                                    >
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="font-bold text-slate-600 block mb-1">
                                    Nama Produk
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="font-bold text-slate-600 block mb-1">
                                        Harga Beli / Modal
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        value={form.buy_price}
                                        onChange={(e) =>
                                            setForm({ ...form, buy_price: e.target.value })
                                        }
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200"
                                    />
                                </div>
                                <div>
                                    <label className="font-bold text-slate-600 block mb-1">
                                        Harga Jual
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        value={form.sell_price}
                                        onChange={(e) =>
                                            setForm({ ...form, sell_price: e.target.value })
                                        }
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-emerald-700"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="font-bold text-slate-600 block mb-1">
                                    Stok Awal
                                </label>
                                <input
                                    type="number"
                                    required
                                    value={form.stock}
                                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                                />
                            </div>

                            <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
                                >
                                    <Save className="w-4 h-4" />
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
