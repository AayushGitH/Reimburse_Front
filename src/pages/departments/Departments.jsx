import React, { useEffect, useState } from 'react'
import styles from './departmentStyle.module.css';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/reusedComponents/components/Input'
import Button from '../../components/reusedComponents/components/Button';
import Table from '../../components/reusedComponents/components/Table'
import Popup from '../../components/reusedComponents/components/Popup';
import { toast } from 'react-toastify';
import { getRequest, postRequest } from '../../services/commonService';
import { CREATE_DEPARTMENT, GETALL_DEPARTMENTS } from '../../api/apiurl';

const Departments = () => {
  const [departments, setDepartments] = useState([])
  const [department, setDepartment] = useState({})
  const [deptModal, setdeptModal] = useState(false)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const recordsPerPage = 4
  const lastIndex = currentPage * recordsPerPage
  const firstIndex = lastIndex - recordsPerPage
  const records = departments?.slice(firstIndex, lastIndex)
  const npage = Math.ceil(departments?.length / recordsPerPage)
  const numbers = [...Array(npage + 1).keys()].slice(1)

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem('user'))
    if (user.role !== 'ADMIN') {
      navigate('/')
    }
    departmentApiCall()
  }, [])

  const departmentApiCall = () => {
    getRequest(GETALL_DEPARTMENTS, null, (response) => {
      if (response.status === 200) {
        setDepartments(response.data)
      } else {
        console.log('No departments in the database')
      }
    })
  }

  const checkErrors = () => {
    const validationErrors = {}
    const departmentPattern = /^[A-Za-z]*$/;
    if (!department.departmentName) {
      validationErrors.departmentName = "Department name is required"
    } else if (!departmentPattern.test(department.departmentName)) {
      validationErrors.departmentName = "Department can contain only letters"
    } else if (department.departmentName.length > 30) {
      validationErrors.departmentName = "Can have 30 letters only"
    }
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }

  const saveDepartmentForm = (e) => {
    if (checkErrors()) {
      postRequest(CREATE_DEPARTMENT, department, null, (response) => {
        if (response.status === 201) {
          toast.success('Successfully added the department');
          departmentApiCall()
          depttoggledeptModal()
          setDepartment({})
        } else {
          toast.warning(response.response.data.errorMessage[0])
          depttoggledeptModal()
          setDepartment({})
        }
      })
    } else {
      toast.error('Fill the department name')
    }
  }

  const handleChange = (event, property) => {
    setDepartment({ ...department, [property]: event.target.value })
    checkErrors()
  }

  const depttoggledeptModal = () => {
    setdeptModal(!deptModal)
    setErrors([])
  }

  const adddeptdeptModal = () => {
    setdeptModal(!deptModal)
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

  const columns = ['Department ID', 'Department Name']

  return (
    <div className={styles.departmentContainer}>
      <h3>List of Departments</h3>
      <div className={styles.mainContainer}>
        <div className={styles.tableBox}>
          <div className={styles.top}>
            <Button className={styles.addBtn} name="Add Department" pl={'25px'} pr={'25px'} click={adddeptdeptModal}></Button>
          </div>
          <div className={styles.department}>
            {deptModal &&
              <Popup form={<form className={styles.departmentForm}>
                <div className={styles.departmentFormControl}>
                  <h4>Department Name <span className='astick'>*</span></h4>
                  <div>
                    <div>
                      <Input type="text" placeholder="Fill Department name" changes={(e) => handleChange(e, "departmentName")} required={'required'} />
                    </div>
                    {errors.departmentName && <small>{errors.departmentName}</small>}
                  </div>
                </div>
              </form>} isFormActive={true} onOkClick={saveDepartmentForm} heading={'Save Department'} onCancelClick={depttoggledeptModal} />
            }
            <div className={styles.deptTable}>
              <Table columns={columns} emptyMsg={'No department found'} data={records.map((department) => ({
                'Department ID': department.departmentId,
                'Department Name': department.departmentName
              }))} />
            </div>
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
        </div>
      </div>
    </div>
  )
}

export default Departments