import React from 'react'

const Input = ({type,placeholder,changes,value,required,disabled,max,min,accept}) => {
  return (
    <input type={type} 
    max={max} 
    min={min} 
    placeholder={placeholder} 
    disabled={disabled} 
    value={value} 
    onChange={changes} 
    accept={accept}
    required={required} />
  )
}

export default Input