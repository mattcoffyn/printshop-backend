import 'dotenv/config';
import { config } from '@keystone-6/core';
import { createAuth } from '@keystone-6/auth';
import { statelessSessions } from '@keystone-6/core/session';
import { User } from './schemas/User';
import { Role } from './schemas/Role';
import { permissionsList } from './schemas/fields';
import { Product } from './schemas/Product';
import { ProductImage } from './schemas/ProductImage';
import { ProcessProduct } from './schemas/ProcessProduct';
import { Order } from './schemas/Order';
import { CartProcessProduct } from './schemas/CartProcessProduct';
import { FilmColour } from './schemas/FilmColour';
import { FilmType } from './schemas/FilmType';
import { ScanResolution } from './schemas/ScanResolution';
import { CartItem } from './schemas/CartItem';
import { OrderStatus } from './schemas/OrderStatus';
import { insertSeedData } from './seed-data';
import { sendPasswordResetEmail } from './lib/mail';
import { extendGraphqlSchema } from './mutations';

const databaseURL = process.env.DATABASE_URL || 'file:./keystone.db';
const frontendURL = process.env.FRONTEND_URL || 'localhost:4000';
const dashboardURL = process.env.DASHBOARD_URL || 'localhost:5000';

const { withAuth } = createAuth({
  listKey: 'User',
  identityField: 'email',
  secretField: 'password',
  initFirstItem: {
    fields: ['name', 'email', 'password'],
    // TODO: Add in inital roles here
  },
  passwordResetLink: {
    async sendToken(args) {
      // send the email
      await sendPasswordResetEmail(args.token, args.identity);
    },
  },
  sessionData: `id name email role { ${permissionsList.join(' ')} }`,
  // sessionData: `id name email role { ${permissionsList.join(' ')} }`,
});

const sessionConfig = {
  maxAge: 60 * 60 * 24 * 360, // How long they stay signed in?
  secret: 'this secret should only be used in testing',
};

const lists = {
  // Schema items go in here
  User,
  Role,
  Product,
  ProductImage,
  ProcessProduct,
  CartProcessProduct,
  FilmColour,
  FilmType,
  ScanResolution,
  CartItem,
  OrderStatus,
  Order,
};

export default withAuth(
  config({
    server: {
      cors: {
        origin: [frontendURL, dashboardURL, 'https://studio.apollographql.com'],
        credentials: true,
      },
    },
    db: {
      provider: 'postgresql',
      url: databaseURL,
      async onConnect(context) {
        console.log('Connected to the database!');
        if (process.argv.includes('--seed-data')) {
          await insertSeedData(context);
        }
      },
    },
    lists,
    extendGraphqlSchema,
    ui: {
      // Show the UI only for poeple who pass this test
      isAccessAllowed: ({ session }) => !!session,
    },
    session: statelessSessions(sessionConfig),
  })
);
