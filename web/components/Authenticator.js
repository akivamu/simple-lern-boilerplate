import axios from "axios";
import _ from "lodash";

const Authenticator = {
    syncAuthenticationStatus: function (callback) {
        axios.get(API_URL + '/auth/sync')
            .then(function (response) {
                if (response.data.username) {
                    window.sessionStorage.setItem("account", JSON.stringify(response.data));
                    callback(true);
                } else {
                    window.sessionStorage.removeItem("account");
                    callback(false);
                }
            })
            .catch(function (error) {
                window.sessionStorage.removeItem("account");
                callback(false);
            });
    },
    login: function (username, password, successCallback, errorCallback) {
        axios.post(API_URL + '/auth/login', {username: username, password: password})
            .then(function (response) {
                window.sessionStorage.setItem("account", JSON.stringify(response.data));
                successCallback && successCallback();
            })
            .catch(function (error) {
                errorCallback && errorCallback(error);
            });

    },
    logout: function () {
        window.sessionStorage.removeItem("account");
        axios.get(API_URL + '/auth/logout');
    },
    isLoggedIn: function () {
        try {
            return !!JSON.parse(window.sessionStorage.getItem("account"));
        } catch (e) {
            console.error(e);
            return false;
        }
    },
    isAuthorized: function (url) {
        try {
            const account = JSON.parse(window.sessionStorage.getItem("account"));
            return !(!account || _.intersection(account.roles, this.rules[url]).length == 0);
        } catch (e) {
            console.error(e);
            return false;
        }
    },
    setRules: function (rules) {
        this.rules = rules;
    },
    getAccount: function () {
        try {
            return JSON.parse(window.sessionStorage.getItem("account"));
        } catch (e) {
            console.error(e);
            return undefined;
        }
    }
};

export default Authenticator;