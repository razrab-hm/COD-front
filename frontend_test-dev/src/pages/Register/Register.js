import React , { useState } from 'react'
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { useForm } from "react-hook-form";
import styles from './Register.module.css'
import { useHistory, Redirect, Link } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { authApi } from "../../utils/authApi";
import Spinner from 'react-bootstrap/Spinner';
import { removeSpaces, errorsRegisterForm } from '../../utils/projectUtils';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

function Register({userLoggedIn}) {

    const [isLoading, setIsLoading] = useState(false);
    const [showToaster, setShowToaster] = useState(false);
    const history = useHistory();

    const formSchema = yup.object().shape({
      username: yup
        .string()
        .required('User name is required')
        .min(3, 'Username length should be at least 3 characters')
        .max(50, 'Username length should be less than 50 characters'),
      email: yup
        .string()
        .required('Email is required')
        .min(3, 'Email length should be at least 3 characters')
        .max(50, 'Email length should be less than 50 characters'),
      password: yup
        .string()
        .required('Password is required')
        .min(4, 'Password length should be at least 4 characters'),
      cpassword: yup
        .string()
        .required('Confirm Password is required')
        .oneOf([yup.ref('password')], 'Passwords do not match'),
      description: yup
        .string()
        .max(50, 'Length should be not more than 50 characters'),
    });

    const { register, setValue, setError, getValues, formState: { errors }, handleSubmit } = useForm({
        mode: "onTouched",
        resolver: yupResolver(formSchema)
      });

    const handleRegister = async (authData) => {
      console.log(authData);
        try {
          setIsLoading(true);
          await authApi.register(authData);
          setIsLoading(false);
          setShowToaster(true);
          setTimeout(() => {
            history.replace('/login');
          }, "4000")
        } catch (error) {
          setIsLoading(false);
          //show username or email error
          if (error.message) {
            const { name, message } = errorsRegisterForm(error.message);
            setError(name, {type: 'custom', message})
          }
          //reset passwords
          setValue('password', '');
          setValue('cpassword', '');
        }
    };

    if (userLoggedIn) {
        return <Redirect to={'/main'} />;
    }

    const handleRemoveSpaves = (inputName) => {
      setValue(`${inputName}`, removeSpaces(getValues(`${inputName}`)));
    };

  return isLoading ? (
    <div className="spinner_wrapper">
      <Spinner variant="primary" animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  ) : (
    <div className={styles.register_container}>
      <h1 className={styles.register_title}>Register</h1>
      <p>Create your account</p>
      <Form onSubmit={handleSubmit(handleRegister)}>
        <InputGroup >
          <InputGroup.Text id="username">
            <img className={styles.username} alt="user" />
          </InputGroup.Text>
          <Form.Control
            {...register('username')}
            onBlur={() => handleRemoveSpaves('username')}
            placeholder="Username *"
            aria-invalid={errors.username ? 'true' : 'false'}
          />
        </InputGroup>
        <p style={{height: 10, margin:' 5px 0 10px 0', fontSize: 13}}>*All spaces will be removed automatically </p>
        <p className={styles.error} role="alert">
          {errors.username?.message}
        </p>
        <InputGroup className="mb-3">
          <InputGroup.Text id="email">
            <img className={styles.email} alt="email" />
          </InputGroup.Text>
          <Form.Control
            {...register('email')}
            placeholder={'Email *'}
            onBlur={() => handleRemoveSpaves('email')}
            aria-invalid={errors.email ? 'true' : 'false'}
            type="email"
          />
        </InputGroup>
        <p className={styles.error} role="alert">
          {errors.email?.message}
        </p>
        <InputGroup className="mb-3">
          <InputGroup.Text id="first_name">
            <img className={styles.first_name} alt="first_name" />
          </InputGroup.Text>
          <Form.Control
            {...register('first_name')}
            placeholder="First name"
            aria-invalid={errors.first_name ? 'true' : 'false'}
          />
        </InputGroup>
        <p className={styles.error} role="alert">
          {errors.first_name?.message}
        </p>
        <InputGroup className="mb-3">
          <InputGroup.Text id="last_name">
            <img className={styles.last_name} alt="last_name" />
          </InputGroup.Text>
          <Form.Control
            {...register('last_name')}
            placeholder="Last name"
            aria-invalid={errors.last_name ? 'true' : 'false'}
          />
        </InputGroup>
        <p className={styles.error} role="alert">
          {errors.last_name?.message}
        </p>
        <InputGroup className="mb-3">
          <InputGroup.Text id="description">
            <img className={styles.description} alt="description" />
          </InputGroup.Text>
          <Form.Control
            {...register('description')}
            placeholder="Comments to admin"
            aria-invalid={errors.description ? 'true' : 'false'}
          />
        </InputGroup>
        <p className={styles.error} role="alert">
          {errors.description?.message}
        </p>
        <InputGroup className="mb-3">
          <InputGroup.Text id="password">
            <img className={styles.password} alt="password" />
          </InputGroup.Text>
          <Form.Control
            {...register('password', { required: true })}
            placeholder="Password *"
            aria-invalid={errors.password ? 'true' : 'false'}
            type="password"
          />
        </InputGroup>
        <p className={styles.error} role="alert">
          {errors.password?.message}
        </p>
        <InputGroup type="password" className="mb-3">
          <InputGroup.Text id="cpassword">
            <img className={styles.password} alt="cpassword" />
          </InputGroup.Text>
          <Form.Control
            {...register('cpassword', { required: true })}
            placeholder="Confirm password *"
            aria-invalid={errors.cpassword ? 'true' : 'false'}
            type="password"
          />
        </InputGroup>
        <p className={styles.error} role="alert">
          {errors.cpassword?.message}
        </p>
        <Button variant="success" type="submit">
          Register
        </Button>
        <div className={styles.register_login}>
          <Link to="/login">Already registered?</Link>
        </div>
      </Form>
      <Row>
        <Col xs={6}>
          <ToastContainer position="middle-center" className="p-3">
            <Toast
              style={{ width: 500, height: 150 }}
              onClose={() => setShowToaster(false)}
              show={showToaster}
              delay={4000}
              autohide
            >
              <Toast.Header>Register</Toast.Header>
              <Toast.Body style={{color: 'green'}}>
                <strong className="me-auto">You have successfully registered. You will be automatically redirect to login page.</strong>
                <Button
                  style={{ position: 'absolute', right: 30, bottom: 30 }}
                  variant="secondary"
                  onClick={() => history.replace('/login')}
                >
                  Ok
                </Button>
              </Toast.Body>
            </Toast>
          </ToastContainer>
        </Col>
      </Row>
    </div>
  );
}

export default Register