import React from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

export default function CorpLearnokButton(props){
    return (
        <Button className={props.classes} variant="success" size="sm" onClick={props.onClick} style={props.style}>
            {"icon" in props && <FontAwesomeIcon icon={props.icon} size="xs"/>} {props.btnText}
        </Button>
    )
}