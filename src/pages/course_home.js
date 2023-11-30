import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { backendFetchUrl } from '../utils/api';
import { sortByID } from '../utils/sort'
import Alert from 'react-bootstrap/Alert';
import CorpLearnContainer from "../ui_utils/corplearn_container";
import CorpLearnClose from '../ui_utils/closebutton';
import CorpLearnDelete from '../ui_utils/deletebutton';
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import CorpLearnAddModule from "../ui_utils/add_module_modal";
import CorpLearnokButton from '../ui_utils/okbutton';

export default function CorpLearnCourseHome(props){
    const { state } = useLocation();
    const [modules, setModules] = useState([]);
    const [deleteAlert, setDeleteAlert] = useState(false);
    const [addModuleModal, setAddModuleModal] = useState(false);
    const [validationAlert, setValidationAlert] = useState(false);

    useEffect(() => {
        backendFetchUrl("/corpLearn/documents/modules/"+ state.code +"/modules", {
            method: 'GET',
        }).then(response => response.json())
        .then(data => {
            if(data.code == "token_not_valid"){
                props.invalidateToken();
            }else{
                console.log(data);
                data.sort(sortByID);
                setModules(data);
            }
        });
    }, [])

    const onHideModal = () => {
        setAddModuleModal(!addModuleModal);
        setValidationAlert(false);
    }

    const addModule = () => {
        let new_content = document.querySelector(`.new_module_content_field`).value;
        if(new_content == ""){
            setValidationAlert(true)
            return;
        }
        backendFetchUrl("/corpLearn/documents/modules/create", {
            method: 'POST',
            body: JSON.stringify({content: new_content, course: state.code})
        }).then(response => response.json())
        .then(data => {
          console.log(data);
          let newModules = modules;
          newModules.push(data);
          setModules(newModules);
          onHideModal();
        });
    }


    return (
        <>
        <CorpLearnContainer>
            {deleteAlert && 
                <Alert key="success" variant="success" onClose={() => setDeleteAlert(false)}>
                    Course deleted successfully. <CorpLearnClose onClick={() => setDeleteAlert(false)}/>
                </Alert>
            }

            {validationAlert && 
                <Alert className="validationAlert" key="danger" variant="danger" onClose={() => setValidationAlert(false)}>
                    One or more fields is empty <CorpLearnClose onClick={() => setValidationAlert(false)}/>
                </Alert>
            }

            <div style={{display: "flex", alignItems: "center", marginTop: "1rem"}}>
                <h3>{state.code} Modules</h3>
                <CorpLearnokButton style={{marginLeft: "auto"}} btnText="Add Module" icon={faPlus} onClick={() => setAddModuleModal(!addModuleModal)} />
            </div>
            {modules.length == 0?(<p>No modules yet!</p>):(modules.map((module, idx) => {
                return (
                    <div className="employee_card">
                        <div style={{maxWidth: "85%"}}>
                            <p className='employee_name'> 
                                <b>Module {idx+1}</b>
                            </p>
                            <p className='employee_email module_content'> 
                                <b>Content</b>: {module["content"]}
                            </p>
                        </div>
                        <div className="employee_util_buttons">
                            {/* <CorpLearnEdit classes="employee_edit_button" onClick={() => editModule(module.id, `Module ${idx+1}`)}/> */}
                            {/* <CorpLearnDelete classes="employee_delete_button" onClick={() => deleteModule(module.id)}/> */}
                        </div>
                    </div>     
                )
            }))}
        </CorpLearnContainer>
        <CorpLearnAddModule onHide={() => onHideModal()} 
                            show={addModuleModal} 
                            onSave={() => addModule()} 
                            handleCloseModal={() => onHideModal()}
                            class="module_edit_modal forum_answer_add" />
        </>
    )
}