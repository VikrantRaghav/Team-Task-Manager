import express from "express";
import { createTask, deleteTask, getTasks, updateTask } from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getTasks).post(authorize("admin"), createTask);
router.route("/:id").put(updateTask).delete(authorize("admin"), deleteTask);

export default router;
