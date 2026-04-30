import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import Project from "./models/Project.js";
import Task from "./models/Task.js";
import User from "./models/User.js";

dotenv.config();

const seed = async () => {
  try {
    await connectDB();

    await Promise.all([Task.deleteMany({}), Project.deleteMany({}), User.deleteMany({})]);

    const password = await bcrypt.hash("123456", 10);

    const admin = await User.create({
      name: "Demo Admin",
      email: "admin@test.com",
      password,
      role: "admin"
    });

    const member = await User.create({
      name: "Demo Member",
      email: "member@test.com",
      password,
      role: "member"
    });

    const project = await Project.create({
      name: "Sample Project",
      description: "A demo project for Team Task Manager.",
      admin: admin._id,
      members: [member._id]
    });

    await Task.create([
      {
        title: "Set up project board",
        description: "Create basic task columns and labels.",
        project: project._id,
        assignedTo: member._id,
        createdBy: admin._id,
        status: "In Progress",
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      },
      {
        title: "Prepare sprint summary",
        description: "Write a short summary of completed work.",
        project: project._id,
        assignedTo: member._id,
        createdBy: admin._id,
        status: "Pending",
        dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)
      }
    ]);

    console.log("Seed completed successfully");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

seed();
