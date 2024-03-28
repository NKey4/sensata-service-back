import ApplicationModel from "../Models/Application.js";
import CounterModel from "../Models/Counter.js";

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
      yandexAddress: req.body.address_id,
      location: req.body.location,
      workType: req.body.workType,
      reason: req.body.reason,
      description: req.body.description,
      user: req.userId,
      dataMessage: req.body.dataMessage,
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

const getAll = async (req, res) => {
  try {
    const applications = await ApplicationModel.find({ user: req.userId })
      .populate("user")
      .exec();
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
  getAll,
  remove,
  update,
};

export default ApplicationController;
