import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Users, Calendar, Download, BarChart3, PieChart, FileText } from 'lucide-react';
import api from '../api';

export default function Analytics() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [formRes, submissionsRes, analyticsRes] = await Promise.all([
        api.get(`/forms/${id}`),
        api.get(`/forms/${id}/submissions`),
        api.get(`/forms/${id}/analytics`)
      ]);
      
      setForm(formRes.data);
      setSubmissions(submissionsRes.data);
      setAnalytics(analyticsRes.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!submissions.length) return;

    // Prepare CSV headers
    const headers = ['Submission ID', 'Date', ...form.fields.map(f => f.label)];
    
    // Prepare CSV rows
    const rows = submissions.map(submission => [
      submission._id.slice(-8),
      new Date(submission.createdAt).toLocaleDateString(),
      ...form.fields.map(field => {
        const value = submission.data[field.name];
        if (Array.isArray(value)) return value.join('; ');
        return value || '';
      })
    ]);

    // Create CSV content
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${form.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_submissions.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getFieldAnalytics = () => {
    if (!submissions.length) return {};

    const analytics = {};
    
    form.fields.forEach(field => {
      const responses = submissions
        .map(s => s.data[field.name])
        .filter(value => value !== undefined && value !== null && value !== '');

      if (field.type === 'select' || field.type === 'radio') {
        // Count occurrences for single-choice fields
        const counts = {};
        responses.forEach(response => {
          counts[response] = (counts[response] || 0) + 1;
        });
        analytics[field.name] = { type: 'categorical', data: counts };
      } else if (field.type === 'checkbox') {
        // Count occurrences for multi-choice fields
        const counts = {};
        responses.forEach(response => {
          if (Array.isArray(response)) {
            response.forEach(item => {
              counts[item] = (counts[item] || 0) + 1;
            });
          } else {
            counts[response] = (counts[response] || 0) + 1;
          }
        });
        analytics[field.name] = { type: 'categorical', data: counts };
      } else {
        // For text fields, just show response count
        analytics[field.name] = { 
          type: 'numeric', 
          totalResponses: responses.length,
          responseRate: ((responses.length / submissions.length) * 100).toFixed(1)
        };
      }
    });

    return analytics;
  };

  const getSubmissionTrend = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const submissionsByDate = {};
    submissions.forEach(submission => {
      const date = new Date(submission.createdAt).toISOString().split('T')[0];
      submissionsByDate[date] = (submissionsByDate[date] || 0) + 1;
    });

    return last7Days.map(date => ({
      date,
      count: submissionsByDate[date] || 0,
      label: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }));
  };

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

  const fieldAnalytics = getFieldAnalytics();
  const submissionTrend = getSubmissionTrend();

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
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{form?.title} - Analytics</h1>
                <p className="text-gray-600">{form?.description || 'Form performance and response analytics'}</p>
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={exportToCSV}
                  disabled={!submissions.length}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Download size={16} />
                  <span>Export CSV</span>
                </button>
                <Link 
                  to={`/forms/${id}/submissions`} 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <FileText size={16} />
                  <span>View Submissions</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Submissions</p>
                <p className="text-3xl font-bold text-gray-900">{submissions.length}</p>
              </div>
              <div className="bg-blue-100 rounded-lg p-3">
                <Users size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Daily Submissions</p>
                <p className="text-3xl font-bold text-gray-900">
                  {(submissionTrend.reduce((sum, day) => sum + day.count, 0) / 7).toFixed(1)}
                </p>
              </div>
              <div className="bg-green-100 rounded-lg p-3">
                <TrendingUp size={24} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Form Created</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(form.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <div className="bg-purple-100 rounded-lg p-3">
                <Calendar size={24} className="text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Submission Trend */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
            <BarChart3 size={20} />
            <span>7-Day Submission Trend</span>
          </h2>
          
          <div className="flex items-end space-x-2 h-32">
            {submissionTrend.map((day, index) => {
              const maxCount = Math.max(...submissionTrend.map(d => d.count), 1);
              const height = (day.count / maxCount) * 100;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="bg-blue-500 rounded-t w-full transition-all hover:bg-blue-600"
                    style={{ height: `${height}%`, minHeight: day.count > 0 ? '4px' : '2px' }}
                    title={`${day.count} submissions on ${day.label}`}
                  />
                  <div className="text-xs text-gray-500 mt-2 text-center">{day.label}</div>
                  <div className="text-xs font-medium text-gray-700">{day.count}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Field Analytics */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
            <PieChart size={20} />
            <span>Field Response Analytics</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {form.fields.map(field => {
              const fieldData = fieldAnalytics[field.name];
              
              return (
                <div key={field.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900">{field.label}</h3>
                    <p className="text-sm text-gray-500 capitalize">{field.type} field</p>
                  </div>

                  {fieldData?.type === 'categorical' ? (
                    <div className="space-y-3">
                      {Object.entries(fieldData.data).map(([option, count]) => {
                        const percentage = ((count / submissions.length) * 100).toFixed(1);
                        
                        return (
                          <div key={option} className="flex items-center justify-between">
                            <span className="text-sm text-gray-700 truncate flex-1 mr-3">{option}</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full transition-all"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium text-gray-900 w-12 text-right">
                                {count} ({percentage}%)
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : fieldData?.type === 'numeric' ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Response Rate:</span>
                        <span className="font-medium text-gray-900">{fieldData.responseRate}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Responses:</span>
                        <span className="font-medium text-gray-900">{fieldData.totalResponses}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 italic">No data available</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
