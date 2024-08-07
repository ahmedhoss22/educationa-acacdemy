const User = require("../model/user.model");
const validation = require("../validation/user.validation");
const { sendUserIdEmail, sendVerificationEmail } = require("../services/nodemailer.service");
const { cloudinaryUploadImage, cloudinaryRemoveImage } = require("../services/cloudinary.service");
const fs = require("fs")
const path = require("path");
const generateUniqueUserId = require("../services/uniqueId");
const Token = require("../model/verificationToken.model");
const getLogger = require('../services/logger');
const Course = require("../model/course.model");
const Cv = require("../model/cv.model");
const Certificate = require("../model/certificate.model");
const { generateToken } = require("../services/generateTokens.service");
const userInfo = getLogger("./user/userInfo")
const userError = getLogger("./user/userError")

exports.activateUserAccount = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById({ _id: id });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isActive) {
            return res.status(400).json({ message: "User account is already active" });
        }

        await sendUserIdEmail(user.email, user.userId);
        user.isActive = true;
        await user.save();
        userInfo.info(`admin activate ${id} account`)
        return res.status(200).json({ message: "Account activated successfully" });
    } catch (error) {
        userError.error(error.message)
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const verifyToken = await Token.findOne({ token });
        if (!verifyToken) {
            return res.status(400).json({ message: 'Your verification link has expired. Please resend the email.' });
        }
        const user = await User.findById(verifyToken.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        user.isEmailVerified = true;
        await user.save();
        await Token.deleteOne({ token: verifyToken.token });
        res.status(200).json({ message: 'Your email has been verified successfully.' });
    } catch (error) {
        userError.error(error.message)
        return res.status(500).json({ message: 'Internal server error.' });
    }
};
exports.getAllUsersCount = async (req, res) => {
    try {
        const count = await User.countDocuments();
        return res.status(200).json({ count });
    } catch (error) {
        userError.error(error.message)
        return res.status(500).json({ message: 'Internal server error' });
    }
};
const USERS_PER_PAGE = 6;
const SORT_BY = "createdAt";

exports.getAllUsers = async (req, res) => {
    try {
        const { pageNumber } = req.query;
        const page = parseInt(pageNumber, 10) || 1;
        let users
        if (page) {
            users = await User.find({ _id: { $ne: req.user.id } })
                .skip((page - 1) * USERS_PER_PAGE)
                .limit(USERS_PER_PAGE)
                .sort({ [SORT_BY]: -1 })
                .populate("Course")
                .populate("Cv")
                .populate("Certificate");
        } else {
            users = await User.find({}).sort({ [SORT_BY]: -1 }).populate("Course").populate("Cv").populate('Certificate')
        }
        return res.status(400).json(users.length > 0 ? users : { message: "No users found" });
    } catch (error) {
        userError.error(error.message)
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate("Course").populate("Cv")
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user);
    } catch (error) {
        userError.error(error.message)
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.newUser = async (req, res) => {
    try {
        if(!req.body.course){
            delete req.body.course
        }
        if(!req.body.email){
            delete req.body.email
        }

        const { email, userId, isActive } = req.body;
        const { error } = validation.newUser(req.body);

        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        let newUserId = userId;
        if (!newUserId) {
            newUserId = await generateUniqueUserId();
        } else {
            const existingUserId = await User.findOne({ userId: newUserId });
            if (existingUserId) {
                return res.status(400).json({ message: "This User ID is already in use" });
            }
        }
            console.log(req.body);
        const newUser = new User({ ...req.body, userId: newUserId });
        await newUser.save();
        
        if(req.body.course){
            let course =await Course.findById(req.body.course)
            course.enroll.push(newUser._id)
            await course.save()
        }
        // if (isActive === true) {
        //     await sendUserIdEmail(email, newUserId);
        //     return res.status(201).json({ message: "User account created successfully. An email has been sent to the user with their unique user ID." })
        // }
        return res.status(201).json({ message: "User created successfully." });
    } catch (error) {
        userError.error(error.message)
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.adminUpdateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = validation.adminUpdateUser(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const {  phoneNumber, userId } = req.body;
    // const existingUser = await User.findOne({ email });
    // if (existingUser && existingUser._id.toString() !== id) {
    //   return res.status(400).json({ message: "This email is already in use" });
    // }

    const existingPhoneNumber = await User.findOne({ phoneNumber });
    if (existingPhoneNumber && existingPhoneNumber._id.toString() !== id) {
      return res.status(400).json({ message: "This Number is already in use" });
    }

    const existingUserId = await User.findOne({ userId });
    if (existingUserId && existingUserId._id.toString() !== id) {
      return res.status(400).json({ message: "This User ID is already in use" });
    }
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }


    
    if(req.body.course){
        const course = await Course.find({}).exec();
        course.map(async (ele)=>{
            ele.enroll = ele.enroll.filter((student)=> student != id)
            await ele.save()
        })
        let newCourse = await Course.findById(req.body.course)
        newCourse.enroll.push(id)
        await newCourse.save()
    }



    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    userError.error(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateUser = async (req, res) => {
    try {

        const { id } = req.params;
        const { error } = validation.updateUser(req.body);
        const { email: newEmail } = req.body
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const user = await User.findById(id)

        if (newEmail && newEmail !== user.email) {
            const existingUser = await User.findOne({ email: newEmail });
            if (existingUser) {
                return res.status(400).json({ message: "This email is already in use" });
            }
            user.email = newEmail;
            user.isEmailVerified = false;
            const verificationToken = generateToken();
            sendVerificationEmail(newEmail, verificationToken);

            return res.json({ message: 'Email updated. Verification email sent.' });
        }

        if (req.file) {
            const imagePath = path.resolve(__dirname, "../uploads", req.file.filename);
            const result = await cloudinaryUploadImage(imagePath);
            const user = await User.findById(req.user._id);

            if (user.profilePhoto.publicId !== null) {
                await cloudinaryRemoveImage(user.profilePhoto.publicId);
            }

            user.profilePhoto = {
                url: result.secure_url,
                publicId: result.public_id,
            };

            await user.save();
            fs.unlinkSync(imagePath);
        }

        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true }).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "User updated successfully", updatedUser });
    } catch (error) {
        userError.error(error.message)
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.profilePhoto?.publicId) {
            await cloudinaryRemoveImage(user.profilePhoto.publicId);
        }
        await Course.updateMany({ enroll: user._id }, { $pull: { enroll: user._id } });
        await Cv.deleteMany({ owner: user._id });
        await Certificate.deleteMany({ studentId: user._id });

        await User.findByIdAndDelete(id)
        const users = await User.find()
        return res.status(200).json({ message: "User deleted successfully", users });
    } catch (error) {
        userError.error(error.message)
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.getUserData = async (req, res) => {
    try {
        res.send(req.user)
    } catch (error) {
        userError.error(error.message)
        return res.status(500).json({ message: "Internal server error" });
    }
}
exports.getInstructorsData = async (req, res) => {
    try {
        let data = await User.find({ role: "instructor" })
        res.send(data)
    } catch (error) {
        userError.error(error.message)
        return res.status(500).json({ message: "Internal server error" });
    }
}

exports.getAllUserData = async (req, res) => {
    try {
        let data = await User.find({ _id: { $ne: req.user._id } })
        res.send(data)
    } catch (error) {
        userError.error(error.message)
        return res.status(500).json({ message: "Internal server error" });
    }
}