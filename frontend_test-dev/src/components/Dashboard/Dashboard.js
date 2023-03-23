import React from 'react'
import styles from './Dashboard.module.css';
import Container from 'react-bootstrap/Container';
import { useHistory } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { authApi } from '../../utils/authApi';
import {getCookie} from '../../utils/cookie';
import ENUMS from '../../constants/appEnums';

function Dashboard({setUserLoggedIn, adminPanel, userRole, setShowMenu, showMenu, userName}) {

  const refreshToken = getCookie('accessToken');
  const history = useHistory();

  const handleLogout = () => {
    authApi.logout(refreshToken)
    .then((res) => {
      setUserLoggedIn(false);
      history.replace('/login')
    })
    .catch((error) => {
      console.log(error)
    })
  };

  return (
    <header className="header header-sticky mb-0">
      <Navbar variant="light" expand="lg">
        <Container fluid style={{ height: 40 }}>
          <Navbar.Brand>
            <button
              title={<div className={adminPanel ? '' : styles.nav_list}></div>}
              onClick={() => setShowMenu(!showMenu)}
              className={styles.nav_list_button}
            >
              {
                adminPanel ? '' : showMenu ? <span>Companies <img className={styles.aside_open} alt='open'></img></span> : <span>Companies <img className={styles.aside_close} alt='close'></img></span>
              }
            </button>
          </Navbar.Brand>
          <Navbar.Brand>
            <div
              style={{
                color: 'rgba(44, 56, 74, 0.681)',
                fontWeight: 'bolder',
                fontSize: '1rem',
              }}
            >
              {adminPanel ? 'Admin Panel' : 'Dashboard'}
            </div>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-dark-example" />
          <DropdownButton
            align={{ lg: 'end' }}
            title={
            <div className={styles.nav_user_wrapper}>
            <span style={{pointerEvents: 'none', fontWeight: 500}}><span style={{fontWeight: 400}}>{userName}</span>role: {userRole === 'root' ? 'superadmin' : userRole}</span>
            <div className={styles.nav_user}></div>
            </div>
            }
            id="dropdown"
          >
            {userRole !== ENUMS.ROLE.MANAGER ? (
              adminPanel ? (
                <Dropdown.Item
                  eventKey="1"
                  onClick={() => history.push('/main')}
                >
                  <img className={styles.link_main} alt="main" />
                  Dashboard
                </Dropdown.Item>
              ) : (
                <Dropdown.Item
                  eventKey="2"
                  onClick={() => history.push('/admin/users')}
                >
                  <img className={styles.link_admin} alt="admin" />
                  Admin Panel
                </Dropdown.Item>
              )
            ) : null}

            <Dropdown.Item eventKey="2" onClick={() => handleLogout()}>
              <img className={styles.logout} alt="admin" />
              Logout
            </Dropdown.Item>
          </DropdownButton>
        </Container>
      </Navbar>
    </header>
  );
}

export default Dashboard