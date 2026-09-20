import React from "react";
import { ShoppingBag, Package, History, Store } from "lucide-react";

interface NavbarProps {
  activeTab: "pos" | "products" | "history";
  setActiveTab: (tab: "pos" | "products" | "history") => void;
  cartCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 font-bold">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight text-slate-900 leading-tight">
                SMAKENSA MART
              </h1>
              <span className="text-[11px] font-semibold text-emerald-600">
                Sistem Kasir Toko Sekolah
              </span>
            </div>
          </div>

          <nav className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("pos")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === "pos"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Kasir POS</span>
              {cartCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white text-emerald-700 text-[10px] font-black">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("products")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === "products"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Produk</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("history")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === "history"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <History className="w-4 h-4" />
              <span>Riwayat</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
