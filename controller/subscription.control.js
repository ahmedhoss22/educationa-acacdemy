const Subscribtion= require("../model/subscription.model")
const loggerEvent=require("../services/logger")
const logger=loggerEvent("subscription")

const subscription={
    addSubscriber: async (req,res) => {
        try {
            logger.info(req.body)
            const {email}=req.body
        
            if (!email){
                 return  res.status(400).send({message:"Email address is required !!"})
            }

            let isValid = await Subscribtion.find({email})
            if(isValid.length){
                return  res.status(400).send({message:"You already subscribed !!"})
            }

            const newSubscriber = new Subscribtion({email})
            await newSubscriber.save()
            .then(()=>res.json({message:"successfully subscribed "}))
            .catch((error)=>{
                logger.error(error.message)
                res.status(400).send({message:error.message})
            })
        } catch (error) {
            logger.error(error.message)
            res.status(400).send({message:error.message})
        }
    },
}
module.exports = subscription