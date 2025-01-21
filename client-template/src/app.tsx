// src/index.jsx
import React, { useState, useEffect } from 'react';
import * as ReactDOM from 'react-dom';
import { AppRouter, AppRoute, AppConfig } from '@ice/stark';
import BasicLayout from './layouts/BasicLayout';
import { getApps } from './apps';
import '@alifd/next/dist/next.css';


interface ExtendedAppConfig extends AppConfig {
  path: string;
}

const App = () => {
  const [state, setState] = useState<{apps: ExtendedAppConfig[]}>({apps: []});

  useEffect(() => {
    getApps().then(apps => {
      setState({ apps: apps as ExtendedAppConfig[] });
    });
  }, []);

  const { apps } = state;

  return (
    <BasicLayout pathname={window.location.pathname}>
      <AppRouter>
        <AppRoute
          activePath="/seller"
          title="商家平台"
          url={[
            '//unpkg.com/icestark-child-seller/build/js/index.js',
            '//unpkg.com/icestark-child-seller/build/css/index.css',
          ]}
        />
        {apps.map((app) => (
          <AppRoute
            key={app.path}
            {...app}
          />
        ))}
      </AppRouter>
    </BasicLayout>
  );
};

ReactDOM.render(<App />, document.getElementById('icestark-container'));