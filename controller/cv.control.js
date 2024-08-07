
const fs = require("fs")
const CvModel = require('../model/cv.model');
const validation = require("../validation/cv.validate")
const getLogger = require('../services/logger')
const logger=getLogger("cv")

const createCv = async (req,res) => {
    try
    {   
          const {error} = cv.validate(req.body)
      if(error){
            logger.error(error.message)
            return res.status(400).json({error:error.message})
        }
      
        if(req.file)
        {
            cv.photo = req.file.path
        }
        logger.info ( req.body)
        const result = await cv.save();
        logger.info ( 'Cv created successfully' )
        res.status(201).json({
            status : 201,
            message : 'Cv created successfully',
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

 const showCv = async (req,res)=>{
     try
     {
         const {id} = req.params
         const cv = await CvModel.findById(id);
         if(!cv){
            logger.error(`cv not found`)
             res.status(404).json({message:"cv not found"})
             
         }
         logger.info(`cv with id ${id} is shown`)
         res.status(200).json({
             status : 200,
             data: cv,
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

const updateCv = async (req,res)=>{
    try
    {
        const {id} = req.params
        const cv = await CvModel.findByIdAndUpdate(id,req.body,{
            new:true,
            runValidators:true
        });

        if(!cv){
            logger.error(`can not find required cv`)
            res.status(404).json({message:`can not find required cv`})
        }
        if(req.file)
        {
            if(cv.photo)
                fs.linkSync(`${cv.photo}`)
            
        }
        logger.info(`cv with id ${id} updated successfully`)
        res.status(200).json({
            status : 200,
            data: cv,
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

const deleteCv = async (req,res)=>{
    try
    {
        const _id = req.params.id
        console.log(_id)
        const cv = await CvModel.findByIdAndDelete(_id);
        if(!cv){
            
            logger.error(error.message)
            res.status(404).json({message:`no cv found`})
        }
        
            fs.unlinkSync(`${cv.photo}`)
        logger.info(`cv with id ${id} deleted successfully`)
        res.status(200).json({
            status : 200,
            data: cv,
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






module.exports = {createCv, showCv, updateCv , deleteCv}