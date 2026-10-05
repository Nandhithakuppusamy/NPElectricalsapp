import React, { createContext, useContext, useState, useEffect } from 'react';
import { CATEGORIES as INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_CUSTOMERS, INITIAL_BILLS } from '../data/initialData';
import { 
  categoryAPI, 
  productAPI, 
  customerAPI, 
  billingAPI, 
  authAPI,
  uploadAPI
} from '../services/api';

const ShopContext = createContext();

export function ShopProvider({ children }) {
  // Core Entities State
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [bills, setBills] = useState(INITIAL_BILLS);
  const [stats, setStats] = useState(null);

  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('np_user');
    return saved ? JSON.parse(saved) : null;
  });

  // UI & Cart State
  const [cart, setCart] = useState([]);
  const [currentTab, setCurrentTab] = useState('billing'); // 'billing' | 'customers' | 'stock' | 'sales'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastCompletedBill, setLastCompletedBill] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Loading & Error States
  const [loading, setLoading] = useState(false);
  const [backendConnected, setBackendConnected] = useState(false);

  // Initial Fetch from Backend MongoDB API
  const refreshAllData = async () => {
    try {
      setLoading(true);

      const [catRes, prodRes, custRes, billRes, statsRes] = await Promise.allSettled([
        categoryAPI.getAll(),
        productAPI.getAll(),
        customerAPI.getAll(),
        billingAPI.getHistory(),
        billingAPI.getStats()
      ]);

      if (catRes.status === 'fulfilled' && catRes.value.data.success) {
        setCategories(catRes.value.data.data);
        setBackendConnected(true);
      }
      if (prodRes.status === 'fulfilled' && prodRes.value.data.success) {
        setProducts(prodRes.value.data.data);
      }
      if (custRes.status === 'fulfilled' && custRes.value.data.success) {
        setCustomers(custRes.value.data.data);
      }
      if (billRes.status === 'fulfilled' && billRes.value.data.success) {
        setBills(billRes.value.data.data);
      }
      if (statsRes.status === 'fulfilled' && statsRes.value.data.success) {
        setStats(statsRes.value.data.data);
      }
    } catch (err) {
      console.warn('Backend sync failed, using local/cached state:', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Check login session & fetch data on mount
  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const token = localStorage.getItem('np_token');
      if (token) {
        try {
          const res = await authAPI.getMe();
          if (res.data.success) {
            setCurrentUser(res.data.data);
            localStorage.setItem('np_user', JSON.stringify(res.data.data));
          }
        } catch {
          // Token expired or invalid
          localStorage.removeItem('np_token');
          localStorage.removeItem('np_user');
          setCurrentUser(null);
        }
      }
      await refreshAllData();
    };

    checkAuthAndFetch();
  }, []);

  // Auth Functions
  const loginUser = async (username, password) => {
    try {
      const res = await authAPI.login({ username, password });
      if (res.data.success) {
        const { token, ...userData } = res.data.data;
        localStorage.setItem('np_token', token);
        localStorage.setItem('np_user', JSON.stringify(userData));
        setCurrentUser(userData);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('np_token');
    localStorage.removeItem('np_user');
    setCurrentUser(null);
  };

  // Cart operations
  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, qty: item.qty + quantity }
            : item
        );
      }
      return [...prev, { product, qty: quantity }];
    });
  };

  const updateCartQty = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, qty: newQty } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Cart total calculations
  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.qty,
    0
  );
  const cartTotalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  // Low stock products count
  const lowStockProducts = products.filter(p => (p.stockCount ?? p.stock) <= p.lowStockAlert);

  // Category CRUD operations (connected to MongoDB)
  const addNewCategory = async (categoryData) => {
    try {
      let finalImageUrl = categoryData.imageUrl || '';
      if (categoryData.imageFile) {
        try {
          const upRes = await uploadAPI.uploadImage(categoryData.imageFile);
          if (upRes.data.success) {
            finalImageUrl = upRes.data.imageUrl;
          }
        } catch (upErr) {
          console.warn('Category image upload warning:', upErr);
        }
      }

      const payload = { ...categoryData, imageUrl: finalImageUrl };
      delete payload.imageFile;

      const res = await categoryAPI.create(payload);
      if (res.data.success) {
        setCategories(prev => [...prev, res.data.data]);
        return res.data.data;
      }
    } catch (err) {
      console.error('Failed to add category via API:', err);
      // Fallback local addition
      const newCat = {
        id: categoryData.name.toLowerCase().trim().replace(/[^a-z0-9]/g, '_') || `cat_${Date.now()}`,
        name: categoryData.name.trim(),
        tamilName: categoryData.tamilName || categoryData.name,
        icon: categoryData.icon || 'Package',
        sizesPreview: categoryData.sizesPreview || 'All Sizes Available',
        color: categoryData.color || 'from-blue-600 to-indigo-700',
        imageUrl: categoryData.imageUrl || ''
      };
      setCategories(prev => [...prev, newCat]);
      return newCat;
    }
  };

  const updateCategory = async (categoryId, categoryData) => {
    try {
      let finalImageUrl = categoryData.imageUrl;
      if (categoryData.imageFile) {
        try {
          const upRes = await uploadAPI.uploadImage(categoryData.imageFile);
          if (upRes.data.success) {
            finalImageUrl = upRes.data.imageUrl;
          }
        } catch (upErr) {
          console.warn('Category image upload warning:', upErr);
        }
      }

      const payload = { ...categoryData };
      if (finalImageUrl !== undefined) payload.imageUrl = finalImageUrl;
      delete payload.imageFile;

      const res = await categoryAPI.update(categoryId, payload);
      if (res.data.success) {
        setCategories(prev => prev.map(c => c.id === categoryId ? res.data.data : c));
      }
    } catch (err) {
      console.error('Failed to update category via API:', err);
      setCategories(prev => prev.map(c => c.id === categoryId ? { ...c, ...categoryData } : c));
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      await categoryAPI.delete(categoryId);
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
      setProducts(prev => prev.filter(p => p.categoryId !== categoryId && p.category !== categoryId));
      if (selectedCategory === categoryId) {
        setSelectedCategory(null);
      }
    } catch (err) {
      console.error('Failed to delete category via API:', err);
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
      setProducts(prev => prev.filter(p => p.categoryId !== categoryId && p.category !== categoryId));
      if (selectedCategory === categoryId) {
        setSelectedCategory(null);
      }
    }
  };

  // Product CRUD operations (connected to MongoDB)
  const addNewProduct = async (productData) => {
    try {
      let finalImageUrl = productData.imageUrl || '';
      if (productData.imageFile) {
        try {
          const upRes = await uploadAPI.uploadImage(productData.imageFile);
          if (upRes.data.success) {
            finalImageUrl = upRes.data.imageUrl;
          }
        } catch (upErr) {
          console.warn('Product image upload warning:', upErr);
        }
      }

      const payload = { ...productData, imageUrl: finalImageUrl };
      delete payload.imageFile;

      const res = await productAPI.create(payload);
      if (res.data.success) {
        setProducts(prev => [res.data.data, ...prev]);
        return res.data.data;
      }
    } catch (err) {
      console.error('Failed to add product via API:', err);
      const newProd = {
        id: `prod_${productData.categoryId || productData.category}_${Date.now()}`,
        categoryId: productData.categoryId || productData.category,
        name: productData.name.trim(),
        size: productData.size.trim(),
        price: parseFloat(productData.price) || 0,
        stockCount: parseInt(productData.stockCount || productData.stock) || 0,
        lowStockAlert: parseInt(productData.lowStockAlert) || 5,
        unit: productData.unit || 'piece',
        imageUrl: productData.imageUrl || ''
      };
      setProducts(prev => [newProd, ...prev]);
      return newProd;
    }
  };

  const updateProduct = async (productId, productData) => {
    try {
      let finalImageUrl = productData.imageUrl;
      if (productData.imageFile) {
        try {
          const upRes = await uploadAPI.uploadImage(productData.imageFile);
          if (upRes.data.success) {
            finalImageUrl = upRes.data.imageUrl;
          }
        } catch (upErr) {
          console.warn('Product image upload warning:', upErr);
        }
      }

      const payload = { ...productData };
      if (finalImageUrl !== undefined) payload.imageUrl = finalImageUrl;
      delete payload.imageFile;

      const res = await productAPI.update(productId, payload);
      if (res.data.success) {
        setProducts(prev => prev.map(p => p.id === productId ? res.data.data : p));
      }
    } catch (err) {
      console.error('Failed to update product via API:', err);
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, ...productData } : p));
    }
  };

  const quickAddStock = async (productId, delta) => {
    try {
      const res = await productAPI.updateStock(productId, { delta });
      if (res.data.success) {
        setProducts(prev => prev.map(p => p.id === productId ? res.data.data : p));
      }
    } catch (err) {
      console.error('Failed to update stock via API:', err);
      setProducts(prev => prev.map(p => {
        if (p.id === productId) {
          const curr = p.stockCount ?? p.stock;
          return { ...p, stockCount: curr + delta, stock: curr + delta };
        }
        return p;
      }));
    }
  };

  const updateProductStock = async (productId, newStock) => {
    try {
      const res = await productAPI.updateStock(productId, { newStock });
      if (res.data.success) {
        setProducts(prev => prev.map(p => p.id === productId ? res.data.data : p));
      }
    } catch (err) {
      console.error('Failed to update stock via API:', err);
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, stockCount: parseInt(newStock) || 0, stock: parseInt(newStock) || 0 } : p));
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await productAPI.delete(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
      setCart(prev => prev.filter(item => item.product.id !== productId));
    } catch (err) {
      console.error('Failed to delete product via API:', err);
      setProducts(prev => prev.filter(p => p.id !== productId));
      setCart(prev => prev.filter(item => item.product.id !== productId));
    }
  };

  // Customer operations (connected to MongoDB)
  const addNewCustomer = async (customerData) => {
    try {
      const res = await customerAPI.create(customerData);
      if (res.data.success) {
        setCustomers(prev => [res.data.data, ...prev]);
        return res.data.data;
      }
    } catch (err) {
      console.error('Failed to create customer via API:', err);
      const initialBal = parseFloat(customerData.initialBalance || customerData.balance) || 0;
      const newCust = {
        id: `cust_${Date.now()}`,
        name: customerData.name.trim(),
        phone: customerData.phone ? customerData.phone.trim() : '-',
        address: customerData.address ? customerData.address.trim() : '-',
        balance: initialBal,
        balanceOwed: initialBal,
        purchaseHistory: initialBal > 0 ? [{
          billId: customerData.billId || `PAST-${Math.floor(1000 + Math.random() * 9000)}`,
          date: customerData.purchaseDate ? new Date(customerData.purchaseDate) : new Date(),
          amount: initialBal,
          paymentType: 'Credit',
          items: customerData.itemsDescription || 'Pazhaiya Kadan (Previous Purchase Record)',
          status: 'PENDING'
        }] : [],
        settledHistory: []
      };
      setCustomers(prev => [newCust, ...prev]);
      return newCust;
    }
  };

  const addPastCreditToCustomer = async (customerId, creditData) => {
    try {
      const res = await customerAPI.addPastCredit(customerId, creditData);
      if (res.data.success) {
        setCustomers(prev => prev.map(c => c.id === customerId ? res.data.data : c));
      }
    } catch (err) {
      console.error('Failed to add past credit via API:', err);
      const amt = parseFloat(creditData.amount) || 0;
      setCustomers(prev => prev.map(c => {
        if (c.id === customerId) {
          const newEntry = {
            billId: creditData.billId || `PAST-${Math.floor(1000 + Math.random() * 9000)}`,
            date: creditData.purchaseDate ? new Date(creditData.purchaseDate) : new Date(),
            items: creditData.itemsDescription || 'Pazhaiya Kadan (Past Purchase)',
            amount: amt,
            status: 'PENDING'
          };
          return {
            ...c,
            balance: (c.balance || 0) + amt,
            balanceOwed: (c.balance || 0) + amt,
            purchaseHistory: [newEntry, ...(c.purchaseHistory || [])]
          };
        }
        return c;
      }));
    }
  };

  const updateCustomer = async (customerId, customerData) => {
    try {
      const res = await customerAPI.update(customerId, customerData);
      if (res.data.success) {
        setCustomers(prev => prev.map(c => c.id === customerId ? res.data.data : c));
      }
    } catch (err) {
      console.error('Failed to update customer via API:', err);
      setCustomers(prev => prev.map(c => c.id === customerId ? { ...c, ...customerData } : c));
    }
  };

  const deleteCustomer = async (customerId) => {
    try {
      await customerAPI.delete(customerId);
      setCustomers(prev => prev.filter(c => c.id !== customerId));
    } catch (err) {
      console.error('Failed to delete customer via API:', err);
      setCustomers(prev => prev.filter(c => c.id !== customerId));
    }
  };

  const settleCustomerCredit = async ({ customerId, amountPaid, paymentMode, notes }) => {
    try {
      const res = await customerAPI.settle(customerId, {
        amount: amountPaid,
        paymentMode: paymentMode || 'Cash',
        notes
      });
      if (res.data.success) {
        setCustomers(prev => prev.map(c => c.id === customerId ? res.data.data.customer : c));
        if (res.data.data.receipt) {
          setBills(prev => [res.data.data.receipt, ...prev]);
        }
        return true;
      }
    } catch (err) {
      console.error('Failed to settle customer balance via API:', err);
      // Fallback local update
      const numPaid = parseFloat(amountPaid) || 0;
      setCustomers(prev => prev.map(c => {
        if (c.id === customerId) {
          const newBal = Math.max(0, (c.balance || c.balanceOwed || 0) - numPaid);
          const newSettle = {
            id: `settle_${Date.now()}`,
            amount: numPaid,
            date: new Date(),
            paymentMode: paymentMode || 'Cash',
            notes: notes || 'Kadan Baaki Vasool'
          };
          return {
            ...c,
            balance: newBal,
            balanceOwed: newBal,
            settledHistory: [newSettle, ...(c.settledHistory || [])]
          };
        }
        return c;
      }));
      return true;
    }
  };

  // Checkout Bill (connected to MongoDB)
  const checkoutBill = async ({
    customerName,
    customerPhone,
    customerAddress,
    paymentMode,
    notes = ''
  }) => {
    const pType = paymentMode === 'Credit' ? 'Credit' : (paymentMode === 'UPI' ? 'UPI' : 'Cash');
    const billPayload = {
      items: cart.map(i => ({
        productId: i.product.id,
        id: i.product.id,
        name: i.product.name,
        size: i.product.size,
        price: i.product.price,
        qty: i.qty,
        total: i.product.price * i.qty,
        unit: i.product.unit || 'piece'
      })),
      paymentType: pType,
      paymentMode: pType,
      customerName: customerName.trim() || 'Walk-in Customer (நேரடி வாடிக்கையாளர்)',
      customerPhone: customerPhone.trim() || (pType === 'Credit' ? 'Credit Customer' : 'Walk-in'),
      customerAddress: customerAddress.trim() || '',
      notes: notes || (pType === 'Credit' ? 'Credit (Kadan) Bill' : 'Amount Settled')
    };

    try {
      const res = await billingAPI.checkout(billPayload);
      if (res.data.success) {
        const createdBill = res.data.data;
        setBills(prev => [createdBill, ...prev]);

        // Refresh products & customers from backend to get updated stock and balances
        await refreshAllData();

        setCart([]);
        setLastCompletedBill(createdBill);
        setShowReceiptModal(true);
        return createdBill;
      }
    } catch (err) {
      console.error('Failed to checkout bill via API:', err);
      // Fallback local bill recording
      const fallbackBill = {
        id: `BILL-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: billPayload.customerName,
        customerPhone: billPayload.customerPhone,
        customerAddress: billPayload.customerAddress,
        items: billPayload.items,
        amount: cartSubtotal,
        total: cartSubtotal,
        paymentType: pType,
        paymentMode: pType,
        date: new Date().toISOString(),
        isSettled: pType !== 'Credit',
        notes: billPayload.notes
      };

      setBills(prev => [fallbackBill, ...prev]);
      setCart([]);
      setLastCompletedBill(fallbackBill);
      setShowReceiptModal(true);
      return fallbackBill;
    }
  };

  const value = {
    categories,
    products,
    customers,
    bills,
    stats,
    cart,
    currentTab,
    setCurrentTab,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    lowStockProducts,
    lastCompletedBill,
    setLastCompletedBill,
    showReceiptModal,
    setShowReceiptModal,
    isAuthModalOpen,
    setIsAuthModalOpen,
    currentUser,
    loading,
    backendConnected,
    refreshAllData,
    // Auth
    loginUser,
    logoutUser,
    // Cart actions
    addToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartTotalItems,
    checkoutBill,
    // Category actions
    addNewCategory,
    updateCategory,
    deleteCategory,
    // Product actions
    addNewProduct,
    updateProduct,
    quickAddStock,
    updateProductStock,
    deleteProduct,
    // Customer actions
    addNewCustomer,
    addPastCreditToCustomer,
    updateCustomer,
    deleteCustomer,
    settleCustomerCredit
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}
