/* eslint-disable */
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import { Route, Switch, HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import reducers from './reducers'
import asyncComponent from './components/commonComp/asyncComponent'
import './common/index.scss'
import './common/Reset.scss'

const AsyncLogin = asyncComponent(() => import('./components/login/login'))
const AsyncRegister = asyncComponent(() => import('./components/register/register'))
const AsyncNews = asyncComponent(() => import('./components/newsInfo/newsInfo'))

const store = createStore(
	reducers,
	compose(
		applyMiddleware(thunk),
		window.devToolsExtension ? window.devToolsExtension() : fn => fn
	)
)

ReactDOM.render(
	<Provider store={store}>
		<HashRouter>
			<div className="container">
				<Switch>
					<Route path="/" exact component={AsyncLogin} />
					<Route path="/register" exact component={AsyncRegister} />
          <Route path="/news" exact component={AsyncNews} />
				</Switch>
			</div>
		</HashRouter>
	</Provider>,
	document.getElementById('root')
)
