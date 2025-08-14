import { render, screen } from '@testing-library/react';
import MockedSlot from './MockedSlot';

describe('MockedSlot', () => {
  it('renders mock plugin with "PluginSlot" text', () => {
    render(<MockedSlot id="test_plugin" />);

    const component = screen.getByText('PluginSlot_test_plugin');
    expect(component).toBeInTheDocument();
  });

  it('renders as the slot children directly if there is content within', () => {
    render(
      <div role="article">
        <MockedSlot id="test_plugin">
          <q role="note">How much wood could a woodchuck chuck if a woodchuck could chuck wood?</q>
        </MockedSlot>
      </div>,
    );

    const component = screen.getByRole('article');
    expect(component).toBeInTheDocument();
    const slot = component.querySelector('[data-testid="test_plugin"]');
    expect(slot).toBeInTheDocument();
    expect(slot).toHaveTextContent('PluginSlot_test_plugin');
    // Check if the quote is a direct child of the MockedSlot
    const quote = slot.querySelector('q');
    expect(quote).toBeInTheDocument();
    expect(quote).toHaveTextContent('How much wood could a woodchuck chuck if a woodchuck could chuck wood?');
    expect(quote.getAttribute('role')).toBe('note');
  });

  it('renders mock plugin with a data-testid ', () => {
    render(
      <MockedSlot id="guybrush">
        <q role="note">I am selling these fine leather jackets.</q>
      </MockedSlot>,
    );

    const component = screen.getByTestId('guybrush');
    expect(component).toBeInTheDocument();

    const quote = component.querySelector('[role=note]');
    expect(quote).toBeInTheDocument();
  });
});
