
const mongoose = require ('mongoose')
const validator = require ('validator')

const cvSchema = new mongoose.Schema ({
    firstname: {
        type: String ,
        required :true,
        trim : true ,
         validate(val){
          let  firstname = /^([a-zA-Z])+$/;
          if(!firstname.test(val))
          throw new Error ("invalid fname ")
        }
    },
    lastname: {
        type: String ,
        required :true,
        trim : true,
        validate(val){
         let  lastname = /^([a-zA-Z])+$/;
         if(!lastname.test(val))
         throw new Error ("invalid fname ")
       }
    },
    profission : {
        type : String ,
        required :true,
        trim : true
    },
    country: {
        type : String ,
        required :true,
        trim : true
    },
    city : {
        type : String ,
        required :true,
        trim : true
    },
    mobnumber :{
        type: String,
    },
    email : {
        type: String,
         required: true,
        trim: true,
        lowercase : true,
        unique: true,
    },
    photo : {
     type: String,
     trim : true
    },
    about :{
        type : String,
        trim : true
    },
    skills : [
        {
            type : String,
            required: true,
            trim : true

        }
    ],
    experience: [{
        companyname:{
            type : String,
            trim : true
        },
        position : {
            type : String,
            trim : true
        },
        from : {
            type: String
        },
        to: {
            type: String
        },
        logo :{
            type : String
        } ,
        description: {
            type: String
        }
    }],
    honorsawards :[{
        name :{
            type :String
        },
        year:{
            type :String
        },
        describtion:{
            type :String
        }
    }] ,
    education : [{
        organisation : {
            type :String,
            // required: true
        },
        degree : {
            type :String,
            // required: true
        },
        from : {
            type :String,
            required: true
        },
        to : {
            type :String,
        required: true
        },
        describ : {
            type :String,
            required: true
        }
 } ] ,
 hobbiesintrests : [
    {
        type :String,
        required: true
    }
  ] ,
  links : [{
    websitename : {
        type : String
    },
    url : {
        type : String 
    },
}],
owner: {
    type: mongoose.Schema.Types.ObjectId,
    required:true,
    ref : 'User'  // Model
}
})
const Cv = mongoose.model( 'Cv' , cvSchema  )
module.exports =Cv