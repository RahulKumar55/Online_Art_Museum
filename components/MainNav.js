import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Link from 'next/link';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import { searchHistoryAtom } from '@/store';

import { addToHistory } from '@/lib/userData';
import { removeToken, readToken } from '@/lib/authenticate';

export default function MainNav() {

  const [searchField, setSearchField] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchHistory, setSearchHistory]= useAtom(searchHistoryAtom);
  const router = useRouter();
  let token = readToken();

  async function submitForm(e) {
    setIsExpanded(false)
    e.preventDefault(); // prevent the browser from automatically submitting the form
    if(searchField){
      setSearchHistory(await addToHistory(`title=true&q=${searchField}`)); 
      router.push(`/artwork?title=true&q=${searchField}`);
    }
  }

  function logout(){
    setIsExpanded(false);
    removeToken();
    router.push('/login');
  }

  if(token){
    return(
    <>
    <Navbar collapseOnSelect expand="lg" className="fixed-top navbar-dark bg-primary" >
        <Container>
          <Navbar.Brand >Rahul Kumar</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" onClick={() => setIsExpanded(!isExpanded)}/>
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
            <Link href="/" passHref legacyBehavior><Nav.Link onClick={() => setIsExpanded(false)} active={router.pathname === "/"}>Home</Nav.Link></Link>
            <Link href="/search" passHref legacyBehavior><Nav.Link onClick={() => setIsExpanded(false)} active={router.pathname === "/search"}>Advanced Search</Nav.Link></Link>
            </Nav>
            &nbsp;
            <Form className="d-flex" onSubmit={submitForm}>
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
              onChange={(e) => setSearchField(e.target.value)}
            />
            <Button type="submit" variant="outline-success">Search</Button>
          </Form>
          &nbsp;
          <Nav>
            <NavDropdown title={`${token.userName}`} id="basic-nav-dropdown">
            <Link href="/favourites" passHref legacyBehavior><NavDropdown.Item onClick={() => setIsExpanded(false)} active={router.pathname === "/favourites"}>Favourites</NavDropdown.Item></Link>
            <Link href="/history" passHref legacyBehavior><NavDropdown.Item onClick={() => setIsExpanded(false)} active={router.pathname === "/history"}>Search History</NavDropdown.Item></Link>
            <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <hr />
      <br /><br />
    </>
    )
  }
  else{

  }
    return (
      <>
        <Navbar collapseOnSelect expand="lg" className="fixed-top navbar-dark bg-primary" >
        <Container>
          <Navbar.Brand >Rahul Kumar</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" onClick={() => setIsExpanded(!isExpanded)}/>
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
            <Link href="/" passHref legacyBehavior><Nav.Link onClick={() => setIsExpanded(false)} active={router.pathname === "/"}>Home</Nav.Link></Link>
            </Nav>
            &nbsp;
            <Nav>
            <Link href="/register" passHref legacyBehavior><Nav.Link onClick={() => setIsExpanded(false)} active={router.pathname === "/register"}>Register</Nav.Link></Link>
            <Link href="/login" passHref legacyBehavior><Nav.Link onClick={() => setIsExpanded(false)} active={router.pathname === "/login"}>Login</Nav.Link></Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <hr />
      <br /><br />
      </>
    )
}