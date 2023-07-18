import axios from 'axios';
import Joi from 'joi';
import React , {useState} from 'react'
import { useNavigate } from 'react-router-dom';



export default function Register(){
    const [errorList,setErrorList]= useState([]);
    const [isLoading,setIsLoading]= useState(false);
    let navigate = useNavigate() ;

    const [error ,setError]=useState('');
    const [user, setUser ]= useState({
        first_name:'',
        second_name:'',
        age:0,
        email:'',
        password:'',

    });
    function getUserData(e){
       let myUser ={...user};//copy user 
       myUser[e.target.name] =e.target.value;
       setUser(myUser);
    }
    async function submetRegisterForm(e){
        e.preventDefault();
        setIsLoading(true);
        let validationResult = validateRegisterForm();
    if (validationResult.error){
        setErrorList(validationResult.error.details);
        setIsLoading(false);
        }
        else{
            let {data} = await axios.post('https://route-egypt-api.herokuapp.com/signup',user) ;
            if (data.message==='success')
            {
                setIsLoading(false);
             //navegate to login
             navigate('/login')
            } 
            else{
             setError(data.message) 
             setIsLoading(false);
            }
         }
        }
      
    function validateRegisterForm(){
        let scheme =Joi.object({
            first_name: Joi.string().alphanum().min(3).max(10).required(),
            second_name: Joi.string().alphanum().min(3).max(10).required(),
            age: Joi.number().min(10).max(30).required(),
            email: Joi.string().email({minDomainSegments:2, tlds: {allow:['com','net']}}).required(),
            password: Joi.string().pattern(new RegExp('^[A-Z][a-z]{3,8}$')).required()
        });
       return scheme.validate(user,{abortErarly: false});
    }
    return(
        <>
        <div className="w-75 mx-auto">
        <h2>Register Now</h2>
        {errorList.map((error)=><div className='alert alert-danger'>{error.message}</div> )}
        {error? <div className='alert  alert.danger'>{error}</div> :''}
        <form onSubmit={submetRegisterForm}> 
            <label htmlFor="first_name">first_name :</label>
            <input onChange={getUserData} className='form-control mb-2' id='first_name' name='first_name' />

            <label htmlFor="second_name">second_name :</label>
            <input onChange={getUserData} className='form-control mb-2' id='second_name' name='second_name' />

            <label htmlFor="age">age :</label>
            <input onChange={getUserData} type="number" className='form-control mb-2' id='age' name='age' />
        
            <label htmlFor="email">email :</label>
            <input onChange={getUserData} type="email" className='form-control mb-2' id='email' name='email' />
        
            <label htmlFor="password">password:</label>
            <input onChange={getUserData} type="password" className='form-control mb-2' id='password' name='password' />

            <button type='submet' className='btn btn-outline-info' >
               {isLoading?<i className='fas fa-spinner fa-spin'></i>:'register' }</button>
        
         
        </form>
        </div>
       
        
        </>
    )
}