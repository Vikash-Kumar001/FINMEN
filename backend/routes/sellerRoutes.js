import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireSeller } from "../middlewares/requireAuth.js";
import Product from "../models/Product.js";
import VoucherRedemption from "../models/VoucherRedemption.js";
import User from "../models/User.js";

const router = express.Router();

// Middleware to ensure only sellers can access these routes
router.use(requireAuth);
router.use(requireSeller);

// Get all products for the seller
router.get("/products", async (req, res) => {
  try {
    const sellerId = req.user._id;
    const { status, category, search } = req.query;

    let query = { sellerId };

    if (status && status !== 'all') {
      query.status = status;
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

// Create a new product
router.post("/products", async (req, res) => {
  try {
    const sellerId = req.user._id;
    const productData = { ...req.body, sellerId };

    const product = new Product(productData);
    await product.save();

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Failed to create product" });
  }
});

// Update a product
router.put("/products/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const sellerId = req.user._id;

    const product = await Product.findOneAndUpdate(
      { _id: productId, sellerId },
      req.body,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Failed to update product" });
  }
});

// Delete a product
router.delete("/products/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const sellerId = req.user._id;

    const product = await Product.findOneAndDelete({ _id: productId, sellerId });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Failed to delete product" });
  }
});

// Get voucher redemptions for seller's products
router.get("/vouchers", async (req, res) => {
  try {
    const sellerId = req.user._id;
    const { status, search } = req.query;

    let query = { sellerId };

    if (status && status !== 'all') {
      query.status = status;
    }

    const vouchers = await VoucherRedemption.find(query)
      .populate('studentId', 'name email')
      .populate('productId', 'name category')
      .sort({ createdAt: -1 });

    let filteredVouchers = vouchers;

    if (search) {
      filteredVouchers = vouchers.filter(voucher =>
        voucher.studentId.name.toLowerCase().includes(search.toLowerCase()) ||
        voucher.productId.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.json(filteredVouchers);
  } catch (error) {
    console.error("Error fetching vouchers:", error);
    res.status(500).json({ message: "Failed to fetch voucher redemptions" });
  }
});

// Approve or reject voucher redemption
router.put("/vouchers/:voucherId", async (req, res) => {
  try {
    const { voucherId } = req.params;
    const { status, rejectionReason, voucherCode } = req.body;
    const sellerId = req.user._id;

    const updateData = {
      status,
      approvedBy: req.user._id,
      approvedAt: new Date(),
    };

    if (status === 'rejected' && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    if (status === 'approved' && voucherCode) {
      updateData.voucherCode = voucherCode;
      updateData.expiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year expiry
    }

    const voucher = await VoucherRedemption.findOneAndUpdate(
      { _id: voucherId, sellerId },
      updateData,
      { new: true }
    ).populate('studentId', 'name email')
      .populate('productId', 'name category');

    if (!voucher) {
      return res.status(404).json({ message: "Voucher redemption not found" });
    }

    res.json({
      message: `Voucher redemption ${status} successfully`,
      voucher,
    });
  } catch (error) {
    console.error("Error updating voucher:", error);
    res.status(500).json({ message: "Failed to update voucher redemption" });
  }
});

// Get sales analytics
router.get("/analytics", async (req, res) => {
  try {
    const sellerId = req.user._id;
    const { period = 'month' } = req.query;

    // Calculate date range based on period
    const now = new Date();
    let startDate;

    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'quarter':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default: // month
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get approved voucher redemptions for analytics
    const redemptions = await VoucherRedemption.find({
      sellerId,
      status: 'approved',
      createdAt: { $gte: startDate }
    }).populate('productId', 'price coinDiscount commissionRate');

    // Calculate analytics
    const totalSales = redemptions.length;
    const totalRevenue = redemptions.reduce((sum, r) => sum + r.productId.price, 0);
    const totalDiscounts = redemptions.reduce((sum, r) => sum + r.productId.coinDiscount, 0);
    const totalCommission = redemptions.reduce((sum, r) =>
      sum + (r.productId.price * (r.productId.commissionRate / 100)), 0
    );

    // Get category breakdown
    const categoryStats = {};
    redemptions.forEach(r => {
      const category = r.productId.category || 'Other';
      if (!categoryStats[category]) {
        categoryStats[category] = { count: 0, revenue: 0 };
      }
      categoryStats[category].count++;
      categoryStats[category].revenue += r.productId.price;
    });

    res.json({
      period,
      totalSales,
      totalRevenue,
      totalDiscounts,
      totalCommission,
      categoryStats,
      redemptions: redemptions.length,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ message: "Failed to fetch sales analytics" });
  }
});

// Get commission tracking
router.get("/commission", async (req, res) => {
  try {
    const sellerId = req.user._id;

    // Get monthly commission data for the last 6 months
    const monthlyCommissions = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const redemptions = await VoucherRedemption.find({
        sellerId,
        status: 'approved',
        createdAt: { $gte: monthStart, $lte: monthEnd }
      }).populate('productId', 'price commissionRate');

      const monthlyCommission = redemptions.reduce((sum, r) =>
        sum + (r.productId.price * (r.productId.commissionRate / 100)), 0
      );

      monthlyCommissions.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        commission: monthlyCommission,
        sales: redemptions.length,
      });
    }

    const totalCommission = monthlyCommissions.reduce((sum, m) => sum + m.commission, 0);

    res.json({
      monthlyCommissions,
      totalCommission,
      commissionRate: 10, // Default 10% commission rate
    });
  } catch (error) {
    console.error("Error fetching commission data:", error);
    res.status(500).json({ message: "Failed to fetch commission data" });
  }
});

export default router;