import 'dotenv/config';
import { config } from '@keystone-6/core';
import { withAuth, session } from './auth';
import { User } from './schemas/User';
import { Role } from './schemas/Role';
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
import { extendGraphqlSchema } from './mutations';

const databaseURL = process.env.DATABASE_URL || 'file:./keystone.db';
const dashboardURL = process.env.DASHBOARD_URL || 'http://localhost:4000';
const deployURL =
  process.env.DEPLOY_URL || 'https://printshop-dashboard.vercel.app';
const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5000';

const lists = {
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
        origin: [
          frontendURL,
          dashboardURL,
          deployURL,
          'https://studio.apollographql.com',
        ],
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
      isAccessAllowed: ({ session }) => {
        console.log(session);
        return !!session;
      },
    },
    session: session,
  })
);
