import React, {Component} from 'react';
import {inject,observer} from 'mobx-react';

import Site from './Dashboard/Site';

@inject('dashboard')
@observer
class Dashboard extends Component {
  render() {
    return (
      <div style={{width: '100%'}}>
        { this.props.dashboard.selectedSite && <Site /> }
      </div>
    )
  }
}

export default Dashboard;
