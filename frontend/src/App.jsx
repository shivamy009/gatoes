import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FormsList from './pages/FormsList.jsx';
import FormBuilder from './pages/FormBuilder.jsx';
import FormRender from './pages/FormRender.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FormsList />} />
        <Route path="/forms/new" element={<FormBuilder />} />
        <Route path="/forms/:id/edit" element={<FormBuilder />} />
        <Route path="/forms/:id" element={<FormRender />} />
      </Routes>
    </BrowserRouter>
  );
}