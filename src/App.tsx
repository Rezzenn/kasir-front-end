import React, { useState, useEffect } from 'react';
import api from './api';
import { Product, Category, CartItem, Sale, SummaryReport } from './types';
import { Navbar } from './components/Navbar';
import { PosView } from './components/PosView';
import { ProductsView } from './components/ProductsView';
import { HistoryView } from './components/HistoryView';
import { ReceiptModal } from './components/ReceiptModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<'pos' | 'products' | 'history'>('pos');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [summary, setSummary] = useState<SummaryReport>({
    total_omset: 0,
    total_transaksi: 0,
    total_barang_terjual: 0,
  });
  const [activeReceipt, setActiveReceipt] = useState<Sale | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/init');
      setProducts(res.data.products || []);
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error('Koneksi ke Laravel API gagal:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get('/history');
      setSales(res.data.sales || []);
      setSummary(res.data.summary || { total_omset: 0, total_transaksi: 0, total_barang_terjual: 0 });
    } catch (err) {
      console.error('Gagal memuat riwayat transaksi:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (activeTab === 'history') {
      loadHistory();
    }
  }, [activeTab]);

  const addToCart = (product: Product) => {
    if (product.stock <= 0) return alert('Stok produk habis!');

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        if (existing.qty >= product.stock) {
          alert('Jumlah belanja melebihi sisa stok produk!');
          return prev;
        }
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            if (newQty > item.stock) {
              alert('Stok barang tidak mencukupi!');
              return item;
            }
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => setCart([]);

  const handleCheckout = async (data: {
    customer_name: string;
    payment_method: 'cash' | 'qris' | 'transfer' | 'debit';
    discount: number;
    cash_paid: number;
  }) => {
    try {
      setLoading(true);
      const payload = {
        customer_name: data.customer_name,
        payment_method: data.payment_method,
        discount: data.discount,
        cash_paid: data.cash_paid,
        items: cart.map((c) => ({
          product_id: c.id,
          quantity: c.qty,
        })),
      };

      const res = await api.post('/checkout', payload);
      if (res.data.status === 'success') {
        clearCart();
        setActiveReceipt(res.data.sale);
        loadInitialData();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Transaksi gagal diproses oleh server!');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async (p: Partial<Product>) => {
    try {
      if (p.id) {
        await api.put(`/products/${p.id}`, p);
      } else {
        await api.post('/products', p);
      }
      loadInitialData();
      alert('Produk berhasil disimpan!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menyimpan produk');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      await api.delete(`/products/${id}`);
      loadInitialData();
    } catch (err: any) {
      alert('Gagal menghapus produk');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cart.reduce((sum, item) => sum + item.qty, 0)}
      />

      <main className="flex-1 pb-12">
        {activeTab === 'pos' && (
          <PosView
            products={products}
            categories={categories}
            cart={cart}
            addToCart={addToCart}
            updateQty={updateQty}
            removeFromCart={removeFromCart}
            clearCart={clearCart}
            onCheckout={handleCheckout}
            loading={loading}
          />
        )}

        {activeTab === 'products' && (
          <ProductsView
            products={products}
            categories={categories}
            onSaveProduct={handleSaveProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        )}

        {activeTab === 'history' && (
          <HistoryView
            sales={sales}
            summary={summary}
            onPrintReceipt={(sale) => setActiveReceipt(sale)}
          />
        )}
      </main>

      <ReceiptModal
        sale={activeReceipt}
        onClose={() => setActiveReceipt(null)}
      />
    </div>
  );
}