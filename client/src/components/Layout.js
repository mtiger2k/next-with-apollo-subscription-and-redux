import React, { Component, PropTypes } from 'react';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import NavItem from 'react-bootstrap/lib/NavItem';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';
import { logout } from '../utils/AuthService'
import Link from 'next/link'
import Head from 'next/head'

class Layout extends React.Component {

  render() {
	const { user, title } = this.props
	return (
	  <div className='app'>
		  <Head>
	      	<title>{title}</title>
	      </Head>
		  <Navbar fixedTop>
		    <Navbar.Header>
		      <Navbar.Brand>
		        <div className="brand" >
		        <Link prefetch href='/'>
		        <a>Next-Apollo</a>
		        </Link>
		        </div>
		      </Navbar.Brand>
		      <Navbar.Toggle />
		    </Navbar.Header>
		    <Navbar.Collapse>
		      <Nav>
		        <Link prefetch href='/posts'>
		        <NavItem eventKey={1}>Posts</NavItem>
		        </Link>
		        <Link prefetch href='/about'>
		        <NavItem eventKey={2}>About</NavItem>
		        </Link>
		      </Nav>
		      <Nav pullRight>
		        {!user && <NavItem eventKey={1} href="/login">Sign in</NavItem>}
		        {!user && <NavItem eventKey={2} href="/register">Sign up</NavItem>}
		        {user && <NavItem eventKey={3} onClick={()=>logout()}>Log out</NavItem>}
		      </Nav>
		      {user && 
		      <Navbar.Text pullRight>
		        Hi <strong>{user.dispName}</strong>
		      </Navbar.Text>}
		    </Navbar.Collapse>
		  </Navbar>
		  <div className='appContent'>
            {this.props.children}
          </div>
        <div className="well text-center">
          Have questions? Ask for help <a
          href="https://github.com/erikras/react-redux-universal-hot-example/issues"
          target="_blank">on Github</a> or in the <a
          href="https://github.com/zeit/next.js" target="_blank">next.js</a> Discord channel.
        </div>

	    <style jsx>{`
		  .app .brand {
		    text-decoration: none;
		    top: 5px;
		    left: 5px;
		    border: 0;
		    background: #2d2d2d url('/static/logo.png') no-repeat center center;
		    width: 40px;
		    height: 40px;
		    background-size: 80%;
		    margin: 5px 10px 0 0;
		    border-radius: 20px;
		  }
		  .app .brand a {
		  	display: block;
		  	height: 40px;
		  	text-indent: -9999px;
		  }
		  .app nav :global(.fa) {
		    font-size: 2em;
		    line-height: 20px;
		  }
		  .appContent {
			margin: 50px 0; // for fixed navbar
		  }
	    `}</style>

	  </div>
	)
  }

}

export default Layout;