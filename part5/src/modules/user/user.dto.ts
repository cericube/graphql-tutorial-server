import { z } from 'zod';

export const createUserSchema = z.object({
  nickname: z
    .string()
    .min(2, { error: '닉네임은 최소 2자 이상이어야 합니다.' })
    .max(100, { error: '닉네임은 최대 100자 이하여야 합니다.' }),
  email: z.email({ error: '유효한 이메일 주소여야 합니다.' }),
});

export const updateUserSchema = z.object({
  nickname: z
    .string()
    .min(2, { error: '닉네임은 최소 2자 이상이어야 합니다.' })
    .max(100, { error: '닉네임은 최대 100자 이하여야 합니다.' })
    .optional(),
  email: z.email({ error: '유효한 이메일 주소여야 합니다.' }).optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
