// Import necessary modules and components
import React, { useEffect, useState } from "react";
import { backendFetchUrl } from "../utils/api";
import { faPlus, faReply } from "@fortawesome/free-solid-svg-icons";
import CorpLearnokButton from "../ui_utils/okbutton";
import CorpLearnContainer from "../ui_utils/corplearn_container";
import CorpLearnModal from "../ui_utils/modal";
import Alert from 'react-bootstrap/Alert';
import CorpLearnClose from '../ui_utils/closebutton';

// Define the functional component CorpLearnAnnouncements
export default function CorpLearnAnnouncements(props) {
    // State variables using React's useState hook
    const [announcements, setAnnouncements] = useState([]); // State to manage announcements
    const [announcement, setAnnouncement] = useState(""); // State for the current announcement being added
    const [validationAlert, setValidationAlert] = useState(false); // State for validation alerts
    const [showannouncementModal, setShowannouncementModal] = useState(false); // State to manage the display of the announcement modal

    // Fetching announcements from the backend API when the component mounts
    useEffect(() => {
        backendFetchUrl("/corpLearn/users/announcements/all", {
            method: 'GET',
        }).then(response => response.json())
            .then(data => {
                if (data.code == "token_not_valid") {
                    props.invalidateToken(); // Invalidate token if it's not valid
                } else {
                    console.log(data);
                    setAnnouncements(data); // Set the fetched announcements in the state
                }
            });
    }, []);

    // Function to hide the announcement modal
    const onHideModal = () => {
        setShowannouncementModal(!showannouncementModal); // Toggle the display of the announcement modal
        setValidationAlert(false); // Reset the validation alert state
        setAnnouncement(""); // Clear the current announcement content
    }

    // Function to add a new announcement
    const addAnnouncement = () => {
        console.log(announcement);
        if (announcement == "") {
            setValidationAlert(true); // Set validation alert if the announcement content is empty
            return;
        }
        backendFetchUrl("/corpLearn/users/announcements/create", {
            method: 'POST',
            body: JSON.stringify({ content: announcement, admin: props.loggedInUser.id })
        }).then(response => response.json())
            .then(data => {
                if (data.code == "token_not_valid") {
                    props.invalidateToken(); // Invalidate token if it's not valid
                } else {
                    console.log(data);
                    let newAnnouncements = [...announcements, data]; // Add the newly created announcement to the list
                    setAnnouncements(newAnnouncements); // Update the announcements list
                    setAnnouncement(""); // Clear the current announcement content
                    onHideModal(); // Hide the announcement modal after adding the new announcement
                }
            });
    }

    // Rendering JSX components
    return (
        <>
            {/* Display a validation alert if the announcement content is empty */}
            {validationAlert &&
                <Alert className="validationAlert" key="danger" variant="danger" onClose={() => setValidationAlert(false)}>
                    Please enter an announcement <CorpLearnClose onClick={() => setValidationAlert(false)} />
                </Alert>
            }
            <CorpLearnContainer>
                {/* Header with a button to add a new announcement */}
                <div style={{ display: "flex", alignItems: "center", marginTop: "1rem" }}>
                    <h3>Employee announcements</h3>
                    {/* Display the "Add Announcement" button based on the user's role */}
                    {props.loggedInUser.role == 1 && <CorpLearnokButton style={{ marginLeft: "auto" }} btnText="Add Announcement" icon={faPlus} onClick={() => setShowannouncementModal(!showannouncementModal)} />}
                </div>
                {/* Display announcements */}
                {announcements.length == 0 ? (<p>No announcements yet!</p>) : (announcements.map(announcement => {
                    return (
                        <div className="employee_card">
                            <div>
                                {/* Display the announcement content */}
                                <p className='employee_name'>
                                    <b>Announcement</b>: {announcement.content}
                                </p>
                            </div>
                        </div>
                    )
                }))}
            </CorpLearnContainer>
            {/* Modal to add a new announcement */}
            <CorpLearnModal data={{ "title": "Add New Announcement" }}
                onHide={() => onHideModal()}
                show={showannouncementModal}
                onSave={() => addAnnouncement()}
                handleCloseModal={() => onHideModal()}
                bodyClass="forum_announcement_inp"
                bodyContent={announcement}
                bodyChange={(e) => setAnnouncement(e.target.value)}
                form_type="textarea"
                class="module_edit_modal forum_announcement_add" />
        </>
    )
}
