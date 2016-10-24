import React from 'react';
import {Link} from 'react-router';
import NavbarStore from '../stores/NavbarStore';
import NavbarActions from '../actions/NavbarActions';

class Navbar extends React.Component {

	constructor(props) {
		super(props);
		this.state = NavbarStore.getState();
		this.onChange = this.onChange.bind(this);
	}

	componentDidMount() {
		NavbarStore.listen(this.onChange);
	}

	componentWillUnmount() {
		NavbarStore.unlisten(this.onChange);
		NavbarActions.getUserLoggedIn();
	}

	onChange(state) {
		this.setState(state);
	}

	handleSubmit(event) {
		event.preventDefault();
	}

	render() {
		return (
	    <nav className="navbar navbar-default navbar-custom navbar-fixed-top">
	        <div className="container-fluid">
	            <div className="navbar-header page-scroll">
	                <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
	                    <span className="sr-only">Toggle navigation</span>
	                    Menu <i className="fa fa-bars"></i>
	                </button>
	                <a className="navbar-brand" href="/">Researchify</a>
	            </div>

	            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
	                <ul className="nav navbar-nav navbar-right">
	                    <li>
	                        <a href="/">Home</a>
	                    </li>
	                    <li>
	                        <a href="about.html">About</a>
	                    </li>
	                    <li>
	                        <a href="/article/1">Sample Post</a>
	                    </li>
	                    <li>
	                        <a href="contact.html">Contact</a>
	                    </li>
	                </ul>
	            </div>
	        </div>
	    </nav>
		);
	}
}

export default Navbar;
