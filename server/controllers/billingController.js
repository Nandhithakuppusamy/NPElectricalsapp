import Billing from '../models/Billing.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';

// @desc    Checkout and record bill
// @route   POST /api/billing
export const checkoutBill = async (req, res, next) => {
  try {
    const { 
      items, 
      paymentType, 
      paymentMode, 
      customerName, 
      customerPhone, 
      customerAddress, 
      customerId, 
      notes 
    } = req.body;

    const pType = paymentType || paymentMode || 'Cash';

    if (!items || !items.length) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty. Please add items to bill.'
      });
    }

    const isCredit = pType === 'Credit';

    if (isCredit && (!customerName || !customerName.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Customer name is required for Credit purchases'
      });
    }

    // Calculate subtotal and total
    let totalAmount = 0;
    const processedItems = items.map(item => {
      const price = parseFloat(item.price) || 0;
      const qty = parseInt(item.qty) || 1;
      const total = price * qty;
      totalAmount += total;

      return {
        productId: item.productId || item.id || '',
        id: item.id || item.productId || '',
        name: item.name,
        size: item.size || '',
        price,
        qty,
        total,
        unit: item.unit || 'piece'
      };
    });

    const billDate = new Date();
    const billId = `BILL-${Math.floor(1000 + Math.random() * 9000)}`;

    // 1. Deduct Stock for each product
    for (const item of processedItems) {
      if (item.productId) {
        await Product.findOneAndUpdate(
          { $or: [{ id: item.productId }, { _id: item.productId.match(/^[0-9a-fA-F]{24}$/) ? item.productId : null }] },
          { $inc: { stockCount: -item.qty } }
        );
      }
    }

    // 2. Customer record handling
    let matchedCustomer = null;
    const cleanName = customerName ? customerName.trim() : 'Walk-in Customer';
    const cleanPhone = customerPhone ? customerPhone.trim() : '-';
    const cleanAddress = customerAddress ? customerAddress.trim() : '';

    const itemsSummary = processedItems
      .map(i => `${i.name} (${i.size}) x${i.qty}`)
      .join(', ');

    if (customerId) {
      matchedCustomer = await Customer.findOne({ $or: [{ id: customerId }, { _id: customerId.match(/^[0-9a-fA-F]{24}$/) ? customerId : null }] });
    } else if (cleanPhone && cleanPhone !== '-') {
      matchedCustomer = await Customer.findOne({ phone: cleanPhone });
    }

    if (isCredit) {
      if (matchedCustomer) {
        matchedCustomer.balance += totalAmount;
        matchedCustomer.purchaseHistory.unshift({
          billId,
          date: billDate,
          amount: totalAmount,
          paymentType: 'Credit',
          items: itemsSummary,
          status: 'PENDING'
        });
        if (cleanAddress && (!matchedCustomer.address || matchedCustomer.address === '-')) {
          matchedCustomer.address = cleanAddress;
        }
        await matchedCustomer.save();
      } else {
        matchedCustomer = await Customer.create({
          id: `cust_${Date.now()}`,
          name: cleanName,
          phone: cleanPhone,
          address: cleanAddress,
          balance: totalAmount,
          purchaseHistory: [
            {
              billId,
              date: billDate,
              amount: totalAmount,
              paymentType: 'Credit',
              items: itemsSummary,
              status: 'PENDING'
            }
          ]
        });
      }
    } else {
      // If Cash or UPI with customer name provided, record into customer settled history
      if (matchedCustomer) {
        matchedCustomer.settledHistory.unshift({
          id: `settle_${Date.now()}`,
          amount: totalAmount,
          date: billDate,
          paymentMode: pType,
          notes: `Bill #${billId} - ${itemsSummary}`
        });
        await matchedCustomer.save();
      }
    }

    // 3. Save Billing record
    const bill = await Billing.create({
      id: billId,
      customerId: matchedCustomer ? matchedCustomer.id : '',
      customerName: cleanName,
      customerPhone: cleanPhone,
      customerAddress: cleanAddress,
      items: processedItems,
      amount: totalAmount,
      paymentType: pType,
      date: billDate,
      isSettled: !isCredit,
      settledDate: !isCredit ? billDate : null,
      notes: notes || (isCredit ? 'Credit (Kadan) Bill' : 'Amount Settled')
    });

    res.status(201).json({
      success: true,
      message: 'Bill recorded successfully',
      data: bill
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all billing history
// @route   GET /api/billing
export const getBillingHistory = async (req, res, next) => {
  try {
    const { paymentType, date, search } = req.query;
    let query = {};

    if (paymentType && paymentType !== 'ALL') {
      query.paymentType = paymentType;
    }

    if (date === 'TODAY') {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }

    if (search) {
      const q = search.trim();
      query.$or = [
        { id: { $regex: q, $options: 'i' } },
        { customerName: { $regex: q, $options: 'i' } },
        { customerPhone: { $regex: q, $options: 'i' } }
      ];
    }

    const bills = await Billing.find(query).sort({ date: -1 });
    res.json({
      success: true,
      count: bills.length,
      data: bills
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get shop analytics and dashboard stats
// @route   GET /api/billing/stats
export const getStats = async (req, res, next) => {
  try {
    const bills = await Billing.find();
    const customers = await Customer.find();
    const lowStockCount = await Product.countDocuments({
      $expr: { $lte: ['$stockCount', '$lowStockAlert'] }
    });

    const todayStr = new Date().toISOString().slice(0, 10);
    const todaysBills = bills.filter(b => b.date && b.date.toISOString().slice(0, 10) === todayStr);

    const todaysSales = todaysBills.reduce((sum, b) => sum + (b.amount || 0), 0);
    const totalRevenue = bills.reduce((sum, b) => sum + (b.amount || 0), 0);
    const totalSettled = bills
      .filter(b => b.isSettled)
      .reduce((sum, b) => sum + (b.amount || 0), 0);
    const totalCreditPending = customers.reduce((sum, c) => sum + (c.balance || 0), 0);

    const cashRevenue = bills
      .filter(b => b.paymentType === 'Cash')
      .reduce((sum, b) => sum + (b.amount || 0), 0);

    const upiRevenue = bills
      .filter(b => b.paymentType === 'UPI')
      .reduce((sum, b) => sum + (b.amount || 0), 0);

    res.json({
      success: true,
      data: {
        todaysSales,
        todaysBillsCount: todaysBills.length,
        totalRevenue,
        totalSettled,
        totalCreditPending,
        cashRevenue,
        upiRevenue,
        lowStockCount,
        totalCustomers: customers.length,
        totalBillsCount: bills.length
      }
    });
  } catch (err) {
    next(err);
  }
};
