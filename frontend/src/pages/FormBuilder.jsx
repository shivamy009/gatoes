import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';

const fieldTemplates = [
  { type: 'text', label: 'Text', placeholder: 'Enter text' },
  { type: 'email', label: 'Email', placeholder: 'you@example.com' },
  { type: 'textarea', label: 'Textarea', placeholder: 'Enter details' },
  { type: 'select', label: 'Select', options: ['Option 1', 'Option 2'] },
  { type: 'checkbox', label: 'Checkbox', options: ['Option A', 'Option B'] },
  { type: 'radio', label: 'Radio', options: ['Yes', 'No'] },
  { type: 'file', label: 'File Upload' },
];

export default function FormBuilder() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState('Untitled Form');
  const [description, setDescription] = useState('');
  const [fields, setFields] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const addField = (tpl) => {
    setFields(prev => [...prev, { ...tpl, name: tpl.type + '_' + (prev.length + 1), required: false }]);
  };

  const updateField = (index, patch) => {
    setFields(prev => prev.map((f,i) => i===index ? { ...f, ...patch } : f));
  };

  const removeField = (index) => {
    setFields(prev => prev.filter((_,i) => i!==index));
  };

  const moveField = (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= fields.length) return;
    const copy = [...fields];
    const [item] = copy.splice(index,1);
    copy.splice(target,0,item);
    setFields(copy);
  };

  const save = async () => {
    setSaving(true); setError(null);
    try {
      const payload = { title, description, fields };
      if (id) {
        await api.put(`/forms/${id}`, payload);
      } else {
        const { data } = await api.post('/forms', payload);
        navigate(`/forms/${data._id}/edit`);
      }
    } catch(e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-56 border-r p-3 space-y-2 bg-gray-50">
        <h2 className="font-semibold mb-2">Fields</h2>
        {fieldTemplates.map(ft => (
          <button key={ft.type} onClick={() => addField(ft)} className="block w-full text-left px-2 py-1 bg-white border rounded hover:bg-blue-50 text-sm">+ {ft.label}</button>
        ))}
        <div className="pt-4 space-y-2 text-sm">
          <button onClick={save} className="w-full bg-blue-600 text-white py-1 rounded disabled:opacity-50" disabled={saving}>{saving? 'Saving...' : 'Save'}</button>
        </div>
        {error && <div className="text-red-500 text-xs">{error}</div>}
      </div>
      <div className="flex-1 p-6 overflow-auto">
        <div className="mb-4 space-y-2">
          <input value={title} onChange={e=>setTitle(e.target.value)} className="border px-2 py-1 w-full font-semibold text-lg" />
          <textarea value={description} onChange={e=>setDescription(e.target.value)} className="border px-2 py-1 w-full text-sm" placeholder="Description" />
        </div>
        <div className="space-y-4">
          {fields.map((f,i) => (
            <div key={i} className="border rounded p-3 bg-white shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <strong>{f.label}</strong>
                <div className="space-x-1 text-xs">
                  <button onClick={()=>moveField(i,-1)} className="px-2 py-0.5 border rounded">↑</button>
                  <button onClick={()=>moveField(i,1)} className="px-2 py-0.5 border rounded">↓</button>
                  <button onClick={()=>removeField(i)} className="px-2 py-0.5 border rounded text-red-600">X</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <label className="space-y-1">Name
                  <input value={f.name} onChange={e=>updateField(i,{name:e.target.value})} className="border px-1 py-0.5 w-full" />
                </label>
                <label className="space-y-1">Label
                  <input value={f.label} onChange={e=>updateField(i,{label:e.target.value})} className="border px-1 py-0.5 w-full" />
                </label>
                {['text','email','textarea'].includes(f.type) && (
                  <label className="space-y-1 col-span-2">Placeholder
                    <input value={f.placeholder||''} onChange={e=>updateField(i,{placeholder:e.target.value})} className="border px-1 py-0.5 w-full" />
                  </label>
                )}
                {['select','checkbox','radio'].includes(f.type) && (
                  <label className="space-y-1 col-span-2">Options (comma separated)
                    <input value={(f.options||[]).join(',')} onChange={e=>updateField(i,{options:e.target.value.split(',').map(s=>s.trim())})} className="border px-1 py-0.5 w-full" />
                  </label>
                )}
                <label className="flex items-center space-x-1">
                  <input type="checkbox" checked={f.required} onChange={e=>updateField(i,{required:e.target.checked})} />
                  <span>Required</span>
                </label>
              </div>
            </div>
          ))}
          {fields.length === 0 && <div className="text-sm text-gray-500">Add fields from the left panel.</div>}
        </div>
      </div>
    </div>
  );
}
