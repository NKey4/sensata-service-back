import jwt from "jsonwebtoken";
import ApplicationModel from "../models/Application.js";

export const checkAuth = (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");
  if (token) {
    try {
      const decoded = jwt.verify(token, "secret123");
      req.userId = decoded._id;

      next();
    } catch (error) {
      return res.status(403).json({
        message: "Нет доступа",
      });
    }
  } else {
    return res.status(403).json({
      message: "Нет доступа",
    });
  }
};

export const checkAccess = async (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");
  const userId = jwt.decode(token)._id;
  const applicationId = req.params.id;

  try {
    const application = await ApplicationModel.findById(applicationId);
    if (!application) {
      return res.status(404).json({
        message: "Активность не найдена",
      });
    }
    if (application.user.toString() !== userId) {
      return res.status(403).json({
        message: "Нет доступа",
      });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Ошибка сервера",
    });
  }
};
