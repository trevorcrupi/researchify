import React from 'react';
import {Link} from 'react-router';
import FooterStore from '../stores/FooterStore';
import FooterActions from '../actions/FooterActions';

class Footer extends React.Component {

	constructor(props) {
		super(props);
		this.state = FooterStore.getState();
		this.onChange = this.onChange.bind(this);
	}

	componentDidMount() {
		FooterStore.listen(this.onChange);
		FooterActions.getUserLoggedIn();
	}

	componentWillUnmount() {
		FooterStore.unlisten(this.onChange);
	}

	onChange(state) {
		this.setState(state);
	}

	render() {
		return (
	    <footer>
	        <div className="container">
	            <div className="row">
	                <div className="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
	                    <ul className="list-inline text-center">
	                        <li>
	                            <a href="#">
	                                <span className="fa-stack fa-lg">
	                                    <i className="fa fa-circle fa-stack-2x"></i>
	                                    <i className="fa fa-twitter fa-stack-1x fa-inverse"></i>
	                                </span>
	                            </a>
	                        </li>
	                        <li>
	                            <a href="#">
	                                <span className="fa-stack fa-lg">
	                                    <i className="fa fa-circle fa-stack-2x"></i>
	                                    <i className="fa fa-facebook fa-stack-1x fa-inverse"></i>
	                                </span>
	                            </a>
	                        </li>
	                        <li>
	                            <a href="#">
	                                <span className="fa-stack fa-lg">
	                                    <i className="fa fa-circle fa-stack-2x"></i>
	                                    <i className="fa fa-github fa-stack-1x fa-inverse"></i>
	                                </span>
	                            </a>
	                        </li>
	                    </ul>
	                    <p className="copyright text-muted">Copyright &copy; Researchify 2016</p>
	                </div>
	            </div>
	        </div>
	    </footer>
		);
	}
}

export default Footer;
