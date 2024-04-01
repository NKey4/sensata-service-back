import AddressModel from "../models/Address.js";

const addAddress = async (req, res) => {
  try {
    const { street, city } = req.body;
    const newAddress = new AddressModel({ street, city, user: req.userId });
    await newAddress.save();
    const addresses = await AddressModel.find({ user });
    res.json(addresses);
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
