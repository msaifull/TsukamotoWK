const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide title"],
    minLength: 3,
    maxLength: 50,
  },
  price: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    required: [true, 'Please Provide Date']
  },
  cover: {
    type: String,
    required: [true, 'Please Provide Cover']
  },
  about: {
    type:'string',
    required: [true, 'Please Provide about']

  },
  venueName: {
    type: String,
    required: [ true, 'please provide venue name']
  },
  tagLine: {
    type : String,
    required:[true,'Please provie tagline']
  },
  keyPoint: {
    type: [String],
    // required: [true, 'Please provide Keypoint']
  },
  status:{
    type: Boolean,
    enum: [true, false],
    default: true
  },
  stock: {
    type: Number,
    default: 0
  },
  category: {
    type: mongoose.Types.ObjectId,
    ref : 'Category',
    required: true
  },
  speaker: {
    type: mongoose.Types.ObjectId,
    ref : 'Speaker',
    required: true
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref : 'User',
    required: true
  },
},
{ timestamps: true}
); 


module.exports = mongoose.model('Event', EventSchema);