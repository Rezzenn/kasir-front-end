export interface Category {
    id: number;
    name: string;
    slug: string;
}

export interface Product {
    id: number;
    category_id: number;
    code: string;
    name: string;
    buy_price: number;
    sell_price: number;
    stock: number;
    min_stock: number;
    image?: string;
    category?: Category;
}

export interface CartItem {
    id: number;
    code: string;
    name: string;
    sell_price: number;
    buy_price: number;
    stock: number;
    qty: number;
}

export interface SaleDetail {
    id?: number;
    product_id: number;
    product_code: string;
    product_name: string;
    buy_price: number;
    sell_price: number;
    quantity: number;
    subtotal: number;
}

export interface Sale {
    id: number;
    invoice_no: string;
    total_items: number;
    subtotal: number;
    tax: number;
    discount: number;
    grand_total: number;
    cash_paid: number;
    change_due: number;
    payment_method: 'cash' | 'qris' | 'transfer' | 'debit';
    notes?: string;
    created_at: string;
    details?: SaleDetail[];
}

export interface SummaryReport {
    total_omset: number;
    total_transaksi: number;
    total_barang_terjual: number;
}