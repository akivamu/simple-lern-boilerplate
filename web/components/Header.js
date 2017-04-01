import React from "react";
import {Link} from "react-router-dom";
import Authenticator from "./Authenticator";

export default class Header extends React.Component {
    render() {
        return (
            <div>
                <div className="container">
                    <ul className="nav nav-pills">
                        <li className="navbar-left"><p className="navbar-text">
                            Hello, {Authenticator.getAccount().username}</p>
                        </li>
                        <li className="navbar-right"><a href="/" onClick={Authenticator.logout}>Logout</a></li>
                        {Authenticator.isAuthorized('/admin') &&
                        <li className="navbar-right"><Link to="/admin">Admin</Link></li>
                        }
                    </ul>
                </div>
            </div>
        );
    }
}