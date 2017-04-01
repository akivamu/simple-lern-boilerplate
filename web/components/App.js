import React, {PropTypes} from "react";
import Authenticator from "./Authenticator";
import routes from "./Routes";

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {syncDone: false};

        const that = this;
        Authenticator.syncAuthenticationStatus(function () {
            that.setState({syncDone: true});
        });
    }

    render() {
        if (!this.state.syncDone) {
            return (<div></div>);
        } else {
            return routes;
        }
    }
}