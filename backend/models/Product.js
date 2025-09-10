import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      required: true,
      enum: ["Gift Cards", "E-commerce", "Education", "Entertainment", "Food", "Travel", "Technology"],
    },
    price: {
      type: Number,
      required: true,
    },
    coinDiscount: {
      type: Number,
      default: 0,
    },
    finalPrice: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "out_of_stock"],
      default: "active",
    },
    image: {
      type: String,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    commissionRate: {
      type: Number,
      default: 10, // 10% commission to FINMEN
    },
  },
  {
    timestamps: true,
  }
);

// Calculate final price before saving
productSchema.pre('save', function(next) {
  this.finalPrice = this.price - this.coinDiscount;
  next();
});

const Product = mongoose.model("Product", productSchema);
export default Product;