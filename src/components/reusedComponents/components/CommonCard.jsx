import React, { useState, useEffect } from 'react';
import styles from '../styles/commonCard.module.css';
import Button from './Button'
import Popup from './Popup';
import { getImage } from '../../../services/commonService';



const CommonCard = ({ claim, updateStatusModal }) => {
    const [role, setRole] = useState()
    const InStatus = ["ALL", "PENDING"];
    const InUser = ["ADMIN", "MANAGER"];
    const [pathName, setPathName] = useState('')
    const [comment, setComment] = useState('');
    const [commentPopup, setCommentPopup] = useState(false);

    useEffect(() => {
        let user = JSON.parse(localStorage.getItem('user'))
        setRole(user.role)
        let path = window.location.pathname
        setPathName(path.slice(11, path.length))
    }, [])

    const viewMore = (comment) => {
        setComment(comment)
        setCommentPopup(true)
    }

    const closeModal = () => {
        setCommentPopup(false)
    }

    const viewInvoice = (image) => {
        getImage(image).then((resp)=>{
          var image = new Image();
            image.src = 'data:image/jpg;base64,'+ resp.data.image;
            var w = window.open(image);
            w.document.write(image.outerHTML);
        },(error)=>{
          console.log(error)
        })
      }

    return (
        <div className={styles.card}>
            {
                commentPopup && <Popup heading={'Comment'} text={comment} onCancelClick={closeModal} /> 
            }
            <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>{claim.expenseType}</h3>
            </div>
            <div className={styles.cardBody}>
                <div className={styles.row}>
                    <div className={styles.halfCol}>
                        <p className={styles.cardText}>
                            RequestId:
                            <span className={styles.cardValue}>{claim.reimburseId}</span>
                        </p>
                    </div>
                    <div className={styles.halfCol}>
                        <p className={styles.cardText}>
                            Name:
                            <span className={styles.cardValue}>{claim.employeeName}</span>
                        </p>
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.halfCol}>
                        <p className={styles.cardText}>
                            Bill Amount:
                            <span className={styles.cardValue}>{claim.amount}</span>
                        </p>
                    </div>
                    <div className={styles.halfCol}>
                        <p className={styles.cardText}>
                            Invoice Date:
                            <span className={styles.cardValue}>{claim.expenseDate?.slice(0,10)}</span>
                        </p>
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.halfCol}>
                        <p className={styles.cardText} style={{ textAlign: 'left' }}>
                            Comment:
                            {claim.statusDescription === null ?
                                <span className={styles.cardValue}>{claim.comment?.slice(0,8)}{claim.comment?.length >10 ? <span className={styles.viewMoreButton} onClick={()=>viewMore(claim.comment)}> View more</span> : ''}
                                    </span> 
                                : <span className={styles.cardValue}>{claim.statusDescription?.slice(0,8)}{claim.statusDescription?.length >10 ? <span className={styles.viewMoreButton} onClick={()=>viewMore(claim.statusDescription)}> View more</span> : ''}
                                    </span>
                            }
                        </p>
                    </div>
                    <div className={styles.halfCol}>
                        <p className={styles.cardText}>
                            Status:
                            <span className={styles.cardValue}>{claim.status}</span>
                        </p>
                    </div>
                </div>
                <div className={styles.btngrp}>
                    <div className={styles.btnRow}>
                        <div className={styles.btnCol}>
                            <Button name={'View invoice'} color={'#008080'} click={() => viewInvoice(claim.documentUrl)} pl={'60px'} pr={'60px'} ></Button>
                        </div>
                    </div>
                    {
                        pathName !== "claim"
                        &&
                        InStatus.includes(claim.status)
                        &&
                        InUser.includes(role)
                        &&
                        <div className={styles.btnRow}>
                            <div className={styles.btnCol}>
                                <Button name={'Accept'} color={'#277127'} click={() => { updateStatusModal('Accepted', claim.reimburseId) }} mr={'5px'} pl={'60px'} pr={'60px'} ></Button>
                                <Button name={'Reject'} color={'#e13535'} click={() => { updateStatusModal('Rejected', claim.reimburseId) }} pl={'60px'} pr={'60px'} ></Button>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}
export default CommonCard