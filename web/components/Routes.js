import React, {PropTypes} from "react";
import {BrowserRouter as Router, Route, Redirect} from "react-router-dom";
import Authenticator from "./Authenticator";
import HomeView from "./home/HomeView";
import AdminView from "./admin/AdminView";
import LoginView from "./login/LoginView";

const PrivateRoute = ({component, ...rest}) => (
    <Route {...rest} render={ function (props) {
        if (!Authenticator.isLoggedIn()) {
            return (
                <Redirect to={{
                    pathname: '/',
                    state: {from: props.location}
                }}/>
            )
        }

        if (!Authenticator.isAuthorized(props.location.pathname)) {
            return (
                <div>
                    <h1>Access denied</h1>
                </div>
            );
        }

        return React.createElement(component, props)
    }}/>
);

Authenticator.setRules({
    '/': ['ADMIN', 'USER'],
    '/admin': ['ADMIN']
});

export default (
    <div>
        <Router>
            <div>
                <Route exact path="/" component={HomeView}/>
                <Route exact path="/login" component={LoginView}/>
                <PrivateRoute path="/admin" component={AdminView}/>
            </div>
        </Router>
    </div>
);