import mongoose from "mongoose";
import dotenv from "dotenv";
import FinancialMission from "../models/FinancialMission.js";

dotenv.config();

const seedMissions = async () => {
  try {
    // MongoDB connection
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Sample mission data
    const data = [
      {
        title: "Budgeting Basics",
        description: "Learn to manage a simple monthly budget.",
        level: "junior",
        xp: 50,
        rewardCoins: 20,
        badge: "Budgeter",
      },
      {
        title: "Festival Budget Challenge",
        description: "Plan a festival event within a given amount.",
        level: "junior",
        xp: 75,
        rewardCoins: 30,
        badge: "Planner",
      },
      {
        title: "Investing 101",
        description: "Learn the basics of saving and investing.",
        level: "pro",
        xp: 100,
        rewardCoins: 40,
        badge: "Investor",
      },
      {
        title: "Smart Spending",
        description: "Decide what to buy with limited pocket money.",
        level: "pro",
        xp: 80,
        rewardCoins: 25,
        badge: "Saver",
      },
    ];

    // Clean existing missions and insert new ones
    await FinancialMission.deleteMany();
    await FinancialMission.insertMany(data);

    console.log("✅ Financial missions seeded successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding financial missions:", err);
    process.exit(1);
  }
};

seedMissions();
