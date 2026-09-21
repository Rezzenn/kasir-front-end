import React, { useState } from "react";
import { Product, Category, CartItem } from "../types";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  CreditCard,
  Banknote,
  QrCode,
} from "lucide-react";

interface PosViewProps {
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  addToCart: (p: Product) => void;
  updateQty: (id: number, delta: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  onCheckout: (data: {
    customer_name: string;
    payment_method: "cash" | "qris" | "transfer" | "debit";
    discount: number;
    cash_paid: number;
  }) => Promise<void>;
  loading: boolean;
}

export const PosView: React.FC<PosViewProps> = ({
  products,
  categories,
  cart,
  addToCart,
  updateQty,
  removeFromCart,
  clearCart,
  onCheckout,
  loading,
}) => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | "all">(
    "all",
  );
  const [paymentMethod, setPaymentMethod] = useState<
    "cash" | "qris" | "transfer" | "debit"
  >("cash");
  const [customerName, setCustomerName] = useState("Pelanggan Umum");
  const [discount, setDiscount] = useState<number>(0);
  const [cashPaid, setCashPaid] = useState<number>(0);

  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      selectedCategory === "all" || p.category_id === selectedCategory;
    return matchSearch && matchCategory;
  });

  const subtotal = cart.reduce(
    (sum, item) => sum + item.sell_price * item.qty,
    0,
  );
  const grandTotal = Math.max(0, subtotal - (Number(discount) || 0));
  const changeDue = Math.max(0, (Number(cashPaid) || 0) - grandTotal);

  const handleSubmitCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return alert("Keranjang belanja kosong!");
    if (paymentMethod === "cash" && (Number(cashPaid) || 0) < grandTotal) {
      return alert("Uang pembayaran kurang!");
    }

    onCheckout({
      customer_name: customerName,
      payment_method: paymentMethod,
      discount: Number(discount) || 0,
      cash_paid: paymentMethod === "cash" ? Number(cashPaid) || 0 : grandTotal,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Katalog Produk (8 Kolom) */}
      <div className="lg:col-span-7 xl:col-span-8 space-y-4">
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari produk / barcode..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:outline-emerald-500 font-medium"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === "all"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Semua Kategori
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  selectedCategory === c.id
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Produk */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {filteredProducts.map((p) => {
            const isOutOfStock = p.stock <= 0;
            return (
              <div
                key={p.id}
                onClick={() => !isOutOfStock && addToCart(p)}
                className={`bg-white rounded-3xl border border-slate-200 p-3.5 flex flex-col justify-between transition group shadow-xs ${
                  isOutOfStock
                    ? "opacity-60 cursor-not-allowed bg-slate-50"
                    : "cursor-pointer hover:border-emerald-500 hover:shadow-md"
                }`}
              >
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block">
                    {p.code}
                  </span>
                  <h3 className="text-xs font-bold text-slate-800 line-clamp-2 mt-0.5 group-hover:text-emerald-600">
                    {p.name}
                  </h3>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">
                      Harga
                    </span>
                    <span className="text-xs font-black text-emerald-700">
                      Rp {p.sell_price.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      isOutOfStock
                        ? "bg-rose-100 text-rose-700"
                        : "bg-slate-100 text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-700"
                    }`}
                  >
                    {isOutOfStock ? "Habis" : `Stok ${p.stock}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Keranjang Kasir (4 Kolom) */}
      <div className="lg:col-span-5 xl:col-span-4">
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs sticky top-20 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-slate-800 font-black text-sm">
              <ShoppingCart className="w-4 h-4 text-emerald-600" />
              <span>Keranjang ({cart.reduce((s, i) => s + i.qty, 0)})</span>
            </div>
            {cart.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="text-[11px] font-bold text-rose-600 hover:underline"
              >
                Kosongkan
              </button>
            )}
          </div>

          <div className="max-h-56 overflow-y-auto space-y-2.5 pr-1 divide-y divide-slate-100">
            {cart.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                Klik produk di katalog untuk menambahkan pesanan.
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="pt-2 first:pt-0 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-slate-800 truncate">
                      {item.name}
                    </h4>
                    <div className="text-[10px] text-slate-400">
                      Rp {item.sell_price.toLocaleString("id-ID")}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => updateQty(item.id, -1)}
                      className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-slate-800">
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQty(item.id, 1)}
                      className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 ml-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Form Pembayaran */}
          <form
            onSubmit={handleSubmitCheckout}
            className="space-y-3 pt-2 border-t border-slate-100 text-xs"
          >
            <div>
              <label className="font-bold text-slate-600 block mb-1">
                Nama Pembeli
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-600 block mb-1">
                Metode Bayar
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "cash", label: "Tunai", icon: Banknote },
                  { id: "qris", label: "QRIS", icon: QrCode },
                  { id: "transfer", label: "Transfer", icon: CreditCard },
                  { id: "debit", label: "Debit", icon: CreditCard },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`py-2 px-2.5 rounded-xl border text-[11px] font-bold flex items-center justify-center gap-1.5 transition ${
                      paymentMethod === m.id
                        ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <m.icon className="w-3.5 h-3.5" />
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-600 block mb-1">
                  Diskon (Rp)
                </label>
                <input
                  type="number"
                  min="0"
                  value={discount || ""}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  placeholder="0"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              {paymentMethod === "cash" && (
                <div>
                  <label className="font-bold text-slate-600 block mb-1">
                    Uang Diterima
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={cashPaid || ""}
                    onChange={(e) => setCashPaid(Number(e.target.value))}
                    placeholder="50000"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-emerald-700"
                  />
                </div>
              )}
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
              <div className="flex justify-between text-slate-500 text-xs">
                <span>Subtotal</span>
                <span>Rp {subtotal.toLocaleString("id-ID")}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-rose-600 text-xs font-semibold">
                  <span>Diskon</span>
                  <span>-Rp {Number(discount).toLocaleString("id-ID")}</span>
                </div>
              )}
              <div className="flex justify-between font-black text-sm text-slate-900 pt-1 border-t border-slate-200">
                <span>Total Tagihan</span>
                <span className="text-emerald-700">
                  Rp {grandTotal.toLocaleString("id-ID")}
                </span>
              </div>
              {paymentMethod === "cash" && cashPaid > 0 && (
                <div className="flex justify-between font-bold text-xs text-slate-700 pt-1">
                  <span>Kembalian</span>
                  <span
                    className={
                      changeDue >= 0 ? "text-emerald-600" : "text-rose-600"
                    }
                  >
                    Rp {changeDue.toLocaleString("id-ID")}
                  </span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || cart.length === 0}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-black rounded-2xl text-xs transition shadow-md shadow-emerald-600/20 cursor-pointer disabled:cursor-not-allowed"
            >
              {loading
                ? "Menyimpan..."
                : `Selesaikan Transaksi (Rp ${grandTotal.toLocaleString("id-ID")})`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
