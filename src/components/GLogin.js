
import {useState,useRef, useContext,useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import {AuthContext} from '../App'
import { GoogleLogin,GoogleLogout,useGoogleLogin} from 'react-google-login';
import {Typography,Step,StepLabel,Stepper,Switch,Button,TextField,Grid,Box,Card,CardHeader,CardContent} from '@material-ui/core'

export default function Signup(){
const bio = useRef(null)
const username = useRef(null)
const name = useRef(null)
const history = useHistory();

const clientId="client id here"
const city = useRef(null)
const [autherr,setautherr] = useState(null)
const [dark,setdark] = useState(false)
const [priv,setpriv] = useState(false)
const [jokes,setjokes]=useState(false)


   const context = useContext(AuthContext);
   const origin = context.origin;
   const Memer = require("random-jokes-api");
   const [next,setnext] = useState(true)

   useEffect(()=>{
      if(!context.details)
         signIn()
   },[])

   const onSuccess = (obj)=>
   {
         context.setok(obj.tokenId)
         context.setuser({googleId:obj.profileObj.googleId,
               imageUrl:obj.profileObj.imageUrl,
               email:obj.profileObj.email,
               givenName:obj.profileObj.givenName,
               name:obj.profileObj.name
             }
         )
      fetch(origin+'/auth/login',{
         method:'POST',
         body: JSON.stringify({userId:obj.profileObj.googleId}),
         headers:{'Content-Type':'application/json','Authorization':obj.tokenObj.id_token}
      }).then(async (resp)=>{
         const res = await resp.json()
         if(resp.status===200 || resp.status===204){
                  history.push('/')
                  if(!context.details)
                  context.setdetails(res.user)
         }
      })
   }

   function onf(ob){
      fetch(origin+'/auth/login',{
         method:'POST',
         body: JSON.stringify({userId:ob.profileObj.googleId}),
         headers:{'Content-Type':'application/json','Authorization':ob.tokenObj.id_token}
      }).then((resp)=>{
         if(resp.status===200 || resp.status===204){
            history.push('/')
         }
         else 
         {
            setnext(false)
         }
      })
   }
   const {signIn} = useGoogleLogin({clientId:clientId,onSuccess:onf,isSignedIn:true})


   async function handleSubmit(e)
  {   
      e.preventDefault();
      const resp= await fetch(origin+'/auth/signup',{
          method:'POST',
          body: JSON.stringify({userId:context.user.googleId,email:context.user.email,username:username.current.value,name:name.current.value,profilePicture:context.user.imageUrl,city:city.current.value,bio:bio.current.value,darkmode:dark,priv:priv}),
          headers:{'Content-Type':'application/json','Authorization':context.tok}

      })
      if (resp.status ===500 ){
          setautherr(true)
      }
      else{
      const out = await resp.json()
      console.log(out)

      setautherr(false)
      window.location.reload()
      }
      } 
      
   const joke = ()=>{
      return(
         <div>
            <CardContent>
            <Grid container>
               <Grid item>
               </Grid>
               <Grid item xs={12}>
                  <Grid container justify='flex-end'>
                     <Grid item xs={12}>
                        <Typography variant='h5'>{Memer.joke()}</Typography>
                     </Grid>
                     <Grid item>
                        <Typography>
                           Click next if you found this funny.
                           Not funny? click on refresh for a different joke
                        </Typography>
                     </Grid>
                     <Grid item xs={12}>
                        <Grid container spacing={2} justify='center'>
                        <Grid item>
                        <Button variant='contained'  onClick={handleBack}>Back</Button>
                        </Grid>
                        <Grid item>
                        <Button variant='contained' color='primary' onClick={()=>setjokes(!jokes)}>Refresh</Button>
                        </Grid>
                        <Grid item>
                        <Button variant='contained' color='secondary' onClick={handleNext}>Next</Button>
                        </Grid>
                        </Grid>
                     </Grid>
                  </Grid>
               </Grid>
            </Grid>
            </CardContent>
         </div>
      )
   }


   const profileset = ()=>{
      return(context.user?
         <div>
         <Grid container alignItems='center' spacing={4}>
         <Grid item xs={3}>    
      <img style={{borderRadius:'50%', height:'5rem',width:'5rem'}} src={context.user.imageUrl}></img>
         </Grid>
         <Grid item xs={6}>    
         <h4>{context.user.name}</h4>
         </Grid>
         </Grid>
         <Grid container stretch justify='center' spacing={3}>
            <Grid item sm={6}>
               <TextField inputRef={username} variant='outlined' placeholder='username'></TextField>
            </Grid>
            <Grid item sm={6}>
               <TextField inputRef={name} variant='outlined' placeholder='name'></TextField>
            </Grid>
            <Grid item xs={6}>
               <TextField inputRef={city} variant='outlined' placeholder='city'></TextField>
            </Grid>
            <Grid item xs={6}>
               <Grid container spacing={0} alignItems='center'>
               <Grid item xs={6}>
               <label> Dark theme</label>
               </Grid>
               <Grid item xs={6}>
               <Switch checked={dark} onChange={()=>setdark(!dark)}></Switch>
               </Grid>
               <Grid item xs={6}>
               <label> private</label>
               </Grid>
               <Grid item xs={6}>
               <Switch checked={priv} onChange={()=>setpriv(!priv)}></Switch>
               </Grid>
               </Grid>
            </Grid>
            <Grid item xs={12}>
               <TextField multiline inputRef={bio} rows={4} fullWidth variant='outlined' placeholder='bio'></TextField>
            </Grid>

                     {autherr?<Grid item xs={12}><p style={{color:'red'}}>username is already taken</p></Grid>:<></>}
                     <Grid item xs={12}>
                        <Grid container spacing={2} justify='center'>
                        <Grid item>
                        <Button variant='contained'  onClick={handleBack}>Back</Button>
                        </Grid>
                        <Grid item>
                        <Button onClick={handleSubmit} variant='contained' color='secondary'>Signup</Button>
                        </Grid>
                        </Grid>
                     </Grid>
         </Grid>
         </div>
         :<></>)
   } 


   const login = ()=>{return(
      <div>
         <CardContent>

         <Grid container justify='center' spacing={2}>

            <Grid item>
                 {context.user?
         <div>
          <GoogleLogout
          clientId="504774353232-i4ctofb91259kii33088t50e8cl2c2si.apps.googleusercontent.com"
          render={renderProps => (
            <Button color='secondary' variant='contained' onClick={renderProps.onClick}>
             Logout
            </Button>
           )}  
          onLogoutSuccess={()=>{window.location.reload()}}
          >
          </GoogleLogout>
          </div>
         :<div>
         <GoogleLogin
        clientId={clientId}
        onSuccess={onSuccess}
        render={renderProps => (
         <Button color='secondary' variant='contained' onClick={renderProps.onClick}>
          Login
         </Button>
        )}        
        cookiePolicy={'single_host_origin'}
        isSignedIn={true}></GoogleLogin></div>
        }
        </Grid>
        <Grid item xs={12}>
           <CardContent>
           <Typography align='justify'>
            Pigeon does not require password since it authenticates based on your google accounts.
            By logging in, we will have access to your username,email ID, google ID and profile picture. 
           </Typography>
           </CardContent>
         </Grid>
         <Grid item xs={12}>
            <Grid container justify='flex-end'>
               <Grid item>
            <Button variant='contained' disabled={!context.user && next?true:false} color='secondary' onClick={handleNext}>Next</Button>
               </Grid>
            </Grid>
         </Grid>
         </Grid>
         </CardContent>

      </div>
   )} 


   function getSteps() {
      return ['Login with Google','laugh at a joke', 'Create user profile'];
    }
    
    function getStepContent(stepIndex) {
      switch (stepIndex) {
        case 0:
          return login();
        case 1:
           return joke();
        case 2:
         return profileset();
         default:
          return 'Unknown stepIndex';
      }
    }
      const [activeStep, setActiveStep] = useState(0);
      const steps = getSteps();
    
      const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      };
    
      const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
      };
   
   
return (<div style={{marginBottom:'5rem'}}>
   <div >
      <Grid container justify='center'>
            <Grid item sm={6}>
            <Box boxShadow={22} >

         <Card style={{marginTop:'2rem'}}>
            <CardHeader title="Sign Up "/>
 <CardContent>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
            {getStepContent(activeStep)}
            </CardContent>
         </Card>
         </Box>

         </Grid>
      </Grid>
   </div>

   </div>)
   }
