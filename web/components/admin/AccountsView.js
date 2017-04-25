import React from "react";
import axios from "axios";
import _ from "lodash";
import {BootstrapTable, TableHeaderColumn} from "react-bootstrap-table";

export default class AccountsView extends React.Component {

    constructor(props) {
        super(props);
        this.options = {
            noDataText: 'No data',
            onDeleteRow: this.onDeleteRow.bind(this)
        };
        this.cellEditOptions = {
            mode: 'dbclick',
            afterSaveCell: this.onAfterSaveCell.bind(this)
        };
        this.state = {accounts: []};
        this.refresh();
    }

    onAfterSaveCell(row, cellName, cellValue) {
        const that = this;
        row.roles = _.split(row.roles, ',');
        axios.patch(API_URL + '/accounts', row)
            .then(function () {
                that.refresh();
            });
    }

    onDeleteRow(rows) {
        rows.forEach(function (username) {
            axios.delete(API_URL + '/accounts/' + username);
        });
    }

    refresh() {
        const that = this;
        axios.get(API_URL + '/accounts').then(function (response) {
            that.setState({accounts: response.data});
        });
    }

    render() {
        return (
            <div>
                <BootstrapTable
                    data={this.state.accounts}
                    options={this.options}
                    keyField='username'
                    deleteRow={ true }
                    selectRow={ {mode: 'checkbox', bgColor: '#ddd'} }
                    cellEdit={this.cellEditOptions}>
                    <TableHeaderColumn dataField='username'
                                       editable={false}>
                        Username
                    </TableHeaderColumn>
                    <TableHeaderColumn dataField='password'>
                        Password
                    </TableHeaderColumn>
                    <TableHeaderColumn dataField='roles'
                                       dataFormat={(cell) => {
                                           return _.join(cell, ',')
                                       }}>
                        Roles
                    </TableHeaderColumn>
                </BootstrapTable>
            </div>
        );
    }
}