import { integer, relationship, select, text } from '@keystone-6/core/fields';
import { list } from '@keystone-6/core';
import { rules, isSignedIn } from '../access';

export const CartItem = list({
  access: {
    operation: {
      create: isSignedIn,
    },
    filter: {
      query: rules.canOrder,
      update: rules.canOrder,
      delete: rules.canOrder,
    },
  },
  // ui: {
  //   listView: {
  //     initialColumns: ['user', 'product', 'quantity'],
  //   },
  // },
  db: {
    idField: { kind: 'autoincrement' },
  },
  fields: {
    quantity: integer({
      defaultValue: 1,
      validation: {
        isRequired: true,
      },
    }),
    product: relationship({ ref: 'Product' }),
    // processProduct: relationship({ ref: 'processProduct' }),
    user: relationship({ ref: 'User.cart' }),
  },
});
