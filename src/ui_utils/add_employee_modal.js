import Modal from 'react-bootstrap/Modal';
import CorpLearnokButton from './okbutton';
import CorpLearnClose from './closebutton';
import { Form } from "react-bootstrap";

function CorpLearnAddEmployee(props) {

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
                    Add Employee
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control placeholder="Enter name" className="profile_name"/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Enter email" className="profile_email"/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Enter password" className="profile_password"/>
            </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <CorpLearnClose btnText="Close" onClick={props.handleCloseModal} />
                <CorpLearnokButton btnText="Save" onClick={props.onSave}/>
            </Modal.Footer>
        </Modal>
  );
}

export default CorpLearnAddEmployee;