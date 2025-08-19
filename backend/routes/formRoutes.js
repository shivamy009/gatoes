import { Router } from 'express';
import { createForm, getForms, getForm, updateForm, deleteForm, duplicateForm, analytics } from '../controllers/formController.js';
import { submitForm, getSubmissions, getSubmission } from '../controllers/submissionController.js';
import { submissionLimiter } from '../middleware/rateLimit.js';
import upload from '../middleware/upload.js';

const router = Router();

router.route('/').post(createForm).get(getForms);
router.route('/:id').get(getForm).put(updateForm).delete(deleteForm);
router.post('/:id/duplicate', duplicateForm);
router.get('/:id/analytics', analytics);
router.post('/:id/submissions', submissionLimiter, upload.array('files'), submitForm);
router.get('/:id/submissions', getSubmissions);
router.get('/:id/submissions/:submissionId', getSubmission);

export default router;
