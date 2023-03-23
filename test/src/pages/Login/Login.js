import React, { useState } from 'react'
import { useHistory, Redirect, useLocation } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import styles from '../Login/Login.module.css';
import { authApi } from "../../utils/authApi";
import { setCookie } from '../../utils/cookie';
import Spinner from 'react-bootstrap/Spinner';
import { removeSpaces } from '../../utils/projectUtils';

function Login({setUserLoggedIn, userLoggedIn, setUserRole, setLogginError, setUserName}) {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const location = useLocation();
    const history = useHistory();
    

    const formSchema = yup.object().shape({
        username: yup.string()
            .required("Username is required"),
        password: yup.string()
            .required("Password is required")
    });

    const { register, formState: { errors }, setValue, getValues, handleSubmit } = useForm({
        resolver: yupResolver(formSchema)
    });

    const handleLogin = async (authData) => {
        try {
          setIsLoading(true);
          const data = await authApi.login(authData);
          setIsLoading(false);
          saveUserState(data);
          setUserLoggedIn(true)
        } catch (error) {
          if(error.message === "All your companies inactive") {
            setLogginError(error.message)
            history.replace('/inactive')
          }
          if(error.message === "You don't have companies") {
            setLogginError(error.message)
            history.replace('/inactive')
          }
          setError(error.message)
          setIsLoading(false);
        }
    };

    const handleRemoveSpaves = (inputName) => {
      setValue(`${inputName}`, removeSpaces(getValues(`${inputName}`)));
    };


    //Method to save JWT in cookies and update user data
    const saveUserState = (data) => {
        setCookie('accessToken', data.access_token);
        setCookie('refreshToken', data.refresh_token);
        setUserRole(data.role);
        setUserName(data.username)
        history.replace('/main')
    };

    if (userLoggedIn) {
      return <Redirect to={location?.state?.from || '/main'}/>
    }

  return isLoading ? (
    <div className="spinner_wrapper">
      <Spinner variant="primary" animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  ) : (
    <div className={styles.login_container}>
      <h1 className={styles.login_title}>Login</h1>
      <Form onSubmit={handleSubmit(handleLogin)}>
        <InputGroup className="mb-3">
          <InputGroup.Text id="user_name">
            <img className={styles.username} alt="user" />
          </InputGroup.Text>
          <Form.Control
            {...register('username', { required: true })}
            placeholder="Username"
            onBlur={() => handleRemoveSpaves('username')}
            aria-invalid={errors.username ? 'true' : 'false'}
          />
        </InputGroup>
        <p className={styles.error} role="alert">
          {errors.username?.message}
        </p>
        <InputGroup className="mb-3">
          <InputGroup.Text id="password">
            <img className={styles.password} alt="password" />
          </InputGroup.Text>
          <Form.Control
            {...register('password', { required: true })}
            placeholder="Password"
            aria-invalid={errors.username ? 'true' : 'false'}
            type="password"
          />
        </InputGroup>
        <p className={styles.error} role="alert">
          {errors.password?.message}
        </p>
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
        <div className={styles.login_btn_wrrapper}>
          <Button variant="success" type="submit">
            Login
          </Button>
          <Button
            variant="primary"
            onClick={() => history.replace('/register')}
          >
            Register
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default Login