import Form from '../models/Form.js';
import Submission from '../models/Submission.js';

export const createForm = async (req, res) => {
  try {
    const form = await Form.create(req.body);
    res.status(201).json(form);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const getForms = async (req, res) => {
  try {
    const forms = await Form.find().sort({ createdAt: -1 });
    res.json(forms);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const getForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ error: 'Form not found' });
    res.json(form);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const updateForm = async (req, res) => {
  try {
    const form = await Form.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!form) return res.status(404).json({ error: 'Form not found' });
    res.json(form);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const deleteForm = async (req, res) => {
  try {
    const form = await Form.findByIdAndDelete(req.params.id);
    if (!form) return res.status(404).json({ error: 'Form not found' });
    res.json({ message: 'Form deleted' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const duplicateForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ error: 'Form not found' });
    const clone = form.toObject();
    delete clone._id;
    clone.title = clone.title + ' (Copy)';
    const newForm = await Form.create(clone);
    res.status(201).json(newForm);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const analytics = async (req, res) => {
  try {
    const formId = req.params.id;
    const submissions = await Submission.find({ form: formId });
    const form = await Form.findById(formId);
    if (!form) return res.status(404).json({ error: 'Form not found' });
    res.json({
      total: submissions.length,
      createdAt: form.createdAt,
      updatedAt: form.updatedAt,
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
