/* eslint-disable no-undef */
import { useEffect } from 'react';
import { logError } from '@edx/frontend-platform/logging';

export default function useFeedbackWrapper() {
  useEffect(() => {
    try {
      window.usabilla_live = lightningjs.require('usabilla_live', '//w.usabilla.com/2655de034958.js');
    } catch (err) {
      logError(err);
    }
  }, []);
}
