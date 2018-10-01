import React from 'react';
import ReactDOM from 'react-dom';
import './app/style/style.scss'
import Layout from './app/components/layout.comp';
import registerServiceWorker from './registerServiceWorker';
import { Router, Route, Switch } from "react-router-dom"
import { createStore , applyMiddleware } from 'redux';
import { Provider  } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import PageTransition from "react-router-page-transition";

import history from './app/common/history'
import createReducer from './app/common/reducers';
import Store from './app/common/store';

import LoginPage from './app/components/login.page'
import MainPage from './app/components/main.page'

window.setCookie = function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

window.getCookie = function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)===' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

const store = createStore(
	createReducer({}),
	applyMiddleware(thunkMiddleware),
);

Store(store)

ReactDOM.render(
    <Router history={history}>
        <Provider store={store}>
            <Layout>
                <Route render={({ location }) => (<PageTransition timeout={500}>
                    <Switch location={location}>
                        <Route exact path="/" component={LoginPage} />
                        <Route path="/main" component={MainPage} />
                    </Switch>
                </PageTransition>)}/>
            </Layout>
        </Provider>
    </Router>,
    document.getElementById('root'));
registerServiceWorker();
