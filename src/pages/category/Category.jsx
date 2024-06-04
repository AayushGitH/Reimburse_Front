import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import styles from './CategoryStyle.module.css'
import Input from '../../components/reusedComponents/components/Input'
import Button from '../../components/reusedComponents/components/Button';
import Table from '../../components/reusedComponents/components/Table'
import Popup from '../../components/reusedComponents/components/Popup';
import { toast } from 'react-toastify';
import { deleteRequest, getRequest, postRequest } from '../../services/commonService';
import { CREATE_CATEGORY, DELETE_CATEGORY, GETALL_CATEGORIES } from '../../api/apiurl';

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState({});
  const [categoryExists, setCategoryExists] = useState(true);
  const navigate = useNavigate()
  const [modal, setModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [deleteObj, setDeleteCategory] = useState('')
  const [errors, setErrors] = useState({})

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const recordsPerPage = 3
  const lastIndex = currentPage * recordsPerPage
  const firstIndex = lastIndex - recordsPerPage
  const records = categories?.slice(firstIndex, lastIndex)
  const npage = Math.ceil(categories?.length / recordsPerPage)
  const numbers = [...Array(npage + 1).keys()].slice(1)

  useEffect(() => {

    let user = JSON.parse(localStorage.getItem('user'))
    if (user.role !== 'ADMIN') {
      navigate('/')
    }
    apiCall()
  }, [])

  const apiCall = () => {
    getRequest(GETALL_CATEGORIES, null, (response) => {
      if (response.status === 200) {
        setCategories(response.data)
        if (response.data == []) {
          setCategoryExists(false)
        }
      } else {
        console.log(response)
      }
    })
  }

  const checkErrors = (event, property) => {
    let value = event?.target?.value;
    const validationErrors = { ...errors }

    const categoryPattern = /^[A-Za-z]*$/;
    Object.keys(validationErrors).forEach(key => {
      if (validationErrors[key] === null) {
        delete validationErrors[key];
      }
    });

    switch (property) {
      case "categoryType": {
        if (!value) {
          validationErrors.categoryType = "Category type is required"
        } else if (!categoryPattern.test(value)) {
          validationErrors.categoryType = "Must contain only alphabets"
        } else if (value.length < 4) {
          validationErrors.categoryType = "Must contain 4 letters"
        } else if (value.length > 30) {
          validationErrors.categoryType = "Can have 30 letters only"
        } else {
          validationErrors.categoryType = ""
        }
        break;
      }

      case "categoryLimit": {
        if (!value) {
          validationErrors.categoryLimit = "Category limit is required"
        } else if (value == 0) {
          validationErrors.categoryLimit = "Limit must be greater than 0"
        } else if (value > 0 && value < 100) {
          validationErrors.categoryLimit = "Limit must be greater than 100"
        } else {
          validationErrors.categoryLimit = ""
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

  const saveCategoryForm = (e) => {
    if (checkErrors()) {
      postRequest(CREATE_CATEGORY, category, null, (response) => {
        if (response.status === 201) {
          toast.success('Successfully added the category');
          apiCall()
          toggleModal()
          setCategory({})
        } else {
          toast.warning(response.response.data.errorMessage[0])
          toggleModal()
          setCategory({})
        }
      })
    } else {
      toast.error('Fill both fields')
    }
  }

  const handleChange = (event, property) => {
    setCategory({ ...category, [property]: event.target.value })
    checkErrors(event, property)
  }

  const deleteCategory = (item) => {
    deleteRequest(`${DELETE_CATEGORY}/${item}`, (response) => {
      if (response.status === 200) {
        toast.success(response.data.message)
        apiCall()
      } else {
        console.log(response.error)
      }
    })
  }

  const toggleModal = () => {
    setModal(!modal)
  }

  const addcatmodal = () => {
    setModal(!modal)
    setErrors([])
  }

  const deletecatModal = (item) => {
    setDeleteCategory(item)
    setDeleteModal(!deleteModal)
  }

  const viewdeletemodal = () => {
    setDeleteModal(!deleteModal)
  }

  const finalDeleteCategory = () => {
    deleteCategory(deleteObj)
    setDeleteModal(!deleteModal)
  }

  const changeCPage = (id) => {
    setCurrentPage(id)
  }

  const prePage = () => {
    if(currentPage !== 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const nextPage = () => {
    if(currentPage !== npage) {
      setCurrentPage(currentPage + 1)
    }
  }

  const columns = ['Category', 'Limit', 'Action']

  return (
    <div className={styles.categoryContainer}>
      <h3>List of Categories</h3>
      <div className={styles.mainContainer}>
        <div className={styles.tableBox}>
          <div className={styles.catContainer}>
            <div className={styles.top}>
              <Button className={styles.addBtn} name="Add category" pl={'25px'} pr={'25px'} click={addcatmodal}></Button>
            </div>
          </div>
          <div className={styles.category}>
            {modal &&
              <Popup form={<form className={styles.categoryForm}>
                <div className={styles.categoryFormControl}>
                  <div>
                    <h4>Category Type <span className='astick'>*</span></h4>
                    <div>
                      <div>
                        <Input type="text" placeholder="Fill category type" changes={(e) => handleChange(e, "categoryType")} required={'required'} />
                      </div>
                      {errors.categoryType && <small>{errors.categoryType}</small>}
                    </div>
                  </div>
                  <div>
                    <h4>Category Limit <span className='astick'>*</span></h4>
                    <div>
                      <div>
                        <Input type="number" placeholder="Fill limit in rupees" changes={(e) => handleChange(e, "categoryLimit")} required={'required'} />
                      </div>
                      {errors.categoryLimit && <small>{errors.categoryLimit}</small>}
                    </div>
                  </div>
                </div>
              </form>} isFormActive={true} heading={'Save Category'} onOkClick={(e) => saveCategoryForm(e)} onCancelClick={addcatmodal} />
            }

            {deleteModal &&
              <Popup onOkClick={finalDeleteCategory} heading={'Delete Category'} onCancelClick={viewdeletemodal} text={'Are you sure you want to delete the category ?'} />
            }

            {categoryExists ? <>
              <Table columns={columns} emptyMsg={'No category found'} data={records.map((category) => ({
                'Category': category.categoryType,
                'Limit': category.categoryLimit,
                'Action': <>
                  <Button color={'#e13535'} className={styles.deleteBtn} name={'Delete'} click={() => { deletecatModal(category.categoryType) }}>Delete</Button>
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
                        <li className={`${styles.navItem} ${currentPage === n ? styles.active : styles.none}`} onClick={()=>changeCPage(n)}>
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
            </> : 'No categories found...'
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Category