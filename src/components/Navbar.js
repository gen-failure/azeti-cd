import React, { Component } from 'react';
import {Layout} from 'antd';

import {inject, observer} from 'mobx-react';

@inject('ui')
@observer
class Navbar extends Component {
  render() {
    return (
      <Layout.Header className="header">
        <h1 style={{color: 'white'}}>{this.props.ui.headline}</h1>
      </Layout.Header>
    )
  }
}

export default Navbar;
