import React from 'react';
import { action, observable} from 'mobx';

import authenticatedOnly from './../decorators/authenticatedOnly';

import Dashboard from '../components/Dashboard';

import moment from 'moment';

export default class DashboardStore {
  @observable sites = [];
  @observable sensors = [];
  @observable selectedSite = null;
  @observable selectedSensors = [];
  @observable sensorsData = {};
  @observable dateRange = [];

  onAttach() {
    this.addRoute('/dashboard', () => { this.showDashboard()});
    this.addRoute('/dashboard/site/:guid', ({guid}, {sensor, from, to}) => { this.showSite(guid, sensor, from, to)});
  }

  @action
  @authenticatedOnly
  async showDashboard() {
    this.stores.ui.showLoader();
    this.sites = await this._getSites();
    if (this.sites.length > 0) {
      this.changePath(`/dashboard/site/${this.sites[0].guid}`);
    } else {
      this.stores.ui.renderComponent(<Dashboard />)
      this.stores.ui.hideLoader();
    }
  }

  @action
  @authenticatedOnly
  async showSite(guid, sensors, from, to) {
    this.stores.ui.showLoader();
    if (!this.selectedSite || this.selectedSite.guid !== guid) {
      this.sites = await this._getSites();
      this.selectedSite = this.sites.find((site) => { return site.guid === guid})
      this.sensors = await this._getSensors(this.selectedSite.guid);
    }
    this.stores.ui.setHeadline(this.selectedSite.name);
    if (typeof sensors === 'string') sensors = [sensors];
    if (Array.isArray(sensors)) {
      this.selectedSensors = sensors; 
    } else {
      this.selectedSensors = [];
    }
    if (from && to) {
      this.dateRange = [moment.unix(Number(from)), moment.unix(Number(to))]
    } else {
      this.dateRange = [moment().subtract(90,'d'), moment()];
    }

    //FIXME: This is a temporary solution only, consider getting all sensor values in one query
    for (let i in this.selectedSensors) {
      let guid = this.selectedSensors[i];
      this.sensorsData[guid] = await this._getSensorData(guid)
    }

    this.stores.ui.renderComponent(<Dashboard />)
    this.stores.ui.hideLoader();
  }

  async _getSites() {
    let query = await this.stores.auth.httpClient.get('/sites');
    return query.data
   
  }

  async _getSensors(guid) {
    let query = await this.stores.auth.httpClient.get(`/sensors?siteUuid=${guid}`);
    return query.data;
  }

  async _getSensorData(guid) {
    let query = await this.stores.auth.httpClient.get(`/timeseries/queryUnmapped?q=SELECT time,value FROM "Value" WHERE sensor_guid = '${guid}' AND time > '${this.dateRange[0].utc().format()}' AND time < '${this.dateRange[1].utc().format()}'`);
    return query.data; 
  }
}
