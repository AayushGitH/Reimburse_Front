import React, { useEffect, useState } from 'react'
import styles from './ClaimCss.module.css';
import Button from '../../components/reusedComponents/components/Button';
import CommonCard from '../../components/reusedComponents/components/CommonCard';
import { GET_PARTICULAR_CLAIMS, GET_PARTICULAR_CLAIMS_BY_STATUS } from '../../api/apiurl';
import { getRequest } from '../../services/commonService';


const Claim = () => {
  const [claims, setClaims] = useState([]);
  const [viewClaimModal, setViewClaimModal] = useState(false)
  const [active, setActive] = useState("All");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const recordsPerPage = 4
  const lastIndex = currentPage * recordsPerPage
  const firstIndex = lastIndex - recordsPerPage
  const records = claims?.slice(firstIndex, lastIndex)
  const npage = Math.ceil(claims?.length / recordsPerPage)
  const numbers = [...Array(npage + 1).keys()].slice(1)

  useEffect(() => {
    viewClaimModalToggle()
  }, [])

  const getParticularClaims = () => {
    setActive("All")
    getRequest(`${GET_PARTICULAR_CLAIMS}?email=${localStorage.getItem('loggedEmail')}`, null, (response) => {
      if (response.status === 200) {
        setCurrentPage(1)
        setClaims(response.data);
      } else {
        console.log(response)
      }
    })
  }

  const getParticularClaimsByStatus = (status) => {
    if (status === "All")
      setActive("All")
    if (status === "Pending")
      setActive("Pending")
    if (status === "Accepted")
      setActive("Accepted")
    if (status === "Rejected")
      setActive("Rejected")
    getRequest(`${GET_PARTICULAR_CLAIMS_BY_STATUS}?email=${localStorage.getItem('loggedEmail')}&status=${status}`, null, (response) => {
      if (response.status === 200) {
        setCurrentPage(1)
        setClaims(response.data);
      } else {
        console.log(response)
      }
    })
  }

  const viewClaimModalToggle = () => {
    getParticularClaims()
    setViewClaimModal(!viewClaimModal)
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
        <Button name='All' active={active} click={() => getParticularClaims()} pl={'60px'} pr={'60px'} mr={'5px'}></Button>
        <Button color={'#ddb811'} name='Pending' active={active} click={() => getParticularClaimsByStatus("Pending")} pl={'60px'} pr={'60px'} mr={'5px'}></Button>
        <Button color={'#277127'} name='Accepted' active={active} click={() => getParticularClaimsByStatus("Accepted")} pl={'60px'} pr={'60px'} mr={'5px'}></Button>
        <Button color={'#e13535'} name='Rejected' active={active} click={() => getParticularClaimsByStatus("Rejected")} pl={'60px'} pr={'60px'} mr={'5px'}></Button>
      </div>

      <div className={styles.cardContainer}>
        {claims.length !== 0 ? records?.map((claim, index) => {
          return (
            <CommonCard claim={claim} />
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

export default Claim