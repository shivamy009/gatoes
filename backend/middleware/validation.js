// Field validation middleware
export const validateFormFields = (req, res, next) => {
  const { fields } = req.body;
  
  if (!fields || !Array.isArray(fields)) {
    return res.status(400).json({ error: 'Fields must be an array' });
  }

  // Check if at least one field is present
  if (fields.length === 0) {
    return res.status(400).json({ 
      error: 'Form must have at least one field to be saved' 
    });
  }

  for (const field of fields) {
    // Check required properties
    if (!field.type || !field.label || !field.name) {
      return res.status(400).json({ 
        error: 'Each field must have type, label, and name properties' 
      });
    }

    // Validate field types
    const validTypes = ['text', 'email', 'number', 'textarea', 'select', 'checkbox', 'radio', 'file'];
    if (!validTypes.includes(field.type)) {
      return res.status(400).json({ 
        error: `Invalid field type: ${field.type}. Valid types: ${validTypes.join(', ')}` 
      });
    }

    // Validate options for choice fields
    if (['select', 'checkbox', 'radio'].includes(field.type)) {
      if (!field.options || !Array.isArray(field.options) || field.options.length === 0) {
        return res.status(400).json({ 
          error: `Field "${field.label}" of type ${field.type} must have options array` 
        });
      }
    }

    // Validate email pattern if provided
    if (field.validation?.pattern && field.type === 'email') {
      try {
        new RegExp(field.validation.pattern);
      } catch (e) {
        return res.status(400).json({ 
          error: `Invalid regex pattern for field "${field.label}"` 
        });
      }
    }
  }

  next();
};

// Submission validation middleware
export const validateSubmissionData = async (req, res, next) => {
  try {
    const form = req.form; // Assume form is attached to req by previous middleware
    const submissionData = req.body;

    for (const field of form.fields) {
      const value = submissionData[field.name];

      // Check required fields
      if (field.required && (value === undefined || value === null || value === '')) {
        return res.status(400).json({ 
          error: `Field "${field.label}" is required` 
        });
      }

      // Skip validation for empty optional fields
      if (!field.required && (value === undefined || value === null || value === '')) {
        continue;
      }

      // Email validation
      if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return res.status(400).json({ 
            error: `Invalid email format for field "${field.label}"` 
          });
        }
      }

      // Number validation
      if (field.type === 'number' && value) {
        const numValue = Number(value);
        if (isNaN(numValue)) {
          return res.status(400).json({ 
            error: `Field "${field.label}" must be a valid number` 
          });
        }
        
        if (field.validation) {
          const { min, max } = field.validation;
          if (min !== undefined && numValue < min) {
            return res.status(400).json({ 
              error: `Field "${field.label}" must be at least ${min}` 
            });
          }
          if (max !== undefined && numValue > max) {
            return res.status(400).json({ 
              error: `Field "${field.label}" must be at most ${max}` 
            });
          }
        }
      }

      // Text length validation
      if (field.validation) {
        const { minLength, maxLength } = field.validation;
        
        if (minLength && value.length < minLength) {
          return res.status(400).json({ 
            error: `Field "${field.label}" must be at least ${minLength} characters long` 
          });
        }
        
        if (maxLength && value.length > maxLength) {
          return res.status(400).json({ 
            error: `Field "${field.label}" must be at most ${maxLength} characters long` 
          });
        }
      }

      // Choice field validation
      if (['select', 'radio'].includes(field.type)) {
        if (!field.options.includes(value)) {
          return res.status(400).json({ 
            error: `Invalid option for field "${field.label}"` 
          });
        }
      }

      // Checkbox validation
      if (field.type === 'checkbox' && Array.isArray(value)) {
        for (const choice of value) {
          if (!field.options.includes(choice)) {
            return res.status(400).json({ 
              error: `Invalid option "${choice}" for field "${field.label}"` 
            });
          }
        }
      }
    }

    next();
  } catch (e) {
    res.status(500).json({ error: 'Validation error: ' + e.message });
  }
};
