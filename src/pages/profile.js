import React, { useEffect, useState } from "react";
import CorpLearnContainer from "../ui_utils/corplearn_container";
import { backendFetchUrl } from "../utils/api";
import { Form } from "react-bootstrap";
import CorpLearnEdit from "../ui_utils/editbutton";
import CorpLearnokButton from '../ui_utils/okbutton';
import CorpLearnClose from '../ui_utils/closebutton';
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { Alert } from "react-bootstrap";

export default function CorpLearnEmployeeProfile(props){
    // State to manage employee details and editing mode
    const [empDetails, setEmpDetails] = useState({});
    const [isEditMode, setEditMode] = useState(false);
    const [validationAlert, setValidationAlert] = useState(false);

    // Function to update employee details
    const editEmployee = (user_id) => {
        let new_name = document.querySelector(`.profile_name`).value;
        let new_email = document.querySelector(`.profile_email`).value;
        if(new_name == "" || new_email == ""){
            setValidationAlert(true)
            return;
        }
        backendFetchUrl("/corpLearn/users/update/"+user_id, {
            method: 'PUT',
            body: JSON.stringify({name: new_name, email: new_email})
        }).then(response => response.json())
        .then(data => {
          console.log(data);
          setEmpDetails(data);
          setEditMode(false);
          setValidationAlert(false);
        });
    }

    // Fetch employee details from the backend API
    useEffect(() => {
        backendFetchUrl("/corpLearn/users/"+props.loggedInUser.id, {
            method: 'GET',
        }).then(response => response.json())
        .then(data => {
            if(data.code == "token_not_valid"){
              props.invalidateToken();
            }else{
              console.log(data);
              setEmpDetails(data);
            }
        });
    }, [props.loggedInUser.id])

    // JSX component rendering
    return (
        <CorpLearnContainer>
            {/* Display validation alert if necessary */}
            {validationAlert && 
                <Alert className="validationAlert" key="danger" variant="danger" onClose={() => setValidationAlert(false)}>
                    One or more fields is empty <CorpLearnClose onClick={() => setValidationAlert(false)}/>
                </Alert>
            }
            <h3>Employee Profile</h3>
            
            {/* Form fields to display and edit employee details */}
            <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                {isEditMode?<Form.Control placeholder={empDetails.name} className="profile_name"/>:
                <Form.Control placeholder={empDetails.name} className="profile_name" disabled value={empDetails.name}/>}
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                {isEditMode?<Form.Control type="email" placeholder={empDetails.email} className="profile_email"/>:
                <Form.Control placeholder={empDetails.email} className="profile_email" disabled value={empDetails.email}/>}
            </Form.Group>
            
            {/* Render edit and save buttons based on edit mode */}
            {!isEditMode && <CorpLearnEdit btnText="Edit Profile" onClick={() => setEditMode(true)} />}
            {isEditMode && 
                <div className="employee_util_buttons">
                    <CorpLearnokButton icon={faSave} classes="employee_edit_ok_button" btnText="Save" onClick={() => editEmployee(empDetails.id)}/>
                    <CorpLearnClose classes="employee_edit_cancel_button" btnText="Cancel" onClick={() => setEditMode(false)}/>
                </div>
            }
        </CorpLearnContainer>
    )
}
