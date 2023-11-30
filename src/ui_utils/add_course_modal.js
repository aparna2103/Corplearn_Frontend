import Modal from 'react-bootstrap/Modal';
import CorpLearnokButton from './okbutton';
import CorpLearnClose from './closebutton';
import { Form } from "react-bootstrap";

function CorpLearnAddCourse(props) {

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
                    Add Course
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form.Group className="mb-3">
                <Form.Label>Course Code</Form.Label>
                <Form.Control placeholder="Enter code" className="new_course_code_field"/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="number" min={2} placeholder="Enter days to complete" className="new_course_deadline_field"/>
            </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <CorpLearnClose btnText="Close" onClick={props.handleCloseModal} />
                <CorpLearnokButton btnText="Save" onClick={props.onSave}/>
            </Modal.Footer>
        </Modal>
  );
}

export default CorpLearnAddCourse;