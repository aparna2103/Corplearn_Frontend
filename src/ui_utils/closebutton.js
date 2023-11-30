import React from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose } from '@fortawesome/free-solid-svg-icons'

export default function CorpLearnClose(props){
    return (
        <Button className={props.classes} variant="danger" size="sm" onClick={props.onClick}>
            {!("icon" in props) && <FontAwesomeIcon icon={faClose} size="xs"/>} {props.btnText}
        </Button>
    )
}