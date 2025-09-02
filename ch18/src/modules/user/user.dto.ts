// /src/modules/user/user.dto.ts

import { z } from 'zod';

export const userIdSchema = z.object({
  id: z.number().int().positive({
    error: '유효한 사용자 ID여야 합니다.',
  }),
});

export type UserIdInput = z.infer<typeof userIdSchema>;
