import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema({
  poll: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Poll',
    required: true,
  },
  option: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Option',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

// Ensuring a user can only vote once per poll
voteSchema.index({ poll: 1, user: 1 }, { unique: true });

const Vote = mongoose.model('Vote', voteSchema);

export default Vote;
