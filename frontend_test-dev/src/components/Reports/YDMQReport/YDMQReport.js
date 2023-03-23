import React from 'react';
import styles from './YDMQReport.module.css';

function YDMQReport({data}) {
  return (
    <table className={`table ${styles.table_striped}`}>
      <thead>
        <tr className="table-dark">
          <th scope='col' className='text-lg-start'>Day/Month/Quarters</th>
          <th scope='col' className='text-lg-end'>Average Hashrate (PH/s)</th>
          <th scope='col' className='text-lg-end'>Day/Months/quarters Hashrate (EH)</th>
          {
            data.total_profit ?
            <th scope='col' className='text-lg-end'>BTC</th>
            : null
          }
        </tr>
      </thead>
      <tbody>
        {
          data?.report?.map(elem => (
            elem.type === 'month' ? 
            <tr key={elem.date}>
              <th scope='col' className='text-lg-start'>Totals for {elem.date}</th>
              <th scope='col' className='text-lg-end'>{elem.average}</th>
              <th scope='col' className='text-lg-end'>{elem.total}</th>
              {
                elem.total_profit ?
                <th scope='col' className='text-lg-end'>{elem.total_profit}</th>
                : null
              }
            </tr>
            :
            elem.type === 'quarter' ?
            <tr key={elem.date}>
              <th scope='col' className='text-lg-start'>{elem.date}</th>
              <th scope='col' className='text-lg-end'>{elem.average}</th>
              <th scope='col' className='text-lg-end'>{elem.total}</th>
              {
                elem.total_profit ?
                <th scope='col' className='text-lg-end'>{elem.total_profit}</th>
                : null
              }
            </tr>
            :
            <tr key={elem.date}>
              <td className='text-lg-start'>{elem.date}</td>
              <td className='text-lg-end'>{elem.average}</td>
              <td className='text-lg-end'>{elem.hash}</td>
              {
                elem.total_profit ?
                <td className='text-lg-end'>{elem.total_profit}</td>
                : null
              }
            </tr>
          ))
        }
      </tbody>
    </table>
  )
}

export default YDMQReport