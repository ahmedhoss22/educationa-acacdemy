const { Schema, model } = require("mongoose");

const resultModel = new Schema({
    ExamId: { type: Schema.Types.ObjectId, ref: 'Exam' },
    UserId: { type: Schema.Types.ObjectId, ref: 'User' },
    result: { type: Array, default: [] },
    points: { type: Number, default: 0 },
    achived: { type: String, default: 'fail' },
    createdAt: { type: Date, default: Date.now },
    isCorrect: {type: Boolean, default: false},
    totalScore: { type: Number, default: 0 },
    numOfQuestionsAnswered: { type: Number, default: 0 },
      numOfQuestionsNotAnswered: { type: Number, default: 0 },
      numOfCorrectAnswers: { type: Number, default: 0 },
})

const Result = model('Result', resultModel);

module.exports = Result;