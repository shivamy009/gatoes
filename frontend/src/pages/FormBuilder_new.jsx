import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Save, Eye, BarChart3, Plus, ArrowUp, ArrowDown, X, Settings, Type, Mail, FileText, List, CheckSquare, Radio, Upload, ArrowLeft, Trash2, Hash } from 'lucide-react';
import api from '../api';

const fieldTemplates = [
  { type: 'text', label: 'Text Input', icon: Type, placeholder: 'Enter text' },
  { type: 'email', label: 'Email', icon: Mail, placeholder: 'you@example.com' },
  { type: 'number', label: 'Number', icon: Hash, placeholder: 'Enter number' },
  { type: 'textarea', label: 'Text Area', icon: FileText, placeholder: 'Enter details' },
  { type: 'select', label: 'Dropdown', icon: List, options: ['Option 1', 'Option 2'] },
  { type: 'checkbox', label: 'Checkboxes', icon: CheckSquare, options: ['Option A', 'Option B'] },
  { type: 'radio', label: 'Radio Buttons', icon: Radio, options: ['Yes', 'No'] },
  { type: 'file', label: 'File Upload', icon: Upload },
];

export default function FormBuilder() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState('Untitled Form');
  const [description, setDescription] = useState('');
  const [fields, setFields] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [selectedField, setSelectedField] = useState(null);

  useEffect(() => {
    if (id) {
      toast.loading('Loading form...', { id: 'load-form' });
      api.get(`/forms/${id}`)
        .then(r => {
          const form = r.data;
          setTitle(form.title);
          setDescription(form.description || '');
          setFields(form.fields || []);
          toast.success('Form loaded successfully!', { id: 'load-form' });
        })
        .catch(e => {
          toast.error('Failed to load form: ' + e.message, { id: 'load-form' });
          setError(e.message);
        });
    }
  }, [id]);

  const addField = (tpl) => {
    const newField = { ...tpl, name: tpl.type + '_' + (fields.length + 1), required: false };
    setFields(prev => [...prev, newField]);
    setSelectedField(fields.length);
    toast.success(`${tpl.label} field added!`);
  };

  const removeField = (i) => {
    setFields(prev => prev.filter((_,idx) => idx !== i));
    setSelectedField(null);
    toast.success('Field removed!');
  };

  const moveField = (i, dir) => {
    const newPos = i + dir;
    if (newPos < 0 || newPos >= fields.length) return;
    const newFields = [...fields];
    [newFields[i], newFields[newPos]] = [newFields[newPos], newFields[i]];
    setFields(newFields);
    setSelectedField(newPos);
  };

  const updateField = (i, updates) => {
    setFields(prev => prev.map((f, idx) => idx === i ? { ...f, ...updates } : f));
  };

  const save = async () => {
    if (!title.trim()) {
      toast.error('Please enter a form title');
      return;
    }
    setSaving(true);
    const payload = { title: title.trim(), description: description.trim(), fields };
    try {
      toast.loading('Saving form...', { id: 'save-form' });
      if (id) {
        await api.put(`/forms/${id}`, payload);
        toast.success('Form saved successfully!', { id: 'save-form' });
      } else {
        const { data } = await api.post('/forms', payload);
        toast.success('Form created successfully!', { id: 'save-form' });
        navigate(`/forms/${data._id}/edit`);
      }
    } catch(e) {
      toast.error('Failed to save form: ' + e.message, { id: 'save-form' });
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteForm = async () => {
    if (window.confirm(`Are you sure you want to delete "${title}" and all its submissions? This action cannot be undone.`)) {
      try {
        toast.loading('Deleting form...', { id: 'delete-form' });
        await api.delete(`/forms/${id}`);
        toast.success('Form deleted successfully!', { id: 'delete-form' });
        navigate('/');
      } catch(e) {
        toast.error('Failed to delete form: ' + e.message, { id: 'delete-form' });
        setError(e.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Dashboard</span>
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">Form Builder</h1>
          <button 
            onClick={save} 
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-3 py-1.5 rounded-md text-sm"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:h-screen">
        {/* Left Sidebar - Field Types */}
        <div className="lg:w-80 bg-white border-b lg:border-b-0 lg:border-r border-gray-200 flex flex-col">
          <div className="p-4 lg:p-6 border-b border-gray-200 hidden lg:block">
            <div className="flex items-center justify-between mb-4">
              <Link 
                to="/" 
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back to Dashboard</span>
              </Link>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Form Elements</h2>
            <p className="text-sm text-gray-600">Drag or click to add fields</p>
          </div>
          
          {/* Mobile Field Types - Horizontal Scroll */}
          <div className="lg:hidden p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Add Field</h3>
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {fieldTemplates.map(ft => {
                const Icon = ft.icon;
                return (
                  <button 
                    key={ft.type} 
                    onClick={() => addField(ft)} 
                    className="flex-shrink-0 p-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-all group min-w-[100px]"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <Icon size={20} className="text-gray-500 group-hover:text-blue-600" />
                      <div className="text-xs text-gray-700 text-center font-medium">{ft.label}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Desktop Field Types - Vertical List */}
          <div className="hidden lg:flex flex-1 p-4 space-y-2 overflow-y-auto flex-col">
            {fieldTemplates.map(ft => {
              const Icon = ft.icon;
              return (
                <button 
                  key={ft.type} 
                  onClick={() => addField(ft)} 
                  className="w-full text-left p-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <Icon size={20} className="text-gray-500 group-hover:text-blue-600" />
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{ft.label}</div>
                      <div className="text-xs text-gray-500">Click to add</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:block p-4 border-t border-gray-200 space-y-3">
            <button 
              onClick={save} 
              disabled={saving}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Save size={16} />
              {saving ? 'Saving...' : 'Save Form'}
            </button>
            
            {id && (
              <div className="grid grid-cols-2 gap-2">
                <Link 
                  to={`/forms/${id}/preview`} 
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors"
                >
                  <Eye size={14} />
                  Preview
                </Link>
                <Link 
                  to={`/forms/${id}/analytics`} 
                  className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors"
                >
                  <BarChart3 size={14} />
                  Analytics
                </Link>
              </div>
            )}

            {id && (
              <Link 
                to={`/forms/${id}/settings`} 
                className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors"
              >
                <Settings size={14} />
                Form Settings
              </Link>
            )}

            {id && (
              <button 
                onClick={deleteForm}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors"
              >
                <Trash2 size={14} />
                Delete Form
              </button>
            )}
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="text-sm text-red-800">{error}</div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Form Builder Canvas */}
          <div className="flex-1 p-3 sm:p-6 overflow-y-auto">
            <div className="max-w-2xl mx-auto">
              {/* Form Header */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Form Title</label>
                    <input 
                      value={title} 
                      onChange={e=>setTitle(e.target.value)} 
                      className="w-full text-xl sm:text-2xl font-bold text-gray-900 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter form title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                    <textarea 
                      value={description} 
                      onChange={e=>setDescription(e.target.value)} 
                      className="w-full text-gray-600 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Add a description for your form"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                {fields.map((f,i) => (
                  <div 
                    key={i} 
                    className={`bg-white rounded-lg shadow-sm border-2 transition-all ${
                      selectedField === i ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedField(i)}
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{f.label}</div>
                          <div className="text-sm text-gray-500">{f.type}</div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button 
                            onClick={(e) => {e.stopPropagation(); moveField(i,-1);}} 
                            disabled={i === 0}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          >
                            <ArrowUp size={16} />
                          </button>
                          <button 
                            onClick={(e) => {e.stopPropagation(); moveField(i,1);}} 
                            disabled={i === fields.length - 1}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          >
                            <ArrowDown size={16} />
                          </button>
                          <button 
                            onClick={(e) => {e.stopPropagation(); removeField(i);}} 
                            className="p-1 text-red-400 hover:text-red-600"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                      
                      {/* Field Preview */}
                      <div className="pointer-events-none">
                        {f.type === 'text' && <input type="text" placeholder={f.placeholder} className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50" />}
                        {f.type === 'email' && <input type="email" placeholder={f.placeholder} className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50" />}
                        {f.type === 'number' && <input type="number" placeholder={f.placeholder} className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50" />}
                        {f.type === 'textarea' && <textarea placeholder={f.placeholder} className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50" rows={3} />}
                        {f.type === 'select' && (
                          <select className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50">
                            <option>Select...</option>
                            {f.options?.map(o => <option key={o}>{o}</option>)}
                          </select>
                        )}
                        {f.type === 'checkbox' && (
                          <div className="space-y-2">
                            {f.options?.map(o => (
                              <label key={o} className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span>{o}</span>
                              </label>
                            ))}
                          </div>
                        )}
                        {f.type === 'radio' && (
                          <div className="space-y-2">
                            {f.options?.map(o => (
                              <label key={o} className="flex items-center space-x-2">
                                <input type="radio" name={`preview_${i}`} />
                                <span>{o}</span>
                              </label>
                            ))}
                          </div>
                        )}
                        {f.type === 'file' && <input type="file" className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50" />}
                      </div>
                    </div>
                  </div>
                ))}
                
                {fields.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
                    <Plus size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No fields yet</h3>
                    <p className="text-gray-500 text-sm sm:text-base">Add fields from the {" "}
                      <span className="lg:hidden">top panel</span>
                      <span className="hidden lg:inline">left panel</span>
                      {" "}to get started
                    </p>
                  </div>
                )}
              </div>

              {/* Mobile Action Buttons */}
              <div className="lg:hidden mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex flex-col space-y-3">
                  {id && (
                    <div className="grid grid-cols-2 gap-2">
                      <Link 
                        to={`/forms/${id}/preview`} 
                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors"
                      >
                        <Eye size={14} />
                        Preview
                      </Link>
                      <Link 
                        to={`/forms/${id}/analytics`} 
                        className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors"
                      >
                        <BarChart3 size={14} />
                        Analytics
                      </Link>
                    </div>
                  )}
                  {id && (
                    <div className="grid grid-cols-2 gap-2">
                      <Link 
                        to={`/forms/${id}/settings`} 
                        className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-3 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors"
                      >
                        <Settings size={14} />
                        Settings
                      </Link>
                      <button 
                        onClick={deleteForm}
                        className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  )}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="text-sm text-red-800">{error}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Field Properties */}
          {selectedField !== null && fields[selectedField] && (
            <div className="lg:w-80 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 p-4 lg:p-6">
              <div className="flex items-center space-x-2 mb-4 lg:mb-6">
                <Settings size={20} className="text-gray-600" />
                <h3 className="text-base lg:text-lg font-semibold text-gray-900">Field Settings</h3>
                <button 
                  onClick={() => setSelectedField(null)}
                  className="lg:hidden ml-auto p-1 text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Field Name</label>
                  <input 
                    value={fields[selectedField].name} 
                    onChange={e=>updateField(selectedField,{name:e.target.value})} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Label</label>
                  <input 
                    value={fields[selectedField].label} 
                    onChange={e=>updateField(selectedField,{label:e.target.value})} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                
                {['text','email','number','textarea'].includes(fields[selectedField].type) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Placeholder</label>
                    <input 
                      value={fields[selectedField].placeholder||''} 
                      onChange={e=>updateField(selectedField,{placeholder:e.target.value})} 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                )}
                
                {['select','checkbox','radio'].includes(fields[selectedField].type) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                    <textarea
                      value={(fields[selectedField].options||[]).join('\n')} 
                      onChange={e=>updateField(selectedField,{options:e.target.value.split('\n').filter(s=>s.trim())})} 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      rows={4}
                      placeholder="One option per line"
                    />
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="required"
                    checked={fields[selectedField].required} 
                    onChange={e=>updateField(selectedField,{required:e.target.checked})}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="required" className="text-sm font-medium text-gray-700">Required field</label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
