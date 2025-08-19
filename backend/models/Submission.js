import mongoose from 'mongoose';

const SubmissionSchema = new mongoose.Schema({
  form: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
  data: {},
  files: [{
    fieldName: String,
    originalName: String,
    mimeType: String,
    path: String,
    size: Number,
    url: String,
  }]
}, { timestamps: true });

export default mongoose.model('Submission', SubmissionSchema);
