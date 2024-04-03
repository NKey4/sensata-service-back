import CategoryModel from "../models/Category.js";
import LocationModel from "../models/Location.js";
import ApplicationModel from "../models/Application.js";
import CounterModel from "../models/Counter.js";

const create = async (req, res) => {
  try {
    let counter = await CounterModel.findOneAndUpdate(
      { id: "autoval" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    let seqId;
    if (!counter) {
      const newval = new CounterModel({ id: "autoval", seq: 1 });
      await newval.save();
      seqId = 1;
    } else {
      seqId = counter.seq;
    }

    const doc = new ApplicationModel({
      id: seqId,
      user: req.userId,
      requestLocationId: req.body.location,
      requestCategoryId: req.body.workType,
      requestSubCategoryId: req.body.reason,
      status_id: "660087e06c58241f9b026704",
      address: req.body.address_id,
      dataMessage: req.body.dataMessage,
      userMessage: req.body.description,
    });

    const application = await doc.save();
    res.json(application);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось создать активность",
    });
  }
};

const getOptions = async (req, res) => {
  try {
    const categories = CategoryModel.find();
    const locations = LocationModel.find();

    res.json({ categories, locations });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Ошибка в получении всех активностей",
    });
  }
};

const getAll = async (req, res) => {
  try {
    const applications = await ApplicationModel.find({ user: req.userId })
      .populate("user")
      .populate("requestLocationId")
      .populate("requestCategoryId")
      .populate("requestSubCategoryId")
      .populate("status_id")
      .populate("address")
      .exec();
    console.log(applications);
    res.json(applications);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Ошибка в получении всех активностей",
    });
  }
};

const remove = async (req, res) => {
  try {
    const postId = req.params.id;
    const deletedPost = await ApplicationModel.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res.status(404).json({ message: "Активность не найдена" });
    }

    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Ошибка удаления активности" });
  }
};

const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await ApplicationModel.updateOne(
      { _id: postId },
      {
        companyName: req.body.companyName,
        description: req.body.description,
        tags: req.body.tags,
        user: req.userId,
        imageUrl: req.body.imageUrl,
      }
    );

    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Ошибка обновления активности",
    });
  }
};
const ApplicationController = {
  create,
  getOptions,
  getAll,
  remove,
  update,
};

export default ApplicationController;
