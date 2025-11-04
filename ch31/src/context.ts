// /src/context.ts
import { PrismaClient, Prisma } from './generated/prisma';
import { verifyAccessToken } from './modules/auth/auth.jwt';
import { RefreshTokenPayload, User } from './modules/auth/auth.dto';

const prisma = new PrismaClient({
  log: [{ emit: 'event', level: 'query' }],
});

// Prisma 쿼리 로깅 훅입니다. (개발/디버깅 용도)
// - e.params는 JSON 문자열입니다. 민감 정보가 포함될 수 있으니 운영에서는 비노출이 안전합니다.
prisma.$on('query', (e: Prisma.QueryEvent) => {
  console.log('[PRISMA] Query:', e.query);
  console.log('[PRISMA] Params:', e.params);
  console.log('[PRISMA] Duration(ms):', e.duration);
});

// 서비스 계층 전역 인스턴스입니다.
// - Prisma 싱글턴을 주입하여 재사용합니다.

import { AuthService } from './modules/auth/auth.service';
import { GraphQLError } from 'graphql';
const authService = new AuthService(prisma);

// GraphQL 리졸버에 전달할 컨텍스트 타입을 정의
// - services: 비즈니스 로직 계층
export interface GraphQLContext {
  services: {
    authService: AuthService;
  };
  user: User | null; // 로그인한 사용자 정보 또는 null
}

// 요청당 컨텍스트를 생성합니다.
// - 테스트에서 유연하게 주입할 수 있도록 services는 전역 인스턴스를 사용합니다.
export const createContext = async (req: Request): Promise<GraphQLContext> => {
  // 1. HTTP 요청 헤더에서 'authorization' 값을 가져옵니다. 값이 없으면 빈 문자열('')을 사용합니다.
  const authHeader = req.headers.get('authorization') || '';

  // 2. Authorization 헤더에서 토큰을 추출합니다.
  //    - 헤더가 'Bearer '로 시작하는지 확인합니다.
  //    - 시작한다면, 공백으로 문자열을 분리하여 두 번째 요소(토큰 자체)를 가져옵니다.
  //    - 시작하지 않거나 토큰이 없으면 null을 할당합니다.
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  // 3. 데이터베이스에서 찾은 사용자 정보를 저장할 변수를 null로 초기화합니다.
  let user = null;

  // 4. 추출된 JWT 토큰이 존재하는 경우에만 사용자 인증 로직을 실행합니다.
  if (token) {
    // 5. 토큰 검증 함수를 호출하여 토큰의 페이로드(Payload)를 가져옵니다.
    //    이 함수는 토큰의 유효성(서명, 만료 기간 등)을 확인합니다.
    const payload = verifyAccessToken(token);

    // 6. 페이로드가 유효하게 검증된 경우(토큰이 유효한 경우)에만 사용자 정보를 조회합니다.
    if (payload) {
      // 7. Prisma를 사용하여 페이로드에 있는 이메일 정보로 데이터베이스에서 사용자(User)를 찾습니다.
      user = await prisma.user.findUnique({
        where: { email: (payload as RefreshTokenPayload).email },
      });
    }

    if (!user) {
      throw new GraphQLError('인증 대상 사용자를 찾을 수 없습니다.', {
        extensions: { code: 'INVALID_USER' },
      });
    }
  }

  // 8. 최종적으로 GraphQL Context 객체를 구성하여 반환합니다.
  return {
    services: {
      authService,
    },
    user,
  };
};
