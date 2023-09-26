import './App.css';
import LandingPage from "./pages/landing";
import LoginPage from './pages/LoginPage';
import SignUp from './pages/SignUp';
import MainPage from './pages/MainPage';
import Testpage from './pages/Testpage';
import MyPayments from './pages/MyPayments';
import GroupPayments from './pages/GroupPayments';
import AddPayment from './pages/AddPayment'
import EditGroups from './pages/EditGroups'
import CreateGroup from './pages/CreateGroup'
//import {useState,useEffect} from 'react';
import {Channel} from './pages/Components/Channel'
import {Link, Route, Routes, Router} from "react-router-dom"
import '../node_modules/@syncfusion/ej2-base/styles/material.css';  
import '../node_modules/@syncfusion/ej2-buttons/styles/material.css';  
import '../node_modules/@syncfusion/ej2-calendars/styles/material.css';  
import '../node_modules/@syncfusion/ej2-dropdowns/styles/material.css';  
import '../node_modules/@syncfusion/ej2-inputs/styles/material.css';  
import '../node_modules/@syncfusion/ej2-navigations/styles/material.css';
import '../node_modules/@syncfusion/ej2-popups/styles/material.css';
import '../node_modules/@syncfusion/ej2-splitbuttons/styles/material.css';
import '../node_modules/@syncfusion/ej2-notifications/styles/material.css';
import "../node_modules/@syncfusion/ej2-react-grids/styles/material.css";


function App() {

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" exact element={<LandingPage/>}/>
          {/* <Route path="/login" exact element={<LoginPage/>}/>
          <Route path="/signup" exact element={<SignUp/>}/>
          <Route path="/mainpage" exact element={<MainPage/>}/>
          <Route path="/my_payments" exact element={<MyPayments/>}/>
          <Route path="/group_payments" exact element={<GroupPayments/>}/>
          <Route path="/add_transaction" exact element = {<AddPayment/>}/>
          <Route path="/edit_transaction" exact element = {<EditGroups/>}/>
          <Route path="/create_group" exact element = {<CreateGroup/>}/>
          <Route path="/"></Route>
          <Route path="/test" exact element={<Testpage/>}/> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
