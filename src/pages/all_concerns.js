import React, { useEffect, useState } from "react";
import { backendFetchUrl } from "../utils/api";
import { faPlus, faReply } from "@fortawesome/free-solid-svg-icons";
import CorpLearnokButton from "../ui_utils/okbutton";
import CorpLearnContainer from "../ui_utils/corplearn_container";
import CorpLearnModal from "../ui_utils/modal";
import Alert from 'react-bootstrap/Alert';
import CorpLearnClose from '../ui_utils/closebutton';


export default function CorpLearnAllConcerns(props){
    const [concerns, setConcerns] = useState([]);
    const [concern, setConcern] = useState("");
    const [validationAlert, setValidationAlert] = useState(false);
    const [showConcernModal, setShowConcernModal] = useState(false);
    const [currentConcern, setCurrentConcern] = useState({});

    useEffect(() => {
        backendFetchUrl("/corpLearn/users/employee-concerns/all", {
            method: 'GET',
        }).then(response => response.json())
        .then(data => {
            if(data.code == "token_not_valid"){
              props.invalidateToken();
            }else{
              console.log(data);
              setConcerns(data);
            }
        });
    }, []);

    const onHideModal = () => {
        setShowConcernModal(!showConcernModal);
        setValidationAlert(false)
        setConcern("");
        setCurrentConcern({});
    }

    const replyConcern = () => {
        console.log(concern);
        if(concern == ""){
            setValidationAlert(true);
            return;
        }
        backendFetchUrl("/corpLearn/users/employee-concerns/update/" + currentConcern.id, {
            method: 'PUT',
            body: JSON.stringify({content: currentConcern.content + " | " + concern})
        }).then(response => response.json())
        .then(data => {
            if(data.code == "token_not_valid"){
              props.invalidateToken();
            }else{
              console.log(data);
              let newConcerns = concerns.filter(concern => concern.id != currentConcern.id)
              newConcerns = [...newConcerns, data]
              setConcerns(newConcerns);
              onHideModal();
            }
        });
    }

    const displayConcernModal = (id, content) => {
        setCurrentConcern({"id": id, "content": content});
        setShowConcernModal(!showConcernModal);
    }


    return (
        <>
            {validationAlert && 
                <Alert className="validationAlert" key="danger" variant="danger" onClose={() => setValidationAlert(false)}>
                    Please enter a concern <CorpLearnClose onClick={() => setValidationAlert(false)}/>
                </Alert>
            }
            <CorpLearnContainer>
                <div style={{display: "flex", alignItems: "center", marginTop: "1rem"}}>
                    <h3>Employee Concerns</h3>
                </div>
                {concerns.length == 0?(<p>No Concerns yet!</p>):(concerns.map(concern => {
                    return (
                        <div className="employee_card">
                            <div>
                                <p className='employee_name'> 
                                    <b>Concern</b>: {concern.content.split("|")[0]}
                                    <br />
                                    {concern.content.includes("|") &&  <><b>Reply</b>: {concern.content.split("|")[1]}</>}
                                </p>
                            </div>
                            {!concern.content.includes("|") && 
                                <div className="employee_util_buttons">
                                    <CorpLearnokButton style={{marginLeft: "auto"}} btnText="Reply" icon={faReply} onClick={() => displayConcernModal(concern.id, concern.content)} />
                                </div>
                            }   
                        </div>
                    )
                }))}
            </CorpLearnContainer>
            <CorpLearnModal data={{"title": "Report New Concern"}} 
                        onHide={() => onHideModal()} 
                        show={showConcernModal} 
                        onSave={() => replyConcern()} 
                        handleCloseModal={() => onHideModal()}
                        bodyClass="forum_concern_inp"
                        bodyContent={concern}
                        bodyChange={(e) => setConcern(e.target.value)}
                        form_type="textarea"
                        class="module_edit_modal forum_concern_add" />
            </>
    )
}