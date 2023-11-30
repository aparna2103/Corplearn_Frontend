// Import necessary modules and components
import React from "react";
import CorpLearnContainer from "../ui_utils/corplearn_container";
import CorpLearnokButton from "../ui_utils/okbutton";
import { useLocation } from "react-router-dom"; // Import hook to access location state
import { useNavigate } from 'react-router-dom'; // Import hook to manage navigation

// Define the functional component CorpLearnCourseCompleted
export default function CorpLearnCourseCompleted(props) {
    // Get location state and navigation function using hooks
    const { state } = useLocation(); // Extract location state
    const navigate = useNavigate(); // Access navigation function from React Router

    // Rendering JSX components
    return (
        <CorpLearnContainer>
            {/* Display congratulations message for completing the course */}
            <p>Congratulations {props.loggedInUser.name}! You have completed the course {state.course}</p>
            {/* Button to navigate to the home page */}
            <CorpLearnokButton onClick={() => navigate('/corpLearn/home')} btnText="Go to home"></CorpLearnokButton>
        </CorpLearnContainer>
    )
}
