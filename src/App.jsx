import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginRegisterPage from './pages/LoginRegisterPage';
import UserProfilePage from './pages/UserProfilePage';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginRegisterPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
