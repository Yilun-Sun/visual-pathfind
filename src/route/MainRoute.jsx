import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import PathfindPage from '../components/pages/Pathfind/PathfindPage';

const MainRoute = () => (
  <Switch>
    <Route path="/visual-pathfind">
      <PathfindPage></PathfindPage>
    </Route>
    <Route path="/">
      <Redirect to="/visual-pathfind" />
    </Route>
  </Switch>
);

export default MainRoute;
