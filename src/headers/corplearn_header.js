import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Image from 'react-bootstrap/Image';
import { NavDropdown } from 'react-bootstrap';

function CorpLearnHeader(props) {

  return (
    <Navbar bg="dark" collapseOnSelect data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="/corpLearn/home">CorpLearn</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
          {props.isAuthenticated && 
            <Nav>
              <Nav.Link href="#features">Discussion Forum</Nav.Link>
              <Nav.Link href="#pricing">Courses</Nav.Link>
              <Nav.Link href="#deets">Report</Nav.Link>
              {props.loggedInUser.role == 1 && <Nav.Link href="/corpLearn/employees">View Employees</Nav.Link>}
              {props.loggedInUser.role == 1 && <Nav.Link href="#deets">View Concerns</Nav.Link>}
              {props.loggedInUser.role == 1 && <Nav.Link href="#deets">Post Announcement</Nav.Link>}
              <NavDropdown title={
                  <Image src="../../assets/profile.png" roundedCircle />
              } id="collapsible-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Profile</NavDropdown.Item>
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