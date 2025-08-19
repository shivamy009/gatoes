import mongoose from 'mongoose';

const SubmissionSchema = new mongoose.Schema({
  form: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
  data: {},
  files: [{
    fieldName: String,
    originalName: String,
    mimeType: String,
    url: String,
    size: Number,
    publicId: String, // Cloudinary public ID for deletion
  }]
}, { timestamps: true });

export default mongoose.model('Submission', SubmissionSchema);
