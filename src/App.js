import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePageOne from "./pages/HomePageOne";
import HomePageTwo from "./pages/HomePageTwo";
import HomePageThree from "./pages/HomePageThree";
import AddUserPage from "./pages/AddUserPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import WizardPage from "./pages/WizardPage";
import RouteScrollToTop from "./helper/RouteScrollToTop";
import ViewProfilePage from "./pages/ViewProfilePage";
import UsersListPage from "./pages/UsersListPage";
import DistributorPage from "./pages/DistributorPage";
import AdvisorPage from "./pages/AdvisorPage";
import OTPUserPage from "./pages/OTPUserPage";
import EmailUserPage from "./pages/EmailUserpage";
import PanUserPage from "./pages/panUSerPage";
import EmailOTPPage from "./pages/EmailOTPPage";
import PinPage from "./pages/PinPage";
import PanOTPPage from "./components/PanOTPUser";
import WizardStepper from "./pages/WizardStepper";
import WizardUser from "./pages/WizardUser";
import BankVerification from "./components/BankUserpage";
import ChequeUpload from "./components/ChequePage";
import NomineeDetails from "./components/NomineePage";
import PersonalVerification from "./components/PersonalPage";
import CustomerList from "./pages/CustomerList";
import EventCustomerPage from "./pages/EventCustomer";
import AdvisorLayout from "./pages/Advisor/AdvisorcustMaster";
import AdvisorEventLayout from "./pages/Advisor/AdvisorEventMaster";
import NewEventMaster from "./pages/Advisor/NewEventMaster";
import EditEventMaster from "./pages/Advisor/EditEventMaster";
import EventRegistrationForm from "./pages/Advisor/NewEvent";
import AMCNewEventMaster from "./components/child/AMC/CreateAMCEvent";
import HomePageFour from "./pages/HomePageFour";
import EventFetcher from "./components/child/Distributor/EventsPage";
import EventMasterLayout from "./components/child/Distributor/EventMasterLayout";
function App() {
  return (
    <BrowserRouter>
      <RouteScrollToTop />
      <Routes>


        <Route exact path='/' element={<SignInPage />} />
        <Route exact path='/index-1' element={<HomePageTwo />} />
        <Route exact path='/index-2' element={<HomePageOne />} />
        <Route exact path="/amc-event" element={<AMCNewEventMaster />} />
        <Route exact path="/index-3" element={<HomePageThree />} />
        <Route exact path= "/index-4" element={<HomePageFour/>}/>
        <Route exact path = "/distributor-events" element={<EventFetcher />} />
        <Route exact path = "/event/:id" element={<EventMasterLayout />} />
        <Route path="/wizardstepper" element={<WizardUser />}>
      
          <Route exact path='/wizardstepper/add-user' element={<AddUserPage />} />
          <Route path="add-user" element={<AddUserPage />} />
          <Route path="otp" element={<OTPUserPage />} />
          <Route path="email" element={<EmailUserPage />} />
          <Route path="email-otp" element={<EmailOTPPage />} />

          <Route path="pan" element={<PanUserPage />} />
          <Route path="bank" element={<BankVerification />} />
          <Route path="cheque" element={<ChequeUpload />} />
          <Route path="nominee" element={<NomineeDetails />} />
          <Route path="personal" element={<PersonalVerification />} />

        </Route>
        <Route path="/customer-list" element={< CustomerList />} />
        <Route path="/event-list" element={<EventCustomerPage />} />
        <Route exact path='/users-list' element={<UsersListPage />} />
        <Route exact path='/distributor' element={<DistributorPage />} />
        <Route exact path='/advisor' element={<AdvisorPage />} />
        <Route exact path='/view-profile' element={<ViewProfilePage />} />

        <Route exact path='/sign-in' element={<SignInPage />} />
        <Route exact path='/sign-up' element={<SignUpPage />} />

        <Route exact path='/wizard' element={<WizardPage />} />
        <Route exact path="/advisor-customer" element={<AdvisorLayout />} />
        <Route exact path="/advisor-event" element={<AdvisorEventLayout />} />
        <Route exact path="/new-event" element={<NewEventMaster />} />
        <Route exact path="/edit-event" element={<EditEventMaster />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
