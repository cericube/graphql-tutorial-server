// /src/schema.ts

// 개별 도메인(user, post)의 GraphQL 스키마(typeDefs)를 가져옵니다.
// 각 도메인 폴더 내부에는 해당 리소스의 타입, InputObject, Mutation/Query 정의가 들어있습니다.
import { userTypeDefs } from './modules/user/user.schema';
import { postTypeDefs } from './modules/post/post.schema';
import { categoryTypeDefs } from './modules/post/category.schema';

// GraphQL Yoga 서버에 전달할 전체 스키마(typeDefs)를 하나의 배열로 통합합니다.
// 이 배열은 각 도메인의 SDL(Schema Definition Language) 문자열을 나열하는 방식입니다.
// Yoga는 이 배열을 자동으로 병합하여 하나의 통합 스키마로 인식합니다.

export const typeDefs = [userTypeDefs, postTypeDefs, categoryTypeDefs];
