import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Eye, Settings, ExternalLink, Copy, Check } from 'lucide-react';
import api from '../api';
import { FormSkeleton } from '../components/Skeleton';

export default function FormPreview() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.get(`/forms/${id}`)
      .then(r => {
        setForm(r.data);
        setLoading(false);
      })
      .catch(e => {
        setError(e.message);
        setLoading(false);
      });
  }, [id]);

  const formUrl = `${window.location.origin}/forms/${id}`;

  const copyFormLink = async () => {
    try {
      await navigator.clipboard.writeText(formUrl);
      setCopied(true);
      toast.success('Form link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = formUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      toast.success('Form link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const publishForm = async () => {
    try {
      toast.loading('Publishing form...', { id: 'publish' });
      await api.put(`/forms/${id}`, { ...form, status: 'published' });
      setForm(prev => ({ ...prev, status: 'published' }));
      toast.success('Form published successfully!', { id: 'publish' });
    } catch (e) {
      toast.error('Failed to publish form: ' + e.message, { id: 'publish' });
    }
  };

  const unpublishForm = async () => {
    try {
      toast.loading('Unpublishing form...', { id: 'unpublish' });
      await api.put(`/forms/${id}`, { ...form, status: 'draft' });
      setForm(prev => ({ ...prev, status: 'draft' }));
      toast.success('Form unpublished successfully!', { id: 'unpublish' });
    } catch (e) {
      toast.error('Failed to unpublish form: ' + e.message, { id: 'unpublish' });
    }
  };

  if (loading) return (
    <div className="p-6">
      <FormSkeleton fields={5} />
    </div>
  );

  if (error) return (
    <div className="p-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-800">{error}</div>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link 
              to={`/forms/${id}/edit`} 
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Builder</span>
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 rounded-lg p-2">
                  <Eye size={20} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Form Preview</h1>
                  <p className="text-gray-600">{form?.title}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                  form.status === 'published' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {form.status}
                </span>
                {form.status === 'draft' ? (
                  <button
                    onClick={publishForm}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <ExternalLink size={16} />
                    <span>Publish Form</span>
                  </button>
                ) : (
                  <button
                    onClick={unpublishForm}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <Settings size={16} />
                    <span>Unpublish</span>
                  </button>
                )}
              </div>
            </div>

            {/* Form URL */}
            {form.status === 'published' && (
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Public URL:</span>
                  <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-900 font-mono">
                    {formUrl}
                  </div>
                  <button
                    onClick={copyFormLink}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex items-center space-x-2 transition-colors text-sm"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                  <a
                    href={formUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg flex items-center space-x-2 transition-colors text-sm"
                  >
                    <ExternalLink size={14} />
                    <span>Open</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Form Preview */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-white">
            <h1 className="text-2xl font-bold mb-2">{form.title}</h1>
            {form.description && (
              <p className="text-blue-100 text-lg">{form.description}</p>
            )}
          </div>

          {/* Form Content - Read Only Preview */}
          <div className="p-8 space-y-6">
            {form.fields.map((f, index) => (
              <div key={index} className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  {f.label}
                  {f.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                
                {f.type === 'text' && (
                  <input 
                    placeholder={f.placeholder}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                )}
                
                {f.type === 'email' && (
                  <input 
                    type="email"
                    placeholder={f.placeholder}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                )}
                
                {f.type === 'number' && (
                  <input 
                    type="number"
                    placeholder={f.placeholder}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                )}
                
                {f.type === 'textarea' && (
                  <textarea 
                    placeholder={f.placeholder}
                    rows={4}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 resize-none"
                  />
                )}
                
                {f.type === 'file' && (
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                    Choose file...
                  </div>
                )}
                
                {f.type === 'select' && (
                  <select 
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  >
                    <option>Choose an option...</option>
                    {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                )}
                
                {f.type === 'checkbox' && (
                  <div className="space-y-3">
                    {f.options?.map(o => (
                      <label key={o} className="flex items-center space-x-3 cursor-not-allowed">
                        <input 
                          type="checkbox"
                          disabled
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded bg-gray-50"
                        />
                        <span className="text-gray-500">{o}</span>
                      </label>
                    ))}
                  </div>
                )}
                
                {f.type === 'radio' && (
                  <div className="space-y-3">
                    {f.options?.map(o => (
                      <label key={o} className="flex items-center space-x-3 cursor-not-allowed">
                        <input 
                          type="radio"
                          name={`preview_${index}`}
                          disabled
                          className="w-4 h-4 text-blue-600 border-gray-300 bg-gray-50"
                        />
                        <span className="text-gray-500">{o}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            <div className="pt-6 border-t border-gray-200">
              <button 
                disabled
                className="w-full bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg cursor-not-allowed"
              >
                Submit Form (Preview Mode)
              </button>
            </div>
          </div>
        </div>

        {/* Preview Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 rounded-lg p-2">
              <Eye size={16} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-blue-900">Preview Mode</h3>
              <p className="text-sm text-blue-700 mt-1">
                This is how your form will appear to users. All fields are disabled in preview mode. 
                {form.status === 'draft' ? ' Publish the form to make it accessible to users.' : ' Users can access this form at the public URL above.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
