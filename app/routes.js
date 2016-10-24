import React from 'react';
import {Route} from 'react-router';
import App from './components/App';
import Home from './components/Home';
import Article from './components/Article';
import Likes from './components/Likes';

export default (
	<Route component={App}>
		<Route path='/' component={Home} />
		<Route path='/articles/:id' component={Article} />
		<Route path='/likes' component={Likes} />
	</Route>
);
