import React, { useState, useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import './App.css';
import { Register, Login, Main, Admin, NotFound } from '../../pages';
import { NoCompanies } from '..';
import { ProtectedRoute } from '..';
import ENUMS from '../../constants/appEnums.js';
import Spinner from 'react-bootstrap/Spinner';
import { checkAuthStatus } from '../../utils/projectUtils';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState();
  const [userName, setUserName] = useState();
  const [logginError, setLogginError] = useState(null);

  useEffect(() => {
    checkAuthStatus(setUserLoggedIn, setUserRole, setIsLoading, setUserName);
  },[]);

  return isLoading ? (
    <div className="spinner_wrapper">
      <Spinner variant="primary" animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  ) : (
    <>
      <Switch>
        <Route exact path={ENUMS.ROUTES.REGISTER}>
          <Register userLoggedIn={userLoggedIn} />
        </Route>
        <Route exact path={'/'}>
          <Redirect to={{ pathname: ENUMS.ROUTES.LOGIN}} />
        </Route>
        <Route exact path={ENUMS.ROUTES.INACTIVE}>
          <NoCompanies logginError={logginError}/>
        </Route>
        <Route exact path={ENUMS.ROUTES.LOGIN}>
          <Login setUserName={setUserName} setUserLoggedIn={setUserLoggedIn} userLoggedIn={userLoggedIn} setLogginError={setLogginError} setUserRole={setUserRole} logginError={logginError}/>
        </Route>
        <ProtectedRoute exact path={ENUMS.ROUTES.MAIN} userLoggedIn={userLoggedIn}>
          <Main userName={userName} userLoggedIn={userLoggedIn} setUserLoggedIn={setUserLoggedIn} userRole={userRole}/>
        </ProtectedRoute>
        <ProtectedRoute path={ENUMS.ROUTES.ADMIN} userLoggedIn={userLoggedIn}>
          <Admin userName={userName} userRole={userRole} userLoggedIn={userLoggedIn} setUserLoggedIn={setUserLoggedIn}/>
        </ProtectedRoute>
        <ProtectedRoute exact path={ENUMS.ROUTES.ADMIN_USERS} userLoggedIn={userLoggedIn}>
          <Admin  setUserRole={setUserRole} userLoggedIn={userLoggedIn} setUserLoggedIn={setUserLoggedIn}/>
        </ProtectedRoute>
         <ProtectedRoute exact path={ENUMS.ROUTES.ADMIN_UPLOAD} userLoggedIn={userLoggedIn}>
          <Admin userRole={userRole}/>
        </ProtectedRoute>
        <ProtectedRoute exact path={ENUMS.ROUTES.ADMIN_COMPANIES} userLoggedIn={userLoggedIn}>
          <Admin userRole={userRole}/>
        </ProtectedRoute>
        <Route>
          <NotFound/>
        </Route>
      </Switch>
    </>
  );
}

export default App;
