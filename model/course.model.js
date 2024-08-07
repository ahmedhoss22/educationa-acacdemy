const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    level: {
        type: Number,
        required: true,
        trim: true
    },
    numLessons: {
        type: Number,
        required: true,
        trim: true
    },
    language: {
        type: String,
        required: true,
        trim: true
    },
    startDate: {
        type: String,
        required: true,
        trim: true
    },
    duration: {
        type: Number,
        required: true,
        trim: true
    },
    certificate: {
        type: Boolean,
        default: false
    },
    intro: {
        type: String,
        required: true,
        trim: true
    },
    assessment: {
        type: String,
        required: true,
        trim: true
    },
    requirements: {
        type: String,
        required: true,
        trim: true
    },
    materials: {
        type: String,
        required: true,
        trim: true
    },
    publishDate: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
        trim: true,
        default: 'uploads/courses/default.png'
    },
    level:{
        type : Number,
        required : true,
        trim : true
    },
    numLessons:{
        type : Number,
        required : true,
        trim : true
    },
    language:{
        type : String,
        required : true,
        trim : true
    },
    startDate:{
        type : String,
        required : true,
        trim : true
    },
    duration:{
        type : Number,
        required : true,
        trim : true
    },
    certificate:{
        type : Boolean,
        default : false
    },
    intro:{
        type : String,
        required : true,
        trim : true
    },
    assessment:{
        type : String,
        required : true,
        trim : true
    },
    requirements:{
        type : String,
        required : true,
        trim : true
    },
    materials:{
        type : String,
        required : true,
        trim : true
    },
    publishDate:{
        type : String,
        required : true,
        trim : true,
    },
    image:{
        type : String,
        trim : true,
        default:'uploads/courses/default.png'
    },
    draft:{
        type : Boolean,
        default : true,
    },
    publish:{
        type : Boolean,
        default : false,
    },
    status: 
    { 
        type: String,
        enum: ["On Going", "Ended"],
        default: "On Going" 
    },
    enroll:[
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        }
    ],
    exams:[
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Exam"
        }
    ],
},
{ 
    timestamps:true
}
);

const Course = mongoose.model('Course',courseSchema);
module.exports = Course;