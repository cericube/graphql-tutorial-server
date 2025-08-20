import { userResolvers } from './modules/user/user.resolver'; // 사용자 관련 리졸버 import

// resolvers 배열은 GraphQL 서버에서 사용할 모든 리졸버 객체를 포함합니다.
// 각 리졸버는 특정 타입(Query, Mutation 등)에 대한 필드의 동작을 정의합니다.
// 이 예시에서는 userResolvers만 포함되어 있으며,
// 추후 다른 리졸버(예: postResolvers 등)를 추가할 수 있습니다.
export const resolvers = [userResolvers];
