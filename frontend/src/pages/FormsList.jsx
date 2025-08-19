import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Plus, FileText, Eye, BarChart3, Edit3, MoreVertical, Trash2, Copy, Settings, ExternalLink, Menu, X } from 'lucide-react';
import { TableSkeleton } from '../components/Skeleton';
import { ConfirmModal } from '../components/Modal';
import api from '../api';

export default function FormsList() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, form: null });
  const [duplicateModal, setDuplicateModal] = useState({ isOpen: false, form: null });
  const [openMenuId, setOpenMenuId] = useState(null);

  const load = async () => {
    try {
      const { data } = await api.get('/forms');
      setForms(data);
    } catch (e) {
      toast.error('Failed to load forms: ' + e.message);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const duplicateForm = async (form) => {
    try {
      toast.loading('Duplicating form...', { id: 'duplicate' });
      const response = await api.post(`/forms/${form._id}/duplicate`);
      setForms(prev => [response.data, ...prev]);
      toast.success(`"${form.title}" duplicated successfully!`, { id: 'duplicate' });
    } catch (e) {
      toast.error('Failed to duplicate form: ' + e.message, { id: 'duplicate' });
    }
  };

  const deleteForm = async (form) => {
    try {
      toast.loading('Deleting form...', { id: 'delete' });
      await api.delete(`/forms/${form._id}`);
      setForms(prev => prev.filter(f => f._id !== form._id));
      toast.success(`"${form.title}" deleted successfully!`, { id: 'delete' });
    } catch (e) {
      toast.error('Failed to delete form: ' + e.message, { id: 'delete' });
    }
  };
  useEffect(() => { load(); }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    if (openMenuId) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openMenuId]);

  const ActionMenu = ({ form, isOpen, onToggle }) => (
    <div className="relative">
      <button
        onClick={onToggle}
        className="p-2 text-gray-400 hover:text-gray-600 transition-colors md:hidden"
        title="More actions"
      >
        <MoreVertical size={16} />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
          <div className="py-1">
            <Link 
              to={`/forms/${form._id}/edit`} 
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setOpenMenuId(null)}
            >
              <Edit3 size={14} className="mr-2" />
              Edit
            </Link>
            <Link 
              to={`/forms/${form._id}/preview`} 
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setOpenMenuId(null)}
            >
              <Eye size={14} className="mr-2" />
              Preview
            </Link>
            <Link 
              to={`/forms/${form._id}/analytics`} 
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setOpenMenuId(null)}
            >
              <BarChart3 size={14} className="mr-2" />
              Analytics
            </Link>
            <Link 
              to={`/forms/${form._id}/settings`} 
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setOpenMenuId(null)}
            >
              <Settings size={14} className="mr-2" />
              Settings
            </Link>
            <button
              onClick={() => {
                setDuplicateModal({ isOpen: true, form });
                setOpenMenuId(null);
              }}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
            >
              <Copy size={14} className="mr-2" />
              Duplicate
            </button>
            <button
              onClick={() => {
                setDeleteModal({ isOpen: true, form });
                setOpenMenuId(null);
              }}
              className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-50 w-full text-left"
            >
              <Trash2 size={14} className="mr-2" />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );

  if (loading) return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="h-8 bg-gray-200 rounded animate-pulse w-64 mb-2"></div>
            <div className="h-5 bg-gray-200 rounded animate-pulse w-96"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded animate-pulse w-32"></div>
        </div>
        <TableSkeleton rows={5} columns={5} />
      </div>
    </div>
  );
  
  if (error) return (
    <div className="p-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <div className="text-red-400">⚠</div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading forms</h3>
            <div className="mt-1 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-3 sm:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Forms Dashboard</h1>
            <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">Manage and track your form submissions</p>
          </div>
          <Link 
            to="/forms/new" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm text-sm sm:text-base w-full sm:w-auto"
          >
            <Plus size={18} />
            <span className="sm:inline">New Form</span>
          </Link>
        </div>

        {forms.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No forms yet</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first form</p>
            <Link to="/forms/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 transition-colors">
              <Plus size={20} />
              Create Form
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Form</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responses</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {forms.map(f => (
                      <tr key={f._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <FileText className="h-5 w-5 text-blue-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{f.title}</div>
                              <div className="text-sm text-gray-500">{f.description || 'No description'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            f.status === 'published' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {f.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <BarChart3 className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm font-medium text-gray-900">{f.submissionsCount}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(f.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <Link 
                              to={`/forms/${f._id}/edit`} 
                              className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-2 py-1 rounded-md flex items-center space-x-1 transition-colors text-xs"
                              title="Edit Form"
                            >
                              <Edit3 size={12} />
                              <span className="hidden xl:inline">Edit</span>
                            </Link>
                            <Link 
                              to={`/forms/${f._id}/preview`} 
                              className="bg-green-50 hover:bg-green-100 text-green-700 px-2 py-1 rounded-md flex items-center space-x-1 transition-colors text-xs"
                              title="Preview Form"
                            >
                              <Eye size={12} />
                              <span className="hidden xl:inline">Preview</span>
                            </Link>
                            <Link 
                              to={`/forms/${f._id}/analytics`} 
                              className="bg-purple-50 hover:bg-purple-100 text-purple-700 px-2 py-1 rounded-md flex items-center space-x-1 transition-colors text-xs"
                              title="View Analytics"
                            >
                              <BarChart3 size={12} />
                              <span className="hidden xl:inline">Analytics</span>
                            </Link>
                            <Link 
                              to={`/forms/${f._id}/settings`} 
                              className="bg-orange-50 hover:bg-orange-100 text-orange-700 px-2 py-1 rounded-md flex items-center space-x-1 transition-colors text-xs"
                              title="Form Settings"
                            >
                              <Settings size={12} />
                              <span className="hidden xl:inline">Settings</span>
                            </Link>
                            <button
                              onClick={() => setDuplicateModal({ isOpen: true, form: f })}
                              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md flex items-center space-x-1 transition-colors text-xs"
                              title="Duplicate Form"
                            >
                              <Copy size={12} />
                              <span className="hidden xl:inline">Duplicate</span>
                            </button>
                            <button
                              onClick={() => setDeleteModal({ isOpen: true, form: f })}
                              className="bg-red-50 hover:bg-red-100 text-red-700 px-2 py-1 rounded-md flex items-center space-x-1 transition-colors text-xs"
                              title="Delete Form"
                            >
                              <Trash2 size={12} />
                              <span className="hidden xl:inline">Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
              {forms.map(f => (
                <div key={f._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-medium text-gray-900 truncate">{f.title}</h3>
                        <p className="text-xs text-gray-500 truncate">{f.description || 'No description'}</p>
                      </div>
                    </div>
                    <ActionMenu 
                      form={f} 
                      isOpen={openMenuId === f._id} 
                      onToggle={() => setOpenMenuId(openMenuId === f._id ? null : f._id)} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        f.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {f.status}
                      </span>
                      <div className="flex items-center space-x-1">
                        <BarChart3 className="h-3 w-3" />
                        <span>{f.submissionsCount} responses</span>
                      </div>
                    </div>
                    <span>{new Date(f.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link 
                      to={`/forms/${f._id}/edit`} 
                      className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-md flex items-center space-x-1 transition-colors text-xs"
                    >
                      <Edit3 size={12} />
                      <span>Edit</span>
                    </Link>
                    <Link 
                      to={`/forms/${f._id}/preview`} 
                      className="bg-green-50 hover:bg-green-100 text-green-700 px-3 py-1.5 rounded-md flex items-center space-x-1 transition-colors text-xs"
                    >
                      <Eye size={12} />
                      <span>Preview</span>
                    </Link>
                    <Link 
                      to={`/forms/${f._id}/analytics`} 
                      className="bg-purple-50 hover:bg-purple-100 text-purple-700 px-3 py-1.5 rounded-md flex items-center space-x-1 transition-colors text-xs"
                    >
                      <BarChart3 size={12} />
                      <span>Analytics</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, form: null })}
        onConfirm={() => deleteForm(deleteModal.form)}
        title="Delete Form"
        message={`Are you sure you want to delete "${deleteModal.form?.title}" and all its submissions? This action cannot be undone.`}
        confirmText="Delete"
        confirmColor="red"
      />

      {/* Duplicate Confirmation Modal */}
      <ConfirmModal
        isOpen={duplicateModal.isOpen}
        onClose={() => setDuplicateModal({ isOpen: false, form: null })}
        onConfirm={() => duplicateForm(duplicateModal.form)}
        title="Duplicate Form"
        message={`Do you want to create a copy of "${duplicateModal.form?.title}"?`}
        confirmText="Duplicate"
        confirmColor="blue"
      />
    </div>
  );
}
