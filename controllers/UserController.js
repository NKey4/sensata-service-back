import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import UserModel from "../Models/User.js";

const transporter = nodemailer.createTransport({
  host: "smtp.yandex.kz",
  port: 465,
  secure: true,
  auth: {
    user: "kaznurbek@yandex.kz",
    pass: "qlhirkijknfsiwdt",
  },
});

const sendCode = async (req, res) => {
  try {
    const { fullName, email, phoneNumber } = req.body;
    const confirmationCode = Math.floor(Math.random() * 10000);

    let user = await UserModel.findOne({ email });
    if (!user) {
      user = new UserModel({ fullName, email, phoneNumber });
    }

    user.confirmationCode = confirmationCode;
    await user.save();

    let mailOptions = {
      from: "kaznurbek@yandex.kz",
      to: email,
      subject: "Код подтверждения",
      text: `Ваш код подтверждения: ${confirmationCode}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.json({ message: "Код подтверждения отправлен на вашу почту." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Не удалось отправить код подтверждения" });
  }
};

const checkCode = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    if (user.confirmationCode != verificationCode) {
      return res.status(400).json({ message: "Неверный код подтверждения" });
    }

    user.isVerified = true;
    user.confirmationCode = undefined;
    await user.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      { expiresIn: "30d" }
    );
    const userData = user._doc;
    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Не удалось проверить код подтверждения" });
  }
};

const sendAliceCode = async (req, res) => {
  try {
    const { userId } = req;
    const confirmationCode = Math.floor(Math.random() * 10000);

    const user = await UserModel.findOne({ _id: userId });
    user.aliceCode = confirmationCode;
    const updatedUser = await user.save();

    res.json(updatedUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Не удалось отправить код" });
  }
};

const confirmAliceCode = async (req, res) => {
  try {
    const { yandexId, phoneNumber, code } = req.body;

    const user = await UserModel.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    if (user.aliceCode != code) {
      return res.status(400).json({ message: "Неверный код подтверждения" });
    }
    user.yandexId = yandexId;
    user.isVerified = true;
    user.aliceCode = undefined;
    await user.save();

    const userData = user._doc;
    res.json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Не удалось проверить код подтверждения" });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: "ПОльзователь не найден",
      });
    }

    const userData = user._doc;

    res.json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Ошибка",
    });
  }
};

const addAddress = async (req, res) => {
  try {
    const address = req.body.address;
    console.log(address);
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }
    user.address.push(address);
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Ошибка",
    });
  }
};

const UserController = {
  sendCode,
  checkCode,
  sendAliceCode,
  confirmAliceCode,
  getMe,
  addAddress,
};

export default UserController;
