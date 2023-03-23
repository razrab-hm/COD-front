import React, { useState, useEffect } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Form from 'react-bootstrap/Form';
import styles from './AccordionItem.module.css';
import ENUMS from '../../../constants/appEnums';
import { sortByMonthName } from '../../../utils/projectUtils';
import { handlReport } from '../../../utils/projectUtils';

function AccordionItem({
  setData,
  modalControls,
  header,
  quarterly = false,
  monthly = false,
  url,
  dates,
  selectedCompanies,
  setShowToaster,
}) {
  const [year, setYear] = useState();
  const [month, setMonth] = useState(ENUMS.DATES.CURRENT_MONTH);
  const [quarter, setQuarter] = useState(ENUMS.DATES.CURRENT_QUARTER);
  const selectedCompaniesId = selectedCompanies.map((elem) => elem.id);

  const sendData = {
    year,
    month,
    quarter,
    companies: selectedCompaniesId,
  };

  useEffect(() => {
    if (dates.years && dates.months) {
      setYear(dates.years[dates.years.length - 1]);
    }
  }, [dates]);

  return (
    <>
      <Accordion.Header className={styles.accordion_header}>
        {header}
      </Accordion.Header>
      <Accordion.Body>
        <Form>
          <div className="input-group flex-nowrap">
            <label className="input-group-text">Year</label>
            <Form.Select
              className="form-select"
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              {dates?.years?.map((elem) => (
                <option key={elem} value={elem}>
                  {elem}
                </option>
              ))}
            </Form.Select>
            {quarterly ? (
              <>
                <label className="input-group-text">Quarter</label>
                <Form.Select
                  className="form-select"
                  id="quarter"
                  value={quarter}
                  onChange={(e) => setQuarter(e.target.value)}
                >
                  {dates?.quarters
                    ?.sort(function (a, b) {
                      return a - b;
                    })
                    .map((elem, i) => (
                      <option key={elem} value={i + 1}>{`${elem} - ${
                        ENUMS.QUARTERS[i + 1]
                      }`}</option>
                    ))}
                </Form.Select>
              </>
            ) : (
              ''
            )}
            {monthly ? (
              <>
                <label className="input-group-text">Month</label>
                <Form.Select
                  className="form-select"
                  id="month"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                >
                  {dates.months &&
                    sortByMonthName(dates.months).map((elem, i) => (
                      <option key={elem} value={i + 1}>{`${
                        i + 1
                      }- ${elem}`}</option>
                    ))}
                </Form.Select>
              </>
            ) : null}
          </div>
          <br />
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <button
              onClick={() =>
                handlReport(sendData, url, setData).then(modalControls.open())
              }
              className="btn btn-outline-primary"
              type="button"
              id="dashboard_from_submit"
            >
              View
            </button>
            <button
              onClick={() =>
                handlReport(sendData, url, setData, true, false).catch(() => {
                  setShowToaster(true);
                })
              }
              className="btn btn-outline-primary"
              type="button"
              id="dashboard_from_submit"
            >
              PDF
            </button>
            <button
              onClick={() =>
                handlReport(sendData, url, setData, false, true).catch(() =>
                  setShowToaster(true)
                )
              }
              className="btn btn-outline-primary"
              type="button"
              id="dashboard_from_submit"
            >
              Excel
            </button>
          </div>
        </Form>
      </Accordion.Body>
    </>
  );
}

export default AccordionItem;
