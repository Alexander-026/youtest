import express from "express";
import {
  registerUser,
  loginUser,
  logoutCurrentUser,
  refreshTokens,
  getUsers,
  updateUser,
} from "../controllers/userController.js";
import { body } from "express-validator";
import {
  authMiddleWare,
  authorizeAdmin,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router
  .route("/registration")
  .post(
    body("email").isEmail(),
    body("password").isLength({ min: 3, max: 26 }),
    body("firstName").isLength({ min: 2, max: 16 }),
    body("lastName").isLength({ min: 2, max: 16 }),
    registerUser
  );
router.post("/login", loginUser);
router.post("/logout", logoutCurrentUser);
router.put("/update", updateUser);
router.post("/refresh", refreshTokens);
router.get("/", authMiddleWare, authorizeAdmin, getUsers);


export default router;
