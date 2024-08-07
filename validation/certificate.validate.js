const Joi = require('joi');

function certificate(obj){
   const schema=Joi.object({
  studentId: Joi.string(),
  dateAcquired: Joi.date().required(),
  course: Joi.string().required(),
}  )
return schema.validate(obj);
}

module.exports=certificate