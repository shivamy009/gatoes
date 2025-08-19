import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Forms</h1>
        <Link to="/forms/new" className="bg-blue-600 text-white px-3 py-1 rounded">New Form</Link>
      </div>
      <table className="w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Title</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Submissions</th>
            <th className="p-2 text-left">Created</th>
            <th className="p-2"></th>
          </tr>
        </thead>
        <tbody>
          {forms.map(f => (
            <tr key={f._id} className="border-t">
              <td className="p-2">{f.title}</td>
              <td className="p-2">{f.status}</td>
              <td className="p-2">{f.submissionsCount}</td>
              <td className="p-2">{new Date(f.createdAt).toLocaleDateString()}</td>
              <td className="p-2 space-x-2">
                <Link className="text-blue-600" to={`/forms/${f._id}/edit`}>Edit</Link>
                <Link className="text-green-600" to={`/forms/${f._id}`}>View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
