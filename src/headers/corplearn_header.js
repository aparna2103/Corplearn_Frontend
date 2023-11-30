import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Image from 'react-bootstrap/Image';
import { NavDropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

function CorpLearnHeader(props) {

  return (
    <Navbar bg="dark" collapseOnSelect data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="/corpLearn/home">CorpLearn</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
          {props.isAuthenticated && 
            <Nav>
              {props.loggedInUser.role == 2 && <Nav.Link href="/corpLearn/home">View Trainings</Nav.Link>}
              <Nav.Link href="/corpLearn/discussions">Discussion Forum</Nav.Link>
              {props.loggedInUser.role == 1 && <Nav.Link href="/corpLearn/courses">Courses</Nav.Link>}
              {props.loggedInUser.role == 2 && <Nav.Link href="/corpLearn/reportConcern">Report</Nav.Link>}
              {props.loggedInUser.role == 1 && <Nav.Link href="/corpLearn/employees">View Employees</Nav.Link>}
              {props.loggedInUser.role == 1 && <Nav.Link href="/corpLearn/allconcerns">View Concerns</Nav.Link>}
              <Nav.Link href="/corpLearn/announcements">Announcements</Nav.Link>
              <NavDropdown title={
                  <FontAwesomeIcon icon={faUserCircle} /> 
              } id="collapsible-nav-dropdown">
                <NavDropdown.Item href="/corpLearn/profile">Profile</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={props.logout}>Log out</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          }
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CorpLearnHeader;