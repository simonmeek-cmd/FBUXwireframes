import React from 'react';

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'radio';
  placeholder?: string;
  required?: boolean;
  options?: { id: string; label: string }[];
}

export interface FormInlineProps {
  /** Optional heading above the form */
  heading?: string;
  /** Description text below heading */
  description?: string;
  /** Array of form fields */
  fields?: FormField[];
  /** Submit button label */
  submitLabel?: string;
  /** Show privacy notice */
  showPrivacyNotice?: boolean;
}

const defaultFields: FormField[] = [
  { id: 'name', label: 'Name', type: 'text', placeholder: 'Your name', required: true },
  { id: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com', required: true },
  { id: 'topic', label: 'Topic', type: 'select', options: [
    { id: 'general', label: 'General enquiry' },
    { id: 'volunteer', label: 'Volunteering' },
    { id: 'donate', label: 'Donation enquiry' },
  ]},
  { id: 'message', label: 'Message', type: 'textarea', placeholder: 'Your message...', required: true },
];

/**
 * FormInline
 * A form component for contact forms, sign-ups, etc.
 */
export const FormInline: React.FC<FormInlineProps> = ({
  heading,
  description,
  fields = defaultFields,
  submitLabel = 'Submit',
  showPrivacyNotice = true,
}) => {
  const renderField = (field: FormField) => {
    const baseInputStyles = 'w-full px-3 py-2 bg-wire-50 border border-wire-300 rounded focus:outline-none focus:border-wire-500 text-wire-800';
    
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            id={field.id}
            placeholder={field.placeholder}
            required={field.required}
            rows={4}
            className={baseInputStyles}
          />
        );
      case 'select':
        return (
          <select
            id={field.id}
            required={field.required}
            className={baseInputStyles}
          >
            <option value="">Select...</option>
            {field.options?.map((opt) => (
              <option key={opt.id} value={opt.id}>{opt.label}</option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((opt) => (
              <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-wire-600" />
                <span className="text-wire-700">{opt.label}</span>
              </label>
            ))}
          </div>
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((opt) => (
              <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name={field.id} className="w-4 h-4 accent-wire-600" />
                <span className="text-wire-700">{opt.label}</span>
              </label>
            ))}
          </div>
        );
      default:
        return (
          <input
            type={field.type}
            id={field.id}
            placeholder={field.placeholder}
            required={field.required}
            className={baseInputStyles}
          />
        );
    }
  };

  return (
    <div className="bg-wire-100 border border-wire-200 rounded p-6">
      {heading && (
        <h2 className="text-xl font-bold text-wire-800 mb-2">{heading}</h2>
      )}
      {description && (
        <p className="text-wire-600 mb-6">{description}</p>
      )}
      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        {fields.map((field) => (
          <div key={field.id}>
            <label htmlFor={field.id} className="block text-sm font-medium text-wire-700 mb-1">
              {field.label}
              {field.required && <span className="text-wire-500 ml-1">*</span>}
            </label>
            {renderField(field)}
          </div>
        ))}
        
        {showPrivacyNotice && (
          <p className="text-xs text-wire-500">
            By submitting this form, you agree to our privacy policy. We will not share your information with third parties.
          </p>
        )}

        <button
          type="submit"
          className="px-6 py-2 bg-wire-600 text-wire-100 rounded hover:bg-wire-700 transition-colors"
        >
          {submitLabel}
        </button>
      </form>
    </div>
  );
};

export default FormInline;


