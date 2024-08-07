const Exam = require("../model/exam.model")
const loggerEvent = require("../services/logger")
const logger=loggerEvent("exam")
const Course = require("../model/course.model")

const examController={
    createExam :async(req,res)=>{
        try {   
            logger.info(req.body)
            let userId = req.user._id
            const newExam = await Exam({...req.body,instructor:userId});
            await newExam.save()

            const course = await Course.findById(req.body.course);

            // Push the new exam ID to the "exams" array
            course.exams.push(newExam._id);

            // Save the updated course document
            await course.save()
                .then(()=>res.status(201).send({message:"Exam Created !!"}))
        } catch (error) {
            logger.error(error.message)
            res.status(500).send({error:error.message})
        }
    },
    updateExam:async (req,res)=>{
        try {
          await  Exam.findByIdAndUpdate(req.params.id,req.body)
            .then(()=>res.send({message:"Updated !!"}))
        } catch (error) {
            logger.error(error.message)
            res.status(500).send({error:error.message})
        }
    },
    getAmdinExams:async(req,res)=>{
        try {
            let data = await Exam.find({instructor: req.user._id}).populate("instructor").populate("course")
            res.send(data)
        } catch (error) {
            logger.error(error.message)
            res.status(500).send({error:error.message})
        }
    },
    deleteExam : async (req,res)=>{
        try {
            let {id} = req.params

            await Exam.findByIdAndDelete(id)
            
            const course = await Course.findById(req.body.course);
            let index= course.exams.findIndex((ele)=>ele==id)
            course.exams.splice(index,1)

            await course.save()
            .then(()=>res.send())
        } catch (error) {
            logger.error(error.message)
            res.status(500).send({error:error.message})
        }
    },
    getAllExams :async (req,res)=>{
        try {
            let data = await Exam.find({}).populate("instructor").populate("course")
            res.send(data)
        } catch (error) {
            logger.error(error.message)
            res.status(500).send({error:error.message})
        }
    }
}

module.exports = examController