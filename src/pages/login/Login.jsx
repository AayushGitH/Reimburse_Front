import React, { useEffect, useState } from 'react'
import styles from './LoginStyle.module.css'
import base64 from 'base-64'
import { useNavigate } from 'react-router-dom';
import Input from '../../components/reusedComponents/components/Input'
import Button from '../../components/reusedComponents/components/Button';
import Container from '../../components/reusedComponents/components/Container';
import { toast } from 'react-toastify';
import { postRequest } from '../../services/commonService';
import { LOGIN_PATH } from '../../api/apiurl';

const Login = ({ setRole }) => {

  const [loginCredentials, setLoginCredentials] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('user')) {
      let user = JSON.parse(localStorage.getItem('user'))
      if (user !== null && user.role === 'ADMIN') {
        navigate('/dashboard/employees')
      } else if (user !== null && user.role === 'EMPLOYEE') {
        navigate('/dashboard/claim')
      } else if (user !== null && user.role === 'MANAGER') {
        navigate('/dashboard/claim')
      }
    }
  }, [navigate])

  const signupNavigate = () => {
    navigate('/sign-up')
  }

  const handleChange = (event, property) => {
    setLoginCredentials({ ...loginCredentials, [property]: event.target.value })
    checkErrors(event, property)
  }

  const checkErrors = (e, property) => {
    let val = e?.target?.value;
    const validationErrors = {...errors}

    Object.keys(validationErrors).forEach(key => {
      if (validationErrors[key] === null) {
        delete validationErrors[key];
      }
    });

    switch (property) {
      case "email": {
        if (!val) {
          validationErrors.email = "Email is required"
        }
        else if (!val.includes("@nucleusteq.com")) {
          validationErrors.email = "Email must contain @nucleusteq.com"
        }
        else {
          validationErrors.email = ""
        }
        break;
      }

      case "password": {
        if (!val) {
          validationErrors.password = "Password is required"
        } else {
          validationErrors.password = ""
        }
        break;
      }

    }
    setErrors(validationErrors);
    var isValid = true;
    var errorKeys = Object.keys(validationErrors)
    errorKeys.map((e) => {
      if (validationErrors[e] !== '') {
        isValid = false;
      }
    })
    if (errorKeys.length < 2) {
      isValid = false;
    }
    return isValid;
  }

  const loginSubmit = (e) => {
    e.preventDefault();

    if (checkErrors()) {
      const encryptedPassword = base64.encode(loginCredentials.password)
      setLoginCredentials(
        loginCredentials.password = encryptedPassword
      )
      postRequest(LOGIN_PATH, loginCredentials, null, (resp) => {
        if (resp.status === 200) {
          setRole(resp?.data?.role)
        localStorage.setItem('user', JSON.stringify(resp?.data))
        localStorage.setItem('loggedEmail', resp?.data?.email)
        toast.success(`Welcome to portal, ${resp?.data?.name}`)
        if (resp?.data?.role === 'ADMIN') {
          navigate('/dashboard/employees')
        } else if (resp?.data?.role === 'EMPLOYEE') {
          navigate('/dashboard/claim')
        } else if (resp?.data?.role === 'MANAGER') {
          navigate('/dashboard/claim')
        }
        } else {
          resp?.response?.data ? toast.error(resp.response.data.errorMessage[0]) : alert('Server is not responding..')
        setLoginCredentials({ email: '', password: '' });
        navigate('/')
        }})
    } else {
      toast.warning('Please fill email and password')
      navigate('/')
    }
  }

  return (
    <Container>
      <div className={styles.loginContainer}>
        <form onSubmit={loginSubmit} className={styles.loginForm}>
          <h3>Reimbursement Portal</h3>
          <div className={styles.loginText}>Login</div>
          <div className={styles.loginFormControl}>
            <h4>Email <span className='astick'>*</span></h4>
            <div>
              <div>
                <Input type="email" placeholder='Fill Email Id' value={loginCredentials.email} changes={(e) => { handleChange(e, "email") }} />
              </div>
              {errors.email && <small>{errors.email}</small>}
            </div>
          </div>
          <div className={styles.loginFormControl}>
            <h4>Password <span className='astick'>*</span></h4>
            <div>
              <div>
                <Input type="password" placeholder='Fill Password here' value={loginCredentials.password} changes={(e) => { handleChange(e, "password") }} />
              </div>
              {errors.password && <small>{errors.password}</small>}
            </div>
          </div>
          <Button name="Login" type="submit"></Button>
          <div className={styles.gridContainer}>
            <p>Don't have account? <a onClick={signupNavigate}>Sign up</a></p>
          </div>
        </form>
      </div>
    </Container>
  )
}

export default Login