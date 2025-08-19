import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FileText, Send, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../api';

export default function FormRender() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/forms/${id}`).then(r => { setForm(r.data); setStatus('ready'); }).catch(e => { setStatus('error'); });
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData(e.target);
    try {
      const { data } = await api.post(`/forms/${id}/submissions`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMessage({ type: 'success', text: data.message });
    } catch (e) {
      setMessage({ type: 'error', text: e.response?.data?.error || e.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (status==='loading') return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
  
  if (status==='error') return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
        <div className="flex items-center space-x-3 text-red-600 mb-4">
          <AlertCircle size={24} />
          <h2 className="text-lg font-semibold">Form Not Found</h2>
        </div>
        <p className="text-gray-600">The form you're looking for doesn't exist or has been removed.</p>
      </div>
    </div>
  );

  if (message) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4 text-center">
        {message.type === 'success' ? (
          <div className="text-green-600 mb-4">
            <CheckCircle size={48} className="mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Thank You!</h2>
            <p className="text-gray-600">{message.text}</p>
          </div>
        ) : (
          <div className="text-red-600 mb-4">
            <AlertCircle size={48} className="mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Submission Failed</h2>
            <p className="text-gray-600">{message.text}</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-white">
            <div className="flex items-center space-x-3 mb-2">
              <FileText size={24} />
              <h1 className="text-2xl font-bold">{form.title}</h1>
            </div>
            {form.description && (
              <p className="text-blue-100 text-lg">{form.description}</p>
            )}
          </div>

          {/* Form Content */}
          <form onSubmit={submit} className="p-8 space-y-6">
            {form.fields.map(f => (
              <div key={f.name} className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  {f.label}
                  {f.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                
                {f.type === 'text' && (
                  <input 
                    name={f.name} 
                    required={f.required} 
                    placeholder={f.placeholder} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                )}
                
                {f.type === 'email' && (
                  <input 
                    type="email" 
                    name={f.name} 
                    required={f.required} 
                    placeholder={f.placeholder} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                )}
                
                {f.type === 'textarea' && (
                  <textarea 
                    name={f.name} 
                    required={f.required} 
                    placeholder={f.placeholder} 
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  />
                )}
                
                {f.type === 'file' && (
                  <div className="relative">
                    <input 
                      type="file" 
                      name={f.name} 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                )}
                
                {f.type === 'select' && (
                  <select 
                    name={f.name} 
                    required={f.required} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Choose an option...</option>
                    {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                )}
                
                {f.type === 'checkbox' && (
                  <div className="space-y-3">
                    {f.options?.map(o => (
                      <label key={o} className="flex items-center space-x-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          name={f.name} 
                          value={o} 
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-700">{o}</span>
                      </label>
                    ))}
                  </div>
                )}
                
                {f.type === 'radio' && (
                  <div className="space-y-3">
                    {f.options?.map(o => (
                      <label key={o} className="flex items-center space-x-3 cursor-pointer">
                        <input 
                          type="radio" 
                          name={f.name} 
                          value={o} 
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">{o}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            <div className="pt-6 border-t border-gray-200">
              <button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <span>Submit Form</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
