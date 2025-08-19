// src/lib/prisma.ts
// ------------------------------------------------------------
// Prisma Client 인스턴스를 싱글톤(Singleton)으로 생성하는 모듈
// ------------------------------------------------------------
// - PrismaClient는 DB 연결을 관리하는 객체로, 애플리케이션 전역에서
//   하나의 인스턴스만 생성하는 것이 권장됩니다.
// - 매 요청마다 new PrismaClient()를 호출하면 불필요한 커넥션이
//   계속 생겨 성능 저하 및 'Too many connections' 오류를 유발할 수 있습니다.
// - 이 파일에서 한 번만 생성 후 export하여, 모든 서비스/리졸버에서 재사용합니다.
// ------------------------------------------------------------

// Prisma Client 불러오기
// generator output이 "./generated/prisma"로 설정되어 있어
// 기본 '@prisma/client'가 아닌 해당 경로에서 import 합니다.
import { PrismaClient } from '../generated/prisma';

// Prisma Client 인스턴스 생성
const prisma = new PrismaClient();

// 애플리케이션 전역에서 재사용할 수 있도록 export
export default prisma;
