import { HashRouter, Switch, Route } from 'react-router-dom';

import React from 'react';
import { render } from 'react-dom';

import ChangeQuery from './change-query';
import CreateFilterlist from './create-filterlist';
import UseFilterlist from './use-filterlist';
import DeferredInit from './deferred-init';

render(
  <HashRouter>
    <Switch>
      <Route
        component={ChangeQuery}
        path="/change-query/"
      />

      <Route
        component={CreateFilterlist}
        path="/create-filterlist/"
      />

      <Route
        component={UseFilterlist}
        path="/use-filterlist/"
      />

      <Route
        component={DeferredInit}
        path="/deferred-init/"
      />
    </Switch>
  </HashRouter>,
  document.getElementById('app'),
);
