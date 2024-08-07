const xlsx = require('xlsx');
const fs =require("fs")
const filePath = './data.xlsx';
const User =require("../model/user.model")
const mongoose =require("mongoose")
require("dotenv").config()

// const workbook = xlsx.readFile(filePath);
// // Choose the specific sheet you want to read (e.g., the first sheet)
// const sheetName = workbook.SheetNames[0];
// const sheet = workbook.Sheets[sheetName];

// // Convert the sheet data to a JavaScript object
// const data = xlsx.utils.sheet_to_json(sheet);

// let stdData=data.map((ele)=>{
//     let fullname = ele.الاسم.split(" ")
//     let firstName =fullname.splice(0,2).join(" ")

//     if(fullname.length<1){
//         fullname.push(" ")
//     ;}

//     let lasttName =fullname.join(" ")
//     return {
//         firstName,
//         lasttName,
//         password:ele.password,
//         age:ele.السن,
//         phoneNumber:ele["رقم الهاتف"],
//         userId:ele.id,
//         score:ele["Total score"]
//     }
// })
// fs.writeFileSync("./temp.json",JSON.stringify(stdData))
// Print the data
// console.log(stdData);
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




