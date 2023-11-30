import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { backendFetchUrl } from "../utils/api";
import CorpLearnContainer from "../ui_utils/corplearn_container";


export default function CorpLearnTrackProgress(props){
    const {state} = useLocation();
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        backendFetchUrl("/corpLearn/courses/employee-courses/user/" + state.id, {
            method: 'GET',
          }).then(response => response.json())
          .then(data => {
            if(data.code == "token_not_valid"){
              props.invalidateToken();
            }else{
              console.log(data);
              setCourses(data);
            }
        });
    }, [])


    return (
        <CorpLearnContainer>
            <h3>Course progress of {state.name}</h3>
            {courses.length != 0?(<>{courses.map(course => {
                return (
                    <div className="employee_card" style={{display: "table"}}>
                        <div>
                            <p className='employee_name'> 
                                <b>Course code</b>: {course.course}&nbsp;
                            </p>
                        </div>
                        <div>
                            <p className='employee_name'> 
                                <b> Current status</b>: {course.status=="Start"?"Yet to start":course.status}&nbsp;
                            </p>
                        </div>
                        <div>
                            <p className='employee_name'> 
                                <b> Deadline</b>: {course.deadline}
                            </p>
                        </div>
                    </div>
            )
            })}</>):(<p>No course has been assigned to {state.name}</p>)}
        </CorpLearnContainer>
        
    )
}