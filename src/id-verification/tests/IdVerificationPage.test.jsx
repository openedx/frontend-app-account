/* eslint-disable react/jsx-no-useless-fragment */
import React from 'react';
import { MemoryRouter as Router } from 'react-router-dom';
import {
  render, act, screen, fireEvent,
} from '@testing-library/react';
import { IntlProvider } from '@openedx/frontend-base';
import IdVerificationPageSlot from '../../slots/IdVerificationPageSlot';

jest.mock('../IdVerificationContextProvider', () => jest.fn(({ children }) => children));
jest.mock('../VerifiedNameContext', () => {
  const originalModule = jest.requireActual('../VerifiedNameContext');
  return {
    ...originalModule,
    VerifiedNameContextProvider: jest.fn(({ children }) => children),
  };
});
jest.mock('../panels/ReviewRequirementsPanel', () => function ReviewRequirementsPanelMock() {
  return <></>;
});
jest.mock('../panels/RequestCameraAccessPanel', () => function RequestCameraAccessPanelMock() {
  return <></>;
});
jest.mock('../panels/PortraitPhotoContextPanel', () => function PortraitPhotoContextPanelMock() {
  return <></>;
});
jest.mock('../panels/TakePortraitPhotoPanel', () => function TakePortraitPhotoPanelMock() {
  return <></>;
});
jest.mock('../panels/IdContextPanel', () => function IdContextPanelMock() {
  return <></>;
});
jest.mock('../panels/GetNameIdPanel', () => function GetNameIdPanelMock() {
  return <></>;
});
jest.mock('../panels/TakeIdPhotoPanel', () => function TakeIdPhotoPanelMock() {
  return <></>;
});
jest.mock('../panels/SummaryPanel', () => function SummaryPanelMock() {
  return <></>;
});
jest.mock('../panels/SubmittedPanel', () => function SubmittedPanelMock() {
  return <></>;
});

describe('IdVerificationPage', () => {
  jest.spyOn(Storage.prototype, 'setItem');

  it('decodes and stores course_id', async () => {
    await act(async () => render((
      <Router initialEntries={[`/?course_id=${encodeURIComponent('course-v1:edX+DemoX+Demo_Course')}`]}>
        <IntlProvider locale="en">
          <IdVerificationPageSlot />
        </IntlProvider>
      </Router>
    )));
    expect(sessionStorage.setItem).toHaveBeenCalledWith(
      'courseId',
      'course-v1:edX+DemoX+Demo_Course',
    );
  });

  it('stores `next` value', async () => {
    await act(async () => render((
      <Router initialEntries={['/?next=dashboard']}>
        <IntlProvider locale="en">
          <IdVerificationPageSlot />
        </IntlProvider>
      </Router>
    )));
    expect(sessionStorage.setItem).toHaveBeenCalledWith(
      'next',
      'dashboard',
    );
  });
  it('shows modal on click of button', async () => {
    await act(async () => render((
      <Router initialEntries={['/?next=dashboard']}>
        <IntlProvider locale="en">
          <IdVerificationPageSlot  />
        </IntlProvider>
      </Router>
    )));
    expect(screen.getByText('Privacy Information')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Privacy Information'));
    expect(screen.getByTestId('Id-modal')).toBeInTheDocument();
  });
  it('shows modal on click of button', async () => {
    await act(async () => render((
      <Router initialEntries={['/?next=dashboard']}>
        <IntlProvider locale="en">
          <IdVerificationPageSlot />
        </IntlProvider>
      </Router>
    )));
    expect(screen.getByText('Privacy Information')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Privacy Information'));
    expect(screen.getByTestId('Id-modal')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Close'));
  });
});
