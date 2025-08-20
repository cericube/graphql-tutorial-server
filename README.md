# 🛠️ TypeScript 프로젝트 구성 가이드

TypeScript 프로젝트를 모듈 단위(chapter 구조)로 관리하고, 빌드, 실행, Prisma ORM까지 다루는 실전 구성 가이드입니다.

---

## 📁 프로젝트 구조 예시

```
my-typescript-project/
├── tsconfig.base.json
├── package.json
├── ch04/
│   ├── src/
│   │   └── index.ts
│   ├── dist/
│   ├── package.json
│   └── tsconfig.json
```

- 루트: 공통 설정(`tsconfig.base.json`), 공통 의존성(`package.json`)
- 하위(ch04): 소스(`src`), 빌드 결과(`dist`), 개별 설정(`package.json`, `tsconfig.json`)

---

## 1. 실행 및 빌드

### 루트에서 실행

```bash
# ch04/src 실행 (ts-node)
npx ts-node ch04/src/index.ts

# ch04 빌드
npx tsc -p ch04

# 빌드 결과 실행
node ch04/dist/index.js
```

### ch04 폴더에서 실행

```bash
cd ch04

# 개발 중 즉시 실행
npx ts-node src/index.ts

# 빌드
npx tsc

# 빌드 결과 실행
node dist/index.js
```

---

## 2. tsconfig.json 설정

### 루트 tsconfig.base.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true
  }
}
```

### 하위(ch04) tsconfig.json

```json
{
  "extends": "../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*.ts"]
}
```

---

## 3. package.json 구성

### 루트 package.json

```json
{
  "name": "my-typescript-project",
  "private": true,
  "scripts": {
    "lint": "eslint 'ch04/src/**/*.ts' --fix"
  },
  "devDependencies": {
    "typescript": "^5.4.0",
    "ts-node": "^10.9.2",
    "eslint": "^8.57.0",
    "@typescript-eslint/parser": "^6.9.0",
    "@typescript-eslint/eslint-plugin": "^6.9.0"
  }
}
```

### 하위(ch04) package.json

```json
{
  "name": "chapter04",
  "private": true,
  "scripts": {
    "dev": "ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "lodash": "^4.17.21"
  }
}
```

---

## 4. ESLint 설정

```bash
# 설치 (루트에서)
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin

# 실행 (루트에서 ch04 소스 검사)
npx eslint "ch04/src/**/*.ts" --fix
```

---

## 5. 설치 방식

- 전역(-g) 설치 대신 **프로젝트별 로컬 설치** 권장 → 버전 충돌 방지

---

## 6. 추천 워크플로우

### 루트에서 (단발성 실행 및 코드 검사)

```bash
# ch04/src 단발성 실행
npx ts-node ch04/src/index.ts

# 코드 검사
npm run lint
```

### ch04 내부에서

```bash
npm run dev     # 개발/테스트
npm run build   # 빌드
npm start       # 빌드 결과 실행
```

---

## 7. Prisma 명령어

### 7.1 프로젝트 초기화

```bash
npx prisma init
```

- `prisma/schema.prisma` 파일 생성
- `.env` 환경 변수 파일 생성

```
📁 prisma/
└── schema.prisma
.env
```

---

### 7.2 마이그레이션 반영

```bash
npx prisma migrate dev --name init
```

- Prisma 모델 구조를 실제 DB에 반영 (테이블 생성 등)
- 마이그레이션 파일 + Prisma Client 자동 생성

예시:

```
📁 prisma/
└── migrations/
    ├── 20250817_init/
    │   └── migration.sql
    ├── 20250819_add-user-status/
    │   └── migration.sql
```

| 변경 내용                          | 추천 이름 (`--name`)   |
| ---------------------------------- | ---------------------- |
| User 모델에 status 필드 추가       | `add-user-status`      |
| Post 모델에 published 추가         | `add-published-flag`   |
| Comment 모델 삭제                  | `remove-comment-model` |
| User.email 필드를 optional로 변경  | `make-email-optional`  |

---

### 7.3 Prisma Client 코드 생성

```bash
npx prisma generate
```

- `schema.prisma`를 기반으로 `@prisma/client` 코드 자동 생성

생성 위치:

```
📁 node_modules/@prisma/client/
├── index.d.ts
├── PrismaClient.js
└── runtime/
```

사용 예시:

```ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
```

---

## ✅ 정리

- `tsconfig.base.json`으로 공통 설정 유지
- chapter 단위로 분리 개발 가능 (`ch04`, `ch05` 등)
- Prisma ORM은 `migrate`, `generate` 흐름만 익히면 간단
- ESLint로 일관된 코드 품질 유지 가능
- `ts-node`로 빠른 실행, `tsc`로 명확한 빌드 분리

