import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import axios from "axios";

axios.defaults.withCredentials = true;

document.addEventListener('DOMContentLoaded', function () {
    ReactDOM.render(
        <App/>,
        document.getElementById('main')
    );
});