import React, { Component } from 'react';
import {inject, observer} from 'mobx-react';

import {Layout} from 'antd';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Loader from './components/Loader';

import './App.scss';

@inject('ui', 'auth')
@observer
class App extends Component {
  render() {
    return (
      <Layout style={{height: '100%'}}>
        { this.props.auth.authenticated && <Navbar /> }
        <Layout>
          {this.props.auth.authenticated && <Sidebar /> }
          <Layout style={{ padding: '24px'}}>
            <Layout.Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280, display: 'flex', position: 'relative' }}>
              {this.props.ui.loading && <Loader />}
              {!this.props.ui.loading && this.props.ui.render}
            </Layout.Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

export default App;
