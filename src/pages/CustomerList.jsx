import CustomerList from "../components/advisorcustomer";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
const CustomerListPage = () => {
  return (
    <>
      <MasterLayout>
        <Breadcrumb title="CRM"  />
        <CustomerList />
      </MasterLayout>
    </>
  );
}
export default CustomerListPage;