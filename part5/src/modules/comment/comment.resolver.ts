import { throwInputValidationError } from '../../utils/error.validation';
import { GraphQLContext } from '../../context';
import {
  CreateCommentInput,
  UpdateCommentInput,
  createCommentSchema,
  updateCommentSchema,
} from './comment.dto';

export const commentResolvers = {
  Query: {
    comment: async (_parent: unknown, args: { id: number }, context: GraphQLContext) => {
      return context.services.commentService.getCommentById(args.id);
    },

    commentsByPost: async (_parent: unknown, args: { id: number }, context: GraphQLContext) => {
      return context.services.commentService.getCommentsByPost(args.id);
    },

    commentsByUser: async (_parent: unknown, args: { id: number }, context: GraphQLContext) => {
      return context.services.commentService.getCommentsByUser(args.id);
    },

    comments: async (_parent: unknown, args: unknown, context: GraphQLContext) => {
      return context.services.commentService.getAllComments();
    },
  },

  Mutation: {
    createComment: async (
      _parent: unknown,
      args: { input: CreateCommentInput },
      context: GraphQLContext
    ) => {
      const result = createCommentSchema.safeParse(args.input);
      if (!result.success) {
        throwInputValidationError(result.error);
      }
      return context.services.commentService.createComment(result.data);
    },

    updateComment: async (
      _parent: unknown,
      args: { id: number; input: UpdateCommentInput },
      context: GraphQLContext
    ) => {
      const result = updateCommentSchema.safeParse(args.input);
      if (!result.success) {
        throwInputValidationError(result.error);
      }
      return context.services.commentService.updateComment(args.id, result.data);
    },

    deleteComment: async (_parent: unknown, args: { id: number }, context: GraphQLContext) => {
      return context.services.commentService.deleteComment(args.id);
    },
  },
};
