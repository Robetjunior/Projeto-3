const express = require("express");
const router = express.Router();

const uploader = require('../configs/cloudinary');

const Announcement = require("../models/Announcement.model");
const Ong = require("../models/Ong.model");

//POST/ Create Announcement
router.post("/announcement/create", uploader.single('imgPath'), async (req, res) => {
  const { title, description, value } = req.body;
  try {
    if (!title || !description || !value) {
      res.status(400).json({ message: "Please provide all informations" });
    }

    const response = await Announcement.create({
      title,
      description,

      imgPath: req.file.url,

      value,
      ongId: req.session.currentUser._id,
    });

    const updatedOng = await Ong.updateOne( { _id: req.session.currentUser._id }, { $push: { adId: response._id } });


    res.status(201).json({ ...response });
  } catch (err) {
    console.log(`Error while creating a new  announcement ${err}`);
  }
});

//GET/Announcement list
router.get("/announcement", async (req, res) => {
  try {
    const response = await Announcement.find();
    return res.status(200).json(response);
  } catch (err) {}
});

//GET/details Announcement
router.get("/announcement/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await Announcement.findOne({ _id: id });
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
  }
});

//PATCH/Update Announcement
router.patch("/announcement/:id/edit", async (req, res) => {
  const { title, description, value, imgPath } = req.body;
  const { id } = req.params;
  try {
    if (!title || !description || !value || !imgPath) {
      return res
        .status(400)
        .json({ message: "Please provide all informations" });
    }
    const result = await Announcement.updateOne({ _id: id }, req.body);
    res.status(200).json(result);
  } catch (err) {
    throw new Error(err);
  }
});

//DELETE/ Delete Announcement
router.delete("/announcement/:id/delete", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await Announcement.deleteOne({ _id: id });
    res.status(200).json({ response });
  } catch (err) {
    throw new Error(err);
  }
});
module.exports = router;
