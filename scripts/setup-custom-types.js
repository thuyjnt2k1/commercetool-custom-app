const fetch = require('node-fetch') || globalThis.fetch;

const CTP_PROJECT_KEY = process.env.CTP_PROJECT_KEY;
const CTP_CLIENT_SECRET = process.env.CTP_CLIENT_SECRET;
const CTP_CLIENT_ID = process.env.CTP_CLIENT_ID;
const CTP_AUTH_URL = process.env.CTP_AUTH_URL || 'https://auth.europe-west1.gcp.commercetools.com';
const CTP_API_URL = process.env.CTP_API_URL || 'https://api.europe-west1.gcp.commercetools.com';

async function setupCustomType() {
  if (!CTP_PROJECT_KEY || !CTP_CLIENT_SECRET || !CTP_CLIENT_ID) {
    console.error('Please set CTP_PROJECT_KEY, CTP_CLIENT_SECRET, and CTP_CLIENT_ID environment variables.');
    process.exit(1);
  }

  console.log('Fetching access token...');
  const authResponse = await fetch(`${CTP_AUTH_URL}/oauth/token?grant_type=client_credentials`, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${CTP_CLIENT_ID}:${CTP_CLIENT_SECRET}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  if (!authResponse.ok) {
    const err = await authResponse.text();
    console.error('Failed to authenticate:', err);
    process.exit(1);
  }

  const { access_token } = await authResponse.json();

  const typeDraft = {
    key: 'customer-custom-type',
    name: {
      en: 'Customer Custom Type',
    },
    resourceTypeIds: ['customer'],
    fieldDefinitions: [
      {
        name: 'sale_type',
        label: {
          en: 'Sale Type',
        },
        required: false,
        type: {
          name: 'Enum',
          values: [
            { key: 'B2B', label: 'B2B' },
            { key: 'B2C', label: 'B2C' },
            { key: 'Retail', label: 'Retail' },
            { key: 'Wholesale', label: 'Wholesale' },
          ],
        },
        inputHint: 'SingleLine',
      },
    ],
  };

  console.log('Creating or updating custom Type...');
  
  // Try to create
  let res = await fetch(`${CTP_API_URL}/${CTP_PROJECT_KEY}/types`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(typeDraft),
  });

  if (res.status === 400) {
    const errorBody = await res.json();
    if (errorBody.errors && errorBody.errors[0].code === 'DuplicateField') {
        console.log('Type already exists. Skipping creation.');
    } else {
        console.error('Failed to create type:', JSON.stringify(errorBody, null, 2));
    }
  } else if (!res.ok) {
    console.error('Failed to create type:', await res.text());
  } else {
    console.log('Successfully created type.');
  }
}

setupCustomType().catch(console.error);
