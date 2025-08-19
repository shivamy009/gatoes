import { Router } from 'express';
import { createForm, getForms, getForm, updateForm, deleteForm, duplicateForm, analytics } from '../controllers/formController.js';
import { submitForm, getSubmissions, getSubmission, deleteSubmission } from '../controllers/submissionController.js';
import { submissionLimiter } from '../middleware/rateLimit.js';
import { validateFormFields, validateSubmissionData } from '../middleware/validation.js';
import upload from '../middleware/upload.js';

const router = Router();

router.route('/').post(validateFormFields, createForm).get(getForms);
router.route('/:id').get(getForm).put(validateFormFields, updateForm).delete(deleteForm);
router.post('/:id/duplicate', duplicateForm);
router.get('/:id/analytics', analytics);
router.post('/:id/submissions', submissionLimiter, submitForm);
router.get('/:id/submissions', getSubmissions);
router.get('/:id/submissions/:submissionId', getSubmission);
router.delete('/:id/submissions/:submissionId', deleteSubmission);

export default router;
