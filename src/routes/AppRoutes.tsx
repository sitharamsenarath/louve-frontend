import { Routes, Route } from 'react-router-dom';
import Home from '../pages/customer/Home';
import Shop from '../pages/customer/Shop';
// import other pages like Login, ProductDetail, etc.

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Customer Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      {/* Add more routes below */}
    </Routes>
    
    //   <Routes>
    //     <Route path="/" element={<Home />} />
    //     <Route path="/shop" element={<Shop />} />
    //     <Route path="/cart" element={<Cart />} />
    //     <Route path="/login" element={<Login onLogin={handleLogin} />} />
    //     <Route path="/signup" element={<Signup onSignup={handleLogin} />} />
    //   </Routes>
  );
}
