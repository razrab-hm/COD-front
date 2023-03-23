import React from 'react';
import { useHistory } from 'react-router-dom';
import { AdminMain } from '../../components';
import ENUMS from '../../constants/appEnums';
import styles from './Admin.module.css';


function Admin({userRole, setUserLoggedIn, userName}) {

  const history = useHistory();

  if (userRole === ENUMS.ROLE.MANAGER) history.replace('/login')
  
  return (
    <div className={styles.admin_wrapper}>
      <AdminMain setUserLoggedIn={setUserLoggedIn} userRole={userRole} userName={userName}/>
    </div>
  )
}

export default Admin