import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  categoryAPI, 
  productAPI, 
  customerAPI, 
  billingAPI 
} from '../config/api';
import { 
  INITIAL_CATEGORIES, 
  INITIAL_PRODUCTS, 
  INITIAL_CUSTOMERS 
} from '../data/initialData';

const ShopContext = createContext(null);

export const ShopProvider = ({ children }) => {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [bills, setBills] = useState([]);
  const [cart, setCart] = useState([]);
  
  // Loading & error states
  const [isLoading, setIsLoading] = useState(false);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Active view/filter state
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Sync with MongoDB backend on startup
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const [catRes, prodRes, custRes, billRes] = await Promise.allSettled([
        categoryAPI.getAll(),
        productAPI.getAll(),
        customerAPI.getAll(),
        billingAPI.getAll(),
      ]);

      let backendOk = false;

      if (catRes.status === 'fulfilled' && catRes.value.data?.success && catRes.value.data.data?.length > 0) {
        setCategories(catRes.value.data.data);
        backendOk = true;
      }
      if (prodRes.status === 'fulfilled' && prodRes.value.data?.success && prodRes.value.data.data?.length > 0) {
        setProducts(prodRes.value.data.data);
        backendOk = true;
      }
      if (custRes.status === 'fulfilled' && custRes.value.data?.success && custRes.value.data.data?.length > 0) {
        setCustomers(custRes.value.data.data);
        backendOk = true;
      }
      if (billRes.status === 'fulfilled' && billRes.value.data?.success && billRes.value.data.data?.length > 0) {
        setBills(billRes.value.data.data);
        backendOk = true;
      }

      setIsBackendConnected(backendOk);
    } catch (err) {
      console.warn('Backend sync failed, running in offline fallback mode:', err);
      setIsBackendConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Cart operations
  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, qty: item.qty + qty }
            : item
        );
      }
      return [...prev, { product, qty }];
    });
  };

  const updateCartQty = (productId, qty) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((item) => item.product.id !== productId));
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, qty } : item
        )
      );
    }
  };

  const clearCart = () => setCart([]);

  const cartTotalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.qty,
    0
  );

  // Category CRUD
  const addNewCategory = async (catData) => {
    try {
      const res = await categoryAPI.create(catData);
      if (res.data?.success) {
        setCategories((prev) => [...prev, res.data.data]);
        return res.data.data;
      }
    } catch (err) {
      console.warn('API error adding category:', err);
    }
    // Fallback local
    const newCat = {
      id: catData.name.toLowerCase().trim().replace(/[^a-z0-9]/g, '_') || `cat_${Date.now()}`,
      name: catData.name.trim(),
      tamilName: catData.tamilName || catData.name,
      sizesPreview: catData.sizesPreview || 'All Sizes Available',
      imageUrl: catData.imageUrl || ''
    };
    setCategories((prev) => [...prev, newCat]);
    return newCat;
  };

  const updateCategory = async (id, catData) => {
    try {
      const res = await categoryAPI.update(id, catData);
      if (res.data?.success) {
        setCategories((prev) => prev.map((c) => (c.id === id ? res.data.data : c)));
        return;
      }
    } catch (err) {
      console.warn('API error updating category:', err);
    }
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...catData } : c)));
  };

  const deleteCategory = async (id) => {
    try {
      await categoryAPI.delete(id);
    } catch (err) {
      console.warn('API error deleting category:', err);
    }
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setProducts((prev) => prev.filter((p) => p.categoryId !== id && p.category !== id));
    if (selectedCategory === id) setSelectedCategory(null);
  };

  // Product CRUD
  const addNewProduct = async (prodData) => {
    try {
      const res = await productAPI.create(prodData);
      if (res.data?.success) {
        setProducts((prev) => [res.data.data, ...prev]);
        return res.data.data;
      }
    } catch (err) {
      console.warn('API error adding product:', err);
    }
    const newProd = {
      id: `prod_${prodData.categoryId || prodData.category}_${Date.now()}`,
      categoryId: prodData.categoryId || prodData.category,
      category: prodData.categoryId || prodData.category,
      name: prodData.name.trim(),
      size: prodData.size.trim(),
      price: parseFloat(prodData.price) || 0,
      stockCount: parseInt(prodData.stockCount || prodData.stock) || 0,
      stock: parseInt(prodData.stockCount || prodData.stock) || 0,
      lowStockAlert: parseInt(prodData.lowStockAlert) || 5,
      unit: prodData.unit || 'piece',
      imageUrl: prodData.imageUrl || ''
    };
    setProducts((prev) => [newProd, ...prev]);
    return newProd;
  };

  const updateProduct = async (id, prodData) => {
    try {
      const res = await productAPI.update(id, prodData);
      if (res.data?.success) {
        setProducts((prev) => prev.map((p) => (p.id === id ? res.data.data : p)));
        return;
      }
    } catch (err) {
      console.warn('API error updating product:', err);
    }
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...prodData } : p)));
  };

  const updateProductStock = async (id, newStock) => {
    const stockVal = Math.max(0, parseInt(newStock) || 0);
    try {
      await productAPI.updateStock(id, stockVal);
    } catch (err) {
      console.warn('API error updating stock:', err);
    }
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, stock: stockVal, stockCount: stockVal } : p
      )
    );
  };

  const quickAddStock = async (id, amount) => {
    const prod = products.find((p) => p.id === id);
    if (!prod) return;
    const current = prod.stock ?? prod.stockCount ?? 0;
    const newStock = current + amount;
    await updateProductStock(id, newStock);
  };

  const deleteProduct = async (id) => {
    try {
      await productAPI.delete(id);
    } catch (err) {
      console.warn('API error deleting product:', err);
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((item) => item.product.id !== id));
  };

  // Customer Operations
  const addNewCustomer = async (custData) => {
    try {
      const res = await customerAPI.create(custData);
      if (res.data?.success) {
        setCustomers((prev) => [res.data.data, ...prev]);
        return res.data.data;
      }
    } catch (err) {
      console.warn('API error adding customer:', err);
    }
    const newCust = {
      id: `cust_${Date.now()}`,
      name: custData.name.trim(),
      phone: custData.phone || '-',
      address: custData.address || '-',
      balance: parseFloat(custData.balance) || 0,
      balanceOwed: parseFloat(custData.balance) || 0,
      purchaseHistory: [],
      settledHistory: []
    };
    setCustomers((prev) => [newCust, ...prev]);
    return newCust;
  };

  const settleCustomerPayment = async (customerId, amount, paymentMode = 'Cash', notes = '') => {
    const settleAmt = parseFloat(amount) || 0;
    if (settleAmt <= 0) return;

    try {
      const res = await customerAPI.settlePayment(customerId, {
        amount: settleAmt,
        paymentMode,
        notes: notes || `${paymentMode} Settlement`
      });
      if (res.data?.success) {
        setCustomers((prev) =>
          prev.map((c) => (c.id === customerId ? res.data.data : c))
        );
        return res.data.data;
      }
    } catch (err) {
      console.warn('API error settling payment:', err);
    }

    // Local fallback
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === customerId) {
          const newBal = Math.max(0, (c.balance ?? c.balanceOwed ?? 0) - settleAmt);
          const historyEntry = {
            id: `settle_${Date.now()}`,
            amount: settleAmt,
            date: new Date().toISOString(),
            paymentMode,
            notes: notes || `${paymentMode} Settle seiyappattadhu`
          };
          return {
            ...c,
            balance: newBal,
            balanceOwed: newBal,
            settledHistory: [historyEntry, ...(c.settledHistory || [])]
          };
        }
        return c;
      })
    );
  };

  const addCustomerCredit = async (customerId, amount, items = [], notes = '') => {
    const creditAmt = parseFloat(amount) || 0;
    if (creditAmt <= 0) return;

    try {
      const res = await customerAPI.addPurchase(customerId, {
        amount: creditAmt,
        paymentType: 'Credit',
        items,
        notes: notes || 'Credit Purchase (கடன்)'
      });
      if (res.data?.success) {
        setCustomers((prev) =>
          prev.map((c) => (c.id === customerId ? res.data.data : c))
        );
        return res.data.data;
      }
    } catch (err) {
      console.warn('API error adding customer credit:', err);
    }

    // Local fallback
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === customerId) {
          const newBal = (c.balance ?? c.balanceOwed ?? 0) + creditAmt;
          const historyEntry = {
            id: `credit_${Date.now()}`,
            amount: creditAmt,
            date: new Date().toISOString(),
            paymentType: 'Credit',
            items,
            notes: notes || 'Credit Purchase'
          };
          return {
            ...c,
            balance: newBal,
            balanceOwed: newBal,
            purchaseHistory: [historyEntry, ...(c.purchaseHistory || [])]
          };
        }
        return c;
      })
    );
  };

  // Billing creation
  const createBill = async ({ customerName, customerPhone, customerAddress, paymentType, items, total, customerId }) => {
    const newBill = {
      id: `BILL-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: customerName || 'Walk-in Customer',
      customerPhone: customerPhone || '-',
      customerAddress: customerAddress || '-',
      paymentType,
      amount: total,
      total,
      items: items.map((i) => ({
        id: i.product.id,
        name: i.product.name,
        size: i.product.size,
        price: i.product.price,
        qty: i.qty,
        total: i.product.price * i.qty,
        unit: i.product.unit || 'piece'
      })),
      date: new Date().toISOString()
    };

    // 1. Deduct stock for all purchased items
    for (const item of items) {
      const prod = products.find((p) => p.id === item.product.id);
      if (prod) {
        const curStock = prod.stock ?? prod.stockCount ?? 0;
        const newStock = Math.max(0, curStock - item.qty);
        updateProductStock(prod.id, newStock);
      }
    }

    // 2. Handle Credit vs Settled
    if (paymentType === 'Credit') {
      let targetCust = customers.find((c) => c.id === customerId || (c.phone === customerPhone && customerPhone !== '-'));
      if (!targetCust) {
        // Create customer record automatically for new credit buyer
        targetCust = await addNewCustomer({
          name: customerName,
          phone: customerPhone,
          address: customerAddress,
          balance: total
        });
      } else {
        // Add credit to existing customer
        await addCustomerCredit(targetCust.id, total, newBill.items);
      }
    }

    // 3. Save to backend if connected
    try {
      const res = await billingAPI.create({
        ...newBill,
        customerId: customerId || undefined
      });
      if (res.data?.success) {
        setBills((prev) => [res.data.data, ...prev]);
        clearCart();
        return res.data.data;
      }
    } catch (err) {
      console.warn('API error creating bill:', err);
    }

    setBills((prev) => [newBill, ...prev]);
    clearCart();
    return newBill;
  };

  // Low stock products
  const lowStockProducts = products.filter(
    (p) => (p.stock ?? p.stockCount ?? 0) <= (p.lowStockAlert || 5)
  );

  return (
    <ShopContext.Provider
      value={{
        categories,
        products,
        customers,
        bills,
        cart,
        isLoading,
        isBackendConnected,
        selectedCategory,
        setSelectedCategory,
        cartTotalItems,
        cartSubtotal,
        lowStockProducts,
        fetchInitialData,
        addToCart,
        updateCartQty,
        clearCart,
        addNewCategory,
        updateCategory,
        deleteCategory,
        addNewProduct,
        updateProduct,
        updateProductStock,
        quickAddStock,
        deleteProduct,
        addNewCustomer,
        settleCustomerPayment,
        addCustomerCredit,
        createBill
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
