import React, { useState, useEffect } from 'react'
import { Dashboard, MonthReport, MonthHashRate, YQMReport, ReportSelect, Footer, AsideMain } from '../../components'
// eslint-disable-next-line no-unused-vars
import styles from './Main.module.css'
import Form from 'react-bootstrap/Form';
import { api } from '../../utils/api';
import ENUMS from '../../constants/appEnums';
import { sortByMonthName, getData } from '../../utils/projectUtils';
import { handlReport } from '../../utils/projectUtils';

function Main({setUserLoggedIn, userRole, userLoggedIn, userName}) {
  const [userCompanies, setUserCompanies] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState(userCompanies);
  const [monthReportData, setMonthReportData] = useState([]);
  const [YQMReportData, setYQMReportData] = useState([]);
  const [dates, setDates] = useState([]);
  const [year, setYear] = useState();
  const [month, setMonth] = useState(ENUMS.DATES.CURRENT_MONTH);
  const selectedCompaniesId = selectedCompanies.map(elem => elem.id);
  const [showMenu, setShowMenu] = useState(true);

  const sendData = {
    year,
    month,
    companies: selectedCompaniesId
  }

  useEffect(() => {
    if(userCompanies.length > 0) getData( null, setDates, api.fetchData, ENUMS.API_ROUTES.DATES)
  },[userCompanies])

  useEffect(() => {
    setSelectedCompanies(userCompanies) 
  },[userCompanies])

  useEffect(() => {
    if(userLoggedIn) getData( null, setUserCompanies, api.fetchData, ENUMS.API_ROUTES.COMPANIES_ME);
  },[userLoggedIn])

  useEffect(() => {
    if (dates.years && dates.months) {
      setYear(dates.years[dates.years.length - 1]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dates]);

  const getInitialReports = () => {
    if (year && month && userCompanies.length > 0) {
      handlReport(sendData, ENUMS.API_ROUTES.MONTH_DAY, setMonthReportData);
      handlReport(
        sendData,
        ENUMS.API_ROUTES.YEAR_QUARTER_MONTH,
        setYQMReportData
      );
    }
  };

  useEffect(() => {
    getInitialReports();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year]);

  return (
    <div
      className="wrapper d-flex flex-column min-vh-100"
      style={{ backgroundColor: 'rgb( 235, 237, 239)' }}
    >
      <Dashboard
        userName={userName}
        userRole={userRole}
        setUserLoggedIn={setUserLoggedIn}
        userCompanies={userCompanies}
        setSelectedCompanies={setSelectedCompanies}
        setUserCompanies={setUserCompanies}
        setShowMenu={setShowMenu}
        showMenu={showMenu}
      />
      <div className="container-fluid">
        <div className="row flex-nowrap">
        <AsideMain showMenu={showMenu} userCompanies={userCompanies} selectedCompanies={selectedCompanies} setSelectedCompanies={setSelectedCompanies} getInitialReports={getInitialReports}/>
          <div className='col py-3'>
            <div className='container'>
              <div className='row'>
              <div className="col-xl-6">
            <MonthHashRate monthReportData={monthReportData} />
            <MonthReport data={monthReportData} />
          </div>
          <div className="col-xl-6">
            <ReportSelect dates={dates} selectedCompanies={selectedCompanies} />
            <table className="table table-success table-striped">
              <tbody>
                <tr>
                  <td>
                    <Form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handlReport(
                          sendData,
                          ENUMS.API_ROUTES.MONTH_DAY,
                          setMonthReportData
                        );
                        handlReport(
                          sendData,
                          ENUMS.API_ROUTES.YEAR_QUARTER_MONTH,
                          setYQMReportData
                        );
                      }}
                    >
                      <div className="input-group flex-nowrap">
                        <label className="input-group-text">Year</label>
                        <Form.Select
                          value={year}
                          onChange={(e) => setYear(e.target.value)}
                          className="form-select"
                          id="year"
                        >
                          {dates?.years?.map((elem, i) => (
                            <option key={elem} value={elem}>
                              {elem}
                            </option>
                          ))}
                        </Form.Select>
                        <label className="input-group-text">Month</label>
                        <Form.Select
                          className="form-select"
                          id="id_month"
                          value={month}
                          onChange={(e) => setMonth(e.target.value)}
                        >
                          {dates.months
                            ? sortByMonthName(dates.months).map((elem, i) => (
                                <option key={elem} value={i + 1}>{`${
                                  i + 1
                                } - ${elem}`}</option>
                              ))
                            : null}
                        </Form.Select>
                        <button
                          style={{ backgroundColor: '#321fdb' }}
                          className="btn btn-primary"
                          type="submit"
                          id="dashboard_form_submit"
                        >
                          Submit
                        </button>
                      </div>
                    </Form>
                  </td>
                </tr>
              </tbody>
            </table>
            <YQMReport data={YQMReportData} />
          </div>
              </div>
            </div>
          </div>
         
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Main