import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText, Eye, BarChart3, Edit3, MoreVertical } from 'lucide-react';
import api from '../api';

export default function FormsList() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      const { data } = await api.get('/forms');
      setForms(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Forms Dashboard</h1>
            <p className="mt-2 text-gray-600">Manage and track your form submissions</p>
          </div>
          <Link to="/forms/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm">
            <Plus size={20} />
            New Form
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
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
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
                        <div className="flex items-center justify-end space-x-2">
                          <Link 
                            to={`/forms/${f._id}/edit`} 
                            className="text-gray-600 hover:text-blue-600 p-1 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit3 size={16} />
                          </Link>
                          <Link 
                            to={`/forms/${f._id}`} 
                            className="text-gray-600 hover:text-green-600 p-1 rounded transition-colors"
                            title="Preview"
                          >
                            <Eye size={16} />
                          </Link>
                          <Link 
                            to={`/forms/${f._id}/submissions`} 
                            className="text-gray-600 hover:text-purple-600 p-1 rounded transition-colors"
                            title="Submissions"
                          >
                            <BarChart3 size={16} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
