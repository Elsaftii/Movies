import Footer from './Footer';
import Home from './Home';
import Login from './Login';
import Movies from './Movies';
import Navbar from './Navbar';
import Notfound from './Notfound';
import People from './People';
import Register from './Register';
import { Routes, Route, Navigate ,useNavigate} from 'react-router-dom';
import Tv from './Tv';
import { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';


export default function App(){
   let navigate = useNavigate();
   const [userData, setUserData]= useState(null);

   function saveUserData()
   {
     let encodedToken =localStorage.getItem('userToken');
     let decodedToken= jwtDecode(encodedToken);
     setUserData(decodedToken)
   }
   function logOut()
   {
     setUserData(null);
     localStorage.removeItem('userToken');
     navigate ('/login')
   }
   //componant didmont (34an el reload)
   useEffect(() => {
      if(localStorage.getItem('userToken'))
      {
         saveUserData();
      }
   },[])

   function ProtectedRoute(props)
   {
      if(localStorage.getItem('userToken')===null )
      {
        return <Navigate to='login'/>
      }
      else
      {
        return props.children;
      }
   }
    return(<>
       <Navbar logOut={logOut} userData={userData}/>
       <div className="container-fluid">  <Routes>
            <Route path='' element={ <ProtectedRoute> <Home/> </ProtectedRoute> }/>
            <Route path='home' element={ <ProtectedRoute><Home/> </ProtectedRoute>}/>
            <Route path='movies' element={ <ProtectedRoute><Movies/></ProtectedRoute>}/>
            <Route path='tv' element={ <ProtectedRoute> <Tv/></ProtectedRoute>}/>
            <Route path='people' element={ <ProtectedRoute><People/></ProtectedRoute>}/>
            <Route path='login' element={<Login saveUserData={saveUserData}/>}/>
            <Route path='register' element={<Register/>}/>
            <Route path='*' element={<Notfound/>}/>
         </Routes>
         </div>
       
        <Footer/> 
        </> )
}