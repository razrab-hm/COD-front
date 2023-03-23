import React, { useState, useEffect } from 'react';
import styles from './AdminAddForm.module.css';
import Form from 'react-bootstrap/Form';
import { useForm } from "react-hook-form";
import InputGroup from 'react-bootstrap/InputGroup';
import { Button } from 'react-bootstrap';
import ENUMS from '../../constants/appEnums';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import { adminApi } from '../../utils/adminApi';
import Spinner from 'react-bootstrap/Spinner';
import { getData } from '../../utils/projectUtils';
import { api } from '../../utils/api';
import ListGroup from 'react-bootstrap/ListGroup';

function AdminAddForm({header, usage, loadData}) {
    const [isLoading, setIsLoading] = useState(false);
    const [showToaster, setShowToaster] = useState(false);
    const [toasterText, setToasterText] = useState('');
    const [toasterStyles, setToasterStyles] = useState({});
    const [disableSaveBtn, setDisableSaveBtn] = useState(true);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [allCompanies, setAllCompanies] = useState([]);
    const [userCompanies, setUserCompanies] = useState([]);
    const [showCompanyAdd, setShowCompanyAdd] = useState(false);

    const { register, setValue, reset ,setError, formState: { errors }, handleSubmit } = useForm();

    const handleChange = ({ target: { value } }) => {
      setSearchTerm(value);
    };


    const deleteCompany = (company) => {
      setUserCompanies((prevState) =>
        prevState.filter((elem) => elem.id !== company.id)
      );
      setDisableSaveBtn(false);
    };
  
    const addCompany = (company) => {
      setUserCompanies((prevState) => {return [...prevState, company]});
     
      setDisableSaveBtn(false);
    };

    const getCompanies = () => {
      getData(null, setAllCompanies, api.fetchData, ENUMS.API_ROUTES.COMPANIES_ME);
    };
    const handleSaveData = async (parameters) => {
        try {
          setIsLoading(true);
          if(usage === ENUMS.USAGE.USERS) {
            if(userCompanies.length > 0) {
              await adminApi.createUser({...parameters, companies_id: userCompanies.map(elem => elem.id)}, ENUMS.API_ROUTES.ADMIN_NEW_USER)
              handleSuccesSaveData(ENUMS.TOASTER.SUCCESS_ADD_USER.label)
            } else {
              setIsLoading(false);
              setShowToaster(true);
              setToasterStyles(ENUMS.TOASTER.FAIL_STYLE)
              setToasterText("Please select at least 1 company")
            }
          } else if(usage === ENUMS.USAGE.COMPANIES){
              await adminApi.createCompany(parameters, ENUMS.API_ROUTES.COMPANIES);
              handleSuccesSaveData(ENUMS.TOASTER.SUCCESS_ADD_COMPANY.label)
          }
        } catch (error) {
          setIsLoading(false);
          setShowToaster(true);
          setToasterStyles(ENUMS.TOASTER.FAIL_STYLE)
          setToasterText(ENUMS.TOASTER.FAIL.label)
          if (error.message === 'Username already registered') {
            setError('username', {type: 'custom', message: 'This username has already registered'})
          }
          if (error.message === 'Email already registered') {
            setError('email', {type: 'custom', message: 'This email has already registered'})
          }
          //reset passwords input
          setValue('password', '');
          setValue('cpassword', '');
        }
    };

    const handleSuccesSaveData = (toasterText) => {
      setShowToaster(true);
      loadData();
      setToasterStyles(ENUMS.TOASTER.SUCCESS_STYLE)
      setToasterText(toasterText)
      setIsLoading(false);
      reset();
    }

    useEffect(() => {
      getCompanies();
    }, []); 

  return isLoading ? (
    <div className="spinner_wrapper">
      <Spinner variant="primary" animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  ) : (
    <div className={styles.add_form_wrapper}>
      <h4>{header}</h4>
      <Form
        onSubmit={handleSubmit(handleSaveData)}
        onChange={() => setDisableSaveBtn(false)}
      >
        {usage === ENUMS.USAGE.USERS ? (
          <>
            <InputGroup className="mb-3">
              <InputGroup.Text id="username">
                User name<div style={{ marginLeft: 8, color: 'red' }}>*</div>
              </InputGroup.Text>
              <Form.Control
                {...register('username', {
                  required: 'User name is required',
                  minLength: 3,
                })}
                aria-invalid={errors.username ? 'true' : 'false'}
              />
            </InputGroup>
            <p className={styles.error} role="alert">
              {errors.username?.message}
            </p>
            <InputGroup className="mb-3">
              <InputGroup.Text id="email">
                Email <div style={{ marginLeft: 8, color: 'red' }}>*</div>
              </InputGroup.Text>
              <Form.Control
                type="email"
                {...register('email', { required: 'Email is required' })}
                aria-invalid={errors.email ? 'true' : 'false'}
              />
            </InputGroup>
            <p className={styles.error} role="alert">
              {errors.email?.message}
            </p>
            <InputGroup className="mb-3">
              <InputGroup.Text id="password">
                Password<div style={{ marginLeft: 8, color: 'red' }}>*</div>
              </InputGroup.Text>
              <Form.Control
                type="password"
                {...register('password', {
                  required: 'Password name is required',
                })}
                aria-invalid={errors.password ? 'true' : 'false'}
              />
            </InputGroup>
            <p className={styles.error} role="alert">
              {errors.password?.message}
            </p>
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

            {showCompanyAdd ? (
              <>
                <div className={styles.user_info_companies_wrapper}>
                  <h4>Set companies for user</h4>
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
                    height: '130px',
                    boxSizing: 'border-box',
                    overflow: 'scroll',
                  }}
                >
                  {allCompanies
                    .filter(
                      ({ id: id1 }) =>
                        !userCompanies.some(({ id: id2 }) => id2 === id1)
                    )
                    .filter((elem) =>
                      elem.title.toLowerCase().includes(searchTerm)
                    )
                    .map((elem) => (
                      <ListGroup.Item
                        className={styles.user_info_company_add}
                        key={elem.title}
                        onClick={() => addCompany(elem)}
                      >
                        <img
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
                    ))}
                </ListGroup>
              </>
            ) : (
              <>
                <div className={styles.user_info_companies_wrapper}>
                  <h4>User companies</h4>
                  <Button size="sm" onClick={() => setShowCompanyAdd(true)}>
                    <img className={styles.add_icon} alt="plus"></img>
                    Add company
                  </Button>
                </div>
                {userCompanies.length > 0 ? (
                  <div className={styles.user_info_check_wrapper}>
                    <ListGroup>
                      {userCompanies.map((elem) => (
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
                          <img
                            onClick={() => deleteCompany(elem)}
                            className={styles.delete_icon}
                            alt="delete"
                          ></img>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </div>
                ) : (
                  <div key={'empty'}>Empty</div>
                )}
              </>
            )}
          </>
        ) : null}
        {usage === ENUMS.USAGE.COMPANIES ? (
          <>
            <InputGroup className="mb-3">
              <InputGroup.Text id="title">
                Company name{' '}
                <div style={{ marginLeft: 8, color: 'red' }}>*</div>
              </InputGroup.Text>
              <Form.Control
                {...register('title', { required: 'Company name is required' })}
                aria-invalid={errors.username ? 'true' : 'false'}
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text id="contact_fio">Contact name</InputGroup.Text>
              <Form.Control
                {...register('contact_fio')}
                aria-invalid={errors.contact_name ? 'true' : 'false'}
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text id="contact_email">
                Contact email{' '}
                <div style={{ marginLeft: 8, color: 'red' }}>*</div>
              </InputGroup.Text>
              <Form.Control
                type="email"
                {...register('contact_email', {
                  required: 'Contact email is required',
                })}
                aria-invalid={errors.contact_email ? 'true' : 'false'}
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text id="contact_phone">
                Contact phone
              </InputGroup.Text>
              <Form.Control
                {...register('contact_phone')}
                aria-invalid={errors.contact_phone ? 'true' : 'false'}
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text id="description">Description</InputGroup.Text>
              <Form.Control
                {...register('description')}
                aria-invalid={errors.company_descr ? 'true' : 'false'}
              />
            </InputGroup>
          </>
        ) : null}
        <Button
          className={styles.user_info_save}
          disabled={disableSaveBtn}
          variant="success"
          type="submit"
        >
          Save
        </Button>
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
              <Toast.Header>Create {usage}</Toast.Header>
              <Toast.Body style={toasterStyles}>
                <strong className="me-auto">{toasterText}</strong>
                <Button
                  style={{ position: 'absolute', right: 30, bottom: 30 }}
                  variant="secondary"
                  onClick={() => setShowToaster(false)}
                >
                  Close
                </Button>
              </Toast.Body>
            </Toast>
          </ToastContainer>
        </Col>
      </Row>
    </div>
  );
}

export default AdminAddForm