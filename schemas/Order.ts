import {
  integer,
  select,
  text,
  relationship,
  virtual,
  timestamp,
} from '@keystone-6/core/fields';
import { list, graphql } from '@keystone-6/core';
import { isSignedIn, rules } from '../access';
import formatMoney from '../lib/formatMoney';

export const Order = list({
  access: {
    operation: {
      create: isSignedIn,
      update: () => false,
      delete: () => false,
    },
    filter: { query: rules.canOrder },
  },
  db: {
    idField: { kind: 'autoincrement' },
  },
  fields: {
    total: integer(),
    processProducts: relationship({ ref: 'ProcessProduct.order', many: true }),
    user: relationship({ ref: 'User.orders' }),
    charge: text(),
    createdAt: timestamp(),
    updatedAt: timestamp({
      db: {
        updatedAt: true,
      },
    }),
  },
});
