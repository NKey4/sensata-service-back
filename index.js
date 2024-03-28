import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import {
  registerValidation,
  loginValidation,
  applicationCreateValidation,
} from "./validations.js";
import {
  checkAuth,
  checkAccess,
  handleValidationErrors,
} from "./utils/index.js";
import { UserController, ApplicationController } from "./controllers/index.js";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("Mongoose success");
});
const app = express();

app.use(express.json());
app.use(cors());

app.listen(process.env.PORT || 3002, console.log("Server has started"));

app.post(
  "/auth/sendCode",
  registerValidation,
  handleValidationErrors,
  UserController.sendCode
);
app.post(
  "/auth/checkCode",
  loginValidation,
  handleValidationErrors,
  UserController.checkCode
);
app.get("/auth/me", checkAuth, UserController.getMe);
app.get("/alice/sendCode", checkAuth, UserController.sendAliceCode);
app.post("/alice/confirmCode", UserController.confirmAliceCode);

app.post("/add-address", checkAuth, UserController.addAddress);
app.get("/applications", checkAuth, ApplicationController.getAll);
app.post(
  "/applications",
  checkAuth,
  handleValidationErrors,
  ApplicationController.create
);
app.delete(
  "/applications/:id",
  checkAuth,
  checkAccess,
  ApplicationController.remove
);
app.patch(
  "/applications/:id",
  checkAuth,
  checkAccess,
  applicationCreateValidation,
  handleValidationErrors,
  ApplicationController.update
);
