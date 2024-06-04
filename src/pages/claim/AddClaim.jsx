import React, { useEffect, useState } from 'react'
import styles from './AddClaimStyle.module.css'
import photo from '../../assets/imagenotavail.png'
import { useNavigate } from 'react-router-dom'
import Input from '../../components/reusedComponents/components/Input'
import Button from '../../components/reusedComponents/components/Button';
import Select from '../../components/reusedComponents/components/Select';
import Container from '../../components/reusedComponents/components/Container';
import { toast } from 'react-toastify';
import { getRequest, postRequest } from '../../services/commonService';
import { ADD_CLAIM, GETALL_CATEGORIES } from '../../api/apiurl';

const AddClaim = () => {
  useEffect(() => {
    apiCall()

    let tdate = new Date();
    let tda = String(tdate.getDate()).padStart(2, '0');
    let tmo = String(tdate.getMonth() + 1).padStart(2, '0');
    let tye = tdate.getFullYear();
    let currentDate = `${tye}-${tmo}-${tda}`;
    setCDate(currentDate);

    let odate = new Date();
    let oda = String(odate.getDate()).padStart(2, '0');
    let omo = String(odate.getMonth()).padStart(2, '0');
    let oye = odate.getFullYear();
    let oldDate = `${oye}-${omo}-${oda}`;
    setODate(oldDate)
  }, [])

  const apiCall = () => {
    getRequest(GETALL_CATEGORIES, null, (response) => {
      if (response.status === 200) {
        setCategories(response.data)
      } else {
        console.log(response)
      }
    })
  }
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [currentDate, setCDate] = useState('');
  const [oldDate, setODate] = useState('');
  const navigate = useNavigate()
  const [claim, setClaim] = useState({
    expenseType: '',
    amount: 0,
    currency: '',
    comment: '',
    expenseDate: ''
  })
  const [file, setFile] = useState(null)
  const [previewImage, setPreviewImage] = useState("")

  const categoryArray = []
  categoryArray.push({ label: '', value: '--- Select category type ---' })
  for (let val = 0; val < categories?.length; val++) {
    const obj = {
      label: '',
      value: ''
    };
    obj.label = categories[val].categoryType;
    obj.value = categories[val].categoryType;
    categoryArray.push(obj)
  }

  const currencyArray = [
    { label: '', value: '--- Select the currency ---' },
    { label: 'INR', value: 'INR' }
  ]

  const handleChange = (event, property) => {
    setClaim({ ...claim, [property]: event.target.value })
    checkErrors(event, property)
  }

  const onfileChange = (event) => {
    event.preventDefault()
    setPreviewImage(event.target.files[0])
    setFile({ ...file, file: event.target.files[0] })
    checkErrors(event.target.value, "file");
  }

  const checkErrors = (event, property) => {
    let value = event?.target?.value
    const validationErrors = { ...errors }

    Object.keys(validationErrors).forEach(key => {
      if (validationErrors[key] === null) {
        delete validationErrors[key];
      }
    });

    switch (property) {
      case "amount": {
        let ob = null
        for (var i = 0; i < categories?.length; i++) {
          if (categories[i]?.categoryType === claim?.expenseType) {
            ob = categories[i]
          }
        }
        if (!value) {
          validationErrors.amount = 'Claim amount is required'
        } else if (value > ob?.categoryLimit) {
          validationErrors.amount = `Amount cannot be greater than ${ob?.categoryLimit}`
        } else if (value == 0) {
          validationErrors.amount = `Amount must be greater than 0`
        } else {
          validationErrors.amount = ''
        }
        break;
      }

      case "expenseType": {
        if (!value) {
          validationErrors.expenseType = "Expense type is required"
        } else {
          validationErrors.expenseType = ''
        }
        break;
      }

      case "expenseDate": {
        if (value === null) {
          validationErrors.expenseDate = "Expense date is required"
        } else {
          validationErrors.expenseDate = ''
        }
        break;
      }

      case "comment": { 
        if (!value) {
          validationErrors.comment = "Comment is required"
        }else if (value.length > 150) {
          validationErrors.comment = "Comment cannot be greater than 150 characters"
        } else {
          validationErrors.comment = ""
        }
        break;
      }

      case "file": {
        console.log(value)
        if (value === null) {
          validationErrors.file = "File is required"
        } else {
          validationErrors.file = ""
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
    if (errorKeys.length < 5) {
      isValid = false;
    }
    return isValid;
  }

  const addClaim = async (e) => {
    e.preventDefault()

    let email = localStorage.getItem('loggedEmail')
    if (checkErrors()) {

      const formData = new FormData();
      let obj = claim;
      obj.currency = 'INR';
      formData.append("claim", JSON.stringify(claim))
      formData.append("file", file.file)

      postRequest(`${ADD_CLAIM}/${email}`, formData, null, (response)=>{
        if(response.status === 201) {
          navigate('/dashboard/claim')
          toast.success('Claim added succussfully')
        } else {
          console.log(response)
        }
      })
    } else {
      toast.error('Fill all the required fields')
    }
    return false;
  }

  return (
    <Container>
      <div className={styles.addClaimContainer}>
        <form className={styles.addClaimForm} onSubmit={(e) => addClaim(e)} encType='multipart/form-data'>
          <div className={styles.formLeftBox}>
            <div className={styles.claimText}>Add claim form</div>
            <div className={styles.formControl}>
              <h4>Expense type <span className='astick'>*</span></h4>
              <div>
                <div>
                  <Select name={'categoryType'} id={'categoryType'} changes={(e) => { handleChange(e, 'expenseType') }} options={categoryArray} />
                </div>
                {errors.expenseType && <small>{errors.expenseType}</small>}
              </div>
            </div>
            <div className="form-control">
              <h4>Amount <span className='astick'>*</span></h4>
              <div>
                <div>
                  <Input type="number" placeholder="Enter amount" changes={(e) => { handleChange(e, 'amount') }} />
                </div>
                {errors.amount && <small>{errors.amount}</small>}
              </div>
            </div>
            <div className="form-control">
              <h4>Issue date <span className='astick'>*</span></h4>
              <div>
                <div>
                  <Input type="date" min={oldDate} max={currentDate} placeholder="Enter date here" changes={(e) => { handleChange(e, 'expenseDate') }} />
                </div>
                {errors.expenseDate && <small>{errors.expenseDate}</small>}
              </div>
            </div>
            <div className="form-control">
              <h4>Comment <span className='astick'>*</span></h4>
              <div>
                <div>
                  <textarea name="" id="" placeholder='Write the comment' onChange={(e) => { handleChange(e, 'comment') }} cols="50" rows="1"></textarea>
                </div>
                {errors.comment && <small>{errors.comment}</small>}
              </div>
            </div>
            <Button type="submit" mt='10px' name="Add claim"></Button>
          </div>
          <div className={styles.formRightBox}>
            <h3>Preview box</h3>
            <div className={styles.previewBox}>
              {previewImage ?
                <img src={URL.createObjectURL(previewImage)} alt="" />
                :
                <img src={photo} alt="" />
              }
            </div>
            <div className="form-control">
              <h4>Select file <span className='astick'>*</span></h4>
              <div>
                <div>
                  <Input type="file" accept={'.jpg, .jpeg, .png'} changes={(e) => { onfileChange(e) }} />
                </div>
                {errors.file && <small>{errors.file}</small>}
              </div>
            </div>
          </div>
        </form>
      </div>
    </Container>
  )
}

export default AddClaim
