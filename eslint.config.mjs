// eslint.config.js

// ESLint에서 제공하는 JavaScript 기본 규칙 세트를 불러옴
import js from '@eslint/js';

// TypeScript 코드를 ESLint로 분석하기 위해 typescript-eslint 모듈을 불러옴
// 여기에는 parser, plugin, 추천 규칙 세트 등이 포함됨
import tseslint from 'typescript-eslint';

// Prettier 포맷팅 규칙을 ESLint와 연동하기 위해 Prettier 플러그인을 불러옴
import prettierPlugin from 'eslint-plugin-prettier';

// Prettier와 충돌하는 ESLint 규칙을 비활성화하기 위한 설정
// (예: 세미콜론, 따옴표 관련 규칙 충돌 방지)
import prettierConfig from 'eslint-config-prettier';

// typescript-eslint에서 제공하는 TypeScript 추천 규칙 세트를 가져옴
// await를 쓰는 이유: typescript-eslint.configs.recommended는 비동기 함수 반환
const ts = await tseslint.configs.recommended;

export default [
  // ================================
  // 1. ESLint 무시(ignore) 설정
  //    - 특정 폴더나 파일은 린트 검사에서 제외
  //    - 가장 상위에 위치시켜 전역적으로 적용
  // ================================
  {
    ignores: ['dist/', 'node_modules/', 'coverage/'],
  },

  // ================================
  // 2. JavaScript 기본 규칙 적용
  //    - @eslint/js에서 제공하는 권장 규칙
  // ================================
  js.configs.recommended,

  // ================================
  // 3. TypeScript 추천 규칙 적용
  //    - typescript-eslint에서 제공하는 권장 규칙 세트
  //    - 타입 검사를 하지 않는 "기본 모드"의 규칙들이 포함
  // ================================
  ...ts,

  // ================================
  // 4. Prettier와 충돌하는 ESLint 포맷팅 규칙 비활성화
  //    - eslint-config-prettier를 가장 마지막에 위치시켜야
  //      앞서 적용한 규칙들 중 포맷팅 관련 충돌을 해제 가능
  // ================================
  prettierConfig,

  // ================================
  // 5. TypeScript 파일에만 적용할 규칙/설정
  //    - 확장자가 .ts인 파일을 대상으로만 동작
  // ================================
  {
    files: ['**/*.ts'], // 프로젝트 전체에서 모든 .ts 파일 적용
    languageOptions: {
      // TypeScript 코드를 파싱하기 위해 @typescript-eslint/parser 사용
      parser: tseslint.parser,

      parserOptions: {
        ecmaVersion: 'latest', // 최신 ECMAScript 문법 지원
        sourceType: 'module',  // ES Modules(import/export) 문법 사용

        // [옵션] 타입 기반 린팅 활성화
        // project: true → 현재 디렉토리의 tsconfig.json 자동 탐색
        // project: ['./tsconfig.json'] → 경로를 명시적으로 지정
        // 활성화 시 타입 정보를 기반으로 더 정밀한 규칙 검사 가능
        // 단, 성능 저하가 있을 수 있으므로 CI나 빌드 시에만 사용 권장
        // project: true, // 또는 ['tsconfig.json']
      },
    },

    plugins: {
      // Prettier 플러그인을 ESLint에 등록
      prettier: prettierPlugin,
    },

    rules: {
      // Prettier 포맷팅 규칙을 ESLint 에러로 처리
      // .prettierrc 파일의 설정(singleQuote, semi 등)과 일치시켜야 함
      'prettier/prettier': ['error', { singleQuote: true, semi: true }],

      // Prettier가 관리하는 포맷팅 규칙은 ESLint에서 비활성화하여 충돌 방지
      // (예: semi, quotes 등의 규칙)
    },
  },
];
