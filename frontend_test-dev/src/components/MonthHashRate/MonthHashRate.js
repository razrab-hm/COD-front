import React from 'react';
import styles from './MonthHashRate.module.css';

function MonthHashRate({monthReportData}) {
  return (
    <table className='table table-success table-striped'>
        <thead>
            <tr>
            <th scope="col" className={`text-lg-center ${styles.table_color}`}>
                HASHRATE FOR THE MONTH (cumulative)
            </th>
            </tr>
        </thead>
        <tbody>
            <tr className={styles.month_hash_rate_tr}>
                {
                  monthReportData?.total ? <td className="fs-4 text-lg-center">{monthReportData?.total} EH</td>
                  : 
                  <td className="fs-4 text-lg-center">0 EH</td>
                }
            
            </tr>
        </tbody>
    </table>
  )
}

export default MonthHashRate