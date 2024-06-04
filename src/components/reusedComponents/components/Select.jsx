import React from 'react'

const Select = ({ name, id, changes, options }) => {
  return (
    <select name={name}
      id={id}
      onChange={changes}>
      {options.map((opts) => (
        <option value={opts.label} key={opts.label}>
          {opts.value}
        </option>
      ))
      }
    </select>
  )
}

export default Select