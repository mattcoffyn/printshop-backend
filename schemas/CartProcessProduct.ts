import {
  checkbox,
  integer,
  relationship,
  select,
  text,
  timestamp,
} from '@keystone-6/core/fields';
import { list } from '@keystone-6/core';
import { rules, isSignedIn } from '../access';

export const CartProcessProduct = list({
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
  fields: {
    notes: text({
      ui: {
        displayMode: 'textarea',
      },
    }),
    noDevelop: checkbox({
      defaultValue: false,
      // isRequired: true,
    }),
    noScans: checkbox({
      defaultValue: false,
      // isRequired: true,
    }),
    isSingle: checkbox({
      defaultValue: false,
      // isRequired: true,
    }),
    isSlide: checkbox({
      defaultValue: false,
      // isRequired: true,
    }),
    filmType: relationship({
      ref: 'FilmType',
      many: false,
      // isIndexed: true,
    }),
    filmColour: relationship({
      ref: 'FilmColour',
      many: false,
      // isIndexed: true,
    }),
    scanResolution: relationship({
      ref: 'ScanResolution',
      many: false,
      // isIndexed: true,
    }),
    singleQuantity: integer(),
    status: select({
      options: [
        { label: 'In Cart', value: 'IN_CART' },
        { label: 'Awaiting Film', value: 'AWAITING_FILM' },
        { label: 'Film Received', value: 'FILM_RECEIVED' },
        { label: 'Developed', value: 'DEVELOPED' },
        { label: 'Scanned', value: 'SCANNED' },
        { label: 'Complete', value: 'COMPLETE' },
        { label: 'Shipped', value: 'SHIPPED' },
      ],
      defaultValue: 'AWAITING_FILM',
      ui: {
        displayMode: 'segmented-control',
        createView: { fieldMode: 'hidden' },
      },
    }),
    user: relationship({ ref: 'User.cartProcessProducts' }),
    price: integer(),
    createdOn: timestamp(),
    updatedOn: timestamp({
      db: {
        updatedAt: true,
      },
    }),
  },
});
