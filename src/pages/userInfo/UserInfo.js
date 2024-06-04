import React from 'react'
import styles from './UserInfoStyle.module.css'

const UserInfo = () => {
  return (
    <div className={styles.userinfo}>
        <div className={styles.userContainer}>
          Welcome to the portal
        </div>
    </div>
  )
}

export default UserInfo