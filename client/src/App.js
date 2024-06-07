import { Routes , Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import About from './pages/About';
import Contact from './pages/Contact';
import Policy from './pages/Policy';
import PagenotFound from './pages/PagenotFound';
import Login from './pages/Auth.js/Login';
import Register from './pages/Auth.js/Register';
import "./App.css";
import PrivateRoute from './components/Routes/Private';
import ForgotPassword from './pages/Auth.js/ForgotPassword';
import AdminRoute from './components/Routes/AdminRoute';
import AdminDashboard from './pages/Admin/AdminDashboard';
import Dashboard from './pages/user/Dashboard';
import CreateCategory from "./pages/Admin/CreateCategory";
import CreateProduct from "./pages/Admin/CreateProduct";
import Users from "./pages/Admin/Users";
import Orders from './pages/user/Orders';
import Profile from "./pages/user/Profile";
import Products from './pages/Admin/Products';
import ProductDetails from './pages/ProductDetails';
import Categories from './pages/Categories';
import CategoryProduct from './pages/CategoryProduct';
import CartPage from './pages/CartPage';
import Chatbot from './pages/Chatbot';
// import Search from './pages/search';
//  import Search from './pages/Search.js';

function App() {
  return (
    <>
    <Routes>
      <Route path='/' element={<HomePage/>}/>
      <Route path='/product/:slug' element={<ProductDetails/>}/>
      <Route path='categories' element={<Categories/>}/>
      <Route path='/cart' element={<CartPage/>}/>

      <Route path='category/:slug' element={<CategoryProduct/>}/>
      {/* <Route path='/Search' element={<Search/>}/> */}
      <Route path='/about' element={<About/>}/>
      <Route path='/contact' element={<Contact/>}/>
      <Route path='/Policy' element={<Policy/>}/>
      <Route path='*' element={<PagenotFound/>}/>
      <Route path='/Register' element={<Register/>}/>
      <Route path='/Login' element={<Login/>}/>
      <Route path='/forgot-password' element={<ForgotPassword/>}/>
      {/* <Route path='/dashboard' element={<Dashboard/>}/> */}

      <Route path='/dashboard' element={<PrivateRoute/>}>
        <Route path="" element={<Dashboard/>}/>
        <Route path="user/orders" element={<Orders/>} />
          <Route path="user/profile" element={<Profile />} />
      </Route> 

       {/* <Route path='/dashboard' element={<PrivateRoute/>}>
        <Route path="user" element={<Dashboard/>}/>
      </Route> */}

      
      <Route path='/dashboard' element={<AdminRoute/>}>
        <Route path="admin" element={<AdminDashboard/>}/>
        <Route path="admin/create-category" element={<CreateCategory />} />
        <Route path="admin/create-product" element={<CreateProduct />} />
        <Route path="admin/products" element={<Products />} />
        <Route path="admin/users" element={<Users />} />
      </Route> 

      //chatbot
        <Route path="/chatbot" element={<Chatbot />} />

    </Routes>
    </>
  );
}

export default App;