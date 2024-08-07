const fs = require("fs")
const CourseModel = require('../model/course.model');

const courseValidte = require('../validation/course.validate')
const loggerEvent= require("../services/logger")
const logger = loggerEvent("course")


const createCourse = async (req,res) => {
    try
    {
        const course = new CourseModel(req.body);
        if(req.file)
        {
            course.image =`/api/file/courses/${req.file.filename}`
        }

        const {error} = courseValidte(req.body)
        if(error){
            logger.error(error.message)
            return res.status(400).json({error:error.details[0].message})
        }

        const result = await course.save();

        res.status(201).json({
            status : 201,
            message : 'Course created successfully',
            data: result,
        });
    }
    catch(error)
    {
        logger.error(error.message)
        res.status(400).json({
            status : 400,
            message : error.message
        });
    }
}
const showCourses = async (req,res)=>{
    try
    {
        const courses = await CourseModel.find({}).populate('enroll').populate('instructor').populate("exams")
        if (!courses) {
            logger.error({
                message:"No courses found"
            })
            return res.status(404).json({
                message:"No courses found"
            })
        }
        res.status(200).json({
            status : 200,
            data: courses,
        });
    }
    catch(error)
    {
        logger.error(error.message)
        res.status(400).json({
            status : 400,
            message : error.message
        });        
    }
    
}
const showCourse = async (req,res)=>{
    try
    {
        const {id} = req.params
        const course = await CourseModel.findById(id).populate('enroll').populate('instructor');
        if(!course){
            logger.error(`can not find any course with ID : ${id}`)
            return res.status(404).json({message:`can not find any course with ID : ${id}`})
        }
        res.status(200).json({
            status : 200,
            data: course,
        });
    }
    catch(error)
    {
        logger.error(error.message)
        res.status(400).json({
            status : 400,
            message : error.message
        });        
    }
    
}

const updateCourse = async (req,res)=>{
    try
    {
        const {id} = req.params
        let data = req.body
        console.log(data);
        if(req.file)
        {
            // if(course.image != "uploads/courses/default.png")
            // {
            //     let fileName= course?.image.split("/")[4]
            //     fs.unlinkSync(`uploads/courses/${fileName}`);
            // }
            data.image =`/api/file/courses/${req.file.filename}`
        }
        const course = await CourseModel.findByIdAndUpdate(id,data,{
            new:true,
            runValidators:true
        });
        if(!course){
            logger.error(`can not find any course with ID : ${id}`)
            return res.status(404).json({message:`can not find any course with ID : ${id}`})
        }

        res.status(200).json({
            status : 200,
            data: course,
        });
    }
    catch(error)
    {
        logger.error(error.message)
        res.status(400).json({
            status : 400,
            message : error.message
        });        
    }
}

const deleteCourse = async (req,res)=>{
    try
    {
        const _id = req.params.id
        
        const course = await CourseModel.findByIdAndDelete(_id);
        if(!course){
            logger.error(error.message)
            return res.status(404).json({message:`can not find any course with ID : ${id}`})
        }


        // if(course.image != "uploads/courses/default.png")
        // {
        //     let fileName= course?.image.split("/")[3]
        //     fs.unlinkSync(`uploads/${fileName}`);
        // }

        res.status(200).json({
            status : 200,
            data: course,
        });
    }
    catch(error)
    {
        logger.error(error.message)
        res.status(400).json({
            status : 400,
            message : error.message
        });        
    }
    
}

const enroll = async (req,res) => {
    try
    {
        const userId = req.params.id
        const courseId = req.body.courseId 
        const course = await CourseModel.findById(courseId);

        if(!course)
        {
            logger.error({message:`can not find any course with ID : ${courseId}`})
            return res.status(404).json({message:`can not find any course with ID : ${courseId}`})
        }
        if(course.enroll.includes(userId))
        {
            logger.error({message:`This user exists !!!`})
            return res.status(422).json({message:`This user exists !!`})
        }
        else
        {
            course.enroll.push(userId);
        }

        await course.save()

        res.status(200).json({message : req.body})

    }
    catch(error)
    {
        logger.error(error.message)
        res.status(400).json({message : error.message})
    }
}

module.exports = {createCourse,showCourses,showCourse,updateCourse,deleteCourse,enroll};
