import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Calendar, Eye, Download, Users, Trash2 } from 'lucide-react';
import { TableSkeleton } from '../components/Skeleton';
import { ConfirmModal } from '../components/Modal';
import api from '../api';

export default function Submissions() {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, submission: null });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      api.get(`/forms/${id}`),
      api.get(`/forms/${id}/submissions`)
    ]).then(([formRes, subRes]) => {
      setForm(formRes.data);
      setItems(subRes.data);
      setLoading(false);
    }).catch(e => {
      setError(e.message);
      setLoading(false);
      toast.error('Failed to load submissions!');
    });
  };

  const openDeleteModal = (submission) => {
    setDeleteModal({ isOpen: true, submission });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, submission: null });
  };

  const confirmDelete = async () => {
    if (!deleteModal.submission) return;
    
    try {
      await api.delete(`/forms/${id}/submissions/${deleteModal.submission._id}`);
      setItems(prev => prev.filter(s => s._id !== deleteModal.submission._id));
      toast.success('Submission deleted successfully!');
      closeDeleteModal();
    } catch (e) {
      toast.error('Failed to delete submission: ' + e.message);
    }
  };

  if (loading) return (
    <div className="p-6">
      <TableSkeleton rows={5} cols={4} />
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
    <div className="p-3 sm:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link 
              to={`/forms/${id}/edit`} 
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">Back to Builder</span>
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{form?.title} - Submissions</h1>
                <p className="text-sm sm:text-base text-gray-600">{form?.description || 'View and manage form submissions'}</p>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm">
                <div className="bg-blue-50 rounded-lg px-3 py-2 flex items-center space-x-2">
                  <Users size={16} className="text-blue-600" />
                  <span className="font-medium text-blue-900">{items.length} Total</span>
                </div>
                <button className="bg-green-50 hover:bg-green-100 text-green-700 px-3 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                  <Download size={16} />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Submissions Table */}
        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 text-center py-12">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions yet</h3>
            <p className="text-gray-500 mb-6">Share your form to start collecting responses</p>
            <Link 
              to={`/forms/${id}`} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center space-x-2 transition-colors"
            >
              <Eye size={16} />
              <span>Preview Form</span>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 lg:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submission ID
                    </th>
                    <th className="px-4 lg:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-4 lg:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preview
                    </th>
                    <th className="px-4 lg:px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.map(s => (
                    <tr key={s._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 lg:px-6 py-4">
                        <div className="font-mono text-sm text-gray-900">
                          {s._id.slice(-8)}
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Calendar size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {new Date(s.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-xs truncate">
                          {Object.entries(s.data).slice(0, 2).map(([key, value]) => (
                            <span key={key} className="mr-2">
                              {String(value).slice(0, 30)}
                              {String(value).length > 30 ? '...' : ''}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link 
                            to={`/forms/${id}/submissions/${s._id}`}
                            className="inline-flex items-center px-2 lg:px-3 py-1 text-xs lg:text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-md transition-colors"
                            title="View Details"
                          >
                            <Eye size={12} lg:size={14} className="mr-1" />
                            <span className="hidden lg:inline">View</span>
                          </Link>
                          <button
                            onClick={() => openDeleteModal(s)}
                            className="inline-flex items-center px-2 lg:px-3 py-1 text-xs lg:text-sm bg-red-100 text-red-700 hover:bg-red-200 rounded-md transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={12} lg:size={14} className="mr-1" />
                            <span className="hidden lg:inline">Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="sm:hidden space-y-4 p-4">
              {items.map(s => (
                <div key={s._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-mono text-sm text-gray-900">
                      ID: {s._id.slice(-8)}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link 
                        to={`/forms/${id}/submissions/${s._id}`}
                        className="inline-flex items-center px-3 py-1 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-md transition-colors"
                      >
                        <Eye size={12} className="mr-1" />
                        View
                      </Link>
                      <button
                        onClick={() => openDeleteModal(s)}
                        className="inline-flex items-center px-3 py-1 text-xs bg-red-100 text-red-700 hover:bg-red-200 rounded-md transition-colors"
                      >
                        <Trash2 size={12} className="mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 mb-2">
                    <Calendar size={14} className="text-gray-400" />
                    <span>
                      {new Date(s.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {Object.entries(s.data).slice(0, 2).map(([key, value]) => (
                      <div key={key} className="truncate">
                        <span className="font-medium">{key}:</span> {String(value).slice(0, 50)}
                        {String(value).length > 50 ? '...' : ''}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Delete Submission"
        message={`Are you sure you want to delete this submission? This action cannot be undone.`}
        confirmText="Delete"
        confirmColor="red"
      />
    </div>
  );
}
