import { z } from 'zod';

export const createCommentSchema = z.object({
  postId: z.number().int().positive({ error: '유효한 글 ID가 필요합니다.' }),
  authorId: z.number().int().positive({ error: '유효한 작성자 ID가 필요합니다.' }),
  content: z.string().min(1, { error: '내용은 필수 입력 항목입니다.' }),
});

export const updateCommentSchema = z.object({
  content: z.string().min(1, { error: '내용은 필수 입력 항목입니다.' }),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
