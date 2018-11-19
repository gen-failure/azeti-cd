import React, { Component } from 'react';
import {Layout, Menu, Icon} from 'antd';

import {observer, inject} from 'mobx-react';


@inject('dashboard', 'nav')
@observer
class Sidebar extends Component {
  
  get siteId() {
      return (this.props.dashboard.selectedSite) ? this.props.dashboard.selectedSite.guid : null;
  }

  render() {
    return (
        <Layout.Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            style={{ height: '100%', borderRight: 0 }}
            defaultOpenKeys={["sites"]}
            selectedKeys={[this.siteId]}
            onClick={(item) => {
              this.props.nav.goTo(`/dashboard/site/${item.key}`)
            }}
          >
            <Menu.SubMenu key="sites" title={<span><Icon type="setting" />Sites</span>}>
              {this.props.dashboard.sites.map((site) => {
                return <Menu.Item key={site.guid}>{site.name}</Menu.Item>
              })}
            </Menu.SubMenu>
          </Menu>
        </Layout.Sider>
    )
  }
}

export default Sidebar;
