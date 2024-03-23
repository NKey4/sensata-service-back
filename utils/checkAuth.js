const jwt = require("jsonwebtoken");
const PostModel = require("../Models/Application");

module.exports.checkAuth = (req, res, next) => {
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

module.exports.checkAccess = async (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");
  const userId = jwt.decode(token)._id;
  const postId = req.params.id;

  try {
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Активность не найдена",
      });
    }
    if (post.user.toString() !== userId) {
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
