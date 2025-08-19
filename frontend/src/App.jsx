import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Home, FileText, Plus, BarChart3 } from 'lucide-react';
import FormsList from './pages/FormsList.jsx';
import FormBuilder from './pages/FormBuilder.jsx';
import FormRender from './pages/FormRender.jsx';
import FormPreview from './pages/FormPreview.jsx';
import FormSettings from './pages/FormSettings.jsx';
import Analytics from './pages/Analytics.jsx';
import Submissions from './pages/Submissions.jsx';
import SubmissionDetail from './pages/SubmissionDetail.jsx';

function Sidebar() {
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
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 rounded-lg p-2">
            <FileText size={20} className="text-white" />
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">Form Builder</div>
            <div className="text-xs text-gray-500">Create & Manage</div>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <a
              key={item.path}
              href={item.path}
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
      
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          © {new Date().getFullYear()} Form Builder
        </div>
      </div>
    </aside>
  );
}

function Layout({ children }) {
  const location = useLocation();
  
  // Hide sidebar for public form pages
  const isPublicForm = location.pathname.match(/^\/forms\/[^\/]+$/) && !location.pathname.includes('/edit');
  
  if (isPublicForm) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
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
      <Toaster 
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#10b981',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
    </BrowserRouter>
  );
}