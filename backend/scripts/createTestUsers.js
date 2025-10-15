import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const createTestUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Test users data with simplified role-specific fields
    const testUsers = [
      {
        name: "Parent",
        email: "parent@gmail.com",
        password: "Parent123",
        role: "parent",
        childEmail: "child@gmail.com",
        isVerified: true,
        approvalStatus: "approved"
      },
      {
        name: "Seller",
        email: "seller@gmail.com",
        password: "Seller123",
        role: "seller",
        businessName: "Seller Enterprises",
        shopType: "Stationery",
        isVerified: true,
        approvalStatus: "approved"
      },
      {
        name: "CSR Name",
        email: "csr@example.com",
        password: "csr123",
        role: "csr",
        organization: "NGO Name",
        isVerified: true,
        approvalStatus: "approved"
      },
      {
        name: "Admin User",
        email: "admin@test.com",
        password: "Admin123",
        role: "admin",
        isVerified: true,
        approvalStatus: "approved"
      },
      {
        name: "Child User",
        email: "child@gmail.com",
        password: "Child123",
        role: "student",
        isVerified: true,
        approvalStatus: "approved"
      }
    ];

    // Create users
    for (const userData of testUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        console.log(`⚠️  User ${userData.email} already exists, skipping...`);
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Create user
      const user = await User.create({
        ...userData,
        password: hashedPassword
      });

      console.log(`✅ Created ${userData.role}: ${userData.email}`);
    }

    console.log("\n🎉 Test users created successfully!");
    console.log("\nLogin credentials:");
    console.log("Parent: parent@gmail.com / Parent123 (linked to child@gmail.com)");
    console.log("Seller: seller@gmail.com / Seller123 (Seller Enterprises - Stationery)");
    console.log("CSR: csr@example.com / csr123 (NGO Name)");
    console.log("Admin: admin@test.com / Admin123");
    console.log("Child: child@gmail.com / Child123 (linked to parent account)");

  } catch (error) {
    console.error("❌ Error creating test users:", error);
  } finally {
    await mongoose.disconnect();
    console.log("📡 Disconnected from MongoDB");
    process.exit(0);
  }
};

createTestUsers();