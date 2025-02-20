import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePageOne from "./pages/HomePageOne";
import HomePageTwo from "./pages/HomePageTwo";
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
function App() {
  return (
    <BrowserRouter>
      <RouteScrollToTop />
      <Routes>
   

        <Route exact path='/' element={<SignInPage />} />
        <Route exact path='/index-1' element={<HomePageTwo />} />
        <Route exact path='/index-2' element={<HomePageOne />} />
        
        <Route path="/wizardstepper" element={<WizardUser />}>
        <Route exact path='/wizardstepper/add-user' element={<AddUserPage/>} /> 
          <Route path="add-user" element={<AddUserPage />} />
          <Route path="otp" element={<OTPUserPage />} />
          <Route path="email" element={<EmailUserPage />} />
          <Route path="email-otp" element={<EmailOTPPage />} />
       
          <Route path="pan" element={<PanUserPage />} />
          <Route path= "bank" element={<BankVerification/>}/>
          <Route path="cheque" element={<ChequeUpload />} />
          <Route path="nominee" element={<NomineeDetails />} />
          <Route path="personal" element={<PersonalVerification />} />
         
        </Route>
        <Route path="/customer-list" element={< CustomerList/>}/>
        <Route exact path='/users-list' element={<UsersListPage />} />
        <Route exact path='/distributor' element={<DistributorPage />} />
        <Route exact path='/advisor' element={<AdvisorPage />} />
        <Route exact path='/view-profile' element={<ViewProfilePage />} />
  
        <Route exact path='/sign-in' element={<SignInPage />} />
        <Route exact path='/sign-up' element={<SignUpPage />} />

        <Route exact path='/wizard' element={<WizardPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
