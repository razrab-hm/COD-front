import React,{ useMemo } from 'react'
import styles from './AdminMain.module.css';
import { NavLink } from 'react-router-dom';
import { AdminList, Dashboard } from '..';
import ENUMS from '../../constants/appEnums';
import { Route } from 'react-router-dom';

function AdminMain({setUserLoggedIn, userRole, userName}) {

  const routes = useMemo(
    () => [
      {
        path: ENUMS.ROUTES.ADMIN_USERS,
        exact: true,
        render: () => (
          <AdminList
            header={'Users list'}
            usage={ENUMS.USAGE.USERS}
            userRole={userRole}
          />
        ),
      },
      {
        path: ENUMS.ROUTES.ADMIN_COMPANIES,
        exact: true,
        render: () => (
          <AdminList header={'Companies list'} usage={ENUMS.USAGE.COMPANIES} userRole={userRole}/>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );


  return (
    <>
      <Dashboard adminPanel setUserLoggedIn={setUserLoggedIn} userRole={userRole} userName={userName}/>
      <div className="container-fluid">
        <div className="row flex-nowrap">
          <div className={`col-auto bg-dark ${styles.admin_main_aside}`}>
            <div className="d-flex flex-column text-center pt-2 text-white min-vh-100">
              <h4 className="fs-5 d-none d-sm-inline">Menu</h4>
              <ul
                className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
                id="menu"
              >
               
                  <>
                    <li className="nav-item">
                      <NavLink
                        to={ENUMS.ROUTES.ADMIN_USERS}
                        exact
                        className="nav-link align-middle"
                      >
                        <span>
                          <img
                            className={styles.people_icon}
                            alt="people"
                          ></img>
                          Users
                        </span>
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        to={ENUMS.ROUTES.ADMIN_COMPANIES}
                        exact
                        className="nav-link align-middle"
                      >
                        <span>
                          <img
                            className={styles.companies_icon}
                            alt="companies"
                          ></img>
                          Companies
                        </span>
                      </NavLink>
                    </li>
                  </>
               
              </ul>
            </div>
          </div>
          <div className="col py-3">
            {routes.map((route, index) => (
              <Route key={index} {...route} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminMain