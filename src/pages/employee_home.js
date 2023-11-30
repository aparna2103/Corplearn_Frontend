import React, { useState } from 'react';
import CourseCard from '../commons/course_card';
import CorpLearnContainer from '../ui_utils/corplearn_container';
import { backendFetchUrl } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import CorpLearnokButton from '../ui_utils/okbutton';

function CorpLearnHome(props) {
  const [courses, setCourses] = useState([]);
  const [currentCourses, setCurrentCourses] = useState([]);
  const [futureCourses, setFutureCourses] = useState([]);
  const navigate = useNavigate();

  useState(() => {
    backendFetchUrl("/corpLearn/courses/employee-courses/user/" + props.loggedInUser.id, {
      method: 'GET',
    }).then(response => response.json())
    .then(data => {
      if(data.code == "token_not_valid"){
        props.invalidateToken();
      }else{
        console.log(data);
        setCurrentCourses(data.filter(course => course.status == "InProgress"));
        setFutureCourses(data.filter(course => course.status == "Start"));
        setCourses(data);
      }
    });
  }, [props.loggedInUser.id]);

  const startCourse = (course_id) => {
    backendFetchUrl("/corpLearn/courses/employee-courses/update/" + course_id, {
      method: 'PUT',
      body: JSON.stringify({status: "InProgress"})
    }).then(response => response.json())
    .then(data => {
      let updatedCourses = courses.filter(course => course.id != course_id)
      updatedCourses.push(data);
      setCurrentCourses(updatedCourses.filter(course => course.status == "InProgress"));
      setFutureCourses(updatedCourses.filter(course => course.status == "Start"));
      setCourses(updatedCourses);
    });
  }

  const continueCourse = (course) => {
    navigate('/corpLearn/course', {state: course})
  }

  return (
    <CorpLearnContainer>
      <div style={{display: "flex", alignItems: "center", marginTop: "1rem"}}>
        <h3>Welcome to Corp Learn - {props.loggedInUser.name}</h3>
        {props.loggedInUser.role == 2 && <CorpLearnokButton classes="employee_edit_ok_button" onClick={() => navigate("/corpLearn/trackprogress", {state: props.loggedInUser})} btnText="Track Course Progess"/>}
      </div>
      {props.loggedInUser.role == 2 && <h3 style={{marginTop: "3rem"}}>Current Courses</h3>}
      {props.loggedInUser.role == 2?(<>{currentCourses.length != 0?(
        <>
          {currentCourses.map(course => {
            return <CourseCard 
                    title={course.course} 
                    description={course.data != ''?JSON.parse(course.data)['content']:''} 
                    primaryButton="Continue" 
                    deadline={course.deadline} 
                    onClick={() => continueCourse(course)} />
          })}
        </>
      ):(<p>No Current courses. Please start a course</p>)}</>):(<></>)}
      {props.loggedInUser.role == 2 && <h3>Courses yet to start</h3>}
      {props.loggedInUser.role == 2?(<>{futureCourses.length != 0?(
        <>
          <div className='future_courses_container'>
            {futureCourses.map(course => {
              return <CourseCard 
                      title={course.course} 
                      description={course.data != ''?JSON.parse(course.data)['content']:''} 
                      variant="success" 
                      primaryButton="Start" 
                      deadline={course.deadline}
                      onClick={() => startCourse(course.id)} />
            })}
          </div>
        </>
      ):(<p>You do not have any more courses left to start. Ask admin to assign more</p>)}</>):(<></>)}
      {props.loggedInUser.role == 1 && (
        <>
          <h4>Quick Links</h4>
          <div className="employee_card">
              <div>
                  <p className='employee_name'> 
                      <a href='/corpLearn/employees'>View All Employees</a>
                  </p>
              </div>
          </div>
          <div className="employee_card">
              <div>
                  <p className='employee_name'> 
                      <a href='/corpLearn/allconcerns'>View All Concerns</a>
                  </p>
              </div>
          </div>
          <div className="employee_card">
              <div>
                  <p className='employee_name'> 
                      <a href='/corpLearn/courses'>View All Courses</a>
                  </p>
              </div>
          </div>
          <div className="employee_card">
              <div>
                  <p className='employee_name'> 
                      <a href='/corpLearn/profile'>Go to profile</a>
                  </p>
              </div>
          </div>
          <div className="employee_card">
              <div>
                  <p className='employee_name'> 
                      <a href='/corpLearn/announcements'>View All Announcements</a>
                  </p>
              </div>
          </div>
        </>
      )}
    </CorpLearnContainer>
  );
}

export default CorpLearnHome;
