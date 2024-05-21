import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
});

const Option = mongoose.model('Option', optionSchema);

export default Option;
