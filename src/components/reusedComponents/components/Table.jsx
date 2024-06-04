import React from 'react'
import styles from '../styles/TableStyle.module.css'

const Table = ({ data, columns, size, emptyMsg }) => {
    return (
        <table className={styles.commonTable} style={{ width : size}}>
          <thead>
            <tr>
              {columns?.map((column, index) => (
                <th key={index}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {
              data.length == 0 && <div className={styles.emptyMsg}>{emptyMsg}</div>
            }
            {data?.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns?.map((column, colIndex) => (
                  <td key={colIndex}>{row[column]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
}

export default Table