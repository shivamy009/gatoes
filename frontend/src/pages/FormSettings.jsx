import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Settings, Save, Shield, MessageSquare, Users, Clock } from 'lucide-react';
import api from '../api';

export default function FormSettings() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [settings, setSettings] = useState({
    title: '',
    description: '',
    thankYouMessage: 'Thank you for your submission!',
    submissionLimit: '',
    allowDuplicates: true,
    collectEmails: false,
    requireLogin: false,
    status: 'draft'
  });

  useEffect(() => {
    if (id) {
      api.get(`/forms/${id}`)
        .then(r => {
          const formData = r.data;
          setForm(formData);
          setSettings({
            title: formData.title || '',
            description: formData.description || '',
            thankYouMessage: formData.thankYouMessage || 'Thank you for your submission!',
            submissionLimit: formData.submissionLimit || '',
            allowDuplicates: formData.allowDuplicates !== false,
            collectEmails: formData.collectEmails || false,
            requireLogin: formData.requireLogin || false,
            status: formData.status || 'draft'
          });
          setLoading(false);
        })
        .catch(e => {
          setError(e.message);
          setLoading(false);
        });
    }
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    
    try {
      toast.loading('Saving settings...', { id: 'save-settings' });
      const updatedForm = { 
        ...form, 
        ...settings,
        submissionLimit: settings.submissionLimit ? parseInt(settings.submissionLimit) : undefined
      };
      
      await api.put(`/forms/${id}`, updatedForm);
      setForm(updatedForm);
      setSuccess(true);
      toast.success('Settings saved successfully!', { id: 'save-settings' });
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      toast.error('Failed to save settings: ' + e.message, { id: 'save-settings' });
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  if (error && !form) return (
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
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-gray-100 rounded-lg p-2">
                  <Settings size={20} className="text-gray-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Form Settings</h1>
                  <p className="text-gray-600">{form?.title}</p>
                </div>
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Save size={16} />
                <span>{saving ? 'Saving...' : 'Save Settings'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Settings Form */}
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <MessageSquare size={18} />
                <span>Basic Information</span>
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Form Title *
                </label>
                <input
                  type="text"
                  value={settings.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter form title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={settings.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Describe your form (optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thank You Message
                </label>
                <textarea
                  value={settings.thankYouMessage}
                  onChange={(e) => handleChange('thankYouMessage', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Message shown after successful submission"
                />
              </div>
            </div>
          </div>

          {/* Submission Controls */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Users size={18} />
                <span>Submission Controls</span>
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Submission Limit
                </label>
                <input
                  type="number"
                  value={settings.submissionLimit}
                  onChange={(e) => handleChange('submissionLimit', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Leave empty for unlimited submissions"
                  min="1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Maximum number of submissions allowed. Leave empty for unlimited.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="allowDuplicates"
                    checked={settings.allowDuplicates}
                    onChange={(e) => handleChange('allowDuplicates', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="allowDuplicates" className="text-sm font-medium text-gray-700">
                    Allow duplicate submissions
                  </label>
                </div>
                <p className="text-xs text-gray-500 ml-7">
                  Allow users to submit the form multiple times
                </p>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="collectEmails"
                    checked={settings.collectEmails}
                    onChange={(e) => handleChange('collectEmails', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="collectEmails" className="text-sm font-medium text-gray-700">
                    Collect email addresses
                  </label>
                </div>
                <p className="text-xs text-gray-500 ml-7">
                  Automatically collect submitter's email address
                </p>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="requireLogin"
                    checked={settings.requireLogin}
                    onChange={(e) => handleChange('requireLogin', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="requireLogin" className="text-sm font-medium text-gray-700">
                    Require login to submit
                  </label>
                </div>
                <p className="text-xs text-gray-500 ml-7">
                  Users must be logged in to submit the form
                </p>
              </div>
            </div>
          </div>

          {/* Visibility & Access */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Shield size={18} />
                <span>Visibility & Access</span>
              </h2>
            </div>
            <div className="p-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Form Status
                </label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="status-draft"
                      name="status"
                      value="draft"
                      checked={settings.status === 'draft'}
                      onChange={(e) => handleChange('status', e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <label htmlFor="status-draft" className="text-sm font-medium text-gray-700">
                      Draft
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 ml-7">
                    Form is private and only accessible to you
                  </p>

                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="status-published"
                      name="status"
                      value="published"
                      checked={settings.status === 'published'}
                      onChange={(e) => handleChange('status', e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <label htmlFor="status-published" className="text-sm font-medium text-gray-700">
                      Published
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 ml-7">
                    Form is public and accessible via its URL
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Current Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Clock size={18} />
                <span>Current Statistics</span>
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{form?.submissionsCount || 0}</div>
                  <div className="text-sm text-gray-600">Total Submissions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {form?.createdAt ? new Date(form.createdAt).toLocaleDateString() : '—'}
                  </div>
                  <div className="text-sm text-gray-600">Created Date</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {form?.updatedAt ? new Date(form.updatedAt).toLocaleDateString() : '—'}
                  </div>
                  <div className="text-sm text-gray-600">Last Updated</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
            Settings saved successfully!
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-red-800">{error}</div>
          </div>
        )}
      </div>
    </div>
  );
}
