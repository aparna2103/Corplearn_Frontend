import React from "react";
import CorpLearnContainer from "../ui_utils/corplearn_container";
import CorpLearnokButton from "../ui_utils/okbutton";
import { useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

export default function CorpLearnCourseCompleted(props){
    const {state} = useLocation();
    const navigate = useNavigate();

    return (
        <CorpLearnContainer>
            <p>Congratulations {props.loggedInUser.name}! You have completed the course {state.course}</p>
            <CorpLearnokButton onClick={() => navigate('/corpLearn/home')} btnText="Go to home"></CorpLearnokButton>
        </CorpLearnContainer>
    )

}