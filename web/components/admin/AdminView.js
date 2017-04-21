import React from "react";
import CreateAccountView from "./CreateAccountView";
import AccountsView from "./AccountsView";

export default class AdminView extends React.Component {
    refresh() {
        this.refs.accountsView.refresh();
    }
    render() {
        return (
            <div className="container">
                <h1>Admin</h1>
                <CreateAccountView onChange={this.refresh.bind(this)}/>
                <AccountsView ref="accountsView" onChange={this.refresh.bind(this)}/>
            </div>
        );
    }
}