// Import necessary modules and components
import React, { useEffect, useState } from 'react';
import CourseCard from '../commons/course_card';
import CorpLearnContainer from '../ui_utils/corplearn_container';
import { backendFetchUrl } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import CorpLearnokButton from '../ui_utils/okbutton';
import CorpLearnClose from '../ui_utils/closebutton';
import CorpLearnEdit from '../ui_utils/editbutton';
import CorpLearnDelete from '../ui_utils/deletebutton';
import { faCheck, faPlus } from '@fortawesome/free-solid-svg-icons';
import CorpLearnAddCourse from '../ui_utils/add_course_modal';

// Define the functional component CorpLearnCourses
export default function CorpLearnCourses(props) {
    // State variables using React's useState hook
    const [courses, setCourses] = useState([]); // State to manage courses
    const [editableCourses, setEditableCourses] = useState([]); // State to handle editable courses
    const [deleteAlert, setDeleteAlert] = useState(false); // State for delete alerts
    const [courseModal, setCourseModal] = useState(false); // State to manage the display of the course modal
    const [validationAlert, setValidationAlert] = useState(false); // State for validation alerts
    const navigate = useNavigate(); // React Router hook for navigation

    // Fetching the courses from the backend API when the component mounts
    useEffect(() => {
        backendFetchUrl("/corpLearn/courses", {
            method: 'GET',
        }).then(response => response.json())
            .then(data => {
                if (data.code == "token_not_valid") {
                    props.invalidateToken(); // Invalidate token if it's not valid
                } else {
                    console.log(data);
                    setCourses(data); // Set the fetched courses in the state
                }
            });
    }, []);

    // Function to edit the time required to complete a course
    const editCourse = (course_code) => {
        let new_time = document.querySelector(`[data-course="${course_code}"]`).value;
        backendFetchUrl("/corpLearn/courses/update/" + course_code, {
            method: 'PUT',
            body: JSON.stringify({ time_to_complete: new_time })
        }).then(response => response.json())
            .then(data => {
                console.log(data);
                // Filter out the edited course from the existing list and update it
                let new_courses = courses.filter(course => course.code != course_code);
                new_courses.push(data);
                let newEditableCourses = editableCourses.filter(code => code != course_code);
                setCourses(new_courses);
                setEditableCourses(newEditableCourses);
            });
    }

    // Function to delete a course
    const deleteCourse = (course_code) => {
        backendFetchUrl("/corpLearn/courses/delete/" + course_code, {
            method: 'DELETE',
        }).then(response => response.json())
            .then(data => {
                console.log(data);
                // Filter out the deleted course from the existing list and update it
                let newCourses = courses.filter(course => course.code != course_code);
                setCourses(newCourses);
            });
    }

    // Function to add a new course
    const addCourse = () => {
        let new_code = document.querySelector(`.new_course_code_field`).value;
        let new_deadline = document.querySelector(`.new_course_deadline_field`).value;
        if (new_code == "" || new_deadline == "") {
            setValidationAlert(true); // Set validation alert if any field is empty
            return;
        }
        backendFetchUrl("/corpLearn/courses/create", {
            method: 'POST',
            body: JSON.stringify({ code: new_code, time_to_complete: new_deadline, admin: props.loggedInUser.id })
        }).then(response => response.json())
            .then(data => {
                console.log(data);
                // Add the newly created course to the list of courses
                let newCourses = courses;
                newCourses.push(data);
                setCourses(newCourses);
                onHideModal(); // Hide the course modal after adding the new course
            });
    }

    // Function to toggle the editable state of courses
    const updateEditableCourses = (course_code, insert) => {
        if (insert) {
            let newEditableCourses = [...editableCourses, course_code]
            setEditableCourses(newEditableCourses); // Add a course to the editable courses array
        } else {
            let newEditableCourses = editableCourses.filter(code => code != course_code);
            setEditableCourses(newEditableCourses); // Remove a course from the editable courses array
        }
    }

    // Function to hide the course modal
    const onHideModal = () => {
        setCourseModal(!courseModal); // Toggle the display of the course modal
        setValidationAlert(false); // Reset the validation alert state
    }

    // Rendering JSX components
    return (
        <>
            <CorpLearnContainer>
                {/* Display a delete alert when a course is deleted */}
                {deleteAlert &&
                    <Alert key="success" variant="success" onClose={() => setDeleteAlert(false)}>
                        Course deleted successfully. <CorpLearnClose onClick={() => setDeleteAlert(false)} />
                    </Alert>
                }

                {/* Display a validation alert when fields are empty */}
                {validationAlert &&
                    <Alert className="validationAlert" key="danger" variant="danger" onClose={() => setValidationAlert(false)}>
                        One or more fields is empty <CorpLearnClose onClick={() => setValidationAlert(false)} />
                    </Alert>
                }

                {/* Header with a button to add a new course */}
                <div style={{ display: "flex", alignItems: "center", marginTop: "1rem" }}>
                    <h3>CorpLearn Courses</h3>
                    <CorpLearnokButton style={{ marginLeft: "auto" }} btnText="Add Course" icon={faPlus} onClick={() => setCourseModal(!courseModal)} />
                </div>

                {/* Display courses */}
                {courses.length == 0 ? (<p>No courses yet!</p>) : (courses.map(course => {
                    let isEditMode = editableCourses.includes(course.code);
                    return (
                        <div className="employee_card">
                            <div>
                                {/* Display course information */}
                                <p className='employee_name'>
                                    <b>Course Code</b>: {course.code}
                                </p>
                                <p className='employee_email'>
                                    {
                                        isEditMode ? (
                                            // Input field to edit time to complete if in edit mode
                                            <div className='course_email_edit'>
                                                <b>Time to complete</b>:
                                                <input data-course={course.code} className='form-control employee_email_edit_inp' size="sm" placeholder={course["time_to_complete"]} />
                                            </div>
                                        ) : (
                                            // Display time to complete if not in edit mode
                                            <>
                                                <b>Time to complete</b>: {course["time_to_complete"]}
                                            </>
                                        )
                                    }
                                </p>
                            </div>
                            <div className="employee_util_buttons">
                                {isEditMode ? (
                                    <>
                                        <CorpLearnokButton icon={faCheck} classes="employee_edit_ok_button" onClick={() => editCourse(course.code)} />
                                        <CorpLearnClose classes="employee_edit_cancel_button" onClick={() => updateEditableCourses(course.code, false)} />
                                    </>
                                ) : (
                                    <>
                                        <CorpLearnokButton className="course_home_navigation" onClick={() => navigate("/corpLearn/coursehome", { state: course })} btnText="Go to Course" />
                                        <CorpLearnEdit classes="employee_edit_button" onClick={() => updateEditableCourses(course.code, true)} />
                                        <CorpLearnDelete classes="employee_delete_button" onClick={() => deleteCourse(course.code)} />
                                    </>
                                )}
                            </div>
                        </div>
                    )
                }))}
            </CorpLearnContainer>
            <CorpLearnAddCourse onHide={() => onHideModal()}
                show={courseModal}
                onSave={() => addCourse()}
                handleCloseModal={() => onHideModal()}
                class="module_edit_modal forum_answer_add" />
        </>
    )
}
