import 'dotenv/config';
import { config } from '@keystone-6/core';
import { withAuth, session } from './auth';
import { lists } from './schemas/schema';
import { insertSeedData } from './seed-data';
import { extendGraphqlSchema } from './mutations';

const databaseURL = process.env.DATABASE_URL || 'file:./keystone.db';
const dashboardURL = process.env.DASHBOARD_URL || 'http://localhost:4000';
const deployURL =
  process.env.DEPLOY_URL || 'https://printshop-dashboard.vercel.app';
const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5000';

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
      isAccessAllowed: ({ session }) => !!session,
    },
    session: session,
  })
);
