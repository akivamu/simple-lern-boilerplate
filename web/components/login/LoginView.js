"use strict";

import React from "react";
import {Redirect} from "react-router-dom";
import Authenticator from "../Authenticator";
import moment from "moment";
import CSSModules from "react-css-modules";
import styles from "./login.css";

class LoginView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            loginFail: false,
            loginFailMessage: ''
        };
    }

    handleChange(e) {
        this.setState({loginFail: false});
        this.setState({[e.target.name]: e.target.value});
    }

    login(evt) {
        evt.preventDefault();

        if (this.state.username && this.state.password) {
            const that = this;
            Authenticator.login(this.state.username, this.state.password,
                function () {
                    that.setState({loginFail: false});
                },
                function (error) {
                    let msg = '';
                    if (error.response) {
                        if (error.response.status == 429) {
                            const time = moment(error.response.data.error.nextValidRequestDate);
                            msg = 'Try again ' + time.fromNow();
                        } else {
                            msg = error.response.data.error;
                        }
                    } else {
                        msg = error.message;
                    }
                    that.setState({loginFail: true, loginFailMessage: msg});
                }
            );
        }
    }

    render() {
        if (Authenticator.isLoggedIn()) {
            return (
                <Redirect to={{pathname: '/'}}/>
            )
        } else {
            return (
                <div className="container">
                    <form styleName='form-signin'>
                        <h2 styleName='form-signin-heading'>Please sign in</h2>
                        <div className={"form-group " + (this.state.loginFail ? 'has-error' : '')}>
                            <label htmlFor="inputUsername" className="sr-only">Username</label>
                            <input type="text" id="inputUsername" name='username' value={this.state.username}
                                   className="form-control" placeholder="Username" required autoFocus
                                   onChange={this.handleChange.bind(this)}/>
                        </div>
                        <div className={"form-group " + (this.state.loginFail ? 'has-error' : '')}>
                            <label htmlFor="inputPassword" className="sr-only">Password</label>
                            <input type="password" id="inputPassword" name='password' value={this.state.password}
                                   className="form-control" placeholder="Password" required
                                   onChange={this.handleChange.bind(this)}/>
                        </div>
                        {this.state.loginFail &&
                        <div className="alert alert-danger" role="alert">{this.state.loginFailMessage}</div>
                        }
                        <button className="btn btn-lg btn-primary btn-block" type="submit"
                                onClick={this.login.bind(this)}>
                            Sign in
                        </button>
                    </form>
                </div>
            )
        }
    }
}

export default CSSModules(LoginView, styles);