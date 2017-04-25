import axios from "axios";
import _ from "lodash";

function logout() {
    axios.defaults.headers.common['Authorization'] = undefined;
    window.sessionStorage.removeItem("account");
}

const Authenticator = {
    syncAuthenticationStatus: function (callback) {
        const accountStr = window.sessionStorage.getItem("account");
        if (accountStr) {
            const account = JSON.parse(accountStr);
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + account.token;
        }

        axios.get(API_URL + '/auth/sync')
            .then(function (response) {
                if (response.data.token) {
                    window.sessionStorage.setItem("account", JSON.stringify(response.data));
                    callback(true);
                } else {
                    logout();
                    callback(false);
                }
            })
            .catch(function (error) {
                logout();
                callback(false);
            });
    },
    login: function (username, password, successCallback, errorCallback) {
        axios.post(API_URL + '/auth/login', {username: username, password: password})
            .then(function (response) {
                axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token;
                window.sessionStorage.setItem("account", JSON.stringify(response.data));
                successCallback && successCallback();
            })
            .catch(function (error) {
                errorCallback && errorCallback(error);
            });

    },
    logout: logout,
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