const mongoose=  require("mongoose")

const subscribtionSchema =new mongoose.Schema({
    email:{type:String,trim:true,uniqe:true}
},{
    timestamps:true
})

const subscribtionModel= mongoose.model("Subscribtion",subscribtionSchema)
module.exports = subscribtionModel