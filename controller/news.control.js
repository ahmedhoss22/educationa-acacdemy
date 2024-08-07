const NewsModel = require('../model/news.model')
const fs = require("fs")
const loggerEvent = require("../services/logger")
const logger = loggerEvent("news")
const path = require("path")
const validate = require('../validation/news.validation')
const subscribtionModel = require('../model/subscription.model')
const { sendSubscribeNewsEmail } = require('../services/nodemailer.service')

const createNews = async (req, res) => {
  try {
    const { error } = validate.createNews(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    if (!req.file) {
      return res.status(400).json({ message: "no image provided" });
    }
    const news = new NewsModel(req.body);
    news.image = `/api/file/${req.file.filename}`;
    const result = await news.save();
    const emails = await subscribtionModel.find();
      await sendSubscribeNewsEmail(emails, result);
    res.status(201).json({
      status: 201,
      message: "News created successfully",
      data: result,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      status: 500,
      message: "Failed to create news",
      error: error.message,
    });
  }
};


const showNews = async (req, res) => {
  try {
    const news = await NewsModel.find({}).sort({ publishingDate: -1 })
    if (!news) {
      logger.error("No news found")
      return res.status(404).json({
        message: "No news found"
      })
    }
    res.status(200).json({
      status: 200,
      data: news,
    });
  }
  catch (error) {
    logger.error(error.message)
    res.status(500).json({
      status: 500,
      message: error.message
    });
  }
}

const showNew = async (req, res) => {
  try {
    const { id } = req.params
    const news = await NewsModel.findById(id);
    let arr = []
    
    if (!news) {
      logger.error(`can not find any news with ID : ${id}`)
      return res.status(404).json({ message: `can not find any news with ID : ${id}` })
    }
    res.status(200).json({
      status: 200,
      data: news.reverse(),
    });
  }
  catch (error) {
    logger.error(error.message)
    res.status(500).json({
      status: 500,
      message: error.message
    });
  }

}

const updateNews = async (req, res) => {
  try {
    console.log(req.body);
    const { id } = req.params;
    const { error } = validate.updateNews(req.body)
    // if (error) {
      // return res.status(400).json({ message: error.details[0].message })
    // }
    const news = await NewsModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!news) {
      logger.error(`Cannot find any news with ID: ${id}`);
      return res.status(404).json({ message: `Cannot find any news with ID: ${id}` });
    }

    if (req.file) {
      if (news.image !== "uploads/news/default.png") {
        let fileName= news?.image.split("/")[3]
        fs.unlinkSync(`uploads/${fileName}`);
      }
      news.image = `/api/file/${req.file.filename}`;
    }

    await news.save();

    res.status(200).json({
      status: 200,
      data: news,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      status: 500,
      message: "Failed to update news",
      error: error.message,
    });
  }
};

const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await NewsModel.findByIdAndDelete(id);

    if (!news) {
      logger.error(`Cannot find any news with ID: ${id}`);
      return res.status(404).json({ message: `Cannot find any news with ID: ${id}` });
    }

    if (news.image !== "uploads/news/default.png") {
      let fileName= news?.image.split("/")[3]
      fs.unlinkSync(`uploads/${fileName}`);
      }

    res.status(200).json({
      status: 200,
      message: "News deleted successfully",
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      status: 500,
      message: "Failed to delete news",
      error: error.message,
    });
  }
};

const showPublishedNews= async (req,res)=>{
  try {
    let data = await NewsModel.find({published:true})
    res.send(data)
  } catch (error) {
    logger.error(error.message)
    res.status(500).json({
      status: 500,
      message: error.message
    });
  }
}

const publishNews= async (req,res)=>{
  try {
    let {id} =req.params
    await NewsModel.findByIdAndUpdate(id,req.body)
    .then(()=>res.send())
    .catch((error)=>{
      logger.error(error.message);
      res.status(500).json({
        status: 500,
        message: "Failed to create news",
        error: error.message,
      });
    })
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      status: 500,
      message: "Failed to create news",
      error: error.message,
    });
  }
}

module.exports = { createNews, showNews, showNew, updateNews, deleteNews,showPublishedNews,publishNews };