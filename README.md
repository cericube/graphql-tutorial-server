# TypeScript 프로젝트 구성 가이드

## 📂 프로젝트 구조 예시
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
- **루트**: 공통 설정(`tsconfig.base.json`), 공통 의존성(`package.json`)
- **하위(ch04)**: 소스(`src`), 빌드 결과(`dist`), 개별 설정(`package.json`, `tsconfig.json`)

---

## 1. 실행 및 빌드

### 📌 루트에서 실행
```bash
# ch04/src 실행 (ts-node)
npx ts-node ch04/src/index.ts

# ch04 빌드
npx tsc -p ch04

# 빌드 결과 실행
node ch04/dist/index.js
```

### 📌 ch04 폴더에서 실행
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

**루트 tsconfig.base.json**
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

**하위(ch04) tsconfig.json**
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

**루트 package.json**
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

**하위(ch04) package.json**
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



## 7. Prisma 명령어

### 프로젝트 초기화 (npx prisma init)
```bash
# 프로젝트 초기화 /ch10
npx prisma init

- npx prisma init 명령은 Prisma ORM을 처음 프로젝트에 설정할 때 사용하는 초기화 명령어입니다.
- npx prisma init 명령은 기본적으로 다음 두 작업을 수행합니다:
 * prisma/schema.prisma 파일 생성
 * .env 파일 생성

├── prisma/
│   └── schema.prisma      # Prisma 모델 정의 파일
└── .env                   # 환경 변수 파일 (DATABASE_URL 등)

```

### 마이그레이션으로 DB 반영(npx prisma migrate dev --name init)
```bash
npx prisma migrate dev --name init

 - Prisma 스키마 파일(schema.prisma)에 정의된 모델 구조를 실제 데이터베이스에 반영하여, 
 - 테이블/컬럼 등을 생성하거나 변경하는 작업을 수행하는 것
 - 이 명령을 실행하면 다음 작업이 자동으로 수행됩니다:
1. 마이그레이션 파일 생성:  prisma/migrations/2025xxxxx_init/migration.sql
2. SQL 실행 : 정의된 모델대로 실제 데이터베이스에 테이블 생성
3. Prisma Client 재생성 : 모델 구조에 맞는 타입/클래스 자동 생성
---------------------------------------------------------------
| 변경 내용                          | 추천 이름 (`--name`)   |
| ---------------------------------- | ---------------------- |
| User 모델에 status 필드 추가       | `add-user-status`      |
| Post 모델에 published 추가         | `add-published-flag`   |
| Comment 모델 삭제                  | `remove-comment-model` |
| User.email 필드를 optional로 변경  | `make-email-optional`  |

Prisma는 각 마이그레이션 실행 시마다 다음과 같은 형식의 폴더를 자동으로 생성합니다
📁 prisma/
└── migrations/
    ├── 20250817_init/
    │   └── migration.sql
    ├── 20250819_add-user-status/
    │   └── migration.sql

```

### Prisma Client 코드를 생성(npx prisma generate)
```bash
npx prisma generate

- schema.prisma에 정의된 모델을 기반으로 Prisma Client 코드를 생성하여, 
- TypeScript에서 타입 안전한 DB 접근을 가능하게 해주는 명령어입니다.

이 명령어는 다음 작업을 수행합니다:
1. schema.prisma 파일을 읽어들임
2. 모델 정의(User, Post 등)를 분석
3. 자동으로 타입-safe한 Prisma Client를 생성
4. node_modules/@prisma/client 디렉토리에 JS/TS 코드 저장
5. import { PrismaClient } from '@prisma/client' 로 사용 가능하게 만듦

📁 node_modules/
└── @prisma/
    └── client/
        ├── index.d.ts      # 타입 정의
        ├── runtime/        # 실행에 필요한 런타임 코드
        └── PrismaClient.js # 실제 PrismaClient 클래스

```