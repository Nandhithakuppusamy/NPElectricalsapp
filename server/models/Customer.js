import mongoose from 'mongoose';

const PurchaseHistoryItemSchema = new mongoose.Schema(
  {
    billId: {
      type: String,
      default: ''
    },
    date: {
      type: Date,
      default: Date.now
    },
    amount: {
      type: Number,
      required: true
    },
    paymentType: {
      type: String,
      enum: ['Credit', 'Cash', 'UPI'],
      default: 'Credit'
    },
    items: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['PENDING', 'SETTLED'],
      default: 'PENDING'
    },
    notes: {
      type: String,
      default: ''
    }
  },
  { _id: false }
);

const SettledHistoryItemSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => `settle_${Date.now()}`
    },
    amount: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    paymentMode: {
      type: String,
      enum: ['Cash', 'UPI'],
      default: 'Cash'
    },
    notes: {
      type: String,
      default: ''
    }
  },
  { _id: false }
);

const CustomerSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      index: true
    },
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true
    },
    phone: {
      type: String,
      trim: true,
      default: '-'
    },
    address: {
      type: String,
      trim: true,
      default: '-'
    },
    balance: {
      type: Number,
      default: 0
    },
    purchaseHistory: [PurchaseHistoryItemSchema],
    settledHistory: [SettledHistoryItemSchema]
  },
  {
    timestamps: true
  }
);

// Virtual alias 'balanceOwed' <-> 'balance'
CustomerSchema.virtual('balanceOwed').get(function () {
  return this.balance;
}).set(function (v) {
  this.balance = v;
});

// Virtual alias 'creditBills' <-> 'purchaseHistory'
CustomerSchema.virtual('creditBills').get(function () {
  return this.purchaseHistory;
});

CustomerSchema.set('toJSON', { virtuals: true });
CustomerSchema.set('toObject', { virtuals: true });

CustomerSchema.pre('save', function () {
  if (!this.id) {
    this.id = `cust_${Date.now()}`;
  }
});

export default mongoose.model('Customer', CustomerSchema);
