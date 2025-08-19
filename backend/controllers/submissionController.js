import Form from '../models/Form.js';
import Submission from '../models/Submission.js';

export const submitForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ error: 'Form not found' });
    if (form.submissionLimit && form.submissionsCount >= form.submissionLimit) {
      return res.status(403).json({ error: 'Submission limit reached' });
    }
    const files = (req.files || []).map(f => ({
      fieldName: f.fieldname,
      originalName: f.originalname,
      mimeType: f.mimetype,
      path: f.path,
      size: f.size,
      url: f.filename ? `/uploads/${f.filename}` : undefined,
    }));
    const submission = await Submission.create({
      form: form._id,
      data: req.body,
      files,
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