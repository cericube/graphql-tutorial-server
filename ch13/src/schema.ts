import { userTypeDefs } from './modules/user/user.schema'; // 사용자 관련 타입 정의(import)

// typeDefs 배열은 GraphQL 서버에서 사용할 모든 타입 정의(스키마)를 포함합니다.
// 각 타입 정의는 GraphQL의 Query, Mutation, Object Type 등 구조를 명시합니다.
// 이 예시에서는 userTypeDefs만 포함되어 있으며,
// 추후 다른 타입 정의(postTypeDefs 등)를 추가하여 확장할 수 있습니다.
export const typeDefs = [userTypeDefs];
