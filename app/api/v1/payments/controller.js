const Payment = require("./model");
const { StatusCodes } = require("http-status-codes");
const CustomAPI = require("../../../errors");
const fs = require("fs");
const config = require("../../../config");

const getAllPayment = async (req, res, next) => {
    try {
      const { status } = req.query;
  
      let condition = { user: req.user.id };
  
      if (status) {
        condition = { ...condition, status: status };
      }
  
      const result = await Payment.find(condition);
  
      res.status(StatusCodes.OK).json({ data: result });
    } catch (err) {
      next(err);
    }
  };


const createPayment = async (req, res, next) => {
  try {
    const { type, status } = req.body;
    const user = req.user.id;

    let result;

    console.log("req.file >>");
    console.log(req.file);
    if (!req.file) {
      result = new Payment({ type, user, status });
    } else {
      result = new Payment({ type, imageUrl: req.file.filename, user, status });
    }

    await result.save();

    res.status(StatusCodes.CREATED).json({ data: result });
  } catch (err) {
    next(err);
  }
};

const getOnePayment = async (req, res, next) => {
  try {
    const { id: paymentId } = req.params;
    const result = await Payment.findOne({ _id: paymentId, user: req.user.id });

    if (!result) {
      throw new CustomAPI.NotFoundError("No Payment With Id :" + paymentId);
    }

    res.status(StatusCodes.OK).json({ data: result });
  } catch (err) {
    next(err);
  }
};

const updatePayment = async (req, res, next) => {
  try {
    const { type,status } = req.body;
    const user = req.user.id;
    const { id: paymentId } = req.params;
    let result = await Payment.findOne({ _id: paymentId, user });

    if (!req.file) {
      result.type = type;
      result.status = status;
    } else {
      //delete image to update
      let CurrentImage = `${config.rootPath}/public/uploads/${result.imageUrl}`;

      if (fs.existsSync(CurrentImage)) {
        fs.unlinkSync(CurrentImage);
      }

      result.type = type;
      result.status = status;
      result.imageUrl = req.file.filename;
    }

    await result.save();

    res.status(StatusCodes.OK).json({ data: result });
  } catch (err) {
    next(err);
  }
};

const deletePayment = async (req, res, next) => {
  try {
    const user = req.user.id;
    const { id: paymentId } = req.params;

    let result = await Payment.findOne({ _id: paymentId, user });

    if (!result) {
        throw new CustomAPI.NotFoundError("No Payment With Id :" + paymentId);
      }
  

    let CurrentImage = `${config.rootPath}/public/uploads/${result.imageUrl}`;

    if (fs.existsSync(CurrentImage)) {
      fs.unlinkSync(CurrentImage);
    }

    await result.remove();
    res.status(StatusCodes.OK).json({ data: result });
  } catch (err) {
    next(err);
  }
};

const changeStatusPayment= async(req, res, next) =>{
  try {
    const user = req.user.id;
    const { id: paymentId } = req.params;

    let result = await Payment.findOne({ _id: paymentId, user });

    if (!result) {
        throw new CustomAPI.NotFoundError("No Payment With Id :" + paymentId);
      }

      result.status = !result.status;
      // result.status = result.status ? false : true;
      await result.save();

      res.status(StatusCodes.OK).json({ data: result})
  } catch (err) {
    next(err)
    
  }
}

module.exports = {
  getAllPayment,
  createPayment,
  getOnePayment,
  updatePayment,
  deletePayment,
  changeStatusPayment
};
