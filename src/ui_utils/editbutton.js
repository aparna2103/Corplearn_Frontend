import React from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'

export default function CorpLearnEdit(props){
    return <Button className={props.classes} variant="primary" size="sm" onClick={props.onClick}><FontAwesomeIcon icon={faEdit} size="xs"/> {props.btnText}</Button>
}