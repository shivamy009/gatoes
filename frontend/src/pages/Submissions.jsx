import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Eye, Download, Users } from 'lucide-react';
import api from '../api';

export default function Submissions() {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
    });
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
      <div className="max-w-7xl mx-auto">
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
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{form?.title} - Submissions</h1>
                <p className="text-gray-600">{form?.description || 'View and manage form submissions'}</p>
              </div>
              <div className="flex items-center space-x-4 text-sm">
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
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submission ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preview
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.map(s => (
                    <tr key={s._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-mono text-sm text-gray-900">
                          {s._id.slice(-8)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
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
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-xs truncate">
                          {Object.entries(s.data).slice(0, 2).map(([key, value]) => (
                            <span key={key} className="mr-2">
                              {String(value).slice(0, 30)}
                              {String(value).length > 30 ? '...' : ''}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link 
                          to={`/forms/${id}/submissions/${s._id}`}
                          className="text-blue-600 hover:text-blue-900 font-medium text-sm flex items-center justify-end space-x-1 transition-colors"
                        >
                          <Eye size={16} />
                          <span>View Details</span>
                        </Link>
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
