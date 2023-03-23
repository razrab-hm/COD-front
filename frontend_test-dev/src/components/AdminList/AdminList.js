import React, {useEffect, useState} from 'react';
import styles from './AdminList.module.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import { getData } from '../../utils/projectUtils';
import { api } from '../../utils/api';
import ENUMS from '../../constants/appEnums';
import { UserInfo, CompanyInfo, AdminAddForm } from '..';



function AdminUsers({header, usage, userRole}) {
  const [allUsers, setAllUsers] = useState([]);
  const [allCompanies, setAllCompanies] = useState([]);
  const [currentEditUser, setCurrentEditUser] = useState();
  const [currentEditCompany, setCurrentEditCompany] = useState();
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTermName, setSearchTermName] = React.useState('');
  const [searchTermDescr, setSearchTermDescr] = React.useState('');
  const [roles, setRoles] = React.useState(['All', ENUMS.ROLE.ADMIN, ENUMS.ROLE.MANAGER]);
  const [filter, setFilter] = useState('');
  const [inactiveFilter, setInactiveFilter] = useState(false);
  const [selectedRole, setSelectedRole] = useState('All');
  

  const handleNameSearch = ({ target: { value } }) => {
    setSearchTermName(value?.toLowerCase());
  };

  const handleDescrSearch = ({ target: { value } }) => {
    setSearchTermDescr(value?.toLowerCase());
  };

  const toggleShowAddForm = () => setShowAddForm(!showAddForm);

  useEffect(() => {
    loadData()
    if(userRole === ENUMS.ROLE.SUPERADMIN) setRoles(['All', ENUMS.ROLE.ADMIN, ENUMS.ROLE.MANAGER, ENUMS.ROLE.SUPERADMIN])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = () => {
    if(usage === ENUMS.USAGE.USERS) getData(null, setAllUsers, api.fetchData, ENUMS.API_ROUTES.USERS);
    if(usage === ENUMS.USAGE.COMPANIES) getData(null, setAllCompanies, api.fetchData, ENUMS.API_ROUTES.COMPANIES);
  };


  const switchUserCompaniesFilter = (e) => {
    if(e.target.checked && usage === ENUMS.USAGE.USERS) {
      getData(null, setAllUsers, api.fetchData, ENUMS.API_ROUTES.USERS_COMPANIES_EMPTY)
    } else if (!e.target.checked) {
      loadData()
    }
  };

  
    const handleRoleChange = event => {
      setSelectedRole(event.target.value);
      setFilter('');
    };

    const handleFilterChange = event => {
      setInactiveFilter(event.target.checked);
    };
  
    const filteredListUsers = allUsers
      .filter(item => {
        if (selectedRole === 'All') {
          return true;
        }
        return item.role === selectedRole;
      })
      .filter(item => {
        return item.username.toLowerCase().includes(filter.toLowerCase());
      })
      .filter(item => {
        if(!inactiveFilter) {
          return true
        } else {
          return item.inactive === true;
        }
      })
      .filter((user) => user?.username?.toLowerCase().includes(searchTermName))
      .filter((user) => {
        if(!searchTermDescr) return true
        return user.description?.toLowerCase().includes(searchTermDescr)
      })

      const filteredListCompanies = allCompanies
        .filter((item) => {
          if (!inactiveFilter) {
            return true;
          } else {
            return item.inactive === true;
          }
        })
        .filter((elem) => elem?.title?.toLowerCase().includes(searchTermName))
        .filter((company) => {
          if(!searchTermDescr) return true
          return company.description?.toLowerCase().includes(searchTermDescr)
        })


  const filterNames = () => {
    if (usage === ENUMS.USAGE.USERS) {
      return filteredListUsers.map((elem) => (
        <ListGroup.Item
          key={elem.username}
          onClick={() => {
            setCurrentEditUser(elem);
            setShowAddForm(false);
          }}
          action
        >
          {elem.username}
          {
            elem.inactive ? <span style={{marginLeft: 5 ,color: '#ff9999'}}>(inactive)</span> : ''
          }
          {elem.description ? (
            <span className={styles.admin_list_description}>
              {
                elem.username.length > 40 ? <br/> : ''
              }
              Description: {elem.description}
            </span>
          ) : (
            ''
          )}
        </ListGroup.Item>
      ));
    } else if(usage === ENUMS.USAGE.COMPANIES) {
      return filteredListCompanies.map((elem) => (
        <ListGroup.Item
          key={elem.title}
          onClick={() => {
            setCurrentEditCompany(elem);
            setShowAddForm(false);
          }}
          action
        >
          {elem.title}
          {
            elem.inactive ? <span style={{marginLeft: 5 ,color: '#ff9999'}}>(inactive)</span> : ''
          }
          {elem.description ? (
            <span className={styles.admin_list_description}>
              {
                elem.title.length > 40 ? <br/> : ''
              }
              Description: {elem.description}
            </span>
          ) : (
            ''
          )}
        </ListGroup.Item>
      ));
    }
    
   
  };
  return (
    <div className="container">
      <div className="row">
        <div className="col-xl-6">
          <div className={styles.admin_list_header_wrapper}>
            <h4>{header}</h4>
            {userRole === ENUMS.ROLE.SUPERADMIN ? (
              <Button
                className={styles.admin_list_add_btn}
                onClick={toggleShowAddForm}
              >
                <img className={styles.admin_list_plus} alt="plus" />
                Add {usage}
              </Button>
            ) : usage === ENUMS.USAGE.USERS ? (
              <Button
                className={styles.admin_list_add_btn}
                onClick={toggleShowAddForm}
              >
                <img className={styles.admin_list_plus} alt="plus" />
                Add {usage}
              </Button>
            ) : (
              ''
            )}
          </div>
          <Form className={styles.admin_list_search_group}>
            <InputGroup className="mb-3">
              <InputGroup.Text id="user_name_search">
                <img className={styles.search_icon} alt="search" />
              </InputGroup.Text>
              <Form.Control
                placeholder={`${usage} name`}
                onChange={handleNameSearch}
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text id="description_search">
                <img className={styles.search_icon} alt="search_descr" />
              </InputGroup.Text>
              <Form.Control
                placeholder={'description'}
                onChange={handleDescrSearch}
              />
            </InputGroup>
          </Form>
          <div className={styles.admin_list_filter_container}>
            <span>Filters:</span>
            {usage === ENUMS.USAGE.USERS ? (
              <>
                <Form.Check
                  inline
                  label="Users without companies"
                  name="users_no_companies"
                  type="checkbox"
                  id={`users_no_companies_checkbox`}
                  onChange={(e) => switchUserCompaniesFilter(e)}
                />
              </>
            ) : null}
            <Form className={styles.admin_list_form}>
              <Form.Check
                inline
                label="Inactive"
                name="inactive"
                type="checkbox"
                id={`inactive_checkbox`}
                onChange={handleFilterChange}
              />
            </Form>
            {usage === ENUMS.USAGE.USERS ? (
              <><span>Role:</span><Form.Select
                value={selectedRole}
                style={{ width: 150, marginRight: 20 }}
                onChange={handleRoleChange}
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role === 'root' ? 'superadmin' : role}
                  </option>
                ))}
              </Form.Select></>
            ) : null}
          </div>
          <ListGroup
            style={{
              height: 'calc(100vh - 250px)',
              boxSizing: 'border-box',
              overflow: 'scroll',
            }}
          >
            {filterNames()}
          </ListGroup>
          {/* <div className={styles.admin_user_btns_wrapper}></div> */}
        </div>

        <div className="col-xl-6">
          {showAddForm ? (
            <AdminAddForm
              header={`Add ${usage}`}
              usage={usage}
              loadData={loadData}
            />
          ) : (
            <>
              <UserInfo
                currentEditUserId={currentEditUser?.id}
                loadData={loadData}
                userRole={userRole}
              />
              <CompanyInfo
                currentEditCompanyId={currentEditCompany?.id}
                loadData={loadData}
                allUsers={allUsers}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminUsers