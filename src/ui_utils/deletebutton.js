import React from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'

export default function CorpLearnDelete(props){
    return <Button className={props.classes} variant="danger" onClick={props.onClick} size="sm"><FontAwesomeIcon icon={faTrashAlt} size="xs"/> {props.btnText}</Button>
}