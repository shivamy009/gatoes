import Form from '../models/Form.js';
import Submission from '../models/Submission.js';

export const submitForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ error: 'Form not found' });
    
    // Check if form is published
    if (form.status !== 'published') {
      return res.status(403).json({ error: 'Form is not published' });
    }
    
    if (form.submissionLimit && form.submissionsCount >= form.submissionLimit) {
      return res.status(403).json({ error: 'Submission limit reached' });
    }
    
    // Attach form to request for validation middleware
    req.form = form;
    
    // Extract file URLs from request body (uploaded via frontend to Cloudinary)
    const files = [];
    Object.keys(req.body).forEach(key => {
      if (key.startsWith('file_') && req.body[key]) {
        const fieldName = key.replace('file_', '');
        files.push({
          fieldName,
          originalName: req.body[`filename_${fieldName}`] || 'uploaded_file',
          url: req.body[key],
          size: parseInt(req.body[`filesize_${fieldName}`]) || 0,
          mimeType: req.body[`filetype_${fieldName}`] || 'application/octet-stream',
        });
      }
    });

    const submission = await Submission.create({
      form: form._id,
      data: req.body,
      files,
      submittedAt: new Date(),
    });
    form.submissionsCount += 1;
    await form.save();
    res.status(201).json({ message: form.thankYouMessage, submissionId: submission._id });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const getSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ form: req.params.id }).sort({ createdAt: -1 });
    res.json(submissions);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const getSubmission = async (req, res) => {
  try {
    const { id, submissionId } = req.params;
    const submission = await Submission.findOne({ _id: submissionId, form: id });
    if (!submission) return res.status(404).json({ error: 'Submission not found' });
    res.json(submission);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const deleteSubmission = async (req, res) => {
  try {
    const { id, submissionId } = req.params;
    const submission = await Submission.findOneAndDelete({ _id: submissionId, form: id });
    if (!submission) return res.status(404).json({ error: 'Submission not found' });
    
    // Decrease form submission count
    await Form.findByIdAndUpdate(id, { $inc: { submissionsCount: -1 } });
    
    res.json({ message: 'Submission deleted successfully' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};