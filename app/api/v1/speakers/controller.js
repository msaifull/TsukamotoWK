const Speaker = require("./model");
const { StatusCodes } = require("http-status-codes");
const CustomAPI = require("../../../errors");
const fs = require("fs");
const config = require("../../../config");

const getAllSpeaker = async (req, res, next) => {
  try {

    const {keyword} = req.query;

    let condition = {user: req.user.id};

    //filter
    if (keyword) {
      condition = {...condition, name: { $regex: keyword, $options: 'i'}}
    }
    const result = await Speaker.find( condition );

    res.status(StatusCodes.OK).json({ data: result });
  } catch (err) {
    next(err);
  }
};

const createSpeaker = async (req, res, next) => {
  try {
    const { name, role } = req.body;
    const user = req.user.id;

    let result;

    console.log("req.file >>");
    console.log(req.file);
    if (!req.file) {
      result = new Speaker({ name, role, user });
    } else {
      result = new Speaker({ name, role, avatar: req.file.filename, user });
    }

    await result.save();

    res.status(StatusCodes.CREATED).json({ data: result });
  } catch (err) {
    next(err);
  }
};

const getOneSpeaker = async (req, res, next) => {
  try {
    const { id: speakerId } = req.params;
    const result = await Speaker.findOne({ _id: speakerId, user: req.user.id });

    if (!result) {
      throw new CustomAPI.NotFoundError("No Speaker With Id :" + speakerId);
    }

    res.status(StatusCodes.OK).json({ data: result });
  } catch (err) {
    next(err);
  }
};

const updateSpeaker = async (req, res, next) => {
  try {
    const { name, role } = req.body;
    const user = req.user.id;
    const { id: speakerId } = req.params;
    let result = await Speaker.findOne({ _id: speakerId, user });

    if (!req.file) {
      result.name = name;
      result.role = role;
    } else {
      //delete image to update
      let CurrentImage = `${config.rootPath}/public/uploads/${result.avatar}`;

      if (result.avatar !== "default.png" && fs.existsSync(CurrentImage)) {
        fs.unlinkSync(CurrentImage);
      }

      result.name = name;
      result.role = role;
      result.avatar = req.file.filename;
    }

    await result.save();

    res.status(StatusCodes.OK).json({ data: result });
  } catch (err) {
    next(err);
  }
};

const deleteSpeaker = async (req, res, next) => {
  try {
    const user = req.user.id;
    const { id: speakerId } = req.params;

    let result = await Speaker.findOne({ _id: speakerId, user });

    if (!result) {
        throw new CustomAPI.NotFoundError("No Speaker With Id :" + speakerId);
      }
  

    let CurrentImage = `${config.rootPath}/public/uploads/${result.avatar}`;

    if (result.avatar !== "default.png" && fs.existsSync(CurrentImage)) {
      fs.unlinkSync(CurrentImage);
    }

    await result.remove();
    res.status(StatusCodes.OK).json({ data: result });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllSpeaker,
  createSpeaker,
  getOneSpeaker,
  updateSpeaker,
  deleteSpeaker,
};
