import React, {Component} from 'react';

import { inject, observer } from 'mobx-react';
import { Select, DatePicker, Alert, Row, Col } from 'antd';

import Sensor from './Sensor';

@inject('dashboard', 'nav')
@observer
class Site extends Component {
  onSensorsChange(sensors) {
    this.props.nav.goTo(`/dashboard/site/${this.props.dashboard.selectedSite.guid}?${this.buildQuery(sensors, this.props.dashboard.dateRange)}`)
  }

  onTimeChange(date) {
    this.props.nav.goTo(`/dashboard/site/${this.props.dashboard.selectedSite.guid}?${this.buildQuery(this.props.dashboard.selectedSensors, date)}`)
  }

  buildQuery(sensors,date) {
    let queries = [];
    sensors.forEach((sensor) => {
      queries.push(`sensor=${sensor}`)
    })
    queries.push(`from=${date[0].unix()}`);
    queries.push(`to=${date[1].unix()}`);
    return queries.join('&');
  }

  sensorName(guid) {
    return this.props.dashboard.sensors.find((sensor) => { return sensor.guid === guid}).id;
  }

  render() {
    return(
      <div>
        <Row>
          <Col span={10} offset={1}>
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Select the sensor(s)"
              onChange={(key) => {this.onSensorsChange(key)}}
              value={this.props.dashboard.selectedSensors}
              size="large"
            >
              {this.props.dashboard.sensors.map((sensor) =>{
                return <Select.Option key={sensor.guid}>{sensor.id}</Select.Option>
              })}
            </Select>
          </Col>
          <Col span={10} offset={1}>
            <DatePicker.RangePicker
              size="large"
              value={this.props.dashboard.dateRange}
              onChange={(date) => this.onTimeChange(date)}
              allowClear={false}
            />
          </Col>
        </Row>
        <Row>
          {this.props.dashboard.selectedSensors.map((guid) => {
            return this.props.dashboard.sensorsData[guid].results.map((data, index) => {
              return <Sensor key={`${guid}-${index}`} data={data} title={this.sensorName(guid)}/>
            })
          })
          }
        </Row>
      </div>
    );
  }
}

export default Site;
