import React, { useState } from "react";
import styles from '../styles/PopupStyle.module.css'
import Button from "./Button";

function Popup({ heading, onOkClick, onCancelClick, form, isFormActive, text }) {
  const [inputValue, setInputValue] = useState("");
  const handleOkClick = () => {
    onOkClick(inputValue);
    setInputValue("");
  };
  const handleCancelClick = () => {
    setInputValue("");
    onCancelClick();
  };
  return (
    <div>
      <div className={styles.popupMainDiv}>
        <div className={styles.popup}>
          <div className={styles.popupHeading}>{heading}</div>
          <div className={styles.formDiv}>
            {
              isFormActive ? form : text
            }
          </div>
          <div className={styles.popupSubmissionDiv}>
            {
              heading !== 'Comment' ?

                text?.includes('delete') ?
                  <Button click={handleOkClick} color={'#e13535'} name="Delete" /> :
                  <Button click={handleOkClick} name="Save" />
                : ''
            }
            <Button click={handleCancelClick} name="Cancel" />
          </div>
        </div>
      </div>
    </div>
  );
}
export default Popup;