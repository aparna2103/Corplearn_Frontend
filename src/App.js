import logo from './logo.svg';
import './App.css';
import CorpLearnHeader from './headers/corplearn_header';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import CorpLearnLogin from './authentication/corplearn_login';
import CorpLearnHome from './pages/employee_home';
import { getCookie } from './utils/utils';
import { deleteCookie } from './utils/utils';
import CorpLearnEmployees from './pages/corplearn_employees';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    const token = getCookie('token');
    setIsAuthenticated(!!token);
    if(token){
      setUser(JSON.parse(localStorage.getItem('user')));
    }
  }, []);

  const onLogin = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    setIsAuthenticated(true);
  }

  const onLogout = () => {
    deleteCookie('token'); // delete token from cookie
    setIsAuthenticated(false);
    setUser({});
    localStorage.removeItem('user')
    window.location.href = '/corpLearn/login';
  }

  return (
    <>
      <CorpLearnHeader isAuthenticated={isAuthenticated} logout={() => onLogout()} loggedInUser={user}/>
      <Router>
        <Routes>
          <Route path="/corpLearn/login" element={isAuthenticated ? <Navigate to="/corpLearn/home" /> : <CorpLearnLogin login={(user) => onLogin(user)} />} />
          <Route path="/corpLearn/home" element={isAuthenticated ? <CorpLearnHome /> : <Navigate to="/corpLearn/login" />} />
          <Route path="/" element={isAuthenticated ? <CorpLearnHome /> : <Navigate to="/corpLearn/login" />} />
          <Route path="/corpLearn" element={isAuthenticated ? <CorpLearnHome /> : <Navigate to="/corpLearn/login" />} />
          <Route path="/corpLearn/employees" element={<CorpLearnEmployees loggedInUser={user} />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;