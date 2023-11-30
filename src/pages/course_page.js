import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { backendFetchUrl } from '../utils/api';
import { sortByID } from '../utils/sort'
import CorpLearnContainer from "../ui_utils/corplearn_container";
import { Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';


export default function CorpLearnCourse(props){
    const {state} = useLocation()
    const [currentModule, setCurrentModule] = useState(-1);
    const [modules, setModules] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        backendFetchUrl("/corpLearn/documents/modules/"+state.course+"/modules", {
            method: 'GET',
        }).then(response => response.json())
        .then(data => {
            if(data.code == "token_not_valid"){
                props.invalidateToken();
            }else{
                data.sort(sortByID);
                let course_meta = JSON.parse(state.data);
                setCurrentModule(course_meta["current_module"]);
                setModules(data);
            }
        });
    }, []);

    const changeModule = (curr_module) => {
        let course_data = JSON.parse(state.data);
        course_data["current_module"] = curr_module + 1;
        backendFetchUrl("/corpLearn/courses/employee-courses/update/"+state.id, {
            method: 'PUT',
            body: JSON.stringify({data: course_data})
        }).then(response => response.json())
        .then(data => {
            if(data.code == "token_not_valid"){
                props.invalidateToken();
            }else{
                setCurrentModule(JSON.parse(data.data)["current_module"])
            }
        });
    }

    const completeCourse = () => {
        let emp_course_id = state.id;
        backendFetchUrl("/corpLearn/courses/employee-courses/update/" + emp_course_id, {
            method: 'PUT',
            body: JSON.stringify({status: "Completed"})
        }).then(response => response.json())
        .then(data => {
            navigate('/corpLearn/course/completion', {state: state})
        });

    }


    return (
        <CorpLearnContainer>
            <h3>{state.course}</h3>
            <div className="module_content">
                <p>{modules.length == 0 && "No modules added yet! Wait for admin to add modules!"}</p>
                <p>{modules.length != 0 && modules[currentModule]["content"]}</p>
                {modules.length != 0?(<>{modules.length - 1 == currentModule?(
                    modules.length != 0 && <Button variant="success" className="end_course_btn" onClick={() => completeCourse(state.id)}>Complete the course</Button>
                ):(
                    <Button variant="info" className="next_module_btn" onClick={() => changeModule(currentModule)}>Go to Module {currentModule + 2}</Button>
                )}</>):<></>}
            </div>
        </CorpLearnContainer>
    )
}