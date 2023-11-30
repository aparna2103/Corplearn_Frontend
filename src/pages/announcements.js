import React, { useEffect, useState } from "react";
import { backendFetchUrl } from "../utils/api";
import { faPlus, faReply } from "@fortawesome/free-solid-svg-icons";
import CorpLearnokButton from "../ui_utils/okbutton";
import CorpLearnContainer from "../ui_utils/corplearn_container";
import CorpLearnModal from "../ui_utils/modal";
import Alert from 'react-bootstrap/Alert';
import CorpLearnClose from '../ui_utils/closebutton';


export default function CorpLearnAnnouncements(props){
    const [announcements, setAnnouncements] = useState([]);
    const [announcement, setAnnouncement] = useState("");
    const [validationAlert, setValidationAlert] = useState(false);
    const [showannouncementModal, setShowannouncementModal] = useState(false);

    useEffect(() => {
        backendFetchUrl("/corpLearn/users/announcements/all", {
            method: 'GET',
        }).then(response => response.json())
        .then(data => {
            if(data.code == "token_not_valid"){
              props.invalidateToken();
            }else{
              console.log(data);
              setAnnouncements(data);
            }
        });
    }, []);

    const onHideModal = () => {
        setShowannouncementModal(!showannouncementModal);
        setValidationAlert(false)
        setAnnouncement("");
    }

    const addAnnouncement = () => {
        console.log(announcement);
        if(announcement == ""){
            setValidationAlert(true);
            return;
        }
        backendFetchUrl("/corpLearn/users/announcements/create", {
            method: 'POST',
            body: JSON.stringify({content: announcement, admin:props.loggedInUser.id})
        }).then(response => response.json())
        .then(data => {
            if(data.code == "token_not_valid"){
              props.invalidateToken();
            }else{
              console.log(data);
              let newAnnouncements = [...announcements, data]
              setAnnouncements(newAnnouncements);
              setAnnouncement("");
              onHideModal();
            }
        });
    }


    return (
        <>
            {validationAlert && 
                <Alert className="validationAlert" key="danger" variant="danger" onClose={() => setValidationAlert(false)}>
                    Please enter a announcement <CorpLearnClose onClick={() => setValidationAlert(false)}/>
                </Alert>
            }
            <CorpLearnContainer>
                <div style={{display: "flex", alignItems: "center", marginTop: "1rem"}}>
                    <h3>Employee announcements</h3>
                    {props.loggedInUser.role == 1 && <CorpLearnokButton style={{marginLeft: "auto"}} btnText="Add Announcement" icon={faPlus} onClick={() => setShowannouncementModal(!showannouncementModal)} />}
                </div>
                {announcements.length == 0?(<p>No announcements yet!</p>):(announcements.map(announcement => {
                    return (
                        <div className="employee_card">
                            <div>
                                <p className='employee_name'> 
                                    <b>Announcement</b>: {announcement.content}
                                </p>
                            </div>
                        </div>
                    )
                }))}
            </CorpLearnContainer>
            <CorpLearnModal data={{"title": "Add New Announcement"}} 
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