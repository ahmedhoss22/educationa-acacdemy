const mongoose =require('mongoose')

const certificateSchema = new mongoose.Schema({
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:'User',
      required: true
    },
    dateAcquired: {
      type: Date,
      required: true
    },
    uploadDate: {
      type: Date,
      default: Date.now
    },
    course: {
      type:mongoose.Schema.Types.ObjectId, 
      ref: 'Course',
      required: true
    },
    certificateImage: {
      type: String,
      required: true
    }
  });
  
  // Create the certificate model
  const Certificate = mongoose.model('Certificate', certificateSchema);
  
  module.exports = Certificate;