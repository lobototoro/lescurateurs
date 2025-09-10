import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import CreateArticleForm from '@/app/editor/components/formComponents/createArticles';
import * as articleActions from '@/app/articleActions';

// Mock the articleActions module
vi.mock('@/app/articleActions', () => ({
  createArticleAction: vi.fn(),
}));

// Mock useActionState hook
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    useActionState: vi.fn().mockImplementation((action, initialState) => {
      return [null, action, false];
    }),
    startTransition: vi.fn((callback) => callback()),
  };
});

describe('CreateArticleForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the form correctly', () => {
    render(<CreateArticleForm />);

    expect(screen.getByLabelText(/titre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/introduction/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Texte/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/lien audio principal/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/lien vers l'illustration/i)
    ).toBeInTheDocument();
    expect(screen.getByTestId('url-inputs-container')).toBeInTheDocument();
    expect(screen.getByTestId('final-submit')).toBeInTheDocument();
  });

  //   it('submits the form with correct data', async () => {
  //     const mockCreateAction = vi.fn();
  //     vi.spyOn(React, 'useActionState').mockReturnValue([
  //       null,
  //       mockCreateAction,
  //       false,
  //     ]);

  //     render(<CreateArticleForm />);

  //     // Fill in the form
  //     fireEvent.change(screen.getByLabelText(/titre/i), {
  //       target: { value: 'Test Title' },
  //     });
  //     fireEvent.change(screen.getByLabelText(/introduction/i), {
  //       target: {
  //         value:
  //           'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In interdum odio a tellus vehicula blandit. Etiam blandit pretium pellentesque. Ut porta elementum dolor faucibus tincidunt. Sed vel metus eu erat viverra interdum euismod vel urna. Aenean scelerisque purus auctor cursus congue. Integer dignissim a diam a sollicitudin. Morbi ut sapien sit amet erat volutpat pretium.',
  //       },
  //     });
  //     fireEvent.change(screen.getByLabelText(/Texte/i), {
  //       target: {
  //         value:
  //           'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In interdum odio a tellus vehicula blandit. Etiam blandit pretium pellentesque. Ut porta elementum dolor faucibus tincidunt. Sed vel metus eu erat viverra interdum euismod vel urna. Aenean scelerisque purus auctor cursus congue. Integer dignissim a diam a sollicitudin. Morbi ut sapien sit amet erat volutpat pretium.\n\nUt rutrum, erat vel volutpat condimentum, arcu enim commodo ligula, ac commodo nibh tellus porttitor purus. Integer bibendum nulla et volutpat commodo. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Curabitur luctus at lacus id posuere. Sed ante ipsum, sollicitudin nec eros nec, bibendum convallis tellus. In hac habitasse platea dictumst. Quisque in mauris lectus. Donec non blandit erat. Aliquam erat volutpat. Sed non metus id odio sagittis tempus.',
  //       },
  //     });
  //     fireEvent.change(screen.getByLabelText(/lien audio principal/i), {
  //       target: { value: 'https://example.com/audio' },
  //     });
  //     fireEvent.change(screen.getByLabelText(/lien vers l'illustration/i), {
  //       target: { value: 'https://example.com/image' },
  //     });

  //     // Submit the form
  //     fireEvent.click(screen.getByTestId('final-submit'));

  //     await waitFor(() => {
  //       expect(mockCreateAction).toHaveBeenCalled();
  //     });
  //   });

  //   it('shows notification when state is returned', async () => {
  //     vi.spyOn(React, 'useActionState').mockReturnValue([
  //       { message: true, text: 'Article created successfully' },
  //       vi.fn(),
  //       false,
  //     ]);

  //     render(<CreateArticleForm />);

  //     expect(
  //       screen.getByText(/article created successfully/i)
  //     ).toBeInTheDocument();
  //   });
});
