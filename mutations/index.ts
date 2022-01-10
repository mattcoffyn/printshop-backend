import { graphQLSchemaExtension } from '@keystone-6/core';
import addToCart from './addToCart';
import sendEmail from './completedEmail';

// fake syntax highlighter
const graphql = String.raw;

export const extendGraphqlSchema = graphQLSchemaExtension({
  typeDefs: graphql`
    type Mutation {
      addToCart(productId: ID): CartItem
      sendEmail(processProductId: ID): ProcessProduct
    }
  `,
  resolvers: {
    Mutation: {
      addToCart,
      sendEmail,
    },
  },
});
