import express from "express";
import {
  addMember,
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  removeMember,
  updateProject
} from "../controllers/projectController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getProjects).post(authorize("admin"), createProject);
router.route("/:id").get(getProjectById).put(authorize("admin"), updateProject).delete(authorize("admin"), deleteProject);
router.patch("/:id/add-member", authorize("admin"), addMember);
router.patch("/:id/remove-member", authorize("admin"), removeMember);

export default router;
