import React, { useEffect, useState } from 'react'
import styles from './SigninStyle.module.css';
import { useNavigate } from 'react-router-dom'
import base64 from 'base-64'
import Select from '../../components/reusedComponents/components/Select'
import Input from '../../components/reusedComponents/components/Input'
import Button from '../../components/reusedComponents/components/Button';
import Container from '../../components/reusedComponents/components/Container'
import { toast } from 'react-toastify';
import { getRequest, postRequest } from '../../services/commonService';
import { GETALL_DEPARTMENTS, REGISTER_PATH } from '../../api/apiurl';

const Signin = () => {
  const navigate = useNavigate()
  const [errors, setErrors] = useState({})
  const [department, setDepartment] = useState(0)
  const [secretQuestion, setSecretQuestion] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [currentDate, setCDate] = useState('');
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    contact: '',
    secretAnswer: '',
    joiningDate: '',
    department: {
      departmentId: 0
    }
  })
  const [departments, setDepartments] = useState([])

  useEffect(() => {
    let tdate = new Date();
    let tda = String(tdate.getDate()).padStart(2, '0');
    let tmo = String(tdate.getMonth() + 1).padStart(2, '0');
    let tye = tdate.getFullYear();
    let currentDate = `${tye}-${tmo}-${tda}`;
    setCDate(currentDate);
    getDepartments()
  }, [])

  const getDepartments = () => {
    getRequest(GETALL_DEPARTMENTS, null, (response) => {
      if (response.status === 200) {
        setDepartments(response.data)
      } else {
        console.log(response.response.data)
      }
    })
  }

  const departmentArray = [];
  departmentArray.push({ label: '', value: '--- Select the department ---' })
  for (let val = 0; val < departments?.length; val++) {
    const obj = {
      label: '',
      value: ''
    };
    obj.label = departments[val].departmentId;
    obj.value = departments[val].departmentName;
    departmentArray.push(obj)
  }

  const designationArray = [
    { label: '', value: '--- Select the designation ---' },
    { label: 'MANAGER', value: 'Manager' },
    { label: 'EMPLOYEE', value: 'Employee' },
  ]

  const questionArray = [
    { label: '', value: '--- Select the question ---' },
    { label: 'Who is your favorite singer', value: 'Who is your favorite singer' },
    { label: 'Who is your childhood friend', value: 'Who is your childhood friend' },
    { label: 'What is your nickname', value: 'What is your nickname' }
  ]


  const checkErrors = (e, property) => {
    const validationErrors = { ...errors };

    let value = e?.target?.value

    const namePattern = /^[A-Za-z_ \s*$]+$/;
    const emailPattern = /^[A-Za-z0-9._%+-]+@nucleusteq.com$/;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/i;

    Object.keys(validationErrors).forEach(key => {
      if (validationErrors[key] === null) {
        delete validationErrors[key];
      }
    });

    switch (property) {
      case "name": {
        if (!value) {
          validationErrors.name = "User name is required"
        } else if (value.length < 5) {
          validationErrors.name = "Name must contain atleast 5 characters"
        } else if (!namePattern.test(value)) {
          validationErrors.name = "Name must contain only characters"
        } else {
          validationErrors.name = ''
        }
        break;
      }

      case 'email': {
        if (!value) {
          validationErrors.email = "Email is required"
        } else if (!emailPattern.test(value)) {
          validationErrors.email = "Email must contain @nucleusteq.com"
        } else {
          validationErrors.email = ''
        }
        break;
      }

      case 'password': {
        if (!value) {
          validationErrors.password = "Password is required"
        } else if (!passwordPattern.test(value)) {
          validationErrors.password = "Password must be minimum of 8 characters and atleast one uppercase letter, one lowercase letter, one number and special character"
        } else {
          validationErrors.password = ''
        }
        break;
      }

      case 'contact': {
        const contactPattern = /^[0-9]{10,}/i;
        if (!value) {
          validationErrors.contact = "Contact is required"
        } else if (value.length < 10 || value.length > 10) {
          validationErrors.contact = "Contact must be of 10 numbers"
        } else if (!contactPattern.test(value)) {
          validationErrors.contact = "Contact must be in digits form"
        } else {
          validationErrors.contact = ''
        }
        break;
      }

      case 'joiningDate': {
        if (!value) {
          validationErrors.joiningDate = "Joining date is required"
        } else {
          validationErrors.joiningDate = ''
        }
        break;
      }

      case 'department': {
        if (!value) {
          validationErrors.department = 'Department is required'
        } else {
          validationErrors.department = ''
        }
        break;
      }

      case 'role': {
        if (!value) {
          validationErrors.role = "Designation is required"
        } else {
          validationErrors.role = ''
        }
        break;
      }

      case 'secretAnswer': {
        if (!value) {
          validationErrors.secretAnswer = "Secret answer is required"
        } else {
          validationErrors.secretAnswer = ''
        }
        break;
      }

      case 'secretQuestion': {
        if (!value) {
          validationErrors.secretQuestion = "Secret question is required"
        } else {
          validationErrors.secretQuestion = ''
        }
        break;
      }

      case 'confirmPass': {
        if (!value) {
          validationErrors.confirmPass = "Confirm password is required"
        } else if (value !== data.password) {
          validationErrors.confirmPass = "Password not matched with confirm password"
        } else {
          validationErrors.confirmPass = ''
        }
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
    if (errorKeys.length < 10) {
      isValid = false;
    }
    return isValid;
  }

  const signUpForm = () => {
    if (checkErrors()) {
      let obj = data;
      obj.department.departmentId = department.department
      obj.password = base64.encode(data.password)
      obj.name = obj.name.trimEnd();
      obj.secretAnswer = base64.encode(data.secretAnswer)
      postRequest(REGISTER_PATH, data, null, (response) => {
        if (response.status === 201) {
          toast.success('Successfully registered user !!')
          setData({})
          navigate('/')
        } else {
          toast.warning(response.response.data.errorMessage[0])
        }
      })
    }
    else {
      toast.warning('Please fill all the fields')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    signUpForm(e);
  }

  const loginDirect = () => {
    navigate('/')
  }


  const handleChange = (event, property) => {
    event.preventDefault()
    setData({ ...data, [property]: event.target.value })
    checkErrors(event, property)
  }

  const handleConfirmPassword = (e, property) => {
    e.preventDefault();
    setConfirmPass({ ...confirmPass, [property]: e.target.value })
    checkErrors(e, property)
  }

  const handleDepartment = (e, property) => {
    e.preventDefault();
    setDepartment({ ...department, [property]: e.target.value });
    checkErrors(e, property);
  }

  const handleSecretQuestion = (e, property) => {
    e.preventDefault();
    setSecretQuestion({ ...secretQuestion, secretQuestion: e.target.value });
    checkErrors(e, property);
  }


  return (
    <Container>
      <form className={styles.signupform}>
        <h3>Reimbursement Portal</h3>
        <div className={styles.text}>
          <div>
            Registration form
          </div>
        </div>
        <div className={styles.formControl}>
          <div className={styles.leftHeading}>Name :</div>
          <div className={styles.rightHeading}>
            <div>
              <Input type="text" placeholder="Enter name here" value={data.name} changes={(e) => handleChange(e, "name")} />
            </div>
            {errors.name && <small>{errors.name}</small>}
          </div>
        </div>
        <div className={styles.formControl}>
          <div className={styles.leftHeading}>Email :</div>
          <div className={styles.rightHeading}>
            <div>
              <Input type="email" placeholder="example@nucleusTeq.com" value={data.email} changes={(e) => { handleChange(e, "email") }} />
            </div>
            {errors.email && <small>{errors.email}</small>}
          </div>
        </div>
        <div className={styles.formControl}>
          <div className={styles.leftHeading}>Contact :</div>
          <div className={styles.rightHeading}>
            <div>
              <Input type="text" placeholder="- - - - - - - -" value={data.contact} changes={(e) => handleChange(e, "contact")} />
            </div>
            {errors.contact && <small>{errors.contact}</small>}
          </div>
        </div>
        <div className={styles.formControl}>
          <div className={styles.leftHeading}>DOJ :</div>
          <div className={styles.rightHeading}>
            <div>
              <Input type="date" max={currentDate} placeholder="Date of Joining" value={data.joiningDate} changes={(e) => handleChange(e, "joiningDate")} />
            </div>
            {errors.joiningDate && <small>{errors.joiningDate}</small>}
          </div>
        </div>
        <div className={styles.formControl}>
          <div className={styles.leftHeading}>Department :</div>
          <div className={styles.rightHeading}>
            <div>
              <Select name={'department'} id={'department'} changes={(e) => handleDepartment(e, "department")} options={departmentArray} />
            </div>
            {errors.joiningDate && <small>{errors.joiningDate}</small>}
          </div>
        </div>
        <div className={styles.formControl}>
          <div className={styles.leftHeading}>Designation :</div>
          <div className={styles.rightHeading}>
            <div>
              <Select name={'role'} id={'role'} changes={(e) => handleChange(e, "role")} options={designationArray} />
            </div>
            {errors.role && <small>{errors.role}</small>}
          </div>
        </div>
        <div className={styles.formControl}>
          <div className={styles.leftHeading}>Secret question :</div>
          <div className={styles.rightHeading}>
            <div>
              <Select name={'question'} id={'question'} changes={(e) => handleSecretQuestion(e, "secretQuestion")} options={questionArray} />
            </div>
            {errors.secretQuestion && <small>{errors.secretQuestion}</small>}
          </div>
        </div>
        <div className={styles.formControl}>
          <div className={styles.leftHeading}>Secret Answer :</div>
          <div className={styles.rightHeading}>
            <div>
              <Input type="password" value={data.secretAnswer} placeholder="- - - - - - - -" changes={(e) => handleChange(e, "secretAnswer")} />
            </div>
            {errors.secretAnswer && <small>{errors.secretAnswer}</small>}
          </div>
        </div>
        <div className={styles.formControl}>
          <div className={styles.leftHeading}>Password :</div>
          <div className={styles.rightHeading}>
            <div>
              <Input type="password" value={data.password} placeholder="- - - - - - - - - -" changes={(e) => handleChange(e, "password")} />
            </div>
            {errors.password && <small>{errors.password}</small>}
          </div>
        </div>
        <div className={styles.formControl}>
          <div className={styles.leftHeading}>Confirm password :</div>
          <div className={styles.rightHeading}>
            <div>
              <Input type="password" placeholder="- - - - - - - - - -" changes={(e) => handleConfirmPassword(e, "confirmPass")}></Input>
            </div>
            {errors.confirmPass && <small>{errors.confirmPass}</small>}
          </div>
        </div>
        <div className={styles.registerBtn}>
          <Button type="submit" name="Register" click={(e) => { handleSubmit(e) }}></Button>
        </div>
        <div className={styles.loginurl}>
          <div>Already have an account! <a onClick={loginDirect}>Login</a></div>
        </div>
      </form>
    </Container>
  )
}

export default Signin