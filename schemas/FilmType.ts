import { checkbox, integer, text } from '@keystone-6/core/fields';
import { list } from '@keystone-6/core';
import { rules, isSignedIn } from '../access';

export const FilmType = list({
  // access: {
  //   operation: {
  //     create: isSignedIn,
  //   },
  //   filter: {
  //     query: rules.canOrder,
  //     update: rules.canOrder,
  //     delete: rules.canOrder,
  //   },
  // },
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
    isSingle: checkbox({
      defaultValue: false,
      // isRequired: true,
    }),
    isSlide: checkbox({
      defaultValue: false,
      // isRequired: true,
    }),
    scanOnlyCost: integer(),
  },
});
