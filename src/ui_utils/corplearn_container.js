import React from "react";
import { Container } from "react-bootstrap";


export default function CorpLearnContainer(props){

    return(
        <Container style={{marginTop: "1rem", marginBottom: "1rem"}}>
            {props.children}
        </Container>
    )
}