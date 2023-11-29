import React, { useEffect, useState } from 'react';
import CorpLearnContainer from '../ui_utils/corplearn_container';
import { backendFetchUrl } from '../utils/api';
import CorpLearnEdit from '../ui_utils/editbutton';
import CorpLearnDelete from '../ui_utils/deletebutton';
import './pages.css'
import CorpLearnokButton from '../ui_utils/okbutton';
import CorpLearnClose from '../ui_utils/closebutton';
import Alert from 'react-bootstrap/Alert';

function CorpLearnEmployees(props) {
    const [employees, setEmployees] = useState([]);
    const [editableEmployees, setEditableEmployees] = useState([]);
    const [editAlert, setEditAlert] = useState(false);
    const [deleteAlert, setDeleteAlert] = useState(false);

    useEffect(() => {
        backendFetchUrl("/corpLearn/users/all", {
            method: 'GET',
        }).then(response => response.json())
        .then(data => {
          console.log(data);
          let employees = data.filter(employee => employee.role == 2);
          setEmployees(employees);
        });
    }, [])

    const updateEditableEmployees = (email, insert) => {
        if(insert){
            let newEditableEmployees = [...editableEmployees, email]
            setEditableEmployees(newEditableEmployees);
        }else{
            let newEditableEmployees = editableEmployees.filter(emp_email => emp_email != email);
            setEditableEmployees(newEditableEmployees);
        }
    }

    const editEmployee = (email, user_id) => {
        let new_name = document.querySelector(`[data-name="${email}"]`).value;
        let new_email = document.querySelector(`[data-email="${email}"]`).value;
        backendFetchUrl("/corpLearn/users/update/"+user_id, {
            method: 'PUT',
            body: JSON.stringify({name: new_name, email: new_email})
        }).then(response => response.json())
        .then(data => {
          console.log(data);
          let new_employees = employees.filter(employee => employee.email != email);
          new_employees.push(data);
          let newEditableEmployees = editableEmployees.filter(emp_email => emp_email != email);
          setEmployees(new_employees);
          setEditableEmployees(newEditableEmployees);
        });
    }

    const deleteUser = (user_id) => {
        backendFetchUrl("/corpLearn/users/delete/"+user_id, {
            method: "DELETE"
        }).then(response => response.json)
        .then(data => {
            setDeleteAlert(true);
            let new_employees = employees.filter(employee => employee.id != user_id);
            setEmployees(new_employees);
        })
    }

    return (
        <CorpLearnContainer>
            
            {deleteAlert && 
                <Alert key="success" variant="success" onClose={() => setDeleteAlert(false)}>
                    User deleted successfully. <CorpLearnClose onClick={() => setDeleteAlert(false)}/>
                </Alert>
            }
            <h3>CorpLearn Employees</h3>
            {employees.map(employee => {
                let isEditMode = editableEmployees.includes(employee.email);
                return (
                    <div className="employee_card">
                        <div>
                            <p className='employee_name'> 
                                {
                                    isEditMode?(
                                        <div className='employee_name_edit'>
                                            <b>Name</b>:
                                            <input data-name={employee.email} className='form-control employee_name_edit_inp' size="sm" placeholder={employee.name} />
                                        </div>
                                    ):(
                                        <>
                                            <b>Name</b>: {employee.name}
                                        </>
                                    )
                                }
                            </p>
                            <p className='employee_email'> 
                                {
                                    isEditMode?(
                                        <div className='employee_email_edit'>
                                            <b>Email</b>:
                                            <input data-email={employee.email} className='form-control employee_email_edit_inp' size="sm" placeholder={employee.email} />
                                    </div>
                                    ):(
                                        <>
                                        <b>Email</b>: {employee.email}
                                        </>
                                    )
                                }
                            </p>
                        </div>
                        <div className="employee_util_buttons">
                            {isEditMode?(
                                <>
                                    <CorpLearnokButton classes="employee_edit_ok_button" onClick={() => editEmployee(employee.email, employee.id)}/>
                                    <CorpLearnClose classes="employee_edit_cancel_button" onClick={() => updateEditableEmployees(employee.email, false)}/>
                                </>
                            ):(
                                <>
                                    <CorpLearnEdit classes="employee_edit_button" onClick={() => updateEditableEmployees(employee.email, true)}/>
                                    <CorpLearnDelete classes="employee_delete_button" onClick={() => deleteUser(employee.id)}/>
                                </>
                            )}
                        </div>
                    </div>     
                )
            })}
        </CorpLearnContainer>
    )
}

export default CorpLearnEmployees;