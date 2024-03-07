import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Icon, OverlayTrigger, Tooltip, Dropdown, ModalPopup, Button, useToggle,
} from '@openedx/paragon';
import { InfoOutline, ExpandLess, ExpandMore } from '@openedx/paragon/icons';
import messages from './messages';
import ToggleSwitch from './ToggleSwitch';
import {
  selectPreference,
  selectPreferenceNonEditableChannels,
  selectSelectedCourseId,
  selectUpdatePreferencesStatus,
} from './data/selectors';
import NOTIFICATION_CHANNELS from './data/constants';
import { updatePreferenceToggle } from './data/thunks';
import { LOADING_STATUS } from '../constants';

const NotificationPreferenceRow = ({ appId, preferenceName }) => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const courseId = useSelector(selectSelectedCourseId());
  const preference = useSelector(selectPreference(appId, preferenceName));
  const nonEditable = useSelector(selectPreferenceNonEditableChannels(appId, preferenceName));
  const updatePreferencesStatus = useSelector(selectUpdatePreferencesStatus());
  const [isOpen, open, close] = useToggle(false);
  const [target, setTarget] = useState(null);

  const onToggle = useCallback((event) => {
    const {
      checked,
      name: notificationChannel,
    } = event.target;
    dispatch(updatePreferenceToggle(
      courseId,
      appId,
      preferenceName,
      notificationChannel,
      checked,
    ));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appId, preferenceName]);

  const tooltipId = `${preferenceName}-tooltip`;
  return (
    <div className="d-flex mb-3.5 height-28px" data-testid="notification-preference">
      <div className="d-flex align-items-center col-5 px-0">
        {intl.formatMessage(messages.notificationTitle, { text: preferenceName })}
        {preference.info !== '' && (
          <OverlayTrigger
            id={tooltipId}
            className="d-inline"
            placement="right"
            overlay={(
              <Tooltip id={tooltipId}>
                {preference.info}
              </Tooltip>
            )}
          >
            <span className="ml-2">
              <Icon src={InfoOutline} />
            </span>
          </OverlayTrigger>
        )}
      </div>
      <div className="d-flex flex-row  align-items-center">
        {NOTIFICATION_CHANNELS.map((channel) => (
          <div
            id={`${preferenceName}-${channel}`}
            className={classNames(
              'd-flex',
              { 'pl-4.5 mt-2': channel === 'email' },
              { 'px-4.5 mt-2': channel !== 'email' },
            )}
          >
            <span className={classNames({ 'margin-left-7px': channel === 'push' })}>
              <ToggleSwitch
                name={channel}
                value={preference[channel]}
                onChange={onToggle}
                disabled={nonEditable.includes(channel) || updatePreferencesStatus === LOADING_STATUS}
                id={`${preferenceName}-${channel}`}
              />
            </span>

            {channel === 'email' && (
              <>
                <div className="ml-3.5">
                  <Button
                  // alt={intl.formatMessage(messages.actionsAlt)}
                    ref={setTarget}
                    variant="outline-primary"
                    onClick={open}
                    size="sm"
                    iconAfter={isOpen ? ExpandLess : ExpandMore}
                    className="border-light-300 text-primary-500 font-weight-500 justify-content-between "
                    style={{
                      width: '134px',
                      marginTop: '-0.8rem',
                    }}
                  >
                    Daily
                  </Button>
                </div>
                <div className="actions-dropdown">
                  <ModalPopup
                    onClose={close}
                    positionRef={target}
                    isOpen={isOpen}
                  >
                    <div
                      className="bg-white p-1 shadow d-flex flex-column"
                      data-testid="comment-sort-dropdown-modal-popup"
                    >
                      <Dropdown.Item
                        className="d-flex justify-content-start py-1.5 mb-1"
                        as={Button}
                        variant="tertiary"
                        size="inline"
                        onClick={() => console.log('click')}
                      >
                        daily
                      </Dropdown.Item>
                      <Dropdown.Item
                        className="d-flex justify-content-start py-1.5"
                        as={Button}
                        variant="tertiary"
                        size="inline"
                        onClick={() => console.log('click')}
                      >
                        weekly
                      </Dropdown.Item>
                      <Dropdown.Item
                        className="d-flex justify-content-start py-1.5"
                        as={Button}
                        variant="tertiary"
                        size="inline"
                        onClick={() => console.log('click')}
                      >
                        Imidiately
                      </Dropdown.Item>
                    </div>
                  </ModalPopup>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

NotificationPreferenceRow.propTypes = {
  appId: PropTypes.string.isRequired,
  preferenceName: PropTypes.string.isRequired,
};

export default React.memo(NotificationPreferenceRow);
