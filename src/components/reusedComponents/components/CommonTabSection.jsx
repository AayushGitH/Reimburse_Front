import React from 'react'
import Button from './Button'
import styles from '../styles/CommonTabSectionStyle.module.css'

const CommonTabSection = ({active, mainApi, commonApi}) => {
  return (
    <div className={styles.tabSection}>
        <Button active={active} click={() => mainApi()} name='All' pl={'60px'} pr={'60px'} mr={'5px'}></Button>
        <Button active={active} color={'#6dc5c5'} click={() => commonApi('Pending')} name='Pending' pl={'60px'} pr={'60px'} mr={'5px'}></Button>
        <Button active={active} color={'#277127'} click={() => commonApi('Accepted')} name='Accepted' pl={'60px'} pr={'60px'} mr={'5px'}></Button>
        <Button active={active} color={'#e13535'} click={() => commonApi('Rejected')} name='Rejected' pl={'60px'} pr={'60px'} mr={'5px'}></Button>
      </div>
  )
}

export default CommonTabSection