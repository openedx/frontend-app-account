import React from 'react';
import renderer from 'react-test-renderer';
import { IntlProvider } from '@openedx/frontend-base';
import { render, screen } from '@testing-library/react';

jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: jest.fn(node => node), // Mock portal behavior
}));

import BeforeProceedingBanner from './BeforeProceedingBanner'; // eslint-disable-line import/first


describe('BeforeProceedingBanner', () => {
  const renderComponent = (props = {}) => {
    const defaultProps = {
      instructionMessageId: 'account.settings.delete.account.please.unlink',
      supportArticleUrl: '',
      ...props,
    };

    return render(
      <IntlProvider locale="en">
        <BeforeProceedingBanner {...defaultProps} />
      </IntlProvider>
    );
  };

  it('should render banner without support link when supportArticleUrl is empty', () => {
    renderComponent({ supportArticleUrl: '' });
    
    // Check that the component renders
    expect(screen.getByText(/unlink/i)).toBeInTheDocument();
    
    // Verify no support link is present
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('should render banner with support link when supportArticleUrl is provided', () => {
    const supportUrl = 'http://test-support.edx';
    renderComponent({ supportArticleUrl: supportUrl });
    
    // Check that the component renders
    expect(screen.getByText(/unlink/i)).toBeInTheDocument();
    
    // Verify support link is present and has correct URL
    const supportLink = screen.getByRole('link');
    expect(supportLink).toBeInTheDocument();
    expect(supportLink).toHaveAttribute('href', supportUrl);
  });

  it('should display instruction message based on instructionMessageId', () => {
    renderComponent({
      instructionMessageId: 'account.settings.delete.account.please.unlink',
    });
    
    // Verify the component renders with the instruction message
    expect(screen.getByText(/unlink/i)).toBeInTheDocument();
  });

  it('should have proper structure when no support URL is provided', () => {
    const { container } = renderComponent({ supportArticleUrl: '' });
    
    // Check that container has content
    expect(container.firstChild).toBeInTheDocument();
    
    // Ensure no links are rendered
    expect(container.querySelectorAll('a')).toHaveLength(0);
  });

  it('should have proper structure when support URL is provided', () => {
    const { container } = renderComponent({ 
      supportArticleUrl: 'http://test-support.edx' 
    });
    
    // Check that container has content
    expect(container.firstChild).toBeInTheDocument();
    
    // Ensure exactly one link is rendered
    expect(container.querySelectorAll('a')).toHaveLength(1);
  });
});