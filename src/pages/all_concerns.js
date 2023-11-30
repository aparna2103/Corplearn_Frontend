// Import necessary modules and components from React and other libraries
import React, { useEffect, useState } from "react";
import { backendFetchUrl } from "../utils/api";
import { faPlus, faReply } from "@fortawesome/free-solid-svg-icons";
import CorpLearnokButton from "../ui_utils/okbutton";
import CorpLearnContainer from "../ui_utils/corplearn_container";
import CorpLearnModal from "../ui_utils/modal";
import Alert from 'react-bootstrap/Alert';
import CorpLearnClose from '../ui_utils/closebutton';

// Define the functional component CorpLearnAllConcerns
export default function CorpLearnAllConcerns(props){
    // State variables using React's useState hook
    const [concerns, setConcerns] = useState([]); // Concerns array state
    const [concern, setConcern] = useState(""); // Single concern state
    const [validationAlert, setValidationAlert] = useState(false); // Validation alert state
    const [showConcernModal, setShowConcernModal] = useState(false); // Concern modal display state
    const [currentConcern, setCurrentConcern] = useState({}); // Current concern state

    // useEffect hook to fetch employee concerns from the backend API when the component mounts
    useEffect(() => {
        backendFetchUrl("/corpLearn/users/employee-concerns/all", {
            method: 'GET',
        }).then(response => response.json())
        .then(data => {
            if(data.code == "token_not_valid"){
              props.invalidateToken(); // Invalidating token if needed
            }else{
              console.log(data);
              setConcerns(data); // Setting concerns received from the backend API
            }
        });
    }, []);

    // Function to hide the modal and reset state variables
    const onHideModal = () => {
        setShowConcernModal(!showConcernModal); // Toggling the display of the concern modal
        setValidationAlert(false); // Resetting validation alert
        setConcern(""); // Resetting the single concern state
        setCurrentConcern({}); // Resetting the current concern state
    }

    // Function to reply to a concern
    const replyConcern = () => {
        console.log(concern);
        if(concern == ""){
            setValidationAlert(true); // Setting validation alert if no concern is entered
            return;
        }
        backendFetchUrl("/corpLearn/users/employee-concerns/update/" + currentConcern.id, {
            method: 'PUT',
            body: JSON.stringify({content: currentConcern.content + " | " + concern})
        }).then(response => response.json())
        .then(data => {
            if(data.code == "token_not_valid"){
              props.invalidateToken(); // Invalidating token if needed
            }else{
              console.log(data);
              let newConcerns = concerns.filter(concern => concern.id != currentConcern.id)
              newConcerns = [...newConcerns, data]
              setConcerns(newConcerns); // Updating concerns with the new reply
              onHideModal(); // Hiding the modal after replying
            }
        });
    }

    // Function to display the concern modal
    const displayConcernModal = (id, content) => {
        setCurrentConcern({"id": id, "content": content}); // Setting the current concern
        setShowConcernModal(!showConcernModal); // Toggling the display of the concern modal
    }

    // Rendering JSX components
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
