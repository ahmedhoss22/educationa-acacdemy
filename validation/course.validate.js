const joi = require("joi")

function courseValidte(course){
  const schema = joi.object({
      name : joi.string().required(),
      instructor : joi.string(),
      level : joi.number().positive().required().max(3),
      numLessons : joi.number().positive().required(),
      language : joi.string().required(),
      startDate : joi.string().required(),
      duration : joi.number().positive().required(),
      certificate : joi.boolean().default(false),
      intro : joi.string().required(),
      assessment : joi.string().required(),
      requirements : joi.string().required(),
      materials : joi.string().required(),
      publishDate : joi.string().required(),
      enroll: joi.array(),
  })

return schema.validate(course)
}

module.exports = courseValidte
