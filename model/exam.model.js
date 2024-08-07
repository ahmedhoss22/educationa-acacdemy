const mongoose= require("mongoose")

const formSchema= new mongoose.Schema({
    course:{type : mongoose.Schema.Types.ObjectId , ref:"Course" , required:true},
    instructor:{type : mongoose.Schema.Types.ObjectId , ref:"User" , required:true},
    date:{type:String , trim:true,required:true},
    link:{type:String , trim:true,required:true},
    duration:{
        type:Number,
        trim: true,
        required:true
    }
})

const Exam = mongoose.model("Exam",formSchema)
module.exports = Exam