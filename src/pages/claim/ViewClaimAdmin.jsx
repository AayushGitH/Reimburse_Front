import React, { useEffect, useState } from 'react'
import styles from './ClaimCss.module.css';
import Input from '../../components/reusedComponents/components/Input'
import CommonCard from '../../components/reusedComponents/components/CommonCard'
import Popup from '../../components/reusedComponents/components/Popup';
import CommonTabSection from '../../components/reusedComponents/components/CommonTabSection';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GET_ALL_CLAIMS, GET_CLAIMS_BY_STATUS } from '../../api/apiurl';
import { getRequest, updateClaim } from '../../services/commonService';

const ViewClaimAdmin = () => {

  const navigate = useNavigate()
  let user = JSON.parse(localStorage.getItem('user'))
  if (user.role !== 'ADMIN') {
    navigate('/')
  }

  useEffect(() => {
    fetchAllClaimsForAdmin()
  }, [])

  const [claims, setClaims] = useState([])
  const [claimId, setClaimId] = useState(0)
  const [comment, setComment] = useState('')
  const [updateModal, setUpdateModal] = useState(false)
  const [active, setActive] = useState('All')
  const [errors, setErrors] = useState({})
  const [acceptModal, setAcceptModal] = useState(false)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const recordsPerPage = 4
  const lastIndex = currentPage * recordsPerPage
  const firstIndex = lastIndex - recordsPerPage
  const records = claims?.slice(firstIndex, lastIndex)
  const npage = Math.ceil(claims?.length / recordsPerPage)
  const numbers = [...Array(npage + 1).keys()].slice(1)

  const fetchAllClaims = (status) => {
    if (status === "All")
      setActive("All")
    if (status === "Pending")
      setActive("Pending")
    if (status === "Accepted")
      setActive("Accepted")
    if (status === "Rejected")
      setActive("Rejected")
    getRequest(`${GET_CLAIMS_BY_STATUS}?status=${status}`, null, (response) => {
      if (response.status === 200) {
        setCurrentPage(1)
        setClaims(response.data);
      } else {
        console.log(response)
      }
    })
  }

  const fetchAllClaimsForAdmin = () => {
    setActive("All")
    getRequest(`${GET_ALL_CLAIMS}`, null, (response) => {
      if (response.status === 200) {
        setCurrentPage(1)
        setClaims(response.data);
      } else {
        console.log(response)
      }
    })
  }

  const updateStatusModal = (status, claimId) => {
    if (status === 'Accepted') {
      setClaimId(claimId)
      setAcceptModal(true)
    } else {
      setUpdateModal(true)
      setClaimId(claimId)
    }
  }

  const setUpdateStatus = (e) => {
    const validationErrors = {}

    if (!comment) {
      validationErrors.comment = "Comment is required"
    } else if (comment.length == 0) {
      validationErrors.comment = "Comment is required"
    } else if (comment.length > 150) {
      validationErrors.comment = "Comment cannot be greater than 150 characters"
    }
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      updateStatusAPI()
    }
  }

  const updateStatusAPI = () => {
    const payload = {
      id: claimId,
      comment: comment
    }
    updateClaim(payload).then((response) => {
      toast.success('Successfully updated the claim')
    }, (error) => {
      toast.error('Some unexpected error is caught')
    })
    fetchAllClaimsForAdmin()
    setUpdateModal(false)
    setComment('')
  }

  const setClaimAccept = () => {
    const payload = {
      id: claimId,
      comment: 'Accepted'
    }
    updateClaim(payload).then((response) => {
      toast.success('Successfully updated the claim')
    }, (error) => {
      toast.error('Some unexpected error is caught')
    })
    fetchAllClaimsForAdmin()
    setAcceptModal(false)
    setComment('')
  }

  const viewacceptmodal = () => {
    setAcceptModal(!acceptModal);
  }

  const closeCommentModal = () => {
    setUpdateModal(false)
    setErrors({})
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

  return (
    <div className={styles.claimContainer}>
      <div className={styles.tabArea}>
        <CommonTabSection mainApi={fetchAllClaimsForAdmin} commonApi={fetchAllClaims} active={active} />
      </div>

      {updateModal &&
        <Popup form={<form>
          <div className={styles.formControl}>
            <p>Give the reason to reject the claim</p>
            <div>
              <div>
                <Input type="text" changes={(e) => { setComment(e.target.value) }} placeholder="Enter comment here" />
              </div>
              {errors.comment && <small>* {errors.comment}</small>}
            </div>
          </div>
        </form>} isFormActive={true} onOkClick={(e) => setUpdateStatus(e)} heading={'Reject claim'} onCancelClick={() => closeCommentModal()} />
      }
      {acceptModal &&
        <Popup heading={'Accept Claim'} onOkClick={(e) => setClaimAccept(e)} onCancelClick={viewacceptmodal} text={'Are you sure you want to accept the claim ?'} />
      }

      <div className={styles.cardContainer}>
        {claims.length !== 0 ? records?.map((claim, index) => {
          return (
            <CommonCard claim={claim} updateStatusModal={updateStatusModal} />
          )
        }) : <div className={styles.noClaimText}>No claims found!..</div>
        }
      </div >

      {records?.length !== 0 &&
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
      }
    </div>
  )
}

export default ViewClaimAdmin