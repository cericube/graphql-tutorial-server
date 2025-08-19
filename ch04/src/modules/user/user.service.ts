// src/modules/user/user.service.ts

const users = [
  { id: 1, name: '홍길동', email: 'hong@example.com' },
  { id: 2, name: '김철수', email: 'kim@example.com' },
];

let nextId = 3;

export const userService = {
  getAll: () => users,

  getById: (id: number) => users.find((u) => u.id === id) || null,

  create: (name: string, email: string) => {
    const newUser = { id: nextId++, name, email };
    users.push(newUser);
    return newUser;
  },
};
