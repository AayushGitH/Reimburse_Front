import React from 'react'
import styles from '../styles/ButtonStyle.module.css'

const Button = (props) => {

  const name = props.name;
  const click = props.click;
  const type = props.type;
  const ml = props.ml;
  const mr = props.mr;
  const mt = props.mt;
  const mb = props.mb;
  const pl = props.pl;
  const pr = props.pr;
  const fs = props.fs;
  const fc = props.fc;
  const color = props.color;
  const disabled = props.disabled
  const ref = props.ref
  const active = props.active
  const className = props.className

  return (
    <button className={styles.btn}
      disabled={disabled}
      style={{
        marginLeft: ml,
        marginRight: mr,
        fontSize: fs,
        color: fc,
        marginTop: mt,
        marginBottom: mb,
        backgroundColor: name===active ? '#0e3030' : color,
        paddingLeft: pl,
        paddingRight: pr,
        borderBottom: name===active ? '3px solid blue' : '',
        fontWeight: name===active ? 'bolder' : ''
      }}

      ref={ref}
      type={type}
      onClick={click}
    >{name}</button>

  )
}

export default Button