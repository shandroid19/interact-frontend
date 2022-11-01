// import {useContext, useRef, useState} from 'react';
// import {AuthContext} from '../App';
// import { Redirect,Link,useHistory} from 'react-router-dom'



// export default function Login()
// {
//     const context = useContext(AuthContext)
//     const [autherr,setautherr] = useState(false)
//     let history = useHistory();
//     async function handleSubmit(e)
//     {   
//         e.preventDefault();
//         const resp= await fetch('http://localhost:8000/auth/login',{
//             method:'POST',
//             body: JSON.stringify({username:username,password:password}),
//             headers:{'Content-Type':'application/json'}
//         })
//         if (resp.status ===401 || resp.status ===400){
//             setautherr(true)
//         }
//         else{
//         const out = await resp.json()
//         // context.user=out.user
//         localStorage.setItem('user', JSON.stringify(out.user))
//         localStorage.setItem('token', JSON.stringify(out.token))
//         context.setuser(out.user)
//         setautherr(false)
//         history.push('/')
//         }
//         } 
//     const [user,setuser] = useState(context.user)
//     const [username,setusername] = useState('')
//     const [password,setpassword] = useState('')
//     return (
//             <div className='container d-flex m-5 justify-content-center'>
//                 <div className='card p-5 col-sm-4'style={{backgroundColor:'#53baf5',color:'white'}}>
//                     <h1>Pigeon</h1>
//                     {/* <h1>{context.user.username}</h1> */}
//                 <form onSubmit={handleSubmit}>
//                     <div className='form-group'>
//                     <div className='row d-flex justify-content-center'>
//                     <input onChange={(e)=>setusername(e.target.value)} className='col-5 form-control m-2' placeholder='username or email id' type='text' ></input>
//                     </div>
//                     <div className='row d-flex justify-content-center'>
//                         <input onChange={(e)=>setpassword(e.target.value)} className='col-5 form-control m-2' placeholder='password' type='password'></input>
//                     </div>
//                     <div className='row d-flex justify-content-center'>
//                     <button className='btn btn-primary col-sm-4 m-2 ' type='submit'>Login</button>

//                     </div>
//                     </div>
//                 </form>
//                 {autherr?<div className='card' style={{backgroundColor:'#facfeb',border:'red'}}>wrong email id or password</div>:<></>}
//                 <p>Don't have an account? sign up </p><a onClick={()=>history.push('/register')}>here</a>

//                 </div>
//             </div>
//     )
// }


