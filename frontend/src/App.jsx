import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Home, FileText, Plus, BarChart3, Menu, X } from 'lucide-react';
import FormsList from './pages/FormsList.jsx';
import FormBuilder from './pages/FormBuilder.jsx';
import FormRender from './pages/FormRender.jsx';
import FormPreview from './pages/FormPreview.jsx';
import FormSettings from './pages/FormSettings.jsx';
import Analytics from './pages/Analytics.jsx';
import Submissions from './pages/Submissions.jsx';
import SubmissionDetail from './pages/SubmissionDetail.jsx';

function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/forms/new', label: 'New Form', icon: Plus },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
        w-64 bg-white border-r border-gray-200 flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-4 lg:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 rounded-lg p-2">
                <FileText size={18} lg:size={20} className="text-white" />
              </div>
              <div>
                <div className="text-base lg:text-lg font-bold text-gray-900">Form Builder</div>
                <div className="text-xs text-gray-500">Create & Manage</div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <a
                key={item.path}
                href={item.path}
                onClick={onClose}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={18} />
                <span className="font-medium">{item.label}</span>
              </a>
            );
          })}
        </nav>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            © {new Date().getFullYear()} Form Builder
          </div>
        </div>
      </aside>
    </>
  );
}

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  
  // Hide sidebar for public form pages
  const isPublicForm = location.pathname.match(/^\/forms\/[^\/]+$/) && !location.pathname.includes('/edit');
  
  if (isPublicForm) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 rounded p-1">
                <FileText size={16} className="text-white" />
              </div>
              <span className="font-semibold text-gray-900">Form Builder</span>
            </div>
            <div className="w-8" /> {/* Spacer */}
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
      
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#ffffff',
            color: '#374151',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<FormsList />} />
          <Route path="/forms/new" element={<FormBuilder />} />
          <Route path="/forms/:id/edit" element={<FormBuilder />} />
          <Route path="/forms/:id/preview" element={<FormPreview />} />
          <Route path="/forms/:id/settings" element={<FormSettings />} />
          <Route path="/forms/:id/analytics" element={<Analytics />} />
          <Route path="/forms/:id" element={<FormRender />} />
          <Route path="/forms/:id/submissions" element={<Submissions />} />
          <Route path="/forms/:id/submissions/:submissionId" element={<SubmissionDetail />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}