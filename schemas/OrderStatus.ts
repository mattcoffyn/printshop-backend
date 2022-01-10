import { relationship, text } from '@keystone-6/core/fields';
import { list } from '@keystone-6/core';
import { rules, isSignedIn } from '../access';

export const OrderStatus = list({
  // access: {
  //   operation: {
  //     create: isSignedIn,
  //   },
  // filter: {
  //   query: rules.canOrder,
  //   update: rules.canOrder,
  //   delete: rules.canOrder,
  // },
  // },
  db: {
    idField: { kind: 'autoincrement' },
  },
  fields: {
    name: text({
      validation: {
        isRequired: true,
      },
    }),
    description: text({
      ui: {
        displayMode: 'textarea',
      },
    }),
    orders: relationship({ ref: 'ProcessProduct.orderStatus', many: true }),
  },
});
