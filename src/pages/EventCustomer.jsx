import EventListPage from "../components/eventcustomer";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
const EventCustomerPage = () => {
  return (
    <>
      <MasterLayout>
        <Breadcrumb title="CRM"  />
        <EventListPage />
      </MasterLayout>
    </>
  );
}
export default EventCustomerPage;