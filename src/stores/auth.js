import React from 'react';
import {action, observable} from 'mobx';

import LoginForm from '../components/LoginForm';

import axios from 'axios';

export default class AuthStore {
  @observable OAuthToken = null;
  @observable authenticated = false;
  @observable username = "";
  @observable hostname = "18.203.236.248"; //Just for the purpose of the demo
  @observable authenticationMessage = null;
  @observable authenticationMessageType = null;
  @observable redirectTo = null;

  constructor() {
    this.httpClient = null;
  }

  onAttach() {
    this.addRoute('/signin', (params,{redirectTo, message,type}) => (this.showLoginForm(redirectTo, message, type)));
  }

  @action async login(username, password, hostname) {
    try {
      this.stores.ui.showLoader();
      this.authenticationMessage=null;
      this.authenticationMessageLevel=null;
      let query = await axios({
        method: 'POST',
        data: { username, password},
        url: `https://${hostname}/acp-service/authentication/auth`,
        timeout: 10000 //10 seconds should be enough for everybody!
      });
      this.OAuthToken=query.data.token;
      this.authenticated=true;
      this.username=username;
      this.httpClient = axios.create({
        baseURL: `https://${hostname}/acp-service/`,
        headers: {
          'x-authorization': this.OAuthToken
        }
      });

      if (this.redirectTo) {
        this.stores.nav.goTo(this.redirectTo)
      } else {
        this.stores.nav.goTo('/dashboard')
      }
    } catch(e) {
      //FIXME Improve the error handling when we know more about server error responses
      if (e.response && e.response.status === 401) {
        this.authenticationMessage="Authorization failed, check your username and password";
        this.authenticationMessageType="error";
      } else {
        //FIXME: For now we assume the connection error
        this.authenticationMessage="Connection to cloud failed, check the cloud address";
        this.authenticationMessageType="error";
      }
      this.stores.ui.hideLoader();
    }
  } 
  
  @action showLoginForm(redirectTo, message="", type="") {
    this.redirectTo = decodeURIComponent(redirectTo);
    this.authenticationMessage=message;
    this.authenticationMessageType=type;
    this.stores.ui.renderComponent(<LoginForm />);
  }

  @action signoff() {
    this.authenticated=false;
    this.OAuthToken=null;
  }

  async get(url) {
    try {
      return await this.httpClient.get(url)
    } catch(e) {
      if (e.response && e.response.status === 401) {
        let redirect = decodeURIComponent(`${this.stores.nav.path}${this.stores.nav.query}&message=Auth token expired&type=warning`);
        this.changePath(`/signin?redirectTo=${redirect}`);
        this.signoff();
        this.stores.ui.hideLoader()
      }
      throw(e);
    }
  }
}


