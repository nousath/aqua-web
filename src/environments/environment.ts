// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  silent: false,
  apiUrls: {
    ems: 'http://ems.m-sas.com',
    ams: 'http://ams.m-sas.com',
    website: 'http://aquahrms.m-sas.com',
    register: 'http://ams-getting-started.m-sas.com'
  },
  name: 'dev'
};
