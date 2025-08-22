import { useIntl } from '@openedx/frontend-base';
import {
  ActionRow,
  Button,
  Form,
  ModalDialog,
  StatefulButton,
  useToggle,
} from '@openedx/paragon';
import { useCallback, useEffect, useState } from 'react';
import { YEAR_OF_BIRTH_OPTIONS } from './data/constants';
import { useDOBMutation } from './hooks';
import messages from './messages';

const DOBModal = () => {
  const intl = useIntl();
  const { mutateDOB, isPending, isSuccess, isError, error, reset } = useDOBMutation();

  const [isOpen, open, close] = useToggle(true, {});
  const [monthValue, setMonthValue] = useState('');
  const [yearValue, setYearValue] = useState('');

  const handleChange = (e) => {
    e.preventDefault();

    if (e.target.name === 'month') {
      setMonthValue(e.target.value);
    } else if (e.target.name === 'year') {
      setYearValue(e.target.value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutateDOB(monthValue, yearValue);
  };

  const handleComplete = useCallback(() => {
    close();
    reset();
  }, [close, reset]);

  const handleClose = useCallback(() => {
    close();
    reset();
  }, [close, reset]);

  function renderErrors() {
    if (isError && error) {
      return (
        <Form.Control.Feedback type="invalid" key="general-error">
          {intl.formatMessage(messages['account.settingsfield.dob.error.general'])}
        </Form.Control.Feedback>
      );
    }
    return null;
  }

  useEffect(() => {
    if (isSuccess && isOpen) {
      handleComplete();
    }
  }, [handleComplete, isSuccess, isOpen]);

  return (
    <>
      <Button variant="primary" onClick={open}>
        {intl.formatMessage(messages['account.settings.field.dob.form.button'])}
      </Button>
      <ModalDialog
        title={intl.formatMessage(messages['account.settings.field.dob.form.title'])}
        isOpen={isOpen}
        onClose={handleClose}
        hasCloseButton={false}
        variant="default"
        isOverflowVisible
      >
        <form onSubmit={handleSubmit}>

          <ModalDialog.Header>
            <ModalDialog.Title>
              {intl.formatMessage(messages['account.settings.field.dob.form.title'])}
            </ModalDialog.Title>
          </ModalDialog.Header>

          <ModalDialog.Body className="overflow-hidden" style={{ padding: '1.5rem' }}>
            <p>{intl.formatMessage(messages['account.settings.field.dob.form.help.text'])}</p>
            <Form.Group>
              <Form.Label>
                {intl.formatMessage(messages['account.settings.field.dob.month'])}
              </Form.Label>
              <Form.Control
                as="select"
                name="month"
                onChange={handleChange}
              >
                <option value="">{intl.formatMessage(messages['account.settings.field.dob.month.default'])}</option>
                {[...Array(12).keys()].map(month => (
                  <option key={month + 1} value={month + 1}>{month + 1}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>
                {intl.formatMessage(messages['account.settings.field.dob.year'])}
              </Form.Label>
              <Form.Control
                as="select"
                name="year"
                onChange={handleChange}
              >
                <option value="">{intl.formatMessage(messages['account.settings.field.dob.year.default'])}</option>
                {YEAR_OF_BIRTH_OPTIONS.map(year => (
                  <option key={year.value} value={year.value}>{year.label}</option>
                ))}
              </Form.Control>
            </Form.Group>
            {renderErrors()}
          </ModalDialog.Body>

          <ModalDialog.Footer>
            <ActionRow>
              <ModalDialog.CloseButton variant="tertiary">
                Cancel
              </ModalDialog.CloseButton>
              <StatefulButton
                type="submit"
                state={!(monthValue && yearValue) ? 'unedited' : isPending ? 'pending' : 'default'}
                labels={{
                  default: intl.formatMessage(messages['account.settings.editable.field.action.save']),
                }}
                disabledStates={['unedited', 'pending']}
              />
            </ActionRow>
          </ModalDialog.Footer>

        </form>
      </ModalDialog>
    </>
  );
};

export default DOBModal;
