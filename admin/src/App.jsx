import { SignedIn, SignedOut, SignInButton, useAuth, UserButton } from '@clerk/clerk-react';
import axiosInstance from './lib/axios';
import { Navigate, Route, Routes } from 'react-router';
import LoginPage from './pages/LoginPage';
import DashBoard from './pages/Dashboard';
import ProductsPage from './pages/ProductsPage';
import OrdersPage from './pages/OrdersPage';
import CustomersPage from './pages/CustomersPage';
import DashboardLayouts from './Layouts/DashboardLayouts';
import PageLoader from './Components/PageLoader';


function App() {
   
  const getProducts = async () => {
   const res = await axiosInstance.get('/products');
   return res.data;
  }
  const {isSignedIn, isLoaded} = useAuth();

  if(!isLoaded) return <PageLoader/>

  return (
    <Routes>
      <Route path='/login' element={isSignedIn ? <Navigate to={"/dashboard"}/> :<LoginPage/>}/>

      <Route path='/' element={isSignedIn ? <DashboardLayouts/> : <Navigate to={"/login"}/>}>
            <Route index element={<Navigate to={"dashboard"}/>}/>
            <Route path='dashboard' element={<DashBoard/>}/>
            <Route path='products' element={<ProductsPage/>}/>
            <Route path='orders' element={<OrdersPage/>}/>
            <Route path='customers' element={<CustomersPage/>}/>
      </Route>
    </Routes>
  )
}

export default App
