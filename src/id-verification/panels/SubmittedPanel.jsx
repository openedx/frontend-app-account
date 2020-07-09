import React, { useState, useEffect } from 'react';
import { getConfig } from '@edx/frontend-platform';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import BasePanel from './BasePanel';

import messages from '../IdVerification.messages';

function Survey() {
  useEffect(() => {
    const widget = document.createElement('script');
    widget.src = 'https://widget.surveymonkey.com/collect/website/js/tRaiETqnLgj758hTBazgd_2BNHLyIwmuFE7cezwkskiizA4JjaHjQx10Eruz64ZqW8.js';
    document.body.appendChild(widget);
  }, []);

  return <div id="smcx-sdk" />;
}

function SubmittedPanel(props) {
  const [returnUrl, setReturnUrl] = useState('dashboard');
  const [returnText, setReturnText] = useState('id.verification.return.dashboard');
  const panelSlug = 'submitted';

  // If the user accessed IDV through a course,
  // link back to that course rather than the dashboard
  useEffect(() => {
    if (sessionStorage.getItem('courseRunKey')) {
      setReturnUrl(`courses/${sessionStorage.getItem('courseRunKey')}`);
      setReturnText('id.verification.return.course');
    }
  }, []);

  return (
    <BasePanel
      name={panelSlug}
      title={props.intl.formatMessage(messages['id.verification.submitted.title'])}
    >
      <p>
        {props.intl.formatMessage(messages['id.verification.submitted.text'])}
      </p>
      <a className="btn btn-primary" href={`${getConfig().LMS_BASE_URL}/${returnUrl}`} style={{ marginBottom: 50 }}>
        {props.intl.formatMessage(messages[returnText])}
      </a>
      <Survey />
    </BasePanel>
  );
}

SubmittedPanel.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(SubmittedPanel);
