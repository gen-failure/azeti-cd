import React from 'react'; //eslint-disable-line no-unused-vars
import { action, observable } from 'mobx';

export default class UIStore {
  @observable loading = false;
  @observable render = "";
  @observable headline = ""

  onAttach() {
    this.addRoute('/', () => { this.changePath('/dashboard')})
  }
  
  @action renderComponent(component) {
    this.render = component;
  }

  @action showLoader() {
    this.loading = true;
  }
  
  @action hideLoader() {
    this.loading = false;
  }

  @action setHeadline(headline) {
    this.headline = headline
  }
  
}
