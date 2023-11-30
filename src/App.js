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
import CorpLearnCourse from './pages/course_page';
import CorpLearnCourseCompleted from './pages/course_complete';
import CorpLearnCourses from './pages/all_courses';
import CorpLearnCourseHome from './pages/course_home';
import CorpLearnDiscussionForum from './pages/discussionforum';
import CorpLearnDiscussionForumAnswers from './pages/discussion_forum_answers';
import CorpLearnEmployeeConcern from './pages/report_concern';
import CorpLearnAllConcerns from './pages/all_concerns';
import CorpLearnAnnouncements from './pages/announcements';
import CorpLearnEmployeeProfile from './pages/profile';
import CorpLearnTrackProgress from './pages/trackprogress';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    const token = getCookie('corplearntoken');
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
    deleteCookie('corplearntoken'); // delete token from cookie
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
          <Route path="/corpLearn/home" element={isAuthenticated ? <CorpLearnHome loggedInUser={user} invalidateToken={() => onLogout()}/> : <Navigate to="/corpLearn/login" />} />
          <Route path="/" element={isAuthenticated ? <CorpLearnHome loggedInUser={user} invalidateToken={() => onLogout()}/> : <Navigate to="/corpLearn/login" />} />
          <Route path="/corpLearn" element={isAuthenticated ? <CorpLearnHome loggedInUser={user} invalidateToken={() => onLogout()}/> : <Navigate to="/corpLearn/login" />} />
          <Route path="/corpLearn/employees" element={<CorpLearnEmployees loggedInUser={user} invalidateToken={() => onLogout()}/>} />
          <Route path="/corpLearn/course" element={<CorpLearnCourse loggedInUser={user} invalidateToken={() => onLogout()}/>} />
          <Route path="/corpLearn/course/completion" element={<CorpLearnCourseCompleted loggedInUser={user} invalidateToken={() => onLogout()}/>} />
          <Route path="/corpLearn/courses" element={<CorpLearnCourses loggedInUser={user} invalidateToken={() => onLogout()}/>} />
          <Route path="/corpLearn/coursehome" element={<CorpLearnCourseHome loggedInUser={user} invalidateToken={() => onLogout()}/>} />
          <Route path="/corpLearn/discussions" element={<CorpLearnDiscussionForum loggedInUser={user} invalidateToken={() => onLogout()}/>} />
          <Route path="/corpLearn/discussions/answers" element={<CorpLearnDiscussionForumAnswers loggedInUser={user} invalidateToken={() => onLogout()}/>} />
          <Route path="/corpLearn/reportconcern" element={<CorpLearnEmployeeConcern loggedInUser={user} invalidateToken={() => onLogout()}/>} />
          <Route path="/corpLearn/allconcerns" element={<CorpLearnAllConcerns loggedInUser={user} invalidateToken={() => onLogout()}/>} />
          <Route path="/corpLearn/announcements" element={<CorpLearnAnnouncements loggedInUser={user} invalidateToken={() => onLogout()}/>} />
          <Route path="/corpLearn/profile" element={<CorpLearnEmployeeProfile loggedInUser={user} invalidateToken={() => onLogout()}/>} />
          <Route path="/corpLearn/trackprogress" element={<CorpLearnTrackProgress loggedInUser={user} invalidateToken={() => onLogout()}/>} />
          <Route path="" element={isAuthenticated ? <CorpLearnHome loggedInUser={user} invalidateToken={() => onLogout()}/> : <Navigate to="/corpLearn/login" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;