import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
  // Invoice Identification
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  invoiceType: {
    type: String,
    enum: ['payment_invoice', 'refund_invoice', 'credit_note', 'debit_note'],
    default: 'payment_invoice'
  },
  
  // Related Payment
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CSRPayment',
    required: true
  },
  
  // Organization Information
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  organizationDetails: {
    name: String,
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      postalCode: String
    },
    contactPerson: String,
    email: String,
    phone: String,
    gstNumber: String,
    panNumber: String
  },
  
  // Invoice Details
  issueDate: {
    type: Date,
    default: Date.now
  },
  dueDate: Date,
  currency: {
    type: String,
    default: 'INR',
    enum: ['INR', 'USD', 'EUR']
  },
  
  // Line Items
  lineItems: [{
    description: String,
    quantity: {
      type: Number,
      default: 1
    },
    unitPrice: Number,
    totalPrice: Number,
    taxRate: {
      type: Number,
      default: 0
    },
    taxAmount: {
      type: Number,
      default: 0
    },
    category: {
      type: String,
      enum: ['campaign_funding', 'healcoins_pool', 'platform_fees', 'admin_costs', 'marketing', 'infrastructure']
    }
  }],
  
  // Financial Summary
  subtotal: {
    type: Number,
    required: true
  },
  taxAmount: {
    type: Number,
    default: 0
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  
  // Tax Details
  taxBreakdown: [{
    taxType: String,
    taxRate: Number,
    taxableAmount: Number,
    taxAmount: Number
  }],
  
  // Payment Terms
  paymentTerms: {
    type: String,
    default: 'Net 30'
  },
  paymentInstructions: String,
  
  // Status and Processing
  status: {
    type: String,
    enum: ['draft', 'sent', 'viewed', 'paid', 'overdue', 'cancelled', 'disputed'],
    default: 'draft'
  },
  sentAt: Date,
  viewedAt: Date,
  paidAt: Date,
  paidAmount: {
    type: Number,
    default: 0
  },
  
  // Payment References
  paymentReferences: [{
    paymentId: String,
    paymentMethod: String,
    paymentDate: Date,
    amount: Number,
    gatewayTransactionId: String
  }],
  
  // Finance Team
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  financeTeam: {
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewedAt: Date,
    approvedAt: Date,
    notes: String
  },
  
  // Digital Signature and Security
  digitalSignature: {
    hash: String,
    signedAt: Date,
    signedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  
  // Delivery and Communication
  deliveryMethod: {
    type: String,
    enum: ['email', 'portal', 'postal', 'fax'],
    default: 'email'
  },
  deliveryStatus: {
    type: String,
    enum: ['pending', 'sent', 'delivered', 'failed'],
    default: 'pending'
  },
  deliveryAttempts: {
    type: Number,
    default: 0
  },
  
  // Attachments and Documents
  attachments: [{
    type: {
      type: String,
      enum: ['invoice_pdf', 'supporting_document', 'receipt', 'contract']
    },
    filename: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Reminders and Follow-ups
  reminders: [{
    sentAt: Date,
    type: {
      type: String,
      enum: ['payment_due', 'payment_overdue', 'payment_reminder']
    },
    message: String,
    sentTo: [String], // Email addresses
    status: {
      type: String,
      enum: ['sent', 'delivered', 'failed'],
      default: 'sent'
    }
  }],
  
  // Audit Trail
  auditTrail: [{
    action: String,
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    details: String,
    changes: mongoose.Schema.Types.Mixed
  }]
}, {
  timestamps: true
});

// Indexes for better performance
// invoiceNumber already has unique: true in field definition, no need for explicit index
invoiceSchema.index({ organizationId: 1, status: 1 });
invoiceSchema.index({ paymentId: 1 });
invoiceSchema.index({ issueDate: -1 });
invoiceSchema.index({ dueDate: 1, status: 1 });

// Pre-save middleware to generate invoice number
invoiceSchema.pre('save', function(next) {
  if (this.isNew && !this.invoiceNumber) {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const sequence = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.invoiceNumber = `INV-${year}${month}-${sequence}`;
  }
  next();
});

// Virtual for days overdue
invoiceSchema.virtual('daysOverdue').get(function() {
  if (this.status === 'paid' || this.status === 'cancelled') return 0;
  if (this.dueDate && new Date() > this.dueDate) {
    return Math.ceil((new Date() - this.dueDate) / (1000 * 60 * 60 * 24));
  }
  return 0;
});

// Virtual for outstanding amount
invoiceSchema.virtual('outstandingAmount').get(function() {
  return this.totalAmount - this.paidAmount;
});

// Method to calculate totals
invoiceSchema.methods.calculateTotals = function() {
  let subtotal = 0;
  let totalTax = 0;
  
  this.lineItems.forEach(item => {
    item.totalPrice = item.quantity * item.unitPrice;
    item.taxAmount = item.totalPrice * (item.taxRate / 100);
    subtotal += item.totalPrice;
    totalTax += item.taxAmount;
  });
  
  this.subtotal = subtotal;
  this.taxAmount = totalTax;
  this.totalAmount = subtotal + totalTax - this.discountAmount;
  
  return {
    subtotal,
    taxAmount: totalTax,
    totalAmount: this.totalAmount
  };
};

// Method to add payment reference
invoiceSchema.methods.addPaymentReference = function(paymentData) {
  this.paymentReferences.push(paymentData);
  this.paidAmount += paymentData.amount;
  
  if (this.paidAmount >= this.totalAmount) {
    this.status = 'paid';
    this.paidAt = new Date();
  }
};

const Invoice = mongoose.model('Invoice', invoiceSchema);

export default Invoice;
