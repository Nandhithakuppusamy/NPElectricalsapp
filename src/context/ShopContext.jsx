import React, { createContext, useContext, useState, useEffect } from 'react';
import { CATEGORIES, INITIAL_PRODUCTS, INITIAL_CUSTOMERS, INITIAL_BILLS } from '../data/initialData';

const ShopContext = createContext();

export function ShopProvider({ children }) {
  // Load from localStorage or defaults
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('np_electricals_categories_v1');
    return saved ? JSON.parse(saved) : CATEGORIES;
  });

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('np_electricals_products_v3');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('np_electricals_customers_v3');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [bills, setBills] = useState(() => {
    const saved = localStorage.getItem('np_electricals_bills_v3');
    return saved ? JSON.parse(saved) : INITIAL_BILLS;
  });

  // Active Cart / Current Bill
  const [cart, setCart] = useState([]);

  // Active view: 'billing' | 'customers' | 'stock' | 'sales'
  const [currentTab, setCurrentTab] = useState('billing');

  // Selected Category filter for Billing: null means all, or category id
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Search query
  const [searchQuery, setSearchQuery] = useState('');

  // Active Receipt Modal state
  const [lastCompletedBill, setLastCompletedBill] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('np_electricals_categories_v1', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('np_electricals_products_v3', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('np_electricals_customers_v3', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('np_electricals_bills_v3', JSON.stringify(bills));
  }, [bills]);

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
  const lowStockProducts = products.filter(p => p.stock <= p.lowStockAlert);

  // Checkout Bill
  const checkoutBill = ({
    customerName,
    customerPhone,
    customerAddress,
    paymentMode, // 'Cash' | 'UPI' | 'Credit'
    notes = ''
  }) => {
    const isCredit = paymentMode === 'Credit';
    const billId = `BILL-${Math.floor(1000 + Math.random() * 9000)}`;
    const billDate = new Date().toISOString();

    const itemsSummary = cart
      .map(i => `${i.product.name} (${i.product.size}) x${i.qty}`)
      .join(', ');

    const newBill = {
      id: billId,
      customerName: customerName.trim() || 'Walk-in Customer (நேரடி வாடிக்கையாளர்)',
      customerPhone: customerPhone.trim() || (isCredit ? 'Credit Customer' : 'Walk-in'),
      customerAddress: customerAddress.trim() || '',
      date: billDate,
      items: cart.map(i => ({
        id: i.product.id,
        name: i.product.name,
        size: i.product.size,
        category: i.product.category,
        price: i.product.price,
        qty: i.qty,
        total: i.product.price * i.qty,
        unit: i.product.unit || 'piece'
      })),
      subtotal: cartSubtotal,
      total: cartSubtotal,
      paymentMode,
      isSettled: !isCredit,
      settledDate: !isCredit ? billDate : null,
      notes: notes || (isCredit ? 'Kadan Bill - Pay later' : 'Amount Settled')
    };

    // 1. Deduct Stock for all items
    setProducts(prevProducts =>
      prevProducts.map(p => {
        const cartItem = cart.find(ci => ci.product.id === p.id);
        if (cartItem) {
          const updatedStock = Math.max(0, p.stock - cartItem.qty);
          return { ...p, stock: updatedStock };
        }
        return p;
      })
    );

    // 2. Customer Database update
    if (isCredit) {
      // Find matching customer by phone or name
      setCustomers(prevCusts => {
        const cleanPhone = customerPhone.trim();
        const cleanName = customerName.trim();
        const existingIndex = prevCusts.findIndex(
          c => (cleanPhone && c.phone === cleanPhone) || (cleanName && c.name.toLowerCase() === cleanName.toLowerCase())
        );

        const creditBillEntry = {
          billId: newBill.id,
          date: billDate,
          items: itemsSummary,
          amount: cartSubtotal,
          status: 'PENDING'
        };

        if (existingIndex >= 0) {
          const updated = [...prevCusts];
          const curr = updated[existingIndex];
          updated[existingIndex] = {
            ...curr,
            balanceOwed: curr.balanceOwed + cartSubtotal,
            creditBills: [creditBillEntry, ...(curr.creditBills || [])],
            address: customerAddress.trim() || curr.address,
            phone: cleanPhone || curr.phone
          };
          return updated;
        } else {
          // Create new customer record
          const newCust = {
            id: `cust-${Date.now()}`,
            name: cleanName || 'Kadan Customer',
            phone: cleanPhone || '-',
            address: customerAddress.trim() || '-',
            balanceOwed: cartSubtotal,
            creditBills: [creditBillEntry],
            settledHistory: []
          };
          return [newCust, ...prevCusts];
        }
      });
    } else {
      // If Cash or UPI with customer name provided, record settled history in customer DB
      if (customerName.trim() && customerName.trim().toLowerCase() !== 'walk-in customer') {
        setCustomers(prevCusts => {
          const cleanPhone = customerPhone.trim();
          const cleanName = customerName.trim();
          const existingIndex = prevCusts.findIndex(
            c => (cleanPhone && c.phone === cleanPhone) || (cleanName && c.name.toLowerCase() === cleanName.toLowerCase())
          );

          const settledEntry = {
            id: `settle-${Date.now()}`,
            billId: newBill.id,
            amount: cartSubtotal,
            date: billDate,
            paymentMode,
            notes: `Bill #${newBill.id} - ${itemsSummary}`
          };

          if (existingIndex >= 0) {
            const updated = [...prevCusts];
            const curr = updated[existingIndex];
            updated[existingIndex] = {
              ...curr,
              settledHistory: [settledEntry, ...(curr.settledHistory || [])]
            };
            return updated;
          } else {
            return [
              {
                id: `cust-${Date.now()}`,
                name: cleanName,
                phone: cleanPhone || '-',
                address: customerAddress.trim() || '-',
                balanceOwed: 0,
                creditBills: [],
                settledHistory: [settledEntry]
              },
              ...prevCusts
            ];
          }
        });
      }
    }

    // 3. Save to Bills list
    setBills(prev => [newBill, ...prev]);

    // 4. Clear active cart and display receipt
    setCart([]);
    setLastCompletedBill(newBill);
    setShowReceiptModal(true);

    return newBill;
  };

  // Settle Customer Kadan (Credit Balance Payment)
  const settleCustomerCredit = ({ customerId, amountPaid, paymentMode, notes }) => {
    const numPaid = parseFloat(amountPaid) || 0;
    if (numPaid <= 0) return false;

    const settleDate = new Date().toISOString();

    setCustomers(prevCusts =>
      prevCusts.map(cust => {
        if (cust.id === customerId) {
          const newBalance = Math.max(0, cust.balanceOwed - numPaid);
          const newSettlement = {
            id: `settle-${Date.now()}`,
            amount: numPaid,
            date: settleDate,
            paymentMode,
            notes: notes || `Kadan Baaki Vasool (${paymentMode})`
          };

          // Update status of credit bills if fully cleared
          let remainingPaid = numPaid;
          const updatedCreditBills = (cust.creditBills || []).map(cb => {
            if (cb.status === 'PENDING' && remainingPaid >= cb.amount) {
              remainingPaid -= cb.amount;
              return { ...cb, status: 'SETTLED', settledDate: settleDate };
            }
            return cb;
          });

          return {
            ...cust,
            balanceOwed: newBalance,
            creditBills: updatedCreditBills,
            settledHistory: [newSettlement, ...(cust.settledHistory || [])]
          };
        }
        return cust;
      })
    );

    // Also record a payment settlement receipt in bills history for shop sales tracking
    const custObj = customers.find(c => c.id === customerId);
    const receiptBill = {
      id: `RCV-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: custObj ? custObj.name : 'Credit Customer',
      customerPhone: custObj ? custObj.phone : '-',
      customerAddress: custObj ? custObj.address : '',
      date: settleDate,
      items: [
        {
          id: 'settle-item',
          name: 'Kadan Baaki Settlement / Credit Payment',
          size: `Paid via ${paymentMode}`,
          price: numPaid,
          qty: 1,
          total: numPaid,
          unit: 'entry'
        }
      ],
      subtotal: numPaid,
      total: numPaid,
      paymentMode,
      isSettled: true,
      settledDate: settleDate,
      notes: notes || `Kadan Collection from ${custObj ? custObj.name : 'Customer'}`
    };

    setBills(prev => [receiptBill, ...prev]);
    return true;
  };

  // Stock operations
  const quickAddStock = (productId, amount) => {
    setProducts(prev =>
      prev.map(p =>
        p.id === productId ? { ...p, stock: Math.max(0, p.stock + amount) } : p
      )
    );
  };

  const updateProductStock = (productId, newStock) => {
    setProducts(prev =>
      prev.map(p =>
        p.id === productId ? { ...p, stock: Math.max(0, parseInt(newStock) || 0) } : p
      )
    );
  };

  const addNewProduct = (productData) => {
    const newProduct = {
      id: `prod-${productData.category}-${Date.now()}`,
      name: productData.name.trim(),
      category: productData.category,
      size: productData.size.trim(),
      price: parseFloat(productData.price) || 0,
      stock: parseInt(productData.stock) || 0,
      lowStockAlert: parseInt(productData.lowStockAlert) || 5,
      unit: productData.unit || 'piece'
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const updateProduct = (productId, productData) => {
    setProducts(prev =>
      prev.map(p =>
        p.id === productId
          ? {
              ...p,
              ...productData,
              price: parseFloat(productData.price) || p.price,
              stock: parseInt(productData.stock) || p.stock,
              lowStockAlert: parseInt(productData.lowStockAlert) || p.lowStockAlert
            }
          : p
      )
    );
  };

  const deleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  // Category operations (Shop Owner controls)
  const addNewCategory = (categoryData) => {
    const rawId = categoryData.name.toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
    const newCat = {
      id: rawId || `cat_${Date.now()}`,
      name: categoryData.name.trim(),
      tamilName: categoryData.tamilName ? categoryData.tamilName.trim() : categoryData.name.trim(),
      icon: categoryData.icon || 'Package',
      sizesPreview: categoryData.sizesPreview ? categoryData.sizesPreview.trim() : 'All Sizes Available',
      color: categoryData.color || 'from-blue-600 to-indigo-700',
      bgLight: 'bg-blue-50',
      borderLight: 'border-blue-200',
      textAccent: 'text-blue-800'
    };
    setCategories(prev => [...prev, newCat]);
    return newCat;
  };

  const updateCategory = (categoryId, categoryData) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId
          ? {
              ...cat,
              name: categoryData.name ? categoryData.name.trim() : cat.name,
              tamilName: categoryData.tamilName ? categoryData.tamilName.trim() : cat.tamilName,
              sizesPreview: categoryData.sizesPreview !== undefined ? categoryData.sizesPreview.trim() : cat.sizesPreview
            }
          : cat
      )
    );
  };

  const deleteCategory = (categoryId) => {
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    // Also remove or unlink products under this category
    setProducts(prev => prev.filter(p => p.category !== categoryId));
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    }
  };

  // Customer operations
  const addNewCustomer = (customerData) => {
    const initialBalance = parseFloat(customerData.initialBalance || customerData.balanceOwed) || 0;
    const purchaseDate = customerData.purchaseDate 
      ? new Date(customerData.purchaseDate).toISOString() 
      : new Date().toISOString();

    const pastSettledAmt = parseFloat(customerData.settledAmount) || 0;
    const settledDate = customerData.settledDate 
      ? new Date(customerData.settledDate).toISOString() 
      : new Date().toISOString();

    const newCust = {
      id: `cust-${Date.now()}`,
      name: customerData.name.trim(),
      phone: customerData.phone ? customerData.phone.trim() : '-',
      address: customerData.address ? customerData.address.trim() : '-',
      balanceOwed: initialBalance,
      creditBills: initialBalance > 0 ? [{
        billId: customerData.billId ? customerData.billId.trim() : `PAST-${Math.floor(1000 + Math.random() * 9000)}`,
        date: purchaseDate,
        items: customerData.itemsDescription ? customerData.itemsDescription.trim() : 'Pazhaiya Kadan (Previous Credit Record)',
        amount: initialBalance,
        status: 'PENDING'
      }] : [],
      settledHistory: pastSettledAmt > 0 ? [{
        id: `settle-past-${Date.now()}`,
        amount: pastSettledAmt,
        date: settledDate,
        paymentMode: customerData.settledMode || 'Cash',
        notes: customerData.settledNotes || 'Pazhaiya Settled Panam (Previous Settlement)'
      }] : []
    };
    setCustomers(prev => [newCust, ...prev]);
    return newCust;
  };

  // Add a past credit purchase entry to an existing customer
  const addPastCreditToCustomer = (customerId, { amount, purchaseDate, itemsDescription, billId }) => {
    const amt = parseFloat(amount) || 0;
    if (amt <= 0) return;

    const pDate = purchaseDate ? new Date(purchaseDate).toISOString() : new Date().toISOString();
    const newEntry = {
      billId: billId ? billId.trim() : `PAST-${Math.floor(1000 + Math.random() * 9000)}`,
      date: pDate,
      items: itemsDescription ? itemsDescription.trim() : 'Pazhaiya Kadan (Past Purchase)',
      amount: amt,
      status: 'PENDING'
    };

    setCustomers(prev =>
      prev.map(c =>
        c.id === customerId
          ? {
              ...c,
              balanceOwed: c.balanceOwed + amt,
              creditBills: [newEntry, ...(c.creditBills || [])]
            }
          : c
      )
    );
  };

  const updateCustomer = (customerId, customerData) => {
    setCustomers(prev =>
      prev.map(c =>
        c.id === customerId
          ? {
              ...c,
              name: customerData.name ? customerData.name.trim() : c.name,
              phone: customerData.phone ? customerData.phone.trim() : c.phone,
              address: customerData.address !== undefined ? customerData.address.trim() : c.address
            }
          : c
      )
    );
  };

  const deleteCustomer = (customerId) => {
    setCustomers(prev => prev.filter(c => c.id !== customerId));
  };

  // Reset demo data
  const resetToDefaultData = () => {
    if (window.confirm('Ellam data-vaiyum default data-vukku reset panna venduma? (Are you sure you want to reset all data?)')) {
      setProducts(INITIAL_PRODUCTS);
      setCustomers(INITIAL_CUSTOMERS);
      setBills(INITIAL_BILLS);
      setCart([]);
      localStorage.removeItem('np_electricals_products');
      localStorage.removeItem('np_electricals_customers');
      localStorage.removeItem('np_electricals_bills');
    }
  };

  // Export JSON backup
  const exportDataJson = () => {
    const data = {
      appName: 'NP Electricals',
      exportDate: new Date().toISOString(),
      products,
      customers,
      bills
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `np-electricals-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Value export
  const value = {
    categories,
    products,
    customers,
    bills,
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
    // Actions
    addToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartTotalItems,
    checkoutBill,
    settleCustomerCredit,
    quickAddStock,
    updateProductStock,
    addNewProduct,
    updateProduct,
    deleteProduct,
    addNewCategory,
    updateCategory,
    deleteCategory,
    addNewCustomer,
    addPastCreditToCustomer,
    updateCustomer,
    deleteCustomer,
    resetToDefaultData,
    exportDataJson
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
