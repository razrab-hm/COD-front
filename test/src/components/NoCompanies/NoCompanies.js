import React from 'react';
import styles from './NoCompanies.module.css';
import { useHistory } from 'react-router-dom';


function NoCompanies({logginError}) {

  const history = useHistory();

  const handleLogout = () => {
    history.replace('/login');
  };

  if (!logginError) history.replace('/login');

  return (
    <div className={styles.no_companies_wrapper}>
        <>
          <h4>Sorry, {logginError}.</h4>
          <h4>Please contact with administrator</h4>
        </>
      
      <div className={styles.no_companies_link} onClick={handleLogout}>
        Go back to login
      </div>
    </div>
  );
}

export default NoCompanies