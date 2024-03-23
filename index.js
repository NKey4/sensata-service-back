const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const {
  registerValidation,
  loginValidation,
  postCreateValidation,
} = require("./validations");
const { check, handleValidationErrors } = require("./utils/index");

const { UserController, PostController } = require("./controllers/index");

mongoose
  .connect(
    "mongodb+srv://Nurbek:Nurbek123456789@alicebot.qvadg00.mongodb.net/AliceBot?retryWrites=true&w=majority&appName=AliceBot"
  )
  .then(() => {
    console.log("Mongoose success");
  });
const app = express();

app.use(express.json());
app.use(cors());

app.listen(3001, console.log("Server has started"));

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
app.get("/auth/me", check.checkAuth, UserController.getMe);
app.get("/alice/sendCode", check.checkAuth, UserController.sendAliceCode);
app.post("/alice/confirmCode", UserController.confirmAliceCode);

app.post("/add-address", check.checkAuth, UserController.addAddress);
app.get("/applications", check.checkAuth, PostController.getAll);
app.post(
  "/applications",
  check.checkAuth,
  handleValidationErrors,
  PostController.create
);
app.delete(
  "/applications/:id",
  check.checkAuth,
  check.checkAccess,
  PostController.remove
);
app.patch(
  "/applications/:id",
  check.checkAuth,
  check.checkAccess,
  postCreateValidation,
  handleValidationErrors,
  PostController.update
);
