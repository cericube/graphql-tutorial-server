import { UserService } from './user.service';

//CreateUserInput은 GraphQL 스키마(SDL) 안의 input 타입 이름일 뿐,
// TypeScript 세계의 타입이 아님
type CreateUserArgs = { input: { name: string; email: string } };
type UpdateUserArgs = { input: { id: string; name?: string; email?: string } };
const userService = new UserService();

export const userResolvers = {
  Query: {
    //(parent, args, context, info)
    //객체에서 필요한 속성만 뽑아 쓰고 싶으면 구조 분해 할당
    //{ id } → 두 번째 인자(args)에서 id만 꺼냄
    //: { id: string } → args 객체의 타입이 { id: string }임을 명시
    getUser: (_: unknown, { id }: { id: string }) => {
      return userService.getUser(id);
    },
    listUsers: () => {
      return userService.listUser();
    },
  },
  Mutation: {
    createUser: (_: unknown, { input }: CreateUserArgs) => {
      return userService.createUser(input.name, input.email);
    },
    updateUser: (_: unknown, { input }: UpdateUserArgs) => {
      return userService.updateUser(input.id, input.name, input.email);
    },
    deleteUser: (_: unknown, { id }: { id: string }) => {
      return userService.deleteUser(id);
    },
  },
};
