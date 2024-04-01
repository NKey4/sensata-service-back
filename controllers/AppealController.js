import AppealModel from "../models/Appeal.js";

const getAll = async (req, res) => {
  try {
    const appeals = await AppealModel.find({ user: req.userId }).populate("");
    res.json(appeals);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Ошибка в получении всех обращений",
    });
  }
};

const AddressControler = {
  getAll,
};

export default AddressControler;
