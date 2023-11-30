import React, { useEffect, useState } from "react";
import CorpLearnContainer from "../ui_utils/corplearn_container";
import { backendFetchUrl } from '../utils/api';
import { Form } from "react-bootstrap";
import CorpLearnokButton from "../ui_utils/okbutton";
import { faPlus, faReply } from "@fortawesome/free-solid-svg-icons";
import CorpLearnModal from "../ui_utils/modal";
import { useNavigate } from "react-router-dom";
import Alert from 'react-bootstrap/Alert';
import CorpLearnClose from '../ui_utils/closebutton';


export default function CorpLearnDiscussionForum(props){
    const [courses, setCourses] =useState([]);
    const [currentCourse, setCurrentCourse] = useState("");
    const [questions, setQuestions] = useState([]);
    const [showQuestionModal, setShowQuestionModal] = useState(false);
    const [question, setQuestion] = useState("");
    const [discussionForum, setDiscussionForum] = useState(-1);
    const navigate = useNavigate();
    const [validationAlert, setValidationAlert] = useState(false);

    useEffect(() => {
        backendFetchUrl("/corpLearn/courses", {
          method: 'GET',
        }).then(response => response.json())
        .then(data => {
          if(data.code == "token_not_valid"){
            props.invalidateToken();
          }else{
            console.log(data);
            setCurrentCourse(data[0].code)
            setCourses(data);
            getDiscussionForum(data[0].code);
          }
        });
    }, []);

    const getQuestions = (forum_id) => {
        backendFetchUrl("/corpLearn/users/discussion-forum-questions/"+forum_id, {
            method: 'GET',
        }).then(response => response.json())
        .then(data => {
            if(data.code == "token_not_valid"){
              props.invalidateToken();
            }else{
              console.log(data);
              setQuestions(data);
            }
        });
    }

    const getDiscussionForum = async (course_code) => {
        backendFetchUrl("/corpLearn/users/discussion-forums/"+course_code, {
            method: 'GET',
        }).then(response => response.json())
        .then(data => {
            if(data.code == "token_not_valid"){
              props.invalidateToken();
            }else{
              console.log(data);
              if(data.error){
                createForum(course_code)
                setQuestions([]);
              }else{
                setDiscussionForum(data.id);
                getQuestions(data.id);
              }              
            }
        });
        setCurrentCourse(course_code);
    }

    const createForum = (course_code) => {
        // Create Discussion Forum
        backendFetchUrl("/corpLearn/users/discussion-forums/create", {
            method: 'POST',
            body: JSON.stringify({course: course_code})
        }).then(response => response.json())
        .then(data => {
            if(data.code == "token_not_valid"){
              props.invalidateToken();
            }else{
              console.log(data);
              setDiscussionForum(data.id)
            }
        });
    }

    const addQuestion = () => {
        if(question == ""){
            setValidationAlert(true);
            return;
        }
        backendFetchUrl("/corpLearn/users/discussion-forum-questions/create", {
            method: 'POST',
            body: JSON.stringify({content: question, user:props.loggedInUser.id, discussion_forum: currentCourse})
        }).then(response => response.json())
        .then(data => {
            if(data.code == "token_not_valid"){
              props.invalidateToken();
            }else{
              console.log(data);
              let newQuestions = [...questions, data];
              setQuestions(newQuestions);
              setShowQuestionModal(false);
              setQuestion("");
            }
        });
    }

    const onHideModal = () => {
        setShowQuestionModal(false);
        setValidationAlert(false)
    }

    const goToQuestion = (question_id) => {
        navigate('/corpLearn/discussions/answers', {state: {question: questions.filter(q => q.id==question_id)[0], forum_id: discussionForum, course: currentCourse}})
    }

    return (
        <>
        {validationAlert && 
                <Alert className="validationAlert" key="danger" variant="danger" onClose={() => setValidationAlert(false)}>
                    Please enter a question <CorpLearnClose onClick={() => setValidationAlert(false)}/>
                </Alert>
        }
        <CorpLearnContainer>
            <Form.Select value={props.currentCourse} onChange={(e) => getDiscussionForum(e.target.value)}>
                {courses.map(course => <option value={course.code}>{course.code}</option>)}
            </Form.Select>
            <div style={{display: "flex", alignItems: "center", marginTop: "1rem"}}>
                <h3>Questions</h3>
                <CorpLearnokButton style={{marginLeft: "auto"}} btnText="Add Question" icon={faPlus} onClick={() => setShowQuestionModal(true)} />
            </div>
            {questions.map(question => {
                return (
                    <div className="employee_card">
                        <div>
                            <p className='employee_name'> 
                                <b>Question</b>: {question.content}
                            </p>
                        </div>
                        <div className="employee_util_buttons">
                                <>
                                    <CorpLearnokButton btnText="Go to question" classes="employee_edit_ok_button" onClick={() => goToQuestion(question.id)}/>
                                </>
                        </div>
                    </div>  
                )
            })}
        </CorpLearnContainer>
        <CorpLearnModal data={{"title": currentCourse + " - Add Question"}} 
                        onHide={() => onHideModal()} 
                        show={showQuestionModal} 
                        onSave={() => addQuestion()} 
                        handleCloseModal={() => onHideModal()}
                        bodyClass="forum_question_inp"
                        bodyContent={question}
                        bodyChange={(e) => setQuestion(e.target.value)}
                        form_type="textarea"
                        class="module_edit_modal forum_question_add"/>
        </>
    )
}