import mongoose from 'mongoose';
import Option from './options.model';

const pollSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      default: 'poll',
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    options: {
      type: [Option.schema],  // Use the schema of the Option model
      required: true,
      validate: [arrayLimit, '{PATH} must have between 2 and 5 options'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

function arrayLimit(val) {
  return val.length >= 2 && val.length <= 5;
}

const Poll = mongoose.model('Poll', pollSchema);

export default Poll;
