const LessonModel = require('../model/lesson.model.js');

const loggerEvent= require("../services/logger")
const logger = loggerEvent("lesson")



const createLesson = async (req, res) => {
    try {
        const {title, description, url, completed} = req.body
        if(!title || !description || !url)
        {
            logger.error({message : 'All fields required !!'})
            return res.status(400).json({message : 'All fields required !!'})    
        }
        // else if(typeof(completed) !== 'boolean')
        // {
        //     logger.error({message : 'this field must be true or false'})
        //     return res.status(400).json({message : 'this field must be true or false'})
        // }
        const duplicate = await LessonModel.findOne({ title }).collation({ locale: 'en', strength: 2 });
        if (duplicate !== null) {
            logger.error({message : 'this Lesson exists!!'})
            return res.status(409).json({ message: 'this Lesson exists!!' })
        }
        const lesson = new LessonModel(req.body)
        await lesson.save()
            .then(() => res.status(201).send(lesson))
            .catch((error) => {
                logger.error({message : error.message})
                res.status(500).json({ message: error.message })
            })
    }
    catch (e) {
        logger.error(e.message)
        res.status(400).json({message : e.message})
    }
}

const showlessons = async (req, res) => {
    try {
        const lessons = await LessonModel.find({}).populate('courseId');
        if(!lessons)
        {
            logger.error({message : "No lessons found!!!"})
            return res.status(404).json({message : "No lessons found!!!" })
        }
        res.status(200).json({message : "success", lessons : lessons })
    }
    catch (e) {
        logger.error({message : e.message})
        res.status(400).json({message : e.message})
    }
}

const showlesson = async (req, res) => {
    try {
        const {id} = req.params
        const lesson = await LessonModel.findById(id).populate('courseId');
        
        console.log(lesson)
        if (!lesson)
        {
            logger.error({message : "can't find lesson"})
            return res.status(404).json({message : "can't find lesson"})
        }

        res.status(200).json({message : 'success' , lesson : lesson})
    }
    catch (e) {
        logger.error({message : e.message})
        res.status(400).json({message : e.message})
    }
}


const updateLesson = async (req, res) => {
    try {
        const _id = req.params.id;

        const lesson = await LessonModel.findByIdAndUpdate({ _id }, req.body, {
            new: true,
            runValidators: true
        });
        if (!lesson) 
        {
            logger.error({message : "no lesson to update"})
            return res.status(404).json({message : "no lesson to update"})
        }
        res.status(200).json({message : "Lesson Updated Successfully", lesson : lesson})
    }
    catch (e) {
        logger.error({message : e.message})
        res.status(400).json({message : e.message})
    }
}


const deleteLesson = async (req, res) => {
    try {
        const _id = req.params.id;
        const lesson = await LessonModel.findByIdAndDelete(_id)
        if (!lesson) 
        {
            logger.error({message : "no Lesson to delete"})
            return res.status(404).json({message : "no Lesson to delete"})
        }
        res.status(200).json({message : "Lesson deleted Successfully", lesson : lesson})
    }
    catch (e) {
        logger.error({message : e.message})
        res.status(400).json({message : e.message})
    }
}

module.exports = { createLesson, showlessons, showlesson, updateLesson, deleteLesson }
