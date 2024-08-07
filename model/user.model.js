const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, default:"" },
    password: { type: String, required: true },
    phoneNumber: { type: String },
    age: { type: Number },
    score: { type: Number , default:0 },
    graduationYear: { type: Number },
    about: { type: String },
    nationality: { type: String },
    country: { type: String },
    city: { type: String },
    university: { type: String },
    major: { type: String },
    userId: { type: Number, unique: true },
    isEmailVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    token: { type: String },
    role: { type: String, enum: ["admin", "instructor", "student", "editor"], default: "student", },
    profilePhoto: {
      type: Object, default: { url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png", publicId: null, },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id:false
  }
);

// { fieldName: 'articles', ref: 'Article', foreignField: 'author' },
// { fieldName: 'certificates', ref: 'Certificate', foreignField: 'user' },
// { fieldName: 'lessons', ref: 'Lesson', foreignField: 'user' },
const virtualFields = [
  { fieldName: 'Course', ref: 'Course', foreignField: 'enroll' },
  { fieldName: 'Cv', ref: 'Cv', foreignField: 'owner' },
  { fieldName: 'Certificate', ref: 'Certificate', foreignField: 'studentId' },
];

virtualFields.forEach((field) => {
  userSchema.virtual(field.fieldName, {
    ref: field.ref,
    localField: '_id',
    foreignField: field.foreignField,
  });
});


userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { id: this._id, userId: this.userId, role: this.role },
    process.env.JWT_SECRET_KEY
  );
};
userSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.password;
  delete obj.token
  return obj;
}
const User = mongoose.model("User", userSchema);

module.exports = User;