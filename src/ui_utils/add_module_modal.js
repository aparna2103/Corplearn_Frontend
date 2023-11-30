import Modal from 'react-bootstrap/Modal';
import CorpLearnokButton from './okbutton';
import CorpLearnClose from './closebutton';
import { Form } from "react-bootstrap";

function CorpLearnAddModule(props) {

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
                    Add Module
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form.Group className="mb-3">
                <Form.Label>Module Content</Form.Label>
                <Form.Control placeholder="Enter content" as="textarea" className="new_module_content_field"/>
            </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <CorpLearnClose btnText="Close" onClick={props.handleCloseModal} />
                <CorpLearnokButton btnText="Save" onClick={props.onSave}/>
            </Modal.Footer>
        </Modal>
  );
}

export default CorpLearnAddModule;