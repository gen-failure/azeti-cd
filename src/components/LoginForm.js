import React, { Component } from "react"
import { Form, Icon, Input, Button, Alert } from "antd"

import { observer, inject } from "mobx-react"

import setField from '../decorators/setField';

import "./LoginForm.scss"



@inject('auth')
@observer
@setField
class LoginForm extends Component {
  constructor() {
    super();
    this.submitHandler = (e) => {
      e.preventDefault();
      this.props.auth.login(this.state.username,this.state.password, this.state.hostname);
    }  
  }

  componentWillMount() {
    this.setState((state) => {
      return Object.assign(
        {},
        state,
        {
          username: "",
          password: "",
          hostname: this.props.auth.hostname
        }
      )
    });
  }

  render() {
    return (
      <div className="login-form-component centered">
        <div className="wrapper">
          {this.props.auth.authenticationMessage && <Alert message={this.props.auth.authenticationMessage} type={this.props.auth.authenticationMessageType} />}
          <h2>Sign in</h2>
          <Form onSubmit={this.submitHandler}>
            <Form.Item required>
              <Input
                prefix={<Icon type="user" />}
                value={this.state.username}
                onChange={ (e) => {this.setField('username', e.target.value)}}
                placeholder="Username"
                size="large"
              />
            </Form.Item>
            <Form.Item required>
              <Input
                prefix={<Icon type="lock" />}
                value={this.state.password}
                onChange={ (e) => {this.setField('password', e.target.value)}}
                type="password"
                placeholder="Password"
                size="large"
              />
            </Form.Item>
            <Form.Item required>
              <Input
                prefix={<Icon type="cloud" />}
                value={this.state.hostname}
                onChange={ (e) => {this.setField('hostname', e.target.value)}}
                placeholder="Hostname"
              />
            </Form.Item>
            <Form.Item required>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                size="large"
              >
                Log in
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    )
  }
};

export default LoginForm;
