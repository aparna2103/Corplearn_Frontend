import React, { useEffect, useState } from 'react';
import CorpLearnContainer from '../ui_utils/corplearn_container';
import { backendFetchUrl } from '../utils/api';
import CorpLearnEdit from '../ui_utils/editbutton';
import CorpLearnDelete from '../ui_utils/deletebutton';
import './pages.css'
import CorpLearnokButton from '../ui_utils/okbutton';
import CorpLearnClose from '../ui_utils/closebutton';
import Alert from 'react-bootstrap/Alert';
import { faCheck, faPlus } from '@fortawesome/free-solid-svg-icons';
import CorpLearnModal from '../ui_utils/modal';
import CorpLearnAddEmployee from '../ui_utils/add_employee_modal';
import CorpLearnAddCourse from '../ui_utils/add_course_modal';
import CorpLearnAddCourseToEmployee from '../ui_utils/add_course_to_employee';
import { useNavigate } from 'react-router-dom';

function CorpLearnEmployees(props) {
    const [employees, setEmployees] = useState([]);
    const [editableEmployees, setEditableEmployees] = useState([]);
    const [deleteAlert, setDeleteAlert] = useState(false);
    const [showEmployeeModal, setEmployeeModal] = useState(false);
    const [validationAlert, setValidationAlert] = useState(false);
    const [showAddCourseModal, setAddCourseModal] = useState(false);
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedEmployee, setSelectedEmployee] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        backendFetchUrl("/corpLearn/users/all", {
            method: 'GET',
        }).then(response => response.json())
        .then(data => {
          console.log(data);
          let employees = data.filter(employee => employee.role == 2);
          setEmployees(employees);
        });

        backendFetchUrl("/corpLearn/courses", {
            method: 'GET',
          }).then(response => response.json())
          .then(data => {
            if(data.code == "token_not_valid"){
              props.invalidateToken();
            }else{
              console.log(data);
              setCourses(data);
            }
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

    const onHideModal = () => {
        setEmployeeModal(false);
        setAddCourseModal(false)
        setValidationAlert(false)
    }

    const addEmployee = () => {
        let new_name = document.querySelector(`.profile_name`).value;
        let new_email = document.querySelector(`.profile_email`).value;
        let password = document.querySelector(`.profile_password`).value;
        if(new_name == "" || new_email == "" || password == ""){
            setValidationAlert(true)
            return;
        }
        backendFetchUrl("/corpLearn/users/create", {
            method: 'POST',
            body: JSON.stringify({name: new_name, email: new_email, password: password, role: 2})
        }).then(response => response.json())
        .then(data => {
          console.log(data);
          let newEmployees = employees;
          newEmployees.push(data);
          setEmployees(newEmployees);
          onHideModal();
        });
    }

    const displayAddCourseModal = (employee) => {
        setAddCourseModal(!showAddCourseModal);
        setSelectedEmployee(employee);

    }

    const addCourseToEmployee = () => {
        let selectedCourse = document.querySelector(`.add_course_employee_field`).value;
        console.log(selectedCourse);

        backendFetchUrl("/corpLearn/courses/employee-courses/create", {
            method: 'POST',
            body: JSON.stringify({course: selectedCourse, employee: selectedEmployee.id, data:{}})
        }).then(response => response.json())
        .then(data => {
          console.log(data);
        //   let newCourses = courses;
        //   newCourses.push(data);
        //   setCourses(newCourses);
          onHideModal();
        });
    }

    return (
        <>
        <CorpLearnContainer>
            
            {deleteAlert && 
                <Alert key="success" variant="success" onClose={() => setDeleteAlert(false)}>
                    User deleted successfully. <CorpLearnClose onClick={() => setDeleteAlert(false)}/>
                </Alert>
            }
            
            {validationAlert && 
                <Alert className="validationAlert" key="danger" variant="danger" onClose={() => setValidationAlert(false)}>
                    One or more fields is empty <CorpLearnClose onClick={() => setValidationAlert(false)}/>
                </Alert>
            }
            <div style={{display: "flex", alignItems: "center", marginTop: "1rem"}}>
                <h3>CorpLearn Employees</h3>
                <CorpLearnokButton style={{marginLeft: "auto"}} btnText="Add Employee" icon={faPlus} onClick={() => setEmployeeModal(!showEmployeeModal)} />
            </div>
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
                                    <CorpLearnokButton icon={faCheck} classes="employee_edit_ok_button" onClick={() => editEmployee(employee.email, employee.id)}/>
                                    <CorpLearnClose classes="employee_edit_cancel_button" onClick={() => updateEditableEmployees(employee.email, false)}/>
                                </>
                            ):(
                                <>
                                    <CorpLearnokButton classes="employee_edit_ok_button" onClick={() => navigate("/corpLearn/trackprogress", {state: employee})} btnText="Track Progess"/>
                                    {courses.length && <CorpLearnokButton style={{marginLeft: "auto"}} btnText="Add Course to Employee" icon={faPlus} onClick={() => displayAddCourseModal(employee)} />}
                                    <CorpLearnEdit classes="employee_edit_button" onClick={() => updateEditableEmployees(employee.email, true)}/>
                                    <CorpLearnDelete classes="employee_delete_button" onClick={() => deleteUser(employee.id)}/>
                                </>
                            )}
                        </div>
                    </div>     
                )
            })}
        </CorpLearnContainer>
        <CorpLearnAddEmployee onHide={() => onHideModal()} 
                        show={showEmployeeModal} 
                        onSave={() => addEmployee()} 
                        handleCloseModal={() => onHideModal()}
                        class="module_edit_modal forum_answer_add" />

        <CorpLearnAddCourseToEmployee onHide={() => onHideModal()} 
                        user={selectedEmployee}
                        setSelectedCourse={setSelectedCourse}
                        currentCourse={selectedCourse}
                        show={showAddCourseModal} 
                        onSave={(e) => addCourseToEmployee(e)} 
                        handleCloseModal={() => onHideModal()}
                        courses={courses}
                        class="module_edit_modal forum_answer_add" />
        </>
    )
}

export default CorpLearnEmployees;