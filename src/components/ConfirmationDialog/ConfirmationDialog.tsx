import React from 'react';
import styles from './ConfirmationDialog.module.css';

interface ConfirmationDialogProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className={styles.dialogOverlay}>
      <div className={styles.dialogContainer} role="dialog" aria-labelledby="dialog-title" aria-describedby="dialog-message">
        <h2 id="dialog-title" className={styles.dialogTitle}>{title}</h2>
        <p id="dialog-message" className={styles.dialogMessage}>{message}</p>
        <div className={styles.dialogActions}>
          <button 
            onClick={onCancel} 
            className={styles.cancelButton}
            aria-label="Cancel action"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            className={styles.confirmButton}
            aria-label="Confirm action"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ConfirmationDialog);