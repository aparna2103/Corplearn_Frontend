import Modal from 'react-bootstrap/Modal';
import CorpLearnokButton from './okbutton';
import CorpLearnClose from './closebutton';
import { Form } from "react-bootstrap";

function CorpLearnAddCourseToEmployee(props) {

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
                    Add Course to Employee {props.user.name}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form.Group className="mb-3">
                <Form.Select value={props.currentCourse} onChange={(e) => props.setSelectedCourse(e.target.value)} className="add_course_employee_field">
                    {props.courses.map(course => <option value={course.code}>{course.code}</option>)}
                </Form.Select>
            </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <CorpLearnClose btnText="Close" onClick={props.handleCloseModal} />
                <CorpLearnokButton btnText="Save" onClick={props.onSave}/>
            </Modal.Footer>
        </Modal>
  );
}

export default CorpLearnAddCourseToEmployee;