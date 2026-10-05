import mongoose from 'mongoose';

const BillItemSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      required: true
    },
    size: {
      type: String,
      default: ''
    },
    price: {
      type: Number,
      required: true
    },
    qty: {
      type: Number,
      required: true,
      default: 1
    },
    total: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      default: 'piece'
    }
  },
  { _id: false }
);

const BillingSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      index: true
    },
    customerId: {
      type: String,
      default: ''
    },
    productId: {
      type: String,
      default: ''
    },
    customerName: {
      type: String,
      required: true,
      default: 'Walk-in Customer'
    },
    customerPhone: {
      type: String,
      default: '-'
    },
    customerAddress: {
      type: String,
      default: ''
    },
    items: [BillItemSchema],
    amount: {
      type: Number,
      required: true
    },
    paymentType: {
      type: String,
      enum: ['Cash', 'UPI', 'Credit'],
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    isSettled: {
      type: Boolean,
      default: true
    },
    settledDate: {
      type: Date
    },
    notes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Virtual alias 'total' <-> 'amount'
BillingSchema.virtual('total').get(function () {
  return this.amount;
}).set(function (v) {
  this.amount = v;
});

// Virtual alias 'paymentMode' <-> 'paymentType'
BillingSchema.virtual('paymentMode').get(function () {
  return this.paymentType;
}).set(function (v) {
  this.paymentType = v;
});

BillingSchema.set('toJSON', { virtuals: true });
BillingSchema.set('toObject', { virtuals: true });

BillingSchema.pre('save', function () {
  if (!this.id) {
    this.id = `BILL-${Math.floor(1000 + Math.random() * 9000)}`;
  }
});

export default mongoose.model('Billing', BillingSchema);
