import { z } from 'zod';

/** 인증 인자: 이메일과 비밀번호 */
export const authArgsSchema = z.object({
  email: z.email({ error: '유효한 이메일 주소여야 합니다.' }),
  password: z.string().min(6, { error: '비밀번호는 최소 6자 이상이어야 합니다.' }),
});

/** 스키마로부터 타입 추론(스키마-타입 드리프트 방지) */
export type AuthArgs = z.infer<typeof authArgsSchema>;

/* 사용 팁
  - 안전 파싱: const r = authArgsSchema.safeParse(args)
  - 인자 생략 대응: authArgsSchema.parse(args ?? {})
*/

export type User = {
  id: number;
  email: string;
  name?: string | null;
};

export type AuthPayload = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

export type RefreshTokenPayload = {
  id: number;
  email: string;
  name?: string;
  iat: number;
  exp: number;
};
