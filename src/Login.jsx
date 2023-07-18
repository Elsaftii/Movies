import axios from 'axios';
import Joi from 'joi';
import React , {useState} from 'react'
import { useNavigate } from 'react-router-dom';



export default function Login(props){
    const [errorList,setErrorList]= useState([]);
    const [isLoading,setIsLoading]= useState(false);
    let navigate = useNavigate() ;

    const [error ,setError]=useState('');
    const [user, setUser ]= useState({
        email:'',
        password:'',

    });
    function getUserData(e){
       let myUser ={...user};//copy user 
       myUser[e.target.name] =e.target.value;
       setUser(myUser);
    }
    async function submetLoginForm(e){
        e.preventDefault();
        setIsLoading(true);
        let validationResult = validateLoginForm();
    if (validationResult.error){
        setErrorList(validationResult.error.details);
        setIsLoading(false);
        }
        else{
            let {data} = await axios.post('https://route-egypt-api.herokuapp.com/signin',user) ;
            if (data.message==='success')
            {
                setIsLoading(false);
             localStorage.setItem('userToken',data.token)
             props.saveUserData();

             navigate('/home')
            } 
            else{
             setError(data.message) 
             setIsLoading(false);
            }
         }
        }
      
    function validateLoginForm(){
        let scheme =Joi.object({
            email: Joi.string().email({minDomainSegments:2, tlds: {allow:['com','net']}}).required(),
            password: Joi.string().pattern(new RegExp('^[A-Z][a-z]{3,8}$')).required()
        });
       return scheme.validate(user,{abortErarly: false});
    }
    return(
        <>
        <div className="w-75 mx-auto">
        <h2>Login Now</h2>
        {errorList.map((error)=><div className='alert alert-danger'>{error.message}</div> )}
        {error? <div className='alert  alert.danger'>{error}</div> :''}
        <form onSubmit={submetLoginForm}> 
            <label htmlFor="email">email :</label>
            <input onChange={getUserData} type="email" className='form-control mb-2' id='email' name='email' />
        
            <label htmlFor="password">password:</label>
            <input onChange={getUserData} type="password" className='form-control mb-2' id='password' name='password' />

            <button type='submet' className='btn btn-outline-info' >
               {isLoading?<i className='fas fa-spinner fa-spin'></i>:'Login' }</button>
        
         
        </form>
        </div>
       
        
        </>
    )
}