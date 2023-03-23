import React, { useEffect, useMemo, useState } from 'react'
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { useForm } from "react-hook-form";
import styles from './UserInfo.module.css';
import { getData } from '../../../utils/projectUtils';
import { api } from '../../../utils/api';
import ENUMS from '../../../constants/appEnums';
import Button from 'react-bootstrap/Button';
import { adminApi } from '../../../utils/adminApi';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import ListGroup from 'react-bootstrap/ListGroup';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Spinner from 'react-bootstrap/Spinner';

function UserInfo({ currentEditUserId, loadData, userRole }) {

  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [showToaster, setShowToaster] = useState(false);
  const [userCompanies, setUserCompanies] = useState([]);
  const [toasterText, setToasterText] = useState('');
  const [toasterStyles, setToasterStyles] = useState({});
  const [showPassword, setShowPassword] = useState(true);
  const [disableSaveBtn, setDisableSaveBtn] = useState(true);
  const [showCompanyAdd, setShowCompanyAdd] = useState(false);
  const [allCompanies, setAllCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [disableEdit, setDisableEdit] = React.useState(true);

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const handleChange = ({ target: { value } }) => {
    setSearchTerm(value);
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setError,
    setValue,
  } = useForm({
    defaultValues: useMemo(() => {
      return userInfo;
    }, [userInfo]),
  });

  const getUserInfo = () => {
    getData(
      null,
      setUserInfo,
      api.fetchData,
      `${ENUMS.API_ROUTES.USERS}${currentEditUserId}`
    );
    getData(
      null,
      setUserCompanies,
      api.fetchData,
      `${ENUMS.API_ROUTES.COMPANIES_USER}${currentEditUserId}`
    );
  };

  const renderTooltip = (title, contact_email, contact_fio) => (
    <Tooltip id="button-tooltip">
     <span>Company name: {title}</span>
     <br/>
     <span>Email: {contact_email}</span>
     <br/>
     <span>Contact name: {contact_fio}</span>
    </Tooltip>
  );

  const getCompanies = () => {
    getData(null, setAllCompanies, api.fetchData, ENUMS.API_ROUTES.COMPANIES);
  };

  const deleteCompany = async (company) => {
    const data = {
      userId: userInfo.id,
      companyId: company.id,
    }
    try {
      await adminApi.toggleCompanyAndUser(data, ENUMS.API_ROUTES.USERS_REMOVE_COMPANY);
    } catch (error) {
      console.error(error);
    }

    setUserCompanies((prevState) =>
      prevState.filter((elem) => elem.id !== company.id)
    );
    setDisableSaveBtn(false);
  };

  const addCompany = async (company) => {
    const data = {
      userId: userInfo.id,
      companyId: company.id,
    }
    try {
      await adminApi.toggleCompanyAndUser(data, ENUMS.API_ROUTES.USERS_ADD_COMPANY);
    } catch (error) {
      console.error(error);
    }

    setUserCompanies((prevState) => {return [...prevState, company]});
    setDisableSaveBtn(false);
  };

  const saveData = async (parameters) => {
    if(!parameters.admin && !parameters.manager && !parameters.superadmin) {
       setShowToaster(true);
       setToasterText('Please select user role!');
       setToasterStyles(ENUMS.TOASTER.FAIL_STYLE);
       return
    }

    // const userNewCompanies = {companies_id: userCompanies.map(elem => elem.id), user_id: parameters.id}
    try {
      setIsLoading(true);
      await adminApi.updateUserInfo(parameters, ENUMS.API_ROUTES.USERS);
      // await adminApi.updateUserInfo(userNewCompanies, ENUMS.API_ROUTES.USERS_UPDATE_COMPANIES);
      setToasterText(ENUMS.TOASTER.SUCCESS_UPDATE_USER.label);
      setToasterStyles(ENUMS.TOASTER.SUCCESS_STYLE);
      setIsLoading(false);   
      setShowToaster(true);
      setDisableSaveBtn(true);
      setValue('password', '');
      loadData();
    } catch (error) {
      setIsLoading(false);
      reset();
      setShowToaster(true);
      setToasterText(ENUMS.TOASTER.FAIL.label);
      setToasterStyles(ENUMS.TOASTER.FAIL_STYLE);
      if (error.message === 'User already exists') {
        setError('username', {
          type: 'custom',
          message: `User name '${parameters.username}' has already exists`,
        });
      }
      if (error.message === 'Email already exists') {
        setError('email', {
          type: 'custom',
          message: `Email '${parameters.email}' has already exists`,
        });
      }
      if (error.message === 'Email is not valid') {
        setError('email', {
          type: 'custom',
          message: `Email '${parameters.email}' is not valid`,
        });
      }
    
    }
  };

  const handleChangeRole = (role) => {
    switch (role) {
      case ENUMS.ROLE.MANAGER:
        setValue('admin', false)
        setValue('superadmin', false);
        break;
        case ENUMS.ROLE.ADMIN:
          setValue('manager', false)
          setValue('superadmin', false);
        break;
        case ENUMS.ROLE.SUPERADMIN:
          setValue('manager', false)
          setValue('admin', false);
        break;
      default: return
      }
  };

  useEffect(() => {
    reset(userInfo);
    setValue('password', '');
    userInfo.superadmin = userInfo.role === 'root' ? true : false;
    userInfo.admin = userInfo.role === 'admin' ? true : false;
    userInfo.manager = userInfo.role === 'manager' ? true : false;
    userInfo.active = !userInfo.inactive;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);


  useEffect(() => {
    if (currentEditUserId) {
      getUserInfo();
    }
    getCompanies();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEditUserId]);

  if (!currentEditUserId) return null;

  return isLoading ? (
    <div className="spinner_wrapper">
      <Spinner variant="primary" animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  ) : (
    <div className={styles.user_info_wrapper}>
      <h4>Change user data</h4>
      <Form
        onSubmit={handleSubmit(saveData)}
        onChange={() => setDisableSaveBtn(false)}
      >
        <InputGroup className="mb-3">
          <InputGroup.Text id="user_name">
            User name <span style={{ color: 'red' }}>*</span>
          </InputGroup.Text>
          <Form.Control
            {...register('username', { required: true })}
            aria-invalid={errors.username ? 'true' : 'false'}
          />
        </InputGroup>
        <p className={styles.error} role="alert">
          {errors.username?.message}
        </p>
        <Button onClick={toggleShowPassword} className="mb-2 btn-secondary">
          Reset password
        </Button>
        <InputGroup
          style={{ display: showPassword ? 'none' : '' }}
          className="mb-3"
        >
          <InputGroup.Text id="password">New password</InputGroup.Text>
          <Form.Control
            disabled={showPassword}
            {...register('password')}
            aria-invalid={errors.username ? 'true' : 'false'}
          />
        </InputGroup>
        <h4>Personal Info</h4>
        <InputGroup className="mb-3">
          <InputGroup.Text id="first_name">First name</InputGroup.Text>
          <Form.Control
            {...register('first_name')}
            aria-invalid={errors.firstName ? 'true' : 'false'}
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text id="last_name">Last name</InputGroup.Text>
          <Form.Control
            {...register('last_name')}
            aria-invalid={errors.lastName ? 'true' : 'false'}
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text id="email">
            Email address <span style={{ marginLeft: 8, color: 'red' }}>*</span>
          </InputGroup.Text>
          <Form.Control
            type="email"
            {...register('email')}
            aria-invalid={errors.email ? 'true' : 'false'}
          />
        </InputGroup>
        <p className={styles.error} role="alert">
          {errors.email?.message}
        </p>
        {userCompanies.length === 0 ? (
          <div className={styles.user_info_comments_wrapper}>
            <h4>Comments during registration</h4>
            <p>{userInfo?.description ? userInfo?.description : 'Empty'}</p>
          </div>
        ) : null}

        {showCompanyAdd ? (
          <>
            <div className={styles.user_info_companies_wrapper}>
              <h4>Connect companies</h4>
              <Button size="sm" onClick={() => setShowCompanyAdd(false)}>
                <img className={styles.arrow_icon} alt="back"></img>
                Go back
              </Button>
            </div>
            <InputGroup className="mb-3">
              <InputGroup.Text style={{ width: 40 }} id="user_name_search">
                <img className={styles.search_icon} alt="search" />
              </InputGroup.Text>
              <Form.Control
                placeholder={`Company name`}
                onChange={handleChange}
              />
            </InputGroup>
            <ListGroup
              style={{
                maxHeight: '130px',
                boxSizing: 'border-box',
                overflow: 'scroll',
              }}
            >
              {allCompanies
                .filter(
                  ({ id: id1 }) =>
                    !userCompanies.some(({ id: id2 }) => id2 === id1)
                )
                .filter((elem) => elem.title.toLowerCase().includes(searchTerm))
                .map((elem) => (
                  <OverlayTrigger
                    key={elem.title}
                    placement="left"
                    delay={{ show: 50, hide: 50 }}
                    overlay={renderTooltip(
                      elem.title,
                      elem.contact_email,
                      elem.contact_fio
                    )}
                  >
                    <ListGroup.Item
                      className={styles.user_info_company_add}
                      key={elem.title}
                    >
                      <img
                        onClick={() => addCompany(elem)}
                        className={styles.add_icon_green}
                        alt="add_icon"
                      ></img>
                      {elem.title}
                      {elem.inactive ? (
                        <span style={{ marginLeft: 5, color: '#ff9999' }}>
                          (inactive)
                        </span>
                      ) : null}
                    </ListGroup.Item>
                  </OverlayTrigger>
                ))}
            </ListGroup>
          </>
        ) : (
          <>
            <div className={styles.user_info_companies_wrapper}>
              <h4>Connected companies</h4>
              <Button size="sm" onClick={() => setShowCompanyAdd(true)}>
                <img className={styles.add_icon} alt="plus"></img>
                Connect company
              </Button>
              {userCompanies.length > 0 ? (
                <Button
                  onClick={() => setDisableEdit(!disableEdit)}
                  variant="outline-danger"
                >
                  {disableEdit ? 'Enable editing' : 'Disable editing'}
                </Button>
              ) : null}
            </div>
            {userCompanies.length > 0 ? (
              <div className={styles.user_info_check_wrapper}>
                <ListGroup>
                  {userCompanies.map((elem) => (
                    <OverlayTrigger
                      key={elem.title}
                      placement="left"
                      delay={{ show: 50, hide: 50 }}
                      overlay={renderTooltip(
                        elem.title,
                        elem.contact_email,
                        elem.contact_fio
                      )}
                    >
                      <ListGroup.Item
                        className={styles.user_info_company_add}
                        key={elem.id}
                      >
                        {elem.title}
                        {elem.inactive ? (
                          <span style={{ marginLeft: 5, color: '#ff9999' }}>
                            (inactive)
                          </span>
                        ) : null}
                        {!disableEdit ? (
                          <img
                            disabled={disableEdit}
                            onClick={() => deleteCompany(elem)}
                            className={styles.delete_icon}
                            alt="delete"
                          ></img>
                        ) : null}
                      </ListGroup.Item>
                    </OverlayTrigger>
                  ))}
                </ListGroup>
              </div>
            ) : (
              <div key={'empty'}>Empty</div>
            )}
          </>
        )}

        <h4>Permissions</h4>
        <Form.Check
          style={{ paddingLeft: '2.8em' }}
          {...register('active')}
          type="switch"
          label={`Active (User will be treated as active)`}
          id={`active`}
        />
        <div className={styles.user_info_permissions_check_wrapper}>
          <Form.Check
            style={{ paddingLeft: '2.8em' }}
            {...register('manager')}
            onChange={() => handleChangeRole(ENUMS.ROLE.MANAGER)}
            type="switch"
            id={`manager`}
          />

          <div>Manager</div>
          <OverlayTrigger
            placement="right"
            overlay={
              <Tooltip id={`tooltip-manager`}>
                User can see only reports. (Default role)
              </Tooltip>
            }
          >
            <img className={styles.question_icon} alt="question"></img>
          </OverlayTrigger>
        </div>

        <div className={styles.user_info_permissions_check_wrapper}>
          <Form.Check
            style={{ paddingLeft: '2.8em' }}
            {...register('admin')}
            onChange={() => handleChangeRole(ENUMS.ROLE.ADMIN)}
            type="switch"
            id={`admin`}
          />
          <div>Admin</div>
          <OverlayTrigger
            placement="right"
            overlay={
              <Tooltip id={`tooltip-admin`}>
                User can see reports, log in to admin panel and manage his
                companies and users.
              </Tooltip>
            }
          >
            <img className={styles.question_icon} alt="question"></img>
          </OverlayTrigger>
        </div>

        {userRole === ENUMS.ROLE.SUPERADMIN ? (
          <div className={styles.user_info_permissions_check_wrapper}>
            <Form.Check
              style={{ paddingLeft: '2.8em' }}
              {...register('superadmin')}
              onChange={() => handleChangeRole(ENUMS.ROLE.SUPERADMIN)}
              type="switch"
              id={`superadmin`}
            />
            <div>Superadmin</div>
            <OverlayTrigger
              placement="right"
              overlay={
                <Tooltip id={`tooltip-superadmin`}>
                  User has all permissions and can see all reports.
                </Tooltip>
              }
            >
              <img className={styles.question_icon} alt="question"></img>
            </OverlayTrigger>
          </div>
        ) : (
          ''
        )}

        <div className={styles.user_info_btn_wrapper}>
          <Button
            disabled={disableSaveBtn}
            type="submit"
            variant="success"
            size="s"
          >
            Save
          </Button>
          <Button
            onClick={() => {
              getUserInfo();
              setDisableSaveBtn(true);
            }}
            variant="primary"
            size="s"
          >
            Cancel changes
          </Button>
        </div>
        {!disableSaveBtn && (
          <p className={styles.saving_notification}>
            For saving changes press "Save" if you want cancel press "Cancel
            changes"
          </p>
        )}
      </Form>
      <Row>
        <Col xs={6}>
          <ToastContainer position="middle-center" className="p-3">
            <Toast
              style={{ width: 500, height: 150 }}
              onClose={() => setShowToaster(false)}
              show={showToaster}
              delay={5000}
              autohide
            >
              <Toast.Header>Change user data</Toast.Header>
              <Toast.Body>
                <strong style={toasterStyles} className="me-auto">
                  {toasterText}
                  <Button
                    style={{ position: 'absolute', right: 30, bottom: 30 }}
                    variant="secondary"
                    onClick={() => setShowToaster(false)}
                  >
                    Close
                  </Button>
                </strong>
              </Toast.Body>
            </Toast>
          </ToastContainer>
        </Col>
      </Row>
    </div>
  );
}

export default UserInfo