import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Download, FileText, Paperclip, Trash2 } from 'lucide-react';
import api from '../api';

export default function SubmissionDetail(){
  const { id, submissionId } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [form, setForm] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(()=>{
    Promise.all([
      api.get(`/forms/${id}`),
      api.get(`/forms/${id}/submissions/${submissionId}`)
    ]).then(([formRes, subRes]) => {
      setForm(formRes.data);
      setSubmission(subRes.data);
      setStatus('ready');
    }).catch(()=>setStatus('error'));
  },[id, submissionId]);

  const deleteSubmission = async () => {
    if (window.confirm('Are you sure you want to delete this submission? This action cannot be undone.')) {
      try {
        await api.delete(`/forms/${id}/submissions/${submissionId}`);
        navigate(`/forms/${id}/submissions`);
      } catch (e) {
        console.error('Failed to delete submission:', e);
      }
    }
  };

  if(status==='loading') return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  if(status==='error') return (
    <div className="p-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-800">Failed to load submission details</div>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <Link 
              to={`/forms/${id}/submissions`} 
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Submissions</span>
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 rounded-lg p-2">
                  <FileText size={20} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Submission Details</h1>
                  <p className="text-gray-600">{form?.title}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="bg-green-50 hover:bg-green-100 text-green-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                  <Download size={16} />
                  <span>Export</span>
                </button>
                <button 
                  onClick={deleteSubmission}
                  className="bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <User size={16} className="text-gray-400" />
                <span className="text-sm text-gray-600">ID:</span>
                <span className="font-mono text-sm text-gray-900">{submission._id.slice(-8)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar size={16} className="text-gray-400" />
                <span className="text-sm text-gray-600">Submitted:</span>
                <span className="text-sm text-gray-900">
                  {new Date(submission.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              {submission.files?.length > 0 && (
                <div className="flex items-center space-x-2">
                  <Paperclip size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600">Files:</span>
                  <span className="text-sm text-gray-900">{submission.files.length}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Response Data */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Form Responses</h2>
            
            <div className="space-y-6">
              {form?.fields.map(f => {
                const val = submission.data[f.name];
                let display = '';
                
                if (Array.isArray(val)) {
                  display = val.length > 0 ? val.join(', ') : '—';
                } else if (val === undefined || val === null || val === '') {
                  display = '—';
                } else {
                  display = String(val);
                }

                return (
                  <div key={f.name} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                    <div className="flex flex-col sm:flex-row sm:items-start space-y-2 sm:space-y-0 sm:space-x-4">
                      <div className="sm:w-1/3">
                        <div className="text-sm font-medium text-gray-900">{f.label}</div>
                        <div className="text-xs text-gray-500 capitalize">{f.type} field</div>
                        {f.required && <div className="text-xs text-red-500">Required</div>}
                      </div>
                      <div className="sm:w-2/3">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-sm text-gray-900 break-words">
                            {display === '—' ? (
                              <span className="text-gray-400 italic">No response</span>
                            ) : (
                              display
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Files Section */}
          {submission.files?.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Attached Files</h2>
              
              <div className="space-y-3">
                {submission.files.map((f, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 rounded-lg p-2">
                        <Paperclip size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {f.originalName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {Math.round(f.size / 1024)} KB • {f.mimeType}
                        </div>
                      </div>
                    </div>
                    {f.url && (
                      <a 
                        href={f.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                      >
                        Download
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
