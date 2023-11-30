// Import necessary modules and components
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // Hook to access location state
import { backendFetchUrl } from "../utils/api"; // Function for backend API fetch
import { faPlus } from "@fortawesome/free-solid-svg-icons"; // FontAwesome icon
import CorpLearnokButton from "../ui_utils/okbutton"; // Component for OK button
import CorpLearnContainer from "../ui_utils/corplearn_container"; // Component for main container
import CorpLearnModal from "../ui_utils/modal"; // Component for modal
import Alert from 'react-bootstrap/Alert'; // Bootstrap component for alerts
import CorpLearnClose from '../ui_utils/closebutton'; // Component for close button

// Define the functional component CorpLearnDiscussionForumAnswers
export default function CorpLearnDiscussionForumAnswers(props){
    const { state } = useLocation(); // Extract location state using useLocation hook

    // Define states using the useState hook
    const [answers, setAnswers] = useState([]); // State to store answers
    const [showAnswerModal, setShowAnswerModal] = useState(false); // State to control answer modal visibility
    const [answer, setAnswer] = useState(""); // State to store the answer text
    const [validationAlert, setValidationAlert] = useState(false); // State for validation alerts

    // useEffect hook to fetch answers related to a specific question when the component mounts
    useEffect(() => {
        backendFetchUrl("/corpLearn/users/discussion-forum-answers/question/" + state.question.id, {
            method: 'GET',
          }).then(response => response.json())
          .then(data => {
            if(data.code == "token_not_valid"){
              props.invalidateToken(); // Call function to invalidate token if not valid
            }else{
              console.log(data);
              setAnswers(data); // Set state with fetched answers
            }
          });
    }, [])

    // Function to add an answer to the question
    const addAnswer = () => {
        console.log(answer);
        if(answer == ""){
            setValidationAlert(true); // Show validation alert if the answer is empty
            return;
        }
        // Send a POST request to create a new answer for the question
        backendFetchUrl("/corpLearn/users/discussion-forum-answers/create", {
            method: 'POST',
            body: JSON.stringify({content: answer, user:props.loggedInUser.id, question: state.question.id})
        }).then(response => response.json())
        .then(data => {
            if(data.code == "token_not_valid"){
              props.invalidateToken(); // Invalidate token if not valid
            }else{
              console.log(data);
              let newAnswers = [...answers, data] // Add the new answer to the existing answers
              setAnswers(newAnswers); // Update the state with new answers
              setAnswer(""); // Clear the answer input field
              onHideModal(); // Hide the answer modal
            }
        });
    }

    // Function to hide the answer modal
    const onHideModal = () => {
        setShowAnswerModal(!showAnswerModal); // Toggle the visibility of the answer modal
        setValidationAlert(false); // Hide validation alert
    }

    // Render JSX components
    return (
        <>
            {/* Display validation alert if answer is empty */}
            {validationAlert && 
                <Alert className="validationAlert" key="danger" variant="danger" onClose={() => setValidationAlert(false)}>
                    Please enter an answer <CorpLearnClose onClick={() => setValidationAlert(false)}/>
                </Alert>
            }
            <CorpLearnContainer>
                <div style={{display: "flex", alignItems: "center", marginTop: "1rem"}}>
                    <h3>Question: {state.question.content} [{state.course}] </h3>
                    {/* Button to open the answer modal */}
                    <CorpLearnokButton style={{marginLeft: "auto"}} btnText="Reply" icon={faPlus} onClick={() => setShowAnswerModal(!showAnswerModal)} />
                </div>
                {/* Render answers for the question */}
                {answers.length == 0 ? (
                    <p>No Answers yet!</p>
                ) : (
                    answers.map(answer => {
                        return (
                            <div className="employee_card" key={answer.id}>
                                <div>
                                    <p className='employee_name'> 
                                        <b>Answer</b>: {answer.content}
                                    </p>
                                </div>
                            </div>  
                        )
                    })
                )}
            </CorpLearnContainer>
            {/* Modal to add an answer */}
            <CorpLearnModal data={{"title": "Question: " + state.question.content}} 
                        onHide={() => onHideModal()} 
                        show={showAnswerModal} 
                        onSave={() => addAnswer()} 
                        handleCloseModal={() => onHideModal()}
                        bodyClass="forum_answer_inp"
                        bodyContent={answer}
                        bodyChange={(e) => setAnswer(e.target.value)}
                        form_type="textarea"
                        class="module_edit_modal forum_answer_add" />
        </>
    )
}
