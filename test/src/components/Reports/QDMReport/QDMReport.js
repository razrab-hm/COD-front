import React from 'react';
import styles from './QDMReport.module.css';
import { romanize } from '../../../utils/projectUtils';

function QDMReport({data}) {
  return (
    <table className={`table ${styles.table_striped}`}>
      <thead>
        <tr className="table-dark">
          <th scope='col' className='text-lg-start'>Date</th>
          <th scope='col' className='text-lg-end'>Year</th>
          <th scope='col' className='text-lg-end'>Day/Months Hashrate (EH)</th>
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
              <th scope='col' className='text-lg-end'>{data?.year}</th>
              <th scope='col' className='text-lg-end'>{elem?.total}</th>
              {
                elem.total_profit ?
                <th scope='col' className='text-lg-end'>{elem.total_profit}</th>
                : null
              }
            </tr>
            :
            <tr key={elem.date}>
              <td className='text-lg-start'>{elem.date}</td>
              <td className='text-lg-end'>{data?.year}</td>
              <td className='text-lg-end'>{elem.hash}</td>
              {
                elem.total_profit ?
                <td className='text-lg-end'>{elem.total_profit}</td>
                : null
              }
            </tr>
          ))
        }
         <tr>
            <th scope='col' className='text-lg-start'>Total {romanize(data?.quarter)} Quarter</th>
            <th scope='col' className='text-lg-end'>{data?.year}</th>
            <th scope='col' className='text-lg-end'>{data?.total}</th>
            {
                data.total_profit ?
                <th scope='col' className='text-lg-end'>{data.total_profit}</th>
                : null
              }
          </tr>
      </tbody>
    </table>
  )
}

export default QDMReport