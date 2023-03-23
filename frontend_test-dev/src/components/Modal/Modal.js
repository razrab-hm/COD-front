import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';
import { ModalOverlay } from '..';

const modalsElement = document.getElementById('modal');

function Modal({ isOpen = true, close, children, header }) {
  useEffect(() => {
    function closeByEscape(evt) {
      if (evt.key === 'Escape') {
        close();
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', closeByEscape);
      return () => {
        document.removeEventListener('keydown', closeByEscape);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return isOpen
    ? createPortal(
        <div className={styles.modal_root}>
          <ModalOverlay close={close} />
          <div className={`modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg modal-fullscreen-xl-down ${styles.modal_dialog}`}>
            <div className={styles.modal_content}>
              <div className={styles.modal_header}>
                <h5 className='modal-title'>
                  {header}
                </h5>
                <button onClick={() => close()} className="btn-close" type="button" data-coreui-dismiss="modal"></button>
              </div>
              <div className={styles.modal_body}>
                {children}
              </div>
              <div className={styles.modal_footer}>
                <button onClick={() => close()} type="button" className={`btn ${styles.modal_btn}`} data-coreui-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>,
        modalsElement
      )
    : null;
}

export default Modal;
