// Import necessary modules and components
import React, { useEffect, useState } from "react";
import CorpLearnContainer from "../ui_utils/corplearn_container"; // Component for main container
import { backendFetchUrl } from '../utils/api'; // Function for backend API fetch
import { Form } from "react-bootstrap"; // Form component from React Bootstrap
import CorpLearnokButton from "../ui_utils/okbutton"; // Component for OK button
import { faPlus, faReply } from "@fortawesome/free-solid-svg-icons"; // FontAwesome icons
import CorpLearnModal from "../ui_utils/modal"; // Component for modal
import { useNavigate } from "react-router-dom"; // Hook for navigation
import Alert from 'react-bootstrap/Alert'; // Bootstrap component for alerts
import CorpLearnClose from '../ui_utils/closebutton'; // Component for close button

// Define the functional component CorpLearnDiscussionForum
export default function CorpLearnDiscussionForum(props) {
  // Define states using the useState hook
  const [courses, setCourses] = useState([]); // State to store courses
  const [currentCourse, setCurrentCourse] = useState(""); // State to store current course
  const [questions, setQuestions] = useState([]); // State to store discussion forum questions
  const [showQuestionModal, setShowQuestionModal] = useState(false); // State to control question modal visibility
  const [question, setQuestion] = useState(""); // State to store the question text
  const [discussionForum, setDiscussionForum] = useState(-1); // State to store discussion forum ID
  const navigate = useNavigate(); // Hook for navigation
  const [validationAlert, setValidationAlert] = useState(false); // State for validation alerts

  // useEffect hook to fetch courses and discussion forum details when the component mounts
  useEffect(() => {
    backendFetchUrl("/corpLearn/courses", {
      method: 'GET',
    }).then(response => response.json())
      .then(data => {
        if (data.code == "token_not_valid") {
          props.invalidateToken(); // Call function to invalidate token if not valid
        } else {
          console.log(data);
          if (data.length) {
            setCurrentCourse(data[0].code)
            setCourses(data);
            getDiscussionForum(data[0].code); // Fetch discussion forum based on the first course
          }
        }
      });
  }, []);

  // Function to fetch questions for a specific discussion forum
  const getQuestions = (forum_id) => {
    // Fetch questions related to the discussion forum ID
    backendFetchUrl("/corpLearn/users/discussion-forum-questions/" + forum_id, {
      method: 'GET',
    }).then(response => response.json())
      .then(data => {
        if (data.code == "token_not_valid") {
          props.invalidateToken(); // Invalidate token if not valid
        } else {
          console.log(data);
          setQuestions(data); // Set state with fetched questions
        }
      });
  }

  // Function to fetch discussion forum details based on course code
  const getDiscussionForum = async (course_code) => {
    backendFetchUrl("/corpLearn/users/discussion-forums/" + course_code, {
      method: 'GET',
    }).then(response => response.json())
      .then(data => {
        if (data.code == "token_not_valid") {
          props.invalidateToken(); // Invalidate token if not valid
        } else {
          console.log(data);
          if (data.error) {
            createForum(course_code); // Create a new discussion forum if not found
            setQuestions([]);
          } else {
            setDiscussionForum(data.id); // Set discussion forum ID in state
            getQuestions(data.id); // Fetch questions for the discussion forum
          }
        }
      });
    setCurrentCourse(course_code); // Set the current course
  }

  // Function to create a discussion forum
  const createForum = (course_code) => {
    // Create Discussion Forum using a POST request
    backendFetchUrl("/corpLearn/users/discussion-forums/create", {
      method: 'POST',
      body: JSON.stringify({ course: course_code })
    }).then(response => response.json())
      .then(data => {
        if (data.code == "token_not_valid") {
          props.invalidateToken(); // Invalidate token if not valid
        } else {
          console.log(data);
          setDiscussionForum(data.id); // Set discussion forum ID in state
        }
      });
  }

  // Function to add a question to the discussion forum
  const addQuestion = () => {
    if (question == "") {
      setValidationAlert(true); // Show validation alert if the question is empty
      return;
    }
    // Send a POST request to create a new question in the discussion forum
    backendFetchUrl("/corpLearn/users/discussion-forum-questions/create", {
      method: 'POST',
      body: JSON.stringify({ content: question, user: props.loggedInUser.id, discussion_forum: currentCourse })
    }).then(response => response.json())
      .then(data => {
        if (data.code == "token_not_valid") {
          props.invalidateToken(); // Invalidate token if not valid
        } else {
          console.log(data);
          let newQuestions = [...questions, data]; // Add the new question to the existing questions
          setQuestions(newQuestions); // Update the state with new questions
          setShowQuestionModal(false); // Hide the question modal
          setQuestion(""); // Clear the question input field
        }
      });
  }

  // Function to hide the question modal
  const onHideModal = () => {
    setShowQuestionModal(false); // Hide the question modal
    setValidationAlert(false); // Hide validation alert
  }

  // Function to navigate to a specific question and its answers
  const goToQuestion = (question_id) => {
    navigate('/corpLearn/discussions/answers', {
      state: {
        question: questions.filter(q => q.id == question_id)[0], // Get the question object
        forum_id: discussionForum, // Pass discussion forum ID
        course: currentCourse // Pass current course
      }
    });
  }

  // Render JSX components
  return (
    <>
      {/* Display validation alert if question is empty */}
      {validationAlert &&
        <Alert className="validationAlert" key="danger" variant="danger" onClose={() => setValidationAlert(false)}>
          Please enter a question <CorpLearnClose onClick={() => setValidationAlert(false)} />
        </Alert>
            }
            <CorpLearnContainer>
                  {/* Dropdown to select courses */}
                  <Form.Select value={props.currentCourse} onChange={(e) => getDiscussionForum(e.target.value)}>
                    {courses.map(course => <option value={course.code}>{course.code}</option>)}
                  </Form.Select>
                  <div style={{ display: "flex", alignItems: "center", marginTop: "1rem" }}>
                    <h3>Questions</h3>
                    {/* Button to open the question modal */}
                    <CorpLearnokButton style={{ marginLeft: "auto" }} btnText="Add Question" icon={faPlus} onClick={() => setShowQuestionModal(true)} />
                  </div>
                  {/* Render questions for the discussion forum */}
                  {questions.map(question => {
                    return (
                      <div className="employee_card" key={question.id}>
                        <div>
                          <p className='employee_name'>
                            <b>Question</b>: {question.content}
                          </p>
                        </div>
                        <div className="employee_util_buttons">
                          <>
                            {/* Button to navigate to a specific question */}
                            <CorpLearnokButton btnText="Go to question" classes="employee_edit_ok_button" onClick={() => goToQuestion(question.id)} />
                          </>
                            </div>
                        </div>
                    )
                })}
            </CorpLearnContainer>
            {/* Modal to add a question */}
            <CorpLearnModal data={{"title": currentCourse + " - Add Question"}}
    onHide={() => onHideModal()}
    show={showQuestionModal}
    onSave={() => addQuestion()}
    handleCloseModal={() => onHideModal()}
    bodyClass="forum_question_inp"
    bodyContent={question}
    bodyChange={(e) => setQuestion(e.target.value)}
    form_type="textarea"
    class="module_edit_modal forum_question_add" />
        </>
    )
}
