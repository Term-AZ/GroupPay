import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import LandingPage from "./pages/landing";
import LoginPage from './pages/LoginPage';
import SignUp from './pages/SignUp';
import MainPage from './pages/MainPage';
import HomePage from './pages/HomePage'
import GroupPayments from './pages/GroupPayments'
import MyPayments from './pages/MyPayments'
import AddPayment from './pages/AddPayment'
import EditGroups from './pages/EditGroups'
import CreateGroup from './pages/CreateGroup'
import About from './pages/About';

import{
  createBrowserRouter,
  RouterProvider,
  Link,
}from "react-router-dom"
import Testpage from './pages/Testpage';
import ManageGroups from './pages/ManageGroups/ManageGroups';

const router = createBrowserRouter([{
  path: "/",
  element: <LandingPage/> 
},
{
  path: "/login",
  element: <LoginPage/>
},
{
  path: "/signup",
  element: <SignUp/>
},
{
  path: "/mainpage",
  element: <MainPage/>
},
{
  path: "/homepage",
  element: <HomePage/>
},
{
  path: "/group_payments",
  element: <GroupPayments/>
},
{
  path: "/my_payments",
  element: <MyPayments/>
},
{
  path: "/add_transaction",
  element: <AddPayment/>
},
{
  path: "/edit_groups",
  element: <EditGroups/>
},
{
  path: "/create_group",
  element: <CreateGroup/>
},
{
  path:"/test",
  element: <Testpage/>
},
{
  path:"/manage_groups",
  element: <ManageGroups/>
},
{
  path:"/about",
  element: <About/>
}
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router = {router}/>
  </React.StrictMode>
);





// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <App/>
//     </BrowserRouter>
//   </React.StrictMode>
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
