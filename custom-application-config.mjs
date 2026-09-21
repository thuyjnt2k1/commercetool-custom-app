import { PERMISSIONS, entryPointUriPath } from './src/constants';

/**
 * @type {import('@commercetools-frontend/application-config').ConfigOptionsForCustomApplication}
 */
const config = {
  name: 'Starter Cfcb21',
  entryPointUriPath,
  cloudIdentifier: 'aws-eu',
  env: {
    development: {
      initialProjectKey: 'thuy-test-project',
    },
    production: {
      applicationId: 'cmuas2bqj000401ud3du6a8jp',
      url: 'https://commercetool-custom-app-git-main-thuy-c5ea.vercel.app/',
    },
  },
  oAuthScopes: {
    view: ['view_products'],
    manage: ['manage_products'],
  },
  icon: '${path:@commercetools-frontend/assets/application-icons/rocket.svg}',
  mainMenuLink: {
    defaultLabel: 'Template starter',
    labelAllLocales: [],
    permissions: [PERMISSIONS.View],
  },
  submenuLinks: [
    {
      uriPath: 'channels',
      defaultLabel: 'Channels',
      labelAllLocales: [],
      permissions: [PERMISSIONS.View],
    },
  ],
};

export default config;
