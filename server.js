require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose')
const cors = require("cors")
const cron = require("node-cron")
const helmet = require("helmet")
const { newPublish,coursePublish ,deleteJobs } = require('./services/scheuldeTime.service');
const cookieParser= require("cookie-parser");
const allRoutes = require('./routes/index.routes')
const limitUser = require("./services/blockAttacks")
const fs = require("fs")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limitUser)
app.use(cors({ credentials: true,origin:["http://localhost:3000","https://api.sefacademy.com"]}))
app.use(cookieParser())
app.use('/public', express.static('public'));
// app.use(helmet())

deleteJobs()
cron.schedule('0 0 * * *', () => {      // run every day at 12 mid night 
  newPublish();
  coursePublish();
});

app.use("/api", allRoutes);
app.use("/api/file",express.static("./uploads"))

const url = process.env.DB_URL;
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected !!!!");
  })
  .catch((err) => {
    console.log(err);
    console.log("Database NOT CONNECTED");
  });





// const Course = require("./model/course.model")
//   async function insertData(){
//     let data = JSON.parse(fs.readFileSync("./temp/temp.json").toString())
//     const ids = []
//     for (const item of data) {
//         const user = new User(item);
//         ids.push(user._id) 
//         await user.save();
//       }
//       console.log(ids);
//       fs.writeFileSync("./temp/ids.json",JSON.stringify(ids))

// }

// async function addIds (){
//   try {

//     let ids =JSON.parse( fs.readFileSync("./temp/ids.json").toString())
//     let coure =await Course.findById("64fcace7301ca084d87387af")
//     coure.enroll = coure.enroll.concat(ids);

//     console.log(coure);
//     await coure.save()
//   } catch (error) {
//       console.log(error.message);    
//   }
// }
// addIds()
// insertData()






const port = process.env.PORT || 5000
app.listen(port, () => { console.log(`server running on port ${port}`) })
