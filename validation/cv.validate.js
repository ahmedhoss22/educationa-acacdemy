const joi = require("joi")

function cvValidte(cv){
  const schema = joi.object({
     firstname : joi.string(),
      lastname : joi.string(),
      profission : joi.string(),
      country: joi.string(),
      city: joi.string(),
      phoneno:  joi.string().alphanum().length(13),
      email: joi.string(),
      photo: joi.string(),
      about: joi.string(),
      skills:joi.array().min(1) ,
      experience: joi.array().joi.object().keys({companyname:joi.string(), position: joi.string(),from: joi.string(),to: joi.string(),logo: joi.string(),description: joi.string()}), // array must have first item as string and second item as number
      honorsawards: joi.array().joi.object().keys({name:joi.string(), year: joi.string(),description: joi.string()}),
      education:joi.array().joi.object().keys({orgnization:joi.string(), degree: joi.string(),from: joi.string(),to: joi.string(),logo: joi.string(),description: joi.string()}),
      hobbiesintrests: joi.array(joi.string()),
      links: joi.array().joi.object().keys({websitename:joi.string(), url: joi.string() })
      
  })

  return schema.validate(cv)

}

module.exports = cvValidte