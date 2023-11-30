import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { backendFetchUrl } from "../utils/api";
import CorpLearnContainer from "../ui_utils/corplearn_container";

// Component to display course progress for a user
export default function CorpLearnTrackProgress(props){
    // Get the location state using useLocation hook
    const { state } = useLocation();

    // State to manage courses and their progress
    const [courses, setCourses] = useState([]);

    // Fetch courses' progress data from the backend when the component mounts
    useEffect(() => {
        backendFetchUrl("/corpLearn/courses/employee-courses/user/" + state.id, {
            method: 'GET',
          }).then(response => response.json())
          .then(data => {
            if(data.code == "token_not_valid"){
                // Handle invalid token scenario
                props.invalidateToken();
            } else {
                console.log(data);
                // Set fetched courses data to state
                setCourses(data);
            }
        });
    }, [])

    return (
        <CorpLearnContainer>
            {/* Display the header with user's name */}
            <h3>Course progress of {state.name}</h3>

            {/* Check if courses data is available */}
            {courses.length != 0 ? (
                // Display course progress information for each course
                <>
                    {courses.map(course => {
                        return (
                            <div className="employee_card" style={{display: "table"}}>
                                {/* Display course code */}
                                <div>
                                    <p className='employee_name'> 
                                        <b>Course code</b>: {course.course}&nbsp;
                                    </p>
                                </div>
                                {/* Display current status of the course */}
                                <div>
                                    <p className='employee_name'> 
                                        <b> Current status</b>: {course.status=="Start"?"Yet to start":"In Progress"}&nbsp;
                                    </p>
                                </div>
                                {/* Display deadline for the course */}
                                <div>
                                    <p className='employee_name'> 
                                        <b> Deadline</b>: {course.deadline}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </>
            ) : (
                // Display a message if no courses are assigned to the user
                <p>No course has been assigned to {state.name}</p>
            )}
        </CorpLearnContainer>
    )
}
