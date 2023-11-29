import React from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

export default function CorpLearnokButton(props){
    return <Button className={props.classes} variant="success" size="sm" onClick={props.onClick}><FontAwesomeIcon icon={faCheck} size="xs"/> {props.deleteText}</Button>
}