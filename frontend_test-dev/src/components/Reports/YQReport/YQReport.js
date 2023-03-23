import React from 'react'
// eslint-disable-next-line no-unused-vars
import styles from './YQReport.module.css';
import { romanize } from '../../../utils/projectUtils';
import ENUMS from '../../../constants/appEnums';

function YQReport({ data }) {
  return (
    <table className="table table-success table-striped">
      <thead>
        <tr className="table-dark">
          <th scope="col" className="text-lg-start">
            Quarter
          </th>
          <th scope="col" className="text-lg-end">
            Year
          </th>
          <th scope="col" className="text-lg-end">
            Quarter hashrate (EH)
          </th>
          {
            data.total_profit ?
            <th scope="col" className="text-lg-end">
              BTC
            </th>
            : null
          }
        </tr>
      </thead>
      <tbody>
        {data?.report?.map((elem, index) => (
          <tr key={elem.Quarter}>
            <td className="text-lg-start">
              {romanize(elem.Quarter)} Quarter ({ENUMS.QUARTERS[index + 1]})
            </td>
            <td className="text-lg-end">
              {data?.year}
            </td>
            <td className="text-lg-end">
              {elem.total}
            </td>
            {
              elem.total_profit ?
              <td className="text-lg-end">
                {elem.total_profit}
              </td>
              : null
            }
          </tr>
        ))}
        <tr>
          <th scope="col" className="text-lg-start">
            Totals:
          </th>
          <th scope="col" className="text-lg-end">
            {data?.year}
          </th>
          <th scope="col" className="text-lg-end">
            {data?.total}
          </th>
          {
            data.total_profit ?
            <th scope="col" className="text-lg-end">
              {data?.total_profit}
            </th>
            : null
          }
        </tr>
      </tbody>
    </table>
  );
}

export default YQReport