import { describe, it, expect, vi } from 'vitest';
import { redirect } from 'next/navigation';

import { deleteArticleAction } from '@/app/articleActions';
import { auth0 } from '@/lib/auth0';
import { deleteSlug, deleteArticle } from '@/lib/articles';

vi.mock('@/lib/auth0', () => ({
  auth0: {
    getSession: vi.fn(),
  },
}));

vi.mock('@/lib/articles', () => ({
  deleteSlug: vi.fn(),
  deleteArticle: vi.fn(),
}));

describe('deleteArticleAction', () => {
  it('should return an error message if the user is not logged in', async () => {
    // Mock the redirect function
    vi.mock('next/navigation', () => ({
      redirect: vi.fn(),
    }));
    const redirectSpy = vi.mocked({ redirect }).redirect;
    vi.mocked(auth0.getSession).mockResolvedValue(null);

    const formData = new FormData();
    formData.append('id', '1');

    await deleteArticleAction({}, formData);

    expect(redirectSpy).toHaveBeenCalledWith('/editor');
  });

  it('should delete the article and return a success message', async () => {
    vi.mocked(auth0.getSession).mockResolvedValue({
      user: { nickname: 'testUser', sub: 'd' },
    } as any);
    vi.mocked(deleteSlug).mockResolvedValue({
      lastInsertRowid: 1,
    });
    vi.mocked(deleteArticle).mockResolvedValue({
      lastInsertRowid: 1,
    });

    const formData = new FormData();
    formData.append('id', '1');

    const result = await deleteArticleAction({}, formData);

    expect(result).toEqual({
      message: true,
      text: "L'article a été supprimé avec succès",
    });
    expect(deleteSlug).toHaveBeenCalledWith(1);
    expect(deleteArticle).toHaveBeenCalledWith(1);
  });

  // it('should return an error message if deletion fails', async () => {
  //   vi.mocked(auth0.getSession).mockResolvedValue({
  //     user: { nickname: 'testUser', sub: 'dd' },
  //   } as any);
  //   vi.mocked(deleteSlug).mockRejectedValue({
  //     lastInsertRowid: 0,
  //   });
  //   vi.mocked(deleteArticle).mockRejectedValue({
  //     lastInsertRowid: 0,
  //   });

  //   const formData = new FormData();
  //   formData.append('id', '1');

  //   const result = await deleteArticleAction({}, formData);

  //   expect(result).toEqual({
  //     message: false,
  //     text: "une erreur s'est produite : contactez l'administrateur",
  //   });
  // });

  it('should return a generic error message if an exception occurs', async () => {
    vi.mocked(auth0.getSession).mockResolvedValue({
      user: { nickname: 'testUser', sub: 'dd' },
    } as any);
    vi.mocked(deleteSlug).mockRejectedValue(new Error('Test error'));
    vi.mocked(deleteArticle).mockResolvedValue({
      changes: 1,
      lastInsertRowid: 1,
    });

    const formData = new FormData();
    formData.append('id', '1');

    const result = await deleteArticleAction({}, formData);

    expect(result).toEqual({
      message: false,
      text: "une erreur s'est produite : contactez l'administrateur",
    });
  });
});
