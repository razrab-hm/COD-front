import React from 'react';
import styles from './NotFound.module.css';

function NotFound() {
  return (
    <div className={styles.container}>
      <div className="row text-center">
        <div className="col-lg-6 offset-lg-3 col-sm-6 offset-sm-3 col-12 p-3 error-main">
          <div className="row">
            <div className="col-lg-8 col-12 col-sm-10 offset-lg-2 offset-sm-1">
              <h1 className="m-0">404</h1>
              <h6> Sorry! Page not found</h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound