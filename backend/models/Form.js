import mongoose from 'mongoose';

const FieldSchema = new mongoose.Schema({
  type: { type: String, required: true }, // text, email, number, select, checkbox, radio, textarea, file
  label: { type: String, required: true },
  name: { type: String, required: true },
  placeholder: String,
  required: { type: Boolean, default: false },
  options: [String], // for select, radio, checkbox
  validation: {
    pattern: String,
    minLength: Number,
    maxLength: Number,
    min: Number, // for number fields
    max: Number, // for number fields
  }
}, { _id: false });

const FormSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  fields: [FieldSchema],
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  thankYouMessage: { type: String, default: 'Thank you for your submission!' },
  submissionLimit: Number,
  submissionsCount: { type: Number, default: 0 },
  allowDuplicates: { type: Boolean, default: true },
  collectEmails: { type: Boolean, default: false },
  requireLogin: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Form', FormSchema);
