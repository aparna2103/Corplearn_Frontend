import Modal from 'react-bootstrap/Modal';
import CorpLearnokButton from './okbutton';
import CorpLearnClose from './closebutton';
import { Form } from "react-bootstrap";

function CorpLearnModal(props) {

  return (
        <Modal
            show={props.show}
            onHide={props.onHide}
            backdrop="static"
            keyboard={false}
            className={props.class}
        >
            <Modal.Header>
                <Modal.Title id="example-custom-modal-styling-title">
                    {props.data.title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Control className={props.bodyClass} as={props.form_type || "input"} value={props.bodyContent || ""} 
                          onChange={props.bodyChange} style={{height: "100%"}}/>
            </Modal.Body>
            <Modal.Footer>
                <CorpLearnClose btnText="Close" onClick={props.handleCloseModal} />
                <CorpLearnokButton btnText="Save" onClick={props.onSave}/>
            </Modal.Footer>
        </Modal>
  );
}

export default CorpLearnModal;