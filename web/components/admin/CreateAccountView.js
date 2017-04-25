"use strict";

import React from "react";
import axios from "axios";

export default class CreateAccountView extends React.Component {
    constructor(props) {
        super(props);

        this.resetState();
    }

    resetState() {
        this.state = {
            username: '',
            password: '',
            roles: ''
        };
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    createAccount(evt) {
        evt.preventDefault();

        const that = this;

        const newAccount = {
            username: that.state.username,
            password: that.state.password,
            roles: that.state.roles.split(',')
        };

        axios.post(API_URL + '/accounts', newAccount).then(function (response) {
            that.resetState();
            that.props.onChange();
            that.setState({failMessage: ''});
        }).catch(function (error) {
            that.setState({failMessage: error.response ? error.response.data : error.message});
        })
    }

    render() {
        return (
            <div>
                <form className="form-inline">
                    <div className="form-group">
                        <input type="text" name='username' className="form-control" placeholder="Username"
                               value={this.state.username}
                               onChange={this.handleChange.bind(this)}/>
                    </div>
                    <div className="form-group">
                        <input type="password" name='password' className="form-control" placeholder="Password"
                               value={this.state.password} onChange={this.handleChange.bind(this)}/>
                    </div>
                    <div className="form-group">
                        <input type="text" name='roles' className="form-control" placeholder="Roles"
                               value={this.state.roles}
                               onChange={this.handleChange.bind(this)}/>
                    </div>
                    <button type="submit" className="btn btn-default" onClick={(evt) => this.createAccount(evt)}>
                        Create
                    </button>
                </form>
                {this.state.failMessage &&
                <div className="alert alert-danger" role="alert">{this.state.failMessage}</div>
                }
            </div>
        );
    }
}