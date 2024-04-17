import AddressModel from "../models/Address.js";
import UserModel from "../models/User.js";

const addAddress = async (req, res) => {
  try {
    const { street, city, flat } = req.body;
    const newAddress = new AddressModel({
      street,
      city,
      flat,
      user: req.userId,
    });
    await newAddress.save();

    await UserModel.findByIdAndUpdate(req.userId, {
      $push: { addresses: newAddress._id },
    });
    console.log(newAddress);
    res.json(newAddress);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Ошибка",
    });
  }
};

const getAll = async (req, res) => {
  try {
    const addresses = await AddressModel.find({ user: req.userId });
    res.json(addresses);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Ошибка в получении всех адресов",
    });
  }
};

const AddressControler = {
  addAddress,
  getAll,
};

export default AddressControler;
