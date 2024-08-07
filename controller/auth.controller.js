const User = require("../model/user.model");
const bcrypt = require("bcryptjs");
const generateUniqueUserId = require("../services/uniqueId");
const validation = require("../validation/user.validation");
const { sendVerificationEmail } = require("../services/nodemailer.service");
const Token = require("../model/verificationToken.model");
const { generateToken } = require("../services/generateTokens.service");
const getLogger = require('../services/logger')
const authInfo = getLogger("./auth/authInfo")
const authError = getLogger("./auth/authError")

exports.registerUser = async (req, res) => {
    try {
        const { email } = req.body;
        const { error } = validation.registerUser(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const token = generateToken()
        // const verifyEmailLink = `${process.env.CLIENT_URL}/api/user/${token}/verify-email`;
        // let existingUser = await User.findOne({ email });
        // if (existingUser) {
        //     // if (existingUser) {
        //     //     return res.status(400).json({ message: 'User already exists.' });
        //     // }
        //     const hasToken = await Token.findOne({ userId: existingUser._id });
        //     if (hasToken) {
        //         const expirationTimestamp = new Date(hasToken.createdAt).getTime() + 10 * 60 * 1000;
        //         const currentTime = Date.now();
        //         const remainingTime = expirationTimestamp - currentTime;
        //         const remainingMinutes = Math.floor(remainingTime / (1000 * 60));
        //         return res.status(400).json({ message: `Your email already sent. You can resend your email after ${remainingMinutes} minutes.` });
        //     }

        //     // await sendVerificationEmail(email, verifyEmailLink);
        //     const newToken = new Token({ userId: existingUser._id, token });
        //     await newToken.save();
        //     return res.status(200).json({ message: "Your email verification was sent successfully." });
        // }

        const userId = await generateUniqueUserId();
        const newUser = new User({ ...req.body, userId });
        await newUser.save();
        
        const newToken = new Token({ userId: newUser._id, token });
        await newToken.save();

        // await sendVerificationEmail(email, verifyEmailLink);
        authInfo.info(`user ${email} registered successfully`)
        res.status(201).json({ message: 'You have registered successfully. Please check your email for verification.' });
    } catch (error) {
        authError.error(error.message)
        res.status(500).json({ message: 'Internal server error.' });
    }
};
exports.loginUser = async (req, res) => {
    try {
        const { userId, password } = req.body
        const { error } = validation.loginUser(req.body)
        if (error) {
            return res.status(400).json({ message: error.details[0].message })
        }

        const user = await User.findOne({ userId })
        if (!user) {
            return res.status(400).json({ message: "invalid credentials" })
        }

        // const isPasswordMatch = await bcrypt.compare(password, user.password);
        // if (!isPasswordMatch) {
        //     authInfo.warn(`user ${userId} Login but with wrong password`)
        //     return res.status(400).json({ message: "invalid credentials" });
        // }

        // if (!user.isActive) {
        //      authInfo.warn(`user ${userId} Login but not activated`)
        //     return res.status(403).json({ message: "account is not active" })
        // }

        const token = await user.generateAuthToken()
        user.token = token
        await user.save()
        console.log(process.env.NODE_ENV !== "development");
        const cookieOptions = {

            httpOnly: true,
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Expires in 3 days
            path: '/',
            secure: process.env.NODE_ENV !== "development",
            domain: process.env.CLIENT_URL,
            sameSite:"none"
          };
        
          res.cookie("token", token, cookieOptions);

          res.status(200).json({ message: "Login successful",token,user});

        authInfo.info(`user ${userId} Login successful`)
    } catch (error) {
        authError.error(error.message)
        res.status(500).json({ message: "internal server error" });
    }
}

exports.registerAdmin= async(req,res)=>{
    try {
        let {password,firstName,lastName}=req.body
        const userId = await generateUniqueUserId();
        let newUser = new User({userId,password,firstName,lastName,isActive:true,role:"admin"})
        await newUser.save()
        .then(()=>res.send("Created !!"))
    } catch (error) {
        authError.error(error.message)
        res.status(500).json({ message: "internal server error" });
    }
}