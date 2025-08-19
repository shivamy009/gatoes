import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

export default function FormRender() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState(null);

  useEffect(() => {
    api.get(`/forms/${id}`).then(r => { setForm(r.data); setStatus('ready'); }).catch(e => { setStatus('error'); });
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      const { data } = await api.post(`/forms/${id}/submissions`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMessage(data.message);
    } catch (e) {
      setMessage(e.response?.data?.error || e.message);
    }
  };

  if (status==='loading') return <div className="p-6">Loading...</div>;
  if (status==='error') return <div className="p-6 text-red-500">Failed to load form</div>;

  if (message) return <div className="p-6">{message}</div>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-2">{form.title}</h1>
      {form.description && <p className="mb-4 text-sm text-gray-600">{form.description}</p>}
      <form onSubmit={submit} className="space-y-4">
        {form.fields.map(f => (
          <div key={f.name} className="space-y-1">
            <label className="block font-medium text-sm">{f.label}{f.required && <span className="text-red-500">*</span>}</label>
            {f.type === 'text' && <input name={f.name} required={f.required} placeholder={f.placeholder} className="border px-2 py-1 w-full" />}
            {f.type === 'email' && <input type="email" name={f.name} required={f.required} placeholder={f.placeholder} className="border px-2 py-1 w-full" />}
            {f.type === 'textarea' && <textarea name={f.name} required={f.required} placeholder={f.placeholder} className="border px-2 py-1 w-full" />}
            {f.type === 'file' && <input type="file" name={f.name} className="border w-full" />}
            {f.type === 'select' && (
              <select name={f.name} required={f.required} className="border px-2 py-1 w-full">
                <option value="">Select...</option>
                {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            )}
            {f.type === 'checkbox' && (
              <div className="space-y-1">
                {f.options?.map(o => (
                  <label key={o} className="block text-sm"><input type="checkbox" name={f.name} value={o} className="mr-1" /> {o}</label>
                ))}
              </div>
            )}
            {f.type === 'radio' && (
              <div className="space-y-1">
                {f.options?.map(o => (
                  <label key={o} className="block text-sm"><input type="radio" name={f.name} value={o} className="mr-1" /> {o}</label>
                ))}
              </div>
            )}
          </div>
        ))}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
      </form>
    </div>
  );
}
