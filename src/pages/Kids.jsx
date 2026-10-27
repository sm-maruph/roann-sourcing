import Mens from './Mens';

// Use the shared catalog page so Kids products created in the admin panel are
// loaded from /api/catalog/kids and shown with the same filters and quote flow.
export default function Kids() {
  return <Mens basePath="/kids" audience="Kids’" />;
}
