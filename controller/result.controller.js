const Results = require("../model/result.model");
const fs= require('fs')

const saveResults = (req, res) => {
    const { ExamId, UserId, result, points, achived, isCorrect, totalScore, numOfQuestionsAnswered,numOfQuestionsNotAnswered, numOfCorrectAnswers } = req.body;
  
    const newResult = new Results({
      ExamId,
      UserId,
      result,
      points,
      achived,
      isCorrect,
      totalScore,
      numOfQuestionsAnswered,
      numOfQuestionsNotAnswered,
      numOfCorrectAnswers,
    });
  
    newResult.save()
      .then(() => {
        res.status(200).json({ message: 'Results successfully saved to the database.' });
      })
      .catch((error) => {
        console.error('Error saving results:', error);
        res.status(500).json({ error: 'Failed to save results to the database.' });
      });
  };

  const getResultsByExamAndUser = (req, res) => {
    const { ExamId } = req.params;
  
    Results.findOne({ ExamId })
      .then((result) => {
        if (!result) {
          return res.status(404).json({ message: 'Results not found for the specified ExamId and UserId.' });
        }
  
        res.status(200).json(result);
      })
      .catch((error) => {
        console.error('Error getting results:', error);
        res.status(500).json({ error: 'Failed to get results from the database.' });
      });
  };
  
  module.exports = {
    saveResults,
    getResultsByExamAndUser,
  };