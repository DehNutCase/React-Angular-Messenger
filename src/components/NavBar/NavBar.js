import { Nav, Navbar } from "react-bootstrap";

export default function NavBar() {
  return (
    <Navbar bg="info" expand="lg">
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/messenger">Messenger</Nav.Link>
          <Nav.Link href="/usersPage">User List</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
