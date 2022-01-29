import { list } from '@keystone-6/core';
import {
  text,
  password,
  relationship,
  timestamp,
  json,
} from '@keystone-6/core/fields';
import { permissions, rules } from '../access';

export const User = list({
  access: {
    operation: {
      create: () => true,
      // only people with the permission can delete themselves!
      // You can't delete yourself
      delete: permissions.canManageUsers,
    },
    filter: {
      query: rules.canManageUsers,
      update: rules.canManageUsers,
    },
  },
  ui: {
    // hide the backend UI from regular users
    hideCreate: (args) => !permissions.canManageUsers(args),
    hideDelete: (args) => !permissions.canManageUsers(args),
  },
  db: {
    idField: { kind: 'autoincrement' },
  },
  fields: {
    name: text({ validation: { isRequired: true } }),
    email: text({ isIndexed: 'unique', validation: { isRequired: true } }),
    password: password(),
    cart: relationship({
      ref: 'CartItem.user',
      many: true,
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
      },
    }),
    role: relationship({
      ref: 'Role.assignedTo',
      access: {
        create: permissions.canManageUsers,
        update: permissions.canManageUsers,
      },
    }),
    orders: relationship({
      ref: 'Order.user',
      many: true,
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
      },
    }),
    processProducts: relationship({ ref: 'ProcessProduct.user', many: true }),
    cartProcessProducts: relationship({
      ref: 'CartProcessProduct.user',
      many: true,
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
      },
    }),
    createdOn: timestamp(),
    updatedOn: timestamp(),
    history: json({
      defaultValue: {
        logs: [
          {
            '2011-10-05T14:48:00.000Z': {
              email: { prev: 'test', new: 'text' },
            },
          },
        ],
      },
    }),
  },
});
