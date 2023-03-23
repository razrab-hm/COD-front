import React, { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import Card from 'react-bootstrap/Card';
import useModalControls from '../../hooks/modal-controls';
import ENUMS from '../../constants/appEnums';
import {
  YQReport,
  YDMQReport,
  YQMReport,
  QMQReport,
  QDMReport,
  MonthReport,
  Modal,
  AccordionItem,
} from '..';
import styles from './AccordionItem/AccordionItem.module.css';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import { Button } from 'react-bootstrap';

function ReportSelect({ dates, selectedCompanies }) {
  const modalControlsYQ = useModalControls();
  const modalControlsYQM = useModalControls();
  const modalControlsYDMQ = useModalControls();
  const modalControlsQM = useModalControls();
  const modalControlsQDM = useModalControls();
  const modalControlsMD = useModalControls();

  const [YQReportData, setYQReportData] = useState([]);
  const [YQMReportData, setYQMReportData] = useState([]);
  const [YDMQReportData, setYDMQReportData] = useState([]);
  const [QMReportData, setQMReportData] = useState([]);
  const [QDMReportData, setQDMReportData] = useState([]);
  const [MDReportData, setMDReportData] = useState([]);

  const [showToaster, setShowToaster] = useState(false);

  function CustomToggle({ children, eventKey }) {
    const decoratedOnClick = useAccordionButton(eventKey);
    return (
      <button
        type="button"
        style={{
          padding: '0.05rem 0.1rem 0.05rem 0.1rem',
          fontSize: '0.875rem',
          borderRadius: '0 0.2rem 0.2rem 0',
          float: 'right',
          backgroundColor: '#321fdb',
        }}
        className="btn btn-primary"
        onClick={decoratedOnClick}
      >
        {children}
      </button>
    );
  }

  return (
    <Accordion>
      <Card style={{ backgroundColor: '#dcdfe3', border: 'none' }}>
        <Card.Header style={{ padding: 0, border: 'none' }}>
          <CustomToggle eventKey="0">SELECT REPORT</CustomToggle>
        </Card.Header>
        <Accordion.Collapse eventKey="0">
          <Accordion>
            {/* 1 */}
            <Accordion.Item eventKey="0" style={styles.accordion_item}>
              <AccordionItem
                setShowToaster={() => setShowToaster(true)}
                dates={dates}
                url={ENUMS.API_ROUTES.YEAR_QUARTER}
                header={'Year by quarter'}
                setData={setYQReportData}
                modalControls={modalControlsYQ}
                selectedCompanies={selectedCompanies}
              />
              <Modal
                header={`Year by Quarter Report ${YQReportData?.year || ''}`}
                isOpen={modalControlsYQ.isModalOpen}
                close={modalControlsYQ.close}
              >
                <YQReport data={YQReportData} />
              </Modal>
            </Accordion.Item>
            {/* 2 */}
            <Accordion.Item eventKey="1" style={styles.accordion_item}>
              <AccordionItem
                setShowToaster={() => setShowToaster(true)}
                dates={dates}
                url={ENUMS.API_ROUTES.YEAR_QUARTER_MONTH}
                header={'Year by months/quarters'}
                setData={setYQMReportData}
                modalControls={modalControlsYQM}
                selectedCompanies={selectedCompanies}
              />
              <Modal
                header={`Year by months/quarters ${YQMReportData?.year || ''}`}
                isOpen={modalControlsYQM.isModalOpen}
                close={modalControlsYQM.close}
                selectedCompanies={selectedCompanies}
              >
                <YQMReport modal data={YQMReportData} />
              </Modal>
            </Accordion.Item>
            {/* 3 */}
            <Accordion.Item eventKey="2" style={styles.accordion_item}>
              <AccordionItem
                setShowToaster={() => setShowToaster(true)}
                dates={dates}
                url={ENUMS.API_ROUTES.YEAR_QUARTER_MONTH_DAY}
                header={`Year by day/months/quarters`}
                setData={setYDMQReportData}
                modalControls={modalControlsYDMQ}
                selectedCompanies={selectedCompanies}
              />
              <Modal
                header={`Year by day/months/quarters ${
                  YDMQReportData?.year || ''
                }`}
                isOpen={modalControlsYDMQ.isModalOpen}
                close={modalControlsYDMQ.close}
              >
                <YDMQReport data={YDMQReportData} />
              </Modal>
            </Accordion.Item>
            {/* 4 */}
            <Accordion.Item eventKey="3" style={styles.accordion_item}>
              <AccordionItem
                setShowToaster={() => setShowToaster(true)}
                quarterly
                dates={dates}
                url={ENUMS.API_ROUTES.QUARTER_MONTH}
                header={'Quarterly by months/quarters'}
                setData={setQMReportData}
                modalControls={modalControlsQM}
                selectedCompanies={selectedCompanies}
              />
              <Modal
                header={`Quarterly by months/quarters - ${
                  QMReportData?.quarter || ''
                } ${QMReportData?.quarter ? 'quarter' : ''} ${
                  QMReportData.year || ''
                } (${
                  QMReportData?.quarter
                    ? ENUMS.QUARTERS[QMReportData?.quarter]
                    : ''
                })`}
                isOpen={modalControlsQM.isModalOpen}
                close={modalControlsQM.close}
              >
                <QMQReport data={QMReportData} />
              </Modal>
            </Accordion.Item>
            {/* 5 */}
            <Accordion.Item eventKey="4" style={styles.accordion_item}>
              <AccordionItem
                setShowToaster={() => setShowToaster(true)}
                quarterly
                dates={dates}
                url={ENUMS.API_ROUTES.QUARTE_MONTH_DAY}
                header={'Quarterly by days/months'}
                setData={setQDMReportData}
                modalControls={modalControlsQDM}
                selectedCompanies={selectedCompanies}
              />
              <Modal
                header={`Quarter by Day Report - ${
                  QDMReportData?.quarter || ''
                } ${QDMReportData?.quarter ? 'quarter' : ''} ${
                  QDMReportData?.year || ''
                } (${
                  QDMReportData?.quarter
                    ? ENUMS.QUARTERS[QDMReportData?.quarter]
                    : ''
                })`}
                isOpen={modalControlsQDM.isModalOpen}
                close={modalControlsQDM.close}
              >
                <QDMReport data={QDMReportData} />
              </Modal>
            </Accordion.Item>
            {/* 6 */}
            <Accordion.Item eventKey="5" style={styles.accordion_item}>
              <AccordionItem
                setShowToaster={() => setShowToaster(true)}
                monthly
                dates={dates}
                url={ENUMS.API_ROUTES.MONTH_DAY}
                header={'Month by Day'}
                setData={setMDReportData}
                modalControls={modalControlsMD}
                selectedCompanies={selectedCompanies}
              />
              <Modal
                header={`Month by Day Report ${MDReportData?.year || ''}`}
                isOpen={modalControlsMD.isModalOpen}
                close={modalControlsMD.close}
              >
                <MonthReport modal data={MDReportData} />
              </Modal>
            </Accordion.Item>
          </Accordion>
        </Accordion.Collapse>
      </Card>
      <Row>
        <Col xs={6}>
          <ToastContainer position="middle-center" className="p-3">
            <Toast
              style={{ width: 500, height: 150 }}
              onClose={() => setShowToaster(false)}
              show={showToaster}
              delay={5000}
              autohide
            >
              <Toast.Header>Download file</Toast.Header>
              <Toast.Body style={ENUMS.TOASTER.FAIL_STYLE}>
                <strong className="me-auto">
                  Sorry, there is no data to download.
                </strong>
                <Button
                  style={{ position: 'absolute', right: 30, bottom: 30 }}
                  variant="secondary"
                  onClick={() => setShowToaster(false)}
                >
                  Close
                </Button>
              </Toast.Body>
            </Toast>
          </ToastContainer>
        </Col>
      </Row>
    </Accordion>
  );
}

export default ReportSelect;
