import React, { useState, useEffect, useMemo } from 'react';
import styles from './CompanyInfo.module.css';
import { getData, validateDate, getCurrentDate } from '../../../utils/projectUtils';
import { useForm } from "react-hook-form";
import ENUMS from '../../../constants/appEnums';
import { api } from '../../../utils/api';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import { Button } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import { adminApi } from '../../../utils/adminApi';
import Spinner from 'react-bootstrap/Spinner';
import { reportsApi } from '../../../utils/reportsApi';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

function CompanyInfo({ currentEditCompanyId, loadData}) {

  const [isLoading, setIsLoading] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [companyInfo, setCompanyInfo] = useState({});
  const [showToaster, setShowToaster] = useState(false);
  const [toasterText, setToasterText] = useState('');
  const [toasterStyles, setToasterStyles] = useState({});
  const [disableSaveBtn, setDisableSaveBtn] = useState(true);
  const [file, setFile] = useState();
  const [showUsersAdd, setShowUsersAdd] = useState(false);
  const [companyUsers, setCompanyUsers] = useState([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [disableEdit, setDisableEdit] = React.useState(true);
  const [showImg, setShowImg] = useState(false);
  const [deleteDate, setDeleteDate] = useState({
    from: '',
    to: '',
    done: false,
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
    reset
  } = useForm({
    defaultValues: useMemo(() => {
      return companyInfo;
    }, [companyInfo]),
  });

  const handleChange = ({ target: { value } }) => {
    setSearchTerm(value);
  };

  const renderTooltip = (username, email, first_name, last_name) => (
    <Tooltip id="button-tooltip">
     <span>User name: {username}</span>
     <br/>
     <span>Email: {email}</span>
     <br/>
     <span>First name: {first_name}</span>
     <br/>
     <span>Last name: {last_name}</span>
    </Tooltip>
  );

  const getCompanyInfo = () => {
    getData(null, setCompanyInfo, api.fetchData, `${ENUMS.API_ROUTES.COMPANIES_COMPANY}${currentEditCompanyId}`);
    getData(
      null,
      setCompanyUsers,
      api.fetchData,
      `${ENUMS.API_ROUTES.USERS_COMPANIES}${currentEditCompanyId}`
    );
    setDisableSaveBtn(true);
    setDeleteDate({
      from: '',
      to: '',
      done: false,
    });
  };

  const getUsers = () => {
    getData(null, setAllUsers, api.fetchData, ENUMS.API_ROUTES.USERS);
  };


  const handleSaveData = async (parameters) => {
    // const companyNewUsers = {users_id: companyUsers.map(elem => elem.id), company_id: parameters.id}
    try {
        setIsLoading(true);
        await adminApi.updateCompany(parameters, ENUMS.API_ROUTES.COMPANIES);
        // await adminApi.updateCompany(companyNewUsers, ENUMS.API_ROUTES.COMPANIES_UPDATE_USERS);
        setToasterText(ENUMS.TOASTER.SUCCESS_UPDATE_COMPANY.label)
        setToasterStyles(ENUMS.TOASTER.SUCCESS_STYLE)
        setIsLoading(false);
        setShowToaster(true);
        loadData();
        setDisableSaveBtn(true)
      } catch (error) {
        setIsLoading(false);
        reset();
        if (error.message === 'Username already registered') {
          setError('username', {type: 'custom', message: 'This company name has already registered'})
        }
        if (error.message === 'Email already registered') {
          setError('email', {type: 'custom', message: 'This company email has already registered'})
        }
        setShowToaster(true);
        setToasterText(ENUMS.TOASTER.FAIL.label);
        setToasterStyles(ENUMS.TOASTER.FAIL_STYLE)
      }
    }


    const handleFileChange = (e) => {
      if (e.target.files) {
        setFile(e.target.files[0]);
      }
    };

    const addUser = async (user) => {
      const data = {
        userId: user.id,
        companyId: currentEditCompanyId
      };

      try {
        await adminApi.toggleCompanyAndUser(data, ENUMS.API_ROUTES.USERS_ADD_COMPANY);
      } catch (error) {
        console.error(error);
      };

      setCompanyUsers((prevState) => {return [...prevState, user]});
      setDisableSaveBtn(false);
    };


    const deleteUser = async (user) => {
      const data = {
        userId: user.id,
        companyId: currentEditCompanyId
      };

      try {
        await adminApi.toggleCompanyAndUser(data, ENUMS.API_ROUTES.USERS_REMOVE_COMPANY);
      } catch (error) {
        console.error(error);
      };

      setCompanyUsers((prevState) =>
        prevState.filter((elem) => elem.id !== user.id)
      );
      setDisableSaveBtn(false);
    };
  
    const handleUploadClick = async (e) => {
      if (!file) {
        return;
      }
      setToasterText("Uploading file...")
      setShowToaster(true);
      try {
        await reportsApi.uploadFile(file, currentEditCompanyId)
        setToasterText(ENUMS.TOASTER.SUCCESS_UPLOAD_FILE.label)
        setToasterStyles(ENUMS.TOASTER.SUCCESS_STYLE)
        setShowToaster(true);

      } catch (error) {
        setToasterText(ENUMS.TOASTER.FAIL.label)
        setToasterStyles(ENUMS.TOASTER.FAIL_STYLE)
        setShowToaster(true);
      }
    };

    const handleChangeDateFrom = (e) => {
      setDeleteDate({
        ...deleteDate,
        from: e.target.value,
        done: validateDate(e.target.value, deleteDate.to),
      });
    };

    const handleChangeDateTo = (e) => {
      setDeleteDate({
        ...deleteDate,
        to: e.target.value,
        done: validateDate(deleteDate.from, e.target.value),
      });
    };

    const handleDeleteData = async () => {
      try {
        await api.deleteData(ENUMS.API_ROUTES.DELETE_DATA, {
          from: deleteDate.from,
          to: deleteDate.to,
          id: companyInfo.id
        });
        setDeleteDate({
          from: '',
          to: '',
          done: false,
        });

        setToasterText(ENUMS.TOASTER.SUCCESS_DELETE_DATA.label)
        setToasterStyles(ENUMS.TOASTER.SUCCESS_STYLE)
      } catch (error) {
        setDeleteDate({
          from: '',
          to: '',
          done: false,
        });
        setToasterText(ENUMS.TOASTER.FAIL.label)
        setToasterStyles(ENUMS.TOASTER.FAIL_STYLE)
      }
    };

  useEffect(() => {
    reset(companyInfo);
    companyInfo.active = !companyInfo.inactive;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyInfo]);


  useEffect(() => {
    if (currentEditCompanyId) {
        getCompanyInfo();
    }
    getUsers()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEditCompanyId]);

  useEffect(() => {
    if (!showToaster) {
      setToasterStyles({});
    }
  }, [showToaster])

  if (!currentEditCompanyId) return null;
  return isLoading ? (
    <div className="spinner_wrapper">
      <Spinner variant="primary" animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  ) : (
    <div className={styles.company_info_container}>
      <h4>Change company data</h4>
      <Form
        onSubmit={handleSubmit(handleSaveData)}
        onChange={() => setDisableSaveBtn(false)}
      >
        <InputGroup className="mb-3">
          <InputGroup.Text id="title">
            Company name <span style={{ marginLeft: 8, color: 'red' }}>*</span>
          </InputGroup.Text>
          <Form.Control
            {...register('title', {
              required: 'Company name is required',
              minLength: 3,
            })}
            aria-invalid={errors.username ? 'true' : 'false'}
          />
        </InputGroup>
        <p className={styles.error} role="alert">
          {errors.title?.message}
        </p>
        <InputGroup className="mb-3">
          <InputGroup.Text id="contact_fio">Contact name</InputGroup.Text>
          <Form.Control
            {...register('contact_fio')}
            aria-invalid={errors.contact_name ? 'true' : 'false'}
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text id="contact_email">
            Contact email <span style={{ marginLeft: 8, color: 'red' }}>*</span>
          </InputGroup.Text>
          <Form.Control
            type="email"
            {...register('contact_email', {
              required: 'Contact email is required',
            })}
            aria-invalid={errors.contact_email ? 'true' : 'false'}
          />
        </InputGroup>
        <p className={styles.error} role="alert">
          {errors.contact_email?.message}
        </p>
        <InputGroup className="mb-3">
          <InputGroup.Text id="contact_phone">Contact phone</InputGroup.Text>
          <Form.Control
            {...register('contact_phone')}
            aria-invalid={errors.contact_phone ? 'true' : 'false'}
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text id="description">Description</InputGroup.Text>
          <Form.Control
            {...register('description')}
            type="tel"
            aria-invalid={errors.company_descr ? 'true' : 'false'}
          />
        </InputGroup>
        <Form.Check
          type="switch"
          label={`Active`}
          id={`active`}
          {...register('active')}
        />
        {showUsersAdd ? (
          <>
            <div className={styles.company_info_users_wrapper}>
              <h4>Connect users</h4>
              <Button size="sm" onClick={() => setShowUsersAdd(false)}>
                <img className={styles.arrow_icon} alt="back"></img>
                Go back
              </Button>
            </div>
            <InputGroup className="mb-3">
              <InputGroup.Text style={{ width: 40 }} id="user_name_search">
                <img className={styles.search_icon} alt="search" />
              </InputGroup.Text>
              <Form.Control placeholder={`User name`} onChange={handleChange} />
            </InputGroup>
            <ListGroup
              style={{
                maxHeight: '130px',
                boxSizing: 'border-box',
                overflow: 'scroll',
              }}
            >
              {allUsers
                .filter(
                  ({ id: id1 }) =>
                    !companyUsers.some(({ id: id2 }) => id2 === id1)
                )
                .filter((elem) =>
                  elem.username.toLowerCase().includes(searchTerm)
                )
                .map((elem) => (
                  <OverlayTrigger
                    key={elem.username}
                    placement="left"
                    delay={{ show: 50, hide: 50 }}
                    overlay={renderTooltip(
                      elem.username,
                      elem.email,
                      elem.first_name,
                      elem.last_name
                    )}
                  >
                    <ListGroup.Item
                      className={styles.company_info_user_add}
                      key={elem.username}
                    >
                      <img
                        onClick={() => addUser(elem)}
                        className={styles.add_icon_green}
                        alt="add_icon"
                      ></img>
                      {elem.username}
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
            <div className={styles.company_info_users_wrapper}>
              <h4>Connected users</h4>
              <Button size="sm" onClick={() => setShowUsersAdd(true)}>
                <img className={styles.add_icon} alt="plus"></img>
                Connect user
              </Button>
              {companyUsers.length > 0 ? (
                <Button
                  onClick={() => setDisableEdit(!disableEdit)}
                  variant="outline-danger"
                >
                  {disableEdit ? 'Enable editing' : 'Disable editing'}
                </Button>
              ) : null}
            </div>
            {companyUsers.length > 0 ? (
              <div className={styles.company_info_check_wrapper}>
                <ListGroup>
                  {companyUsers.map((elem) => (
                    <OverlayTrigger
                      key={elem.username}
                      placement="left"
                      delay={{ show: 50, hide: 50 }}
                      overlay={renderTooltip(
                        elem.username,
                        elem.email,
                        elem.first_name,
                        elem.last_name
                      )}
                    >
                      <ListGroup.Item
                        className={styles.company_info_user_add}
                        key={elem.id}
                      >
                        {elem.username}
                        {elem.inactive ? (
                          <span style={{ marginLeft: 5, color: '#ff9999' }}>
                            (inactive)
                          </span>
                        ) : null}
                        {!disableEdit ? (
                          <img
                            disabled={disableEdit}
                            onClick={() => deleteUser(elem)}
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
    <div className="position-relative">
    <h4>
          Upload file to Data Base (XLS, CSV){' '}
          <img
            onMouseEnter={() => setShowImg(true)}
            onMouseLeave={() => setShowImg(false)}
            className={styles.question_icon}
            alt="question"
          ></img>
        </h4>
        <img
          className={showImg ? styles.question_xls : styles.question_xls_hide}
          alt="xls_example"
        ></img>
    </div>
        <div className="d-flex justify-content-between">
          <Form.Group controlId="formFile" style={{ width: '85%' }}>
            <Form.Control onChange={handleFileChange} type="file" />
          </Form.Group>

          <Button onClick={(e) => handleUploadClick(e)}>Upload</Button>
        </div>

        <div className={`d-flex justify-content-between ${styles.company_info_delete_data}`}>
          <h4>
            Delete Data for a period
          </h4>
          <Form.Group controlId='input_to_date' className={styles.company_info_delete_form}>
            <h5>From: </h5>
            <Form.Control
              value={deleteDate.from}
              max={deleteDate.to || getCurrentDate()}
              onChange={handleChangeDateFrom}
              type="date" />
            <h5>To: </h5>
            <Form.Control
              value={deleteDate.to}
              min={deleteDate.from}
              max={getCurrentDate()}
              disabled={!deleteDate.from}
              onChange={handleChangeDateTo}
              type="date"
            />

            <Button
              onClick={() => setShowToaster(true)}
              disabled={!deleteDate.done}
              type="button"
              variant="primary"
              size="s"
            >
              Delete data
            </Button>
          </Form.Group>
        </div>

        <div className={styles.company_info_btn_wrapper}>
          <Button
            disabled={disableSaveBtn}
            type="submit"
            variant="success"
            size="s"
          >
            Save
          </Button>
          <Button
            onClick={() => getCompanyInfo()}
            type="submit"
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
          <ToastContainer containerPosition='fixed' position="middle-center" className="p-3">
            <Toast
              style={{ width: 500, height: 150 }}
              onClose={() => setShowToaster(false)}
              show={showToaster}
              delay={deleteDate.done ? 30000 : 5000}
              autohide
            >
              <Toast.Header>
                {deleteDate.done ? 'Deleting data for the specified period' : 'Change company data'}
              </Toast.Header>
              <Toast.Body style={toasterStyles}>
                <strong className="me-auto">
                  {deleteDate.done ?
                    'Are you sure want to delete the data for the specified period?'
                    :
                    toasterText}
                </strong>
                {deleteDate.done &&
                <Button
                  style={{ position: 'absolute', right: 110, bottom: 30 }}
                  variant="primary"
                  onClick={handleDeleteData}
                >
                  Delete
                </Button>}
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

export default CompanyInfo;
