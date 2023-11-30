import React, { useEffect, useState } from "react";
import { backendFetchUrl } from "../utils/api";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import CorpLearnokButton from "../ui_utils/okbutton";
import CorpLearnContainer from "../ui_utils/corplearn_container";
import CorpLearnModal from "../ui_utils/modal";
import Alert from 'react-bootstrap/Alert';
import CorpLearnClose from '../ui_utils/closebutton';

export default function CorpLearnEmployeeConcern(props) {
    // State to manage concerns, concern input, modal, and validation
    const [concerns, setConcerns] = useState([]);
    const [concern, setConcern] = useState("");
    const [validationAlert, setValidationAlert] = useState(false);
    const [showConcernModal, setShowConcernModal] = useState(false);

    // Fetch concerns data from backend on component mount or when user ID changes
    useEffect(() => {
        backendFetchUrl("/corpLearn/users/employee-concerns/user/" + props.loggedInUser.id, {
            method: 'GET',
        }).then(response => response.json())
            .then(data => {
                if (data.code == "token_not_valid") {
                    props.invalidateToken();
                } else {
                    console.log(data);
                    setConcerns(data);
                }
            });
    }, [props.loggedInUser.id]);

    // Function to handle modal hiding
    const onHideModal = () => {
        setShowConcernModal(!showConcernModal);
        setValidationAlert(false)
    }

    // Function to add a new concern
    const addConcern = () => {
        console.log(concern);
        if (concern == "") {
            setValidationAlert(true);
            return;
        }
        backendFetchUrl("/corpLearn/users/employee-concerns/create", {
            method: 'POST',
            body: JSON.stringify({ content: concern, employee: props.loggedInUser.id })
        }).then(response => response.json())
            .then(data => {
                if (data.code == "token_not_valid") {
                    props.invalidateToken();
                } else {
                    console.log(data);
                    let newConcerns = [...concerns, data]
                    setConcerns(newConcerns);
                    setConcern("");
                    onHideModal();
                }
            });
    }

    // JSX component rendering
    return (
        <>
            {/* Display validation alert if necessary */}
            {validationAlert &&
                <Alert className="validationAlert" key="danger" variant="danger" onClose={() => setValidationAlert(false)}>
                    Please enter a concern <CorpLearnClose onClick={() => setValidationAlert(false)} />
                </Alert>
            }
            <CorpLearnContainer>
                <div style={{ display: "flex", alignItems: "center", marginTop: "1rem" }}>
                    <h3>Your Concerns</h3>
                    {/* Button to open the modal for adding a concern */}
                    <CorpLearnokButton style={{ marginLeft: "auto" }} btnText="Add Concern" icon={faPlus} onClick={() => setShowConcernModal(!showConcernModal)} />
                </div>
                {/* Display existing concerns */}
                {concerns.length == 0 ? (<p>No Concerns yet!</p>) : (concerns.map(concern => {
                    return (
                        <div className="employee_card">
                            <div>
                                <p className='employee_name'>
                                    {/* Display concern and optional reply */}
                                    <b>Concern</b>: {concern.content.split("|")[0]}
                                    <br />
                                    {concern.content.includes("|") && <><b>Reply</b>: {concern.content.split("|")[1]}</>}
                                </p>
                            </div>
                        </div>
                    )
                }))}
            </CorpLearnContainer>
            {/* Modal to report a new concern */}
            <CorpLearnModal data={{ "title": "Report New Concern" }}
                onHide={() => onHideModal()}
                show={showConcernModal}
                onSave={() => addConcern()}
                handleCloseModal={() => onHideModal()}
                bodyClass="forum_concern_inp"
                bodyContent={concern}
                bodyChange={(e) => setConcern(e.target.value)}
                form_type="textarea"
                class="module_edit_modal forum_concern_add" />
        </>
    )
}
