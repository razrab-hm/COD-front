import React from 'react';
import styles from './AsideMain.module.css';
import { Form } from 'react-bootstrap';
import { truncateWord } from '../../utils/projectUtils';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import { containsObject, arraysEqual } from '../../utils/projectUtils';


function AsideMain({showMenu, userCompanies, selectedCompanies, setSelectedCompanies, getInitialReports}) {

  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectAllBtn, setSelectAllBtn] = React.useState('Deselect all');

  const handleChange = ({ target: { value } }) => {
    setSearchTerm(value);
  };

    const switchCompany = (id) => {
        if(selectedCompanies.find(elem => elem.id === id)) {
          setSelectedCompanies(selectedCompanies.filter(elem => elem.id !== id))
        } else {
          setSelectedCompanies([...selectedCompanies, userCompanies.find(elem => elem.id === id)]) 
        }
      };
      
      const toogleFilterAll = () => {
        if (arraysEqual(userCompanies, selectedCompanies)) {
          setSelectedCompanies([]);
          setSelectAllBtn('Select all');
        } else {
          setSelectedCompanies(userCompanies);
          setSelectAllBtn('Deselect all');
        }
      };

      const renderTooltip = (elem) => (
        <Tooltip id="button-tooltip">
          {elem.title}
          {elem.inactive ? <span style={{marginLeft: 10, color: 'red'}}>Inactive</span> : ''}
        </Tooltip>
      );

  return (
    <div
      className={`col-auto p-0 bg-light ${
        showMenu ? styles.main_aside : styles.main_aside_hide
      }`}
    >
      <div className="d-flex flex-column text-center pt-2 text-black min-vh-100 ">
        <Form>
          <InputGroup
            style={{ width: 140, margin: '0 3px 0 4px' }}
            className="mb-3"
          >
            <Form.Control
              placeholder={`Company name`}
              onChange={handleChange}
            />
          </InputGroup>
        </Form>

        <Button variant="success" className={styles.aside_refresh_btn} onClick={() => getInitialReports()}>
          Refresh reports
          <img className={styles.refresh_icon} alt='refresh'></img>
          </Button>
        <Button
          onClick={() => toogleFilterAll()}
          className={styles.aside_filter_btn}
          variant="outline-primary"
        >
          {selectAllBtn}
        </Button>

        {userCompanies?.length > 0
          ? userCompanies
              .filter((elem) => elem?.title?.toLowerCase().includes(searchTerm))
              .map((elem, i) => (
                <OverlayTrigger
                  key={elem.title}
                  placement="right"
                  delay={{ show: 50, hide: 50 }}
                  overlay={renderTooltip(elem)}
                >
                  <div key={elem.id}>
                    <Form.Check
                      onChange={() => {
                        switchCompany(elem.id);
                        setSelectAllBtn('Select all');
                      }}
                      style={{ marginLeft: 10, textAlign: 'start' }}
                      type="checkbox"
                      label={`${truncateWord(elem?.title, 10)}`}
                      id={`${elem.title}`}
                      checked={containsObject(elem, selectedCompanies)}
                    />
                  </div>
                </OverlayTrigger>
              ))
          : ''}
      </div>
    </div>
  );
}

export default AsideMain