import React, { useEffect, useState } from 'react'
import styles from './DashboardStyle.module.css'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { FaUser, FaSignOutAlt } from 'react-icons/fa';

const Dashboard = () => {
  const [admin, setAdmin] = useState(false);
  const [manager, setManager] = useState(false);
  const [loggedUser, setLoggedUser] = useState({})
  const navigate = useNavigate()

  useEffect(() => {

    let user = JSON.parse(localStorage.getItem('user'))
    setLoggedUser(JSON.parse(localStorage.getItem('user')))
    if (user?.role === 'ADMIN') {
      setAdmin(true)
    }
    if (user?.role === 'MANAGER') {
      setManager(true)
    }
  }, [])

  const refreshStorage = () => {
    localStorage.clear()
  }

  const viewClaim = () => {
    let user = JSON.parse(localStorage.getItem('user'))
    if (user.role === 'EMPLOYEE') {
      navigate('/dashboard/claim')
    } else if (user.role === 'MANAGER') {
      navigate('/dashboard/claim')
    }
  }

  const viewRequests = () => {
    let user = JSON.parse(localStorage.getItem('user'))
    if (user.role === 'ADMIN') {
      navigate('/dashboard/adminClaims')
    } else if (user.role === 'MANAGER') {
      navigate('/dashboard/managerClaims')
    }
  }
  let path = window.location.pathname
  let activePath = path.slice(11, path.length)

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.leftBox}>
        <div className={styles.sideTexts}>
          <div >
            <h3 className={styles.shadow}>Reimbursement Portal</h3>
          </div>
          <div className={styles.userRole}>
              <div>{loggedUser.role}</div>
          </div>
          <div className={styles.userName}>
            <div>
              <FaUser />
            </div>
            <div className={styles.loggedUser}>
              <div>{loggedUser.name}</div>
            </div>
          </div>
        </div>
        <div className={styles.tabBar}>
          {admin &&
            <div className={styles.tabs}>
              <div className={activePath === 'employees' ? styles.active : ''}>
                <Link to='employees' className={styles.toggleBar}> Employees</Link>
              </div>
            </div>
          }
        </div>
        <div className={styles.tabBar}>
          {!admin &&
            <div className={styles.tabs}>
              <div className={activePath === 'claim' ? styles.active : '' || activePath === 'adminClaims' ? styles.active : ''}>
                <div onClick={() => viewClaim()} className={styles.toggleBar} style={{ cursor: 'pointer' }}> View claim</div>
              </div>
            </div>
          }
        </div>
        <div className={styles.tabBar}>
          {admin &&
            <div className={styles.tabs}>
              <div className={activePath === 'categories' ? styles.active : ''}>
                <Link to='categories' className={styles.toggleBar}> Categories</Link>
              </div>
            </div>
          }
        </div>
        <div className={styles.tabBar}>
          {admin &&
            <div className={styles.tabs}>
              <div className={activePath === 'departments' ? styles.active : ''}>
                <Link to='departments' className={styles.toggleBar}> Departments</Link>
              </div>
            </div>
          }
        </div>
        <div>
        </div>
        <div className={styles.tabBar}>
          {!admin &&
            <div className={styles.tabs}>
              <div className={activePath === 'addClaim' ? styles.active : ''}>
                <Link to='addClaim' className={styles.toggleBar}> Add claim</Link>
              </div>
            </div>
          }
        </div>
        <div className={styles.tabBar}>
          {manager &&
            <div className={styles.tabs}>
              <div className={activePath === 'managerClaims' ? styles.active : ''}>
                <div onClick={() => viewRequests()} className={styles.toggleBar} style={{ cursor: 'pointer' }}>View requests</div>
              </div>
            </div>
          }
          {admin &&
            <div className={styles.tabs}>
              <div className={activePath === 'adminClaims' ? styles.active : ''}>
                <div onClick={() => viewRequests()} className={styles.toggleBar} style={{ cursor: 'pointer' }}>View requests</div>
              </div>
            </div>
          }
        </div>
        <div>
        </div>
        <div className={styles.logOut}>
          <Link to='/' onClick={refreshStorage} className={styles.toggleBar}><FaSignOutAlt /> Logout</Link>
        </div>
      </div>
      <div className={styles.rightBox}>
        <Outlet />
      </div>
    </div>
  )
}

export default Dashboard