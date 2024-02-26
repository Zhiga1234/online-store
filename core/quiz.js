const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  question: {
    en: String,
    ru: String
  },
  options: [{
    en: String,
    ru: String
  }], 
  correctAnswerIndex: Number 
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = {Quiz};
