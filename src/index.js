import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import {Provider} from 'mobx-react';
import Dispatcher from 'mobx-dispatcher-router';

import AuthStore from './stores/auth';
import UIStore from './stores/ui';
import DashboardStore from './stores/dashboard';

const dispatcher = new Dispatcher();

dispatcher.attachStore(AuthStore);
dispatcher.attachStore(DashboardStore);
dispatcher.attachStore(UIStore, "ui");

dispatcher.start();

window.stores = dispatcher.stores;

ReactDOM.render(
    <Provider {...dispatcher.stores}>
        <App />
    </Provider>,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
