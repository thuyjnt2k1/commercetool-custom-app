import { defineMessages } from 'react-intl';

export default defineMessages({
  title: {
    id: 'CustomerDetails.title',
    description: 'The page title for customer details',
    defaultMessage: 'Customer Details',
  },
  backToCustomers: {
    id: 'CustomerDetails.backToCustomers',
    description: 'Label for back button',
    defaultMessage: 'Back to Customers',
  },
  save: {
    id: 'CustomerDetails.save',
    description: 'Label for save button',
    defaultMessage: 'Save',
  },
  saleTypeLabel: {
    id: 'CustomerDetails.saleTypeLabel',
    description: 'Label for sale type field',
    defaultMessage: 'Sale Type',
  },
  saleTypePlaceholder: {
    id: 'CustomerDetails.saleTypePlaceholder',
    description: 'Placeholder for sale type field',
    defaultMessage: 'Select a Sale Type',
  },
  updateSuccess: {
    id: 'CustomerDetails.updateSuccess',
    description: 'Success message after update',
    defaultMessage: 'Customer successfully updated',
  },
  updateError: {
    id: 'CustomerDetails.updateError',
    description: 'Error message after failed update',
    defaultMessage: 'Failed to update customer',
  },
});
