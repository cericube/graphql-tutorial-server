import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string().min(1, { error: '제목은 필수 입력 항목입니다.' }),
  content: z.string().min(1, { error: '내용은 필수 입력 항목입니다.' }),
  authorId: z.number().int().positive({ error: '유효한 작성자 ID가 필요합니다.' }),
});

export const updatePostSchema = z.object({
  title: z.string().min(1, { error: '제목은 최소 1자 이상이어야 합니다.' }).optional(),
  content: z.string().min(1, { error: '내용은 최소 1자 이상이어야 합니다.' }).optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
