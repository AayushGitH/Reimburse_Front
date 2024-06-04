import React, { useEffect, useState } from 'react'
import styles from './EmployeeStyle.module.css'
import Input from '../../components/reusedComponents/components/Input'
import Button from '../../components/reusedComponents/components/Button';
import Table from '../../components/reusedComponents/components/Table'
import Popup from '../../components/reusedComponents/components/Popup';
import { toast } from 'react-toastify';
import { getRequest, assignEmployee } from '../../services/commonService';
import { GET_EMPLOYEES } from '../../api/apiurl';

const Employees = () => {

  const [employees, setEmployees] = useState([])
  const [managers, setManagers] = useState([])
  const [assignManagers, setAssignManagers] = useState([])
  const [employeesflag, setEmployeesFlag] = useState(false)
  const [managersflag, setManagersFlag] = useState(false)
  const [assignModal, setAssignModal] = useState(false)
  const [active, setActive] = useState('MANAGER')
  const [errors, setErrors] = useState({})
  const [assignObj, setAssignObj] = useState({
    email: '',
    managerEmail: ''
  })

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const recordsPerPage = 5
  const lastIndex = currentPage * recordsPerPage
  const firstIndex = lastIndex - recordsPerPage
  const records = employees?.slice(firstIndex, lastIndex)
  const npage = Math.ceil(employees?.length / recordsPerPage)
  const numbers = [...Array(npage + 1).keys()].slice(1)

  useEffect(() => {
    fetchManager()
    setManagersFlag(false)
    fetchEmployee("Employee")
    setEmployeesFlag(true)
  }, [])

  const fetchEmployee = (empType) => {
    setActive('SDE')
    setEmployeesFlag(true)
    setManagersFlag(false)
    getRequest(`${GET_EMPLOYEES}/${empType}`, null, (response) => {
      if (response.status === 200) {
        setEmployeesFlag(true)
        setManagersFlag(false)
        setEmployees(response.data)
      } else {
        console.log(response.error)
      }
    })
  }

  const fetchManager = () => {
    setActive('Manager')
    setManagersFlag(true)
    setEmployeesFlag(false)
    getRequest(`${GET_EMPLOYEES}/Manager`, null, (response) => {
      if (response.status === 200) {
        setManagersFlag(true)
        setEmployeesFlag(false)
        setManagers(response.data)
      } else {
        console.log(response.error)
      }
    })
  }

  const assignMngForm = (e) => {

    if (checkErrors()) {
      const payload = {
        employeeEmail: assignObj.email,
        managerEmail: assignObj.managerEmail
      }
      assignEmployee(payload).then((resp) => {
        setAssignModal(!assignModal)
        toast.success(resp.data.message)
        fetchEmployee('Employee')
        setAssignManagers([])
      }, (error) => {
        console.log(error)
      })
    } else {
      toast.error('Select the manager')
    }
  }

  const managersArray = [];
  managersArray.push({ label: 0, value: '--- Select manager ---' })
  const assignModaltoggle = (name, department) => {
    for (var i = 0; i < managers?.length; i++) {
      if (managers[i].department.departmentName === department) {
        assignManagers.push(managers[i]);
      }
    }
    setAssignObj({
      email: name
    })
    setAssignModal(!assignModal)
  }

  const closeAssignModal = () => {
    setAssignManagers([])
    setAssignModal(!assignModal)
    setErrors([])
  }

  const handleChange = (event, property) => {
    console.log(property)
    setAssignObj({ ...assignObj, [property]: event.target.value })
    checkErrors(event, property)
  }

  const checkErrors = (e, property) => {
    let value = e?.target?.value
    const validationErrors = { ...errors }

    Object.keys(validationErrors).forEach(key => {
      if (validationErrors[key] === null) {
        delete validationErrors[key];
      }
    });

    switch (property) {
      case "managerEmail": {
        if (!value) {
          validationErrors.managerEmail = "Manager is required"
        } else {
          validationErrors.managerEmail = ""
        }
        break;
      }
    }
    setErrors(validationErrors);
    var isValid = true;
    var errorKeys = Object.keys(validationErrors)
    errorKeys.map((e) => {
      if (validationErrors[e] !== '') {
        console.log(validationErrors[e])
        isValid = false;
      }
    })
    if (errorKeys.length < 1) {
      isValid = false;
    }
    return isValid;
  }

  const changeCPage = (id) => {
    setCurrentPage(id)
  }

  const prePage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const nextPage = () => {
    if (currentPage !== npage) {
      setCurrentPage(currentPage + 1)
    }
  }

  const employeeColumns = ['Name', 'Email', 'Department', 'DOJ', 'Manager Name', 'Actions']
  const managerColumns = ['Name', 'Email', 'Department', 'DOJ']

  return (
    <div className={styles.employeeContainer}>
      <h3>List of Employees</h3>
      <div className={styles.top}>
        <Button active={active} className={styles.sdeBtn} pl={'35px'} pr={'35px'} id='sde' click={() => fetchEmployee('Employee')} name={'SDE'}></Button>
        <Button active={active} color={'#44a5a5'} className={styles.manBtn} pl={'25px'} pr={'25px'} id='sde' click={() => fetchManager()} name={'Manager'} ml='5px'></Button>
      </div>
      {assignModal &&
        <Popup form={<form onSubmit={assignMngForm} className={styles.assignForm}>
          <div className={styles.assignFormControl}>
            <div>
              <h4>Employee <span className='astick'>*</span></h4>
              <div>
                <div>
                  <Input type="text" value={assignObj.email} disabled={'disabled'} placeholder="The name of the employee" changes={(e) => handleChange(e, "email")} required={'required'} />
                </div>
                {errors.email && <small>{errors.email}</small>}
              </div>
            </div>
            <div>
              <h4>Manager <span className='astick'>*</span></h4>
              <div>
                <div>
                  <select name="managerName" id="managerName" onChange={(e) => handleChange(e, "managerEmail")} required>
                    <option value=''>--Select Manager--</option>
                    {
                      assignManagers.map((opts) => (
                        <option value={opts.email} key={opts.name}>
                          {opts.name}
                        </option>
                      ))
                    }
                  </select>
                </div>
                {errors.managerEmail && <small>{errors.managerEmail}</small>}
              </div>
            </div>
          </div>
        </form>} isFormActive={true} onOkClick={(e) => assignMngForm(e)} heading={'Assign Employee'} onCancelClick={closeAssignModal} />
      }

      {employeesflag && <div className={styles.empTable}>
        <Table columns={employeeColumns} emptyMsg={'No employee found'} data={records.map((employee) => ({
          'Name': employee.name,
          'Email': employee.email,
          'DOJ': employee.joiningDate.slice(0, 10),
          'Department': employee.department.departmentName,
          'Manager Name': employee.managerName,
          'Actions': <>
            <Button name={employee.managerId === 1 ? 'Assign' : 'Re-assign'} click={() => { assignModaltoggle(employee.email, employee.department.departmentName) }}></Button>
          </>
        }))} />
        <nav>
          <ul className={styles.numList}>
            <li className={styles.navItem}>
              <a onClick={prePage}>Prev</a>
            </li>
            <li className={styles.navLink}>
              {
                numbers.map((n, i) => (
                  <li className={`${styles.navItem} ${currentPage === n ? styles.active : styles.none}`} onClick={() => changeCPage(n)}>
                    {n}
                  </li>
                ))
              }
            </li>
            <li className={styles.navItem}>
              <a onClick={nextPage}>Next</a>
            </li>
          </ul>
        </nav>
      </div>
      }
      {managersflag &&
        <div>
          <Table columns={managerColumns} emptyMsg={'No manager found'} data={managers.map((manager) => ({
            'Name': manager.name,
            'Email': manager.email,
            'DOJ': manager.joiningDate.slice(0, 10),
            'Department': manager.department.departmentName
          }))} />
        </div>
      }
    </div>
  )
}

export default Employees