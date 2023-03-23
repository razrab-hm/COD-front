import React from 'react';
import { Route, Redirect, useLocation } from 'react-router-dom';
import ENUMS from '../../constants/appEnums';

export default function ProtectedRoute({
  children,
  userLoggedIn,
  ...rest
}) {

  const location = useLocation();

  return (
    <Route
      {...rest}
      render={() =>
        userLoggedIn ? (
          children
        ) : (
          <Redirect to={{ pathname: ENUMS.ROUTES.LOGIN, state: { from: location } }} />
        )
      }
    />
  );
}
