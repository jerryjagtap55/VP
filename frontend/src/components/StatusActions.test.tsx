import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { StatusActions } from './StatusActions.tsx';

describe('StatusActions', () => {
  it('offers only the allowed next statuses for a pending order', () => {
    render(
      <StatusActions
        currentStatus="Pending"
        isUpdating={false}
        onChangeStatus={() => {}}
      />,
    );

    expect(
      screen.getByRole('button', { name: 'Start processing' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Cancel order' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Mark as completed' }),
    ).not.toBeInTheDocument();
  });

  it('reports the chosen status when a button is clicked', async () => {
    const user = userEvent.setup();
    const onChangeStatus = vi.fn();
    render(
      <StatusActions
        currentStatus="Processing"
        isUpdating={false}
        onChangeStatus={onChangeStatus}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Mark as completed' }));

    expect(onChangeStatus).toHaveBeenCalledWith('Completed');
  });

  it('shows no actions for a completed order', () => {
    render(
      <StatusActions
        currentStatus="Completed"
        isUpdating={false}
        onChangeStatus={() => {}}
      />,
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(
      screen.getByText('Completed orders can no longer be changed.'),
    ).toBeInTheDocument();
  });

  it('disables the buttons while an update is in progress', () => {
    render(
      <StatusActions
        currentStatus="Pending"
        isUpdating
        onChangeStatus={() => {}}
      />,
    );

    for (const button of screen.getAllByRole('button')) {
      expect(button).toBeDisabled();
    }
  });
});
