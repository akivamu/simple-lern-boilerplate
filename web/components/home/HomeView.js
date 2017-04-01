import React from "react";
import {Link} from "react-router-dom";
import Header from "../Header";
import Authenticator from "../Authenticator";

export default class HomeView extends React.Component {

    render() {
        if (Authenticator.isLoggedIn()) {
            return (
                <div>
                    <Header/>
                    Home page
                </div>
            );
        } else {
            return (
                <div>
                    Please <Link to="/login">login</Link> first.
                </div>
            )
        }
    }
}