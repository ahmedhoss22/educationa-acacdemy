const joi = require("joi")

function cvValidte(news){
  const schema = joi.object({
      title:joi.string().required(),
      content:joi.string().required(),
      category:joi.string().required(),
      publishingDate:joi.date().required(),
  })
  return schema.validate(news)
}

module.exports = cvValidte