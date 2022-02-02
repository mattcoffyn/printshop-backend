import { createAuth } from '@keystone-6/auth';

import { statelessSessions } from '@keystone-6/core/session';
import { permissionsList } from './schemas/fields';
import { sendPasswordResetEmail } from './lib/mail';

let sessionSecret =
  process.env.SESSION_SECRET ||
  require('crypto')
    .randomBytes(32)
    .toString('base64')
    .replace(/[^a-zA-Z0-9]+/g, '');

const { withAuth } = createAuth({
  listKey: 'User',
  identityField: 'email',
  secretField: 'password',
  sessionData: `id name email role { ${permissionsList.join(' ')} }`,
  passwordResetLink: {
    async sendToken(args) {
      await sendPasswordResetEmail(args.token, args.identity);
    },
  },
  initFirstItem: {
    fields: ['name', 'email', 'password', 'role'],
  },
});

let sessionMaxAge = 60 * 60 * 24 * 30; // 30 days

const session = statelessSessions({
  maxAge: sessionMaxAge,
  secret: sessionSecret,
  secure: true,
  sameSite: 'none',
});

export { withAuth, session };
