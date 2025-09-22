import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { CurrentAppProvider, getAppConfig } from '@openedx/frontend-base';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import 'formdata-polyfill';
import { Outlet } from 'react-router-dom';
import { appId } from './constants';

import './app.scss';

const Main = () => (
  <CurrentAppProvider appId={appId}>
    <main className="flex-grow-1" id="main">
      <Outlet />
    </main>
    { getAppConfig(appId).NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} /> }
  </CurrentAppProvider>
);

export default Main;