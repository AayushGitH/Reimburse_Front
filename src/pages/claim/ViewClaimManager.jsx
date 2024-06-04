import React from 'react'
import styles from './ClaimCss.module.css';
import { useState } from 'react';
import { useEffect } from 'react';
import Button from '../../components/reusedComponents/components/Button'
import CommonCard from '../../components/reusedComponents/components/CommonCard';
import Input from '../../components/reusedComponents/components/Input'
import Popup from '../../components/reusedComponents/components/Popup';
import { getRequest, updateClaim } from '../../services/commonService';
import { GET_MANAGER_CLAIMS, GET_MANAGER_CLAIMS_BY_STATUS } from '../../api/apiurl';
import { toast } from 'react-toastify';

const ViewClaimManager = () => {
    useEffect(() => {
        fetchAllClaimsForManager()
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

    const fetchAllClaimsForManager = () => {
        setActive("All")
        let user = JSON.parse(localStorage.getItem('user'))
        getRequest(`${GET_MANAGER_CLAIMS}/${user.userId}`, null, (response) => {
            if (response.status === 200) {
                setCurrentPage(1)
                setClaims(response.data);
            } else {
                console.log(response)
            }
        })
    }

    const fetchClaimsByStatus = (status) => {
        if (status === "All")
            setActive("All")
        if (status === "Pending")
            setActive("Pending")
        if (status === "Accepted")
            setActive("Accepted")
        if (status === "Rejected")
            setActive("Rejected")
        let user = JSON.parse(localStorage.getItem('user'))
        getRequest(`${GET_MANAGER_CLAIMS_BY_STATUS}?managerId=${user.userId}&status=${status}`, null, (response) => {
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
        } else if (comment.length > 150) {
            validationErrors.comment = "Comment cannot be greater than 150 characters"
        }
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            updateStatusAPI()
        }
    }

    const updateStatusAPI = () => {
        setUpdateModal(false)
        const payload = {
            id: claimId,
            comment: comment
        }
        updateClaim(payload)
        toast.success('Successfully updated the claim')
        fetchAllClaimsForManager()
        setComment('')
    }

    const cancelClick = () => {
        setUpdateModal(false)
        setErrors([])
    }

    const setAcceptClaim = () => {
        const payload = {
            id: claimId,
            comment: 'Accepted'
        }
        updateClaim(payload).then((response) => {
            toast.success('Successfully updated the claim')
        }, (error) => {
            toast.error('Some unexpected error is caught')
        })
        fetchAllClaimsForManager()
        setAcceptModal(false)
        setComment('')
    }

    const viewacceptmodal = () => {
        setAcceptModal(!acceptModal);
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

            <div className={styles.tabSection}>
                <Button active={active} click={() => fetchAllClaimsForManager()} name='All' pl={'60px'} pr={'60px'} mr={'5px'}></Button>
                <Button color={'#ddb811'} active={active} click={() => fetchClaimsByStatus('Pending')} name='Pending' pl={'60px'} pr={'60px'} mr={'5px'}></Button>
                <Button color={'#277127'} active={active} click={() => fetchClaimsByStatus('Accepted')} name='Accepted' pl={'60px'} pr={'60px'} mr={'5px'}></Button>
                <Button color={'#e13535'} active={active} click={() => fetchClaimsByStatus('Rejected')} name='Rejected' pl={'60px'} pr={'60px'} mr={'5px'}></Button>
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
                </form>} isFormActive={true} onOkClick={(e) => setUpdateStatus(e)} heading={'Reject claim'} onCancelClick={cancelClick} />
            }
            {acceptModal &&
                <Popup heading={'Accept Claim'} onOkClick={(e) => setAcceptClaim(e)} onCancelClick={viewacceptmodal} text={'Are you sure you want to accept the claim ?'} />
            }

            <div className={styles.cardContainer}>
                {claims.length !== 0 ? records?.map((claim, index) => {
                    return (
                        <CommonCard claim={claim} updateStatusModal={updateStatusModal} />
                    )
                }) : <div className={styles.noClaim}>No claims found!..</div>
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

export default ViewClaimManager