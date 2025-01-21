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


function App() {
  return (
    <BrowserRouter>
      <RouteScrollToTop />
      <Routes>

        <Route exact path='/' element={<SignInPage />} />
        <Route exact path='/index-1' element={<HomePageTwo />} />
        <Route exact path='/index-2' element={<HomePageOne />} />

        <Route exact path='/add-user' element={<AddUserPage />} />
        <Route exact path='/users-list' element={<UsersListPage />} />
        <Route exact path='/view-profile' element={<ViewProfilePage />} />

        <Route exact path='/sign-in' element={<SignInPage />} />
        <Route exact path='/sign-up' element={<SignUpPage />} />

        <Route exact path='/wizard' element={<WizardPage />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
