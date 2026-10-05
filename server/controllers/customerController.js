import Customer from '../models/Customer.js';
import Billing from '../models/Billing.js';

// @desc    Get all customers
// @route   GET /api/customers
export const getCustomers = async (req, res, next) => {
  try {
    const customers = await Customer.find().sort({ balance: -1, createdAt: -1 });
    res.json({
      success: true,
      count: customers.length,
      data: customers
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add new customer (with optional manual previous credit & purchase date!)
// @route   POST /api/customers
export const addCustomer = async (req, res, next) => {
  try {
    const { 
      name, 
      phone, 
      address, 
      balance, 
      initialBalance, 
      purchaseDate, 
      itemsDescription, 
      billId,
      settledAmount,
      settledDate,
      settledMode,
      settledNotes
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Customer name is required'
      });
    }

    const finalBalance = parseFloat(balance !== undefined ? balance : (initialBalance || 0)) || 0;
    const finalPurchaseDate = purchaseDate ? new Date(purchaseDate) : new Date();

    const pastSettledAmt = parseFloat(settledAmount) || 0;
    const finalSettledDate = settledDate ? new Date(settledDate) : new Date();

    const purchaseHistory = finalBalance > 0 ? [
      {
        billId: billId ? billId.trim() : `PAST-${Math.floor(1000 + Math.random() * 9000)}`,
        date: finalPurchaseDate,
        amount: finalBalance,
        paymentType: 'Credit',
        items: itemsDescription ? itemsDescription.trim() : 'Pazhaiya Kadan (Previous Purchase Record)',
        status: 'PENDING'
      }
    ] : [];

    const settledHistory = pastSettledAmt > 0 ? [
      {
        id: `settle_${Date.now()}`,
        amount: pastSettledAmt,
        date: finalSettledDate,
        paymentMode: settledMode || 'Cash',
        notes: settledNotes || 'Pazhaiya Settled Panam (Previous Settlement)'
      }
    ] : [];

    const customer = await Customer.create({
      id: `cust_${Date.now()}`,
      name: name.trim(),
      phone: phone ? phone.trim() : '-',
      address: address ? address.trim() : '-',
      balance: finalBalance,
      purchaseHistory,
      settledHistory
    });

    res.status(201).json({
      success: true,
      message: 'Customer record created successfully',
      data: customer
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update customer profile
// @route   PUT /api/customers/:id
export const updateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, phone, address, balance } = req.body;

    let customer = await Customer.findOne({ $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    if (name) customer.name = name.trim();
    if (phone !== undefined) customer.phone = phone.trim();
    if (address !== undefined) customer.address = address.trim();
    if (balance !== undefined) customer.balance = parseFloat(balance) || 0;

    await customer.save();

    res.json({
      success: true,
      message: 'Customer updated successfully',
      data: customer
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete customer
// @route   DELETE /api/customers/:id
export const deleteCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findOneAndDelete({ $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.json({
      success: true,
      message: 'Customer deleted successfully',
      data: { id: customer.id }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Settle customer balance (repayment collection)
// @route   POST /api/customers/:id/settle
export const settleCustomerBalance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount, paymentMode, notes } = req.body;

    const numPaid = parseFloat(amount) || 0;
    if (numPaid <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid payment amount is required'
      });
    }

    let customer = await Customer.findOne({ $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    const settleDate = new Date();
    const newBalance = Math.max(0, customer.balance - numPaid);

    // Add to settledHistory
    customer.settledHistory.unshift({
      id: `settle_${Date.now()}`,
      amount: numPaid,
      date: settleDate,
      paymentMode: paymentMode || 'Cash',
      notes: notes || `Kadan Baaki Vasool (${paymentMode || 'Cash'})`
    });

    // Update status of credit bills
    let remaining = numPaid;
    customer.purchaseHistory.forEach(bill => {
      if (bill.status === 'PENDING' && remaining >= bill.amount) {
        remaining -= bill.amount;
        bill.status = 'SETTLED';
      }
    });

    customer.balance = newBalance;
    await customer.save();

    // Also record a billing receipt entry for shop collection history
    const billingEntry = await Billing.create({
      id: `RCV-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerAddress: customer.address,
      date: settleDate,
      items: [
        {
          productId: 'settlement',
          id: 'settlement',
          name: 'Kadan Baaki Settlement / Repayment',
          size: `Paid via ${paymentMode || 'Cash'}`,
          price: numPaid,
          qty: 1,
          total: numPaid,
          unit: 'entry'
        }
      ],
      amount: numPaid,
      paymentType: paymentMode || 'Cash',
      isSettled: true,
      settledDate: settleDate,
      notes: notes || `Kadan Baaki Vasool - ${customer.name}`
    });

    res.json({
      success: true,
      message: 'Payment settled successfully',
      data: {
        customer,
        receipt: billingEntry
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add past credit purchase to existing customer
// @route   POST /api/customers/:id/credit
export const addPastCredit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount, purchaseDate, itemsDescription, billId } = req.body;

    const amt = parseFloat(amount) || 0;
    if (amt <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid credit amount is required'
      });
    }

    let customer = await Customer.findOne({ $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    const pDate = purchaseDate ? new Date(purchaseDate) : new Date();

    const newCreditEntry = {
      billId: billId ? billId.trim() : `PAST-${Math.floor(1000 + Math.random() * 9000)}`,
      date: pDate,
      amount: amt,
      paymentType: 'Credit',
      items: itemsDescription ? itemsDescription.trim() : 'Pazhaiya Kadan (Past Purchase)',
      status: 'PENDING'
    };

    customer.purchaseHistory.unshift(newCreditEntry);
    customer.balance += amt;
    await customer.save();

    res.json({
      success: true,
      message: 'Past credit entry added successfully',
      data: customer
    });
  } catch (err) {
    next(err);
  }
};
