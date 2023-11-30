import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { backendFetchUrl } from "../utils/api";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import CorpLearnokButton from "../ui_utils/okbutton";
import CorpLearnContainer from "../ui_utils/corplearn_container";
import CorpLearnModal from "../ui_utils/modal";
import Alert from 'react-bootstrap/Alert';
import CorpLearnClose from '../ui_utils/closebutton';


export default function CorpLearnDiscussionForumAnswers(props){
    const { state } = useLocation();
    const [answers, setAnswers] = useState([]);
    const [showAnswerModal, setShowAnswerModal] = useState(false);
    const [answer, setAnswer] = useState("");
    const [validationAlert, setValidationAlert] = useState(false);

    useEffect(() => {
        backendFetchUrl("/corpLearn/users/discussion-forum-answers/question/"+state.question.id, {
            method: 'GET',
          }).then(response => response.json())
          .then(data => {
            if(data.code == "token_not_valid"){
              props.invalidateToken();
            }else{
              console.log(data);
              setAnswers(data);
            }
          });
    }, [])

    const addAnswer = () => {
        console.log(answer);
        if(answer == ""){
            setValidationAlert(true);
            return;
        }
        backendFetchUrl("/corpLearn/users/discussion-forum-answers/create", {
            method: 'POST',
            body: JSON.stringify({content: answer, user:props.loggedInUser.id, question: state.question.id})
        }).then(response => response.json())
        .then(data => {
            if(data.code == "token_not_valid"){
              props.invalidateToken();
            }else{
              console.log(data);
              let newAnswers = [...answers, data]
              setAnswers(newAnswers);
              setAnswer("");
              onHideModal();
            }
        });
    }

    const onHideModal = () => {
        setShowAnswerModal(!showAnswerModal);
        setValidationAlert(false)
    }

    return (
            <>
            {validationAlert && 
                <Alert className="validationAlert" key="danger" variant="danger" onClose={() => setValidationAlert(false)}>
                    Please enter an answer <CorpLearnClose onClick={() => setValidationAlert(false)}/>
                </Alert>
            }
            <CorpLearnContainer>
                <div style={{display: "flex", alignItems: "center", marginTop: "1rem"}}>
                    <h3>Question: {state.question.content} [{state.course}] </h3>
                    <CorpLearnokButton style={{marginLeft: "auto"}} btnText="Reply" icon={faPlus} onClick={() => setShowAnswerModal(!showAnswerModal)} />
                </div>
                {answers.length == 0?(<p>No Answers yet!</p>):(answers.map(answer => {
                    return (
                        <div className="employee_card">
                            <div>
                                <p className='employee_name'> 
                                    <b>Answer</b>: {answer.content}
                                </p>
                            </div>
                        </div>  
                    )
                }))}
            </CorpLearnContainer>
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