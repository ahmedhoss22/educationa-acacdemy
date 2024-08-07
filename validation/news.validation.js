const Joi = require('joi');
const messages = {
    title: {
        'string.base': 'Title must be a string',
        'any.required': 'Title is required',
        'string.empty': 'Title is required',
    },
    content: {
        'string.base': 'Content must be a string',
        'any.required': 'Content is required',
        'string.empty': 'Content is required',
    },
    category: {
        'array.base': 'Category must be an array',
        'any.required': 'Category is required',
        'array.empty': 'Category is required',
        'array.min': 'At least one category is required',
    },
    publishingDate: {
        'string.base': 'Publishing date must be a string',
        'any.required': 'Publishing date is required',
        'string.empty': 'Publishing date is required',
    },
    image: {
        'string.base': 'Image must be a string',
        'string.empty': 'Image is required',
    }
}
function createNews(obj) {
    const schema = Joi.object({
        title: Joi.string().required().trim().empty().messages(messages.title),
        content: Joi.string().required().trim().empty().messages(messages.content),
        category: Joi.string().required().min(1).messages(),
        publishingDate: Joi.string().required().trim().empty().messages(),
        // image: Joi.string().trim().empty().default('uploads/news/default.png').messages(messages.image),
    })
    return schema.validate(obj);
}
function updateNews(obj) {
    const schema = Joi.object({
        title: Joi.string().trim().messages(messages.title),
        content: Joi.string().trim().messages(messages.content),
        category: Joi.string().trim(),
        publishingDate: Joi.string().trim(),
        // image: Joi.string().trim().empty().default('uploads/news/default.png').messages(messages.image),
    })
    return schema.validate(obj);
}
module.exports = { createNews,updateNews }