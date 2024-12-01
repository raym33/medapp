import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ConsultationFlow from './components/consultation/ConsultationFlow';
import LoginForm from './components/auth/LoginForm';
import ProtectedRoute from './components/security/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <ConsultationFlow />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;