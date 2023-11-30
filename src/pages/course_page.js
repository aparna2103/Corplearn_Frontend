// Import necessary modules and components
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // Import hook to access location state
import { backendFetchUrl } from '../utils/api'; // Function for backend API fetch
import { sortByID } from '../utils/sort'; // Custom sort function for modules
import CorpLearnContainer from "../ui_utils/corplearn_container"; // Component for the main container
import { Button } from "react-bootstrap"; // Button component from React Bootstrap
import { useNavigate } from 'react-router-dom'; // Hook for navigating to a different page

// Define the functional component CorpLearnCourse
export default function CorpLearnCourse(props) {
    // Get location state using the useLocation hook
    const { state } = useLocation(); // Extract location state

    // Define states using the useState hook
    const [currentModule, setCurrentModule] = useState(-1); // State to track the current module
    const [modules, setModules] = useState([]); // State to store modules data
    const navigate = useNavigate(); // Navigation hook for routing

    // UseEffect hook to fetch modules data when the component mounts
    useEffect(() => {
        // Fetch modules for the specific course from the backend API
        backendFetchUrl("/corpLearn/documents/modules/" + state.course + "/modules", {
            method: 'GET',
        }).then(response => response.json())
            .then(data => {
                // Check if the token is invalid and invalidate it
                if (data.code == "token_not_valid") {
                    props.invalidateToken(); // Call function to invalidate the token
                } else {
                    data.sort(sortByID); // Sort fetched modules by ID
                    let course_meta = JSON.parse(state.data); // Parse course metadata from state
                    setCurrentModule(course_meta["current_module"]); // Set the current module from course metadata
                    setModules(data); // Update the state with fetched modules
                }
            });
    }, []);

    // Function to change the current module
    const changeModule = (curr_module) => {
        let course_data = JSON.parse(state.data); // Parse course data from state
        course_data["current_module"] = curr_module + 1; // Update the current module in course data
        // Update the course data on the backend using the PUT request
        backendFetchUrl("/corpLearn/courses/employee-courses/update/" + state.id, {
            method: 'PUT',
            body: JSON.stringify({ data: course_data })
        }).then(response => response.json())
            .then(data => {
                if (data.code == "token_not_valid") {
                    props.invalidateToken(); // Invalidate token if it's not valid
                } else {
                    setCurrentModule(JSON.parse(data.data)["current_module"]); // Update the current module in state
                }
            });
    }

    // Function to mark the course as completed
    const completeCourse = () => {
        let emp_course_id = state.id; // Get the employee course ID
        // Update the status of the employee course to "Completed" using the PUT request
        backendFetchUrl("/corpLearn/courses/employee-courses/update/" + emp_course_id, {
            method: 'PUT',
            body: JSON.stringify({ status: "Completed" })
        }).then(response => response.json())
            .then(data => {
                navigate('/corpLearn/course/completion', { state: state }); // Navigate to the course completion page
            });
    }

    // Rendering JSX components
    return (
        <CorpLearnContainer>
            <h3>{state.course}</h3>
            <div className="module_content">
                {/* Display module content */}
                <p>{modules.length == 0 && "No modules added yet! Wait for admin to add modules!"}</p>
                <p>{modules.length != 0 && modules[currentModule]["content"]}</p>
                {/* Conditional rendering of buttons based on module status */}
                {modules.length != 0 ? (
                    <>
                        {modules.length - 1 == currentModule ? (
                            modules.length != 0 && <Button variant="success" className="end_course_btn" onClick={() => completeCourse(state.id)}>Complete the course</Button>
                        ) : (
                            <Button variant="info" className="next_module_btn" onClick={() => changeModule(currentModule)}>Go to Module {currentModule + 2}</Button>
                        )}
                    </>
                ) : <></>}
            </div>
        </CorpLearnContainer>
    )
}
