const ApplicationModel = require("../Models/Application");
const CounterModel = require("../Models/Counter");

module.exports.create = async (req, res) => {
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
      yandexAddress: req.body.address,
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

module.exports.getAll = async (req, res) => {
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

module.exports.remove = async (req, res) => {
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

module.exports.update = async (req, res) => {
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
