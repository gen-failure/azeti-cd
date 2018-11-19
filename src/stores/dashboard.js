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
  async showSite(guid, sensor, from, to) {
    try {
      let sites = [];
      let sensors = [];
      let selectedSite = null;
      let selectedSensors = [];
      let sensorsData = {}
      let dateRange = [];

      this.stores.ui.showLoader();
      if (!this.selectedSite || this.selectedSite.guid !== guid) {
        sites = await this._getSites();
        selectedSite = sites.find((site) => { return site.guid === guid})
        sensors = await this._getSensors(selectedSite.guid);
      } else {
        sites = this.sites;
        selectedSite = this.selectedSite
        sensors = this.sensors;
      }

      if (typeof sensor === 'string') sensor = [sensor];
      if (Array.isArray(sensor)) {
        selectedSensors = sensor; 
      } else {
        selectedSensors = [];
      }

      if (from && to) {
        dateRange = [moment.unix(Number(from)), moment.unix(Number(to))]
      } else {
        dateRange = [moment().subtract(90,'d'), moment()];
      }

      //FIXME: This is a temporary solution only, consider getting all sensor values in one query
      for (let i in selectedSensors) {
        let guid = selectedSensors[i];
        sensorsData[guid] = await this._getSensorData(guid, dateRange[0], dateRange[1]);
      }

      this.sites = sites;
      this.sensors = sensors;
      this.selectedSite = selectedSite;
      this.selectedSensors = selectedSensors;
      this.sensorsData = sensorsData;
      this.dateRange = dateRange;

      this.stores.ui.setHeadline(this.selectedSite.name);
      this.stores.ui.renderComponent(<Dashboard />)
      this.stores.ui.hideLoader();
    } catch(e) {
      console.log(e);
    }
  }

  async _getSites() {
    let query = await this.stores.auth.get('/sites');
    return query.data
   
  }

  async _getSensors(guid) {
    let query = await this.stores.auth.get(`/sensors?siteUuid=${guid}`);
    return query.data;
  }

  async _getSensorData(guid, from, to) {
    let query = await this.stores.auth.get(`/timeseries/queryUnmapped?q=SELECT time,value FROM "Value" WHERE sensor_guid = '${guid}' AND time > '${from.utc().format()}' AND time < '${to.utc().format()}'`);
    return query.data; 
  }
}
