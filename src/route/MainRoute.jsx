import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import PathfindPage from '../components/pages/Pathfind/PathfindPage';

const MainRoute = () => (
  <Switch>
    <Route path="/visual-pathfinder">
      <PathfindPage></PathfindPage>
    </Route>
    <Route path="/">
      <Redirect to="/visual-pathfinder" />
    </Route>
  </Switch>
);

export default MainRoute;
