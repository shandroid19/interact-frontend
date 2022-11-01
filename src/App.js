
import React from 'react';
import SearchComponent from './components/Search'
import Notifications from './components/Notifications'
import SinglePost from './components/SinglePost';
import './App.css'
import logo from './components/favicon.png'
import {Menu,InputBase,MenuItem,Box} from '@material-ui/core'
import {Mail,More,AccountCircle} from '@material-ui/icons'
import {Badge,Grid,CssBaseline,AppBar,Avatar,Toolbar,IconButton,Typography,Container,Button} from '@material-ui/core'
import Feed from './components/Feed'
import User from './components/User'
import GLogin from "./components/GLogin"
import Chat from './components/Chat' 
import ChatIcon from '@material-ui/icons/Chat'
import NotificationsIcon from '@material-ui/icons/Notifications';
import { GoogleLogout,useGoogleLogin} from 'react-google-login';
import {
  useHistory,
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import { useState,createContext,useEffect } from "react";
import { ThemeProvider, createMuiTheme, makeStyles, fade} from "@material-ui/core/styles";
import { compose, spacing, palette, styleFunctionSx,display } from '@material-ui/system';
import MoreIcon from '@material-ui/icons/MoreVert';




export const AuthContext = createContext()


const clientId ='504774353232-i4ctofb91259kii33088t50e8cl2c2si.apps.googleusercontent.com'
function App() {


  // const origin='https://interact-9535.herokuapp.com'
  const origin = proces.env.BACKEND_URL
  const [tok,setok] = useState(null)
  const [signin,setsignin] = useState(false);
  const [details,setdetails] = useState(null);
  const [update,setupdate] = useState(false);
  const [user,setuser] = useState(null)
  // const [anchorEl, setAnchorEl] =useState(null);
  const notopen = Boolean(null);
  const [unread,setunread] = useState(0)
  // const notid = notopen ? 'not-popper' : undefined;
  const {signIn} = useGoogleLogin({clientId:clientId,onSuccess:onSuccess,isSignedIn:true})


  function onSuccess(ob){
  fetch(origin+'/auth/login',{
    method:'POST',
    body: JSON.stringify({userId:ob.profileObj.googleId}),
    headers:{'Content-Type':'application/json','Authorization':ob.tokenObj.id_token}
 }
 )

  }

  useEffect(()=>{
    if(window.gapi)
       signIn()
 },[])

  // useEffect(()=>{
  //   let obj;
  //   if(window.gapi){
  //   window.gapi.load('auth2',()=>{
  //     window.gapi.auth2.init({
  //       client_id:clientId
  //     }).then(()=>{
  //       // console.log('signing in')
  //       obj = window.gapi.auth2.getAuthInstance()
  //       if(obj.isSignedIn.get()){
  //         let profile = obj.currentUser.get().getBasicProfile()
  //         setuser({googleId:profile.getId(),
  //           imageUrl:profile.getImageUrl(),
  //           email:profile.getEmail(),
  //           givenName:profile.getGivenName(),
  //           name:profile.getName()
  //         })
  //         // setdetails({googleId:profile.getId(),
  //         //   imageUrl:profile.getImageUrl(),
  //         //   email:profile.getEmail(),
  //         //   givenName:profile.getGivenName(),
  //         //   name:profile.getName()
  //         // })
  //        const tokk = obj.currentUser.get().getAuthResponse().id_token
  //         setok(tokk)
  //       }
  //     }).catch((err)=>{console.log(err)})
  //   })
  // }
  // },[])


  useEffect(()=>{

    if(user){
      getresp()
    }
  },[tok,details,update])
  
const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  title:{
    marginRight:theme.spacing(1),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    // marginRight: theme.spacing(2),
    marginLeft: theme.spacing(1),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  // searchIcon: {
  //   padding: theme.spacing(0, 2),
  //   height: '100%',
  //   position: 'absolute',
  //   pointerEvents: 'none',
  //   display: 'flex',
  //   alignItems: 'center',
  //   justifyContent: 'center',
    
  // },
  inputRoot: {
    color: 'inherit',

  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
    display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  avatarSmall:{
    height:theme.spacing(4),
    width:theme.spacing(4)
  },
}));

const classes = useStyles();


  
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const logout = ()=>{console.log('logged out');window.location.reload();}
  async function getresp(){
        const resp = await fetch(origin+'/auth/login',{
        method:'POST',
        body: JSON.stringify({userId:user.googleId}),
        headers:{'Content-Type':'application/json','Authorization':tok}
    })
       const out =await resp.json()

    if(resp.status===200 || resp.status===204){
        if(!details)
        setdetails(out.user)
        setsignin(false)
        setunread(out.user.unreadchats)
    }
    else{
        setsignin(true)
        console.log('user not found')
      }
  }

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleprofile = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
    history.push(`/users/${details.userId}`)
  };

  const handlechat= () => {
    setAnchorEl(null);
    handleMobileMenuClose();
    history.push(`/users/${details.userId}`)
  };


  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  // const renderMenu = (
  //   <Menu
  //     anchorEl={anchorEl}
  //     anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
  //     id={menuId}
  //     keepMounted
  //     transformOrigin={{ vertical: 'top', horizontal: 'right' }}
  //     open={isMenuOpen}
  //     onClose={handleMenuClose}
  //   >
  //     <MenuItem onClick={handleprofile}>Profile</MenuItem>
  //     <MenuItem onClick={handleMenuClose}>My account</MenuItem>
  //   </Menu>
  // );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={()=>history.push('/chat')}>
           <IconButton onClick={()=>history.push('/chat')}>
           {!details?.unreadchats?
          <ChatIcon/>:
           <Badge color='secondary' badgeContent={unread}>
           <ChatIcon />
           </Badge>}
           </IconButton>
           <p>Messages</p>
          </MenuItem>
          <MenuItem onClick={()=>history.push('/notification')}>
           <IconButton onClick={()=>history.push('/notification')}>
           {!details?.notifications?
           <NotificationsIcon/>:
           <Badge color='secondary' badgeContent={details.notifications}>
          <NotificationsIcon />
          </Badge>}
           </IconButton>
           <p>Notifications </p>
           </MenuItem>
              <MenuItem onClick={handleprofile}>
              {details?<><IconButton >
      
           <Avatar src={details.profilePicture} className={classes.avatarSmall}></Avatar>
           </IconButton><p>Account</p></>:<Link style={{textDecoration:'None',color:'white',textAlign:'center',display:'flex'}} to='/signup'>SignUp</Link>}

      </MenuItem>
      <MenuItem >
      <IconButton>
{user?
 <div>
  <GoogleLogout
  clientId="504774353232-i4ctofb91259kii33088t50e8cl2c2si.apps.googleusercontent.com"
  buttonText="Logout"
  render={renderProps => (
    <Button  variant='contained' color='secondary' onClick={renderProps.onClick}>
     Logout
    </Button>
   )} 
  onLogoutSuccess={logout}>
  </GoogleLogout>
  </div>
 :<div>
<></>
</div>
}
</IconButton>
      </MenuItem>
    </Menu>
  );




  const history = useHistory();

  
  // const onSuccess = res=>{
  // window.gapi?.load('auth2',()=>{
  //       window.gapi.auth2.init({
  //         client_id:clientId
  //       }).then(()=>{
  //         const obj = window.gapi.auth2.getAuthInstance()
  //         if(obj.isSignedIn.get()){
  //           let profile = obj.currentUser.get().getBasicProfile()
  //           setuser({googleId:profile.getId(),
  //             imageUrl:profile.getImageUrl(),
  //             email:profile.getEmail(),
  //             givenName:profile.getGivenName(),
  //             name:profile.getName()
  //           })
  //          const tokk = obj.currentUser.get().getAuthResponse().id_token
  //           setok(tokk)
  //         }
  //       }).then(()=>history.push('/'))
  //     })
    // setTimeout(()=>{if(user===null) window.location.reload()},3000)
// }

  // !user && onSuccess()

  const lightheme = createMuiTheme({
    overrides: {
      MuiCssBaseline: {
  '@global': {
    '*::-webkit-scrollbar':{
      width: '10px'
    },
    
    /* Track */
    '*::-webkit-scrollbar-track':{
      background: '#f1f1f1'
    },
     
    /* Handle */
    '*::-webkit-scrollbar-thumb':{
      background: '#888'
    },
    
    /* Handle on hover */
    '*::-webkit-scrollbar-thumb:hover':{
      background: '#555'
    },
  },
      }
    },

    typography:{
      fontFamily:["Armata",'sans-serif',"Encode Sans","sans-serif","Questrial",'sans-serif'],
      h5:{
      fontFamily: ["Questrial", 'sans-serif'].join(',')
      },
      h6:{
        fontFamily: ["Questrial",'sans-serif'].join(',')
         
      },
    },
    palette: {
      type:'light',
      primary: 
      {
        // main:'#8f00ff', //violet
        // main:'#05Ce91', //green 
        // main:'#1EA5Fc', //blue
        // main:"#ff385d",
        main:'#a6dcf7',
        card:"#edebeb",
        // mainGradient: "linear-gradient(to right,#ff385d, #3541b5)",
        // ultamainGradient: "linear-gradient(to left,#ff385d, #3541b5)",
        contrastText: '#000000',
        text: '#000000'
      },
      secondary: {
        light: '#e8e8e8',
        main: '#e6e6e6',
        contrastText: '#000000',
      },
      info:{
        main:'#e0e0e0',
        light: '#e8e8e8',
        contrastText: '#00000',
      },
      background:{
        default:'#edebeb',
        // default:'#d6e9ff', //blue
        // default:'#d4bdff', //violet
        // default:'#f7f0c8', //green
        // paper:'#d4ffdc',
        // paper:'#70cefa'//prev
        paper:'#f0f9fa',
        contrastText: '#000000',
        

      },
      contrastThreshold: 4,
      

      tonalOffset: 0.2,
    },
  });

  const darktheme = createMuiTheme({
    overrides: {
      MuiCssBaseline: {
  '@global': {
    '*::-webkit-scrollbar':{
      width: '0.6rem',
    },
    
    /* Track */
    '*::-webkit-scrollbar-track':{
      background: '#f1f1f1'
    },
     
    /* Handle */
    '*::-webkit-scrollbar-thumb':{
      background: '#888'
    },
    
    /* Handle on hover */
    '*::-webkit-scrollbar-thumb:hover':{
      background: '#555'
    },
  },
      }
    },
    typography:{
      fontFamily:["Armata",'sans-serif',"Encode Sans","sans-serif","Questrial",'sans-serif'],
      h5:{
      fontFamily: ["Questrial", 'sans-serif'].join(',')
      },
      h6:{
        fontFamily: ["Questrial",'sans-serif'].join(',')
         
      },
    },
    palette: {
      type:'dark'
      ,
      primary: 
      {
        // main:'#8f00ff', //violet
        main:'#383838', //green
        // main:'#1EA5Fc', //blue
        card:'black',
        text: 'white',
        contrastText: '#fff',
      },
      secondary: {
        main: '#8a8a8a',
        contrastText: '#ffffff',
      },
      info:{
        main:'#4103fc',
        light: '#0066ff',
        contrastText: '#ffff',
      },
      background:{
        // default:'#d6e9ff', //blue
        // default:'#d4bdff', //violet
        default:'black', //green
        paper:'#474747',
        contrastText: '#ffff',
      },
      contrastThreshold: 4,

      tonalOffset: 0.2,
    },
  });



  return (
    < ThemeProvider theme={details?.darkmode?darktheme:lightheme}>
    <AuthContext.Provider value={{user,setuser,setok,setdetails,tok,details,origin}}>
    <CssBaseline/>
    {/* <Router > */}
    <Switch> 
      <>
          {!details?<></>:
        //   <AppBar position='static'>
        // <Toolbar>
        //     <Container>
        //   <Grid container justify='flex-end' alignItems='center'>
        //     <Grid item lg={8} md={7} xs={12}>
        //       <Grid container justify='center'>
        //         <Grid item xs={5}>
        //           <Grid container>
        //             <Grid item>
        //   <Link style={{textDecoration:'none'}} to='/'>
        //   <Typography color='textPrimary' variant="h5">
        //   Interact
        //   </Typography>
        //   </Link>
        //   </Grid>
        //   </Grid>
        //   </Grid>
        //   <Grid item xs={7}>
        //     <Grid container justify='flex-start'>
        //       <Grid id='grr' item xs={12}>
        //     <div><SearchComponent/></div>
        //     </Grid>
        //     </Grid>
        //     </Grid>

        //   </Grid>
        //     </Grid>


          
        //  <Grid item lg={4} md={5} xs={12} >
        //   <div className={classes.hidebox}>
        //   <Grid container justify='center' alignItems='center' >
        //   <Grid item xs={2}>  
        //   {details && !signin?<Link style={{textDecoration:'None'}} to='/'><Typography color='textPrimary'> Feed </Typography></Link>:<></>}
        //   </Grid>   
        //   <Grid item xs={2}>   
        // <Link style={{textDecoration:'None'}} to='/chat'  >
        //   <IconButton>
        //   {!details?.unreadchats?
        //   <ChatIcon/>:
        //   <Badge color='secondary' badgeContent={unread}>
        //   <ChatIcon />
        //   </Badge>}
        //   </IconButton>
        //   </Link>
        //   </Grid>
        //   <Grid item xs={2}>    
        //   <Link  style={{textDecoration:'None'}} to='/notification'>
        //     <IconButton>
        //   {!details?.notifications?
        //   <NotificationsIcon/>:
        //   <Badge color='secondary' badgeContent={details.notifications}>
        //   <NotificationsIcon />
        //   </Badge>}
        //   </IconButton>
        //   </Link>
        //   </Grid>
        //   <Grid item xs={2} >    
        //   {details?<IconButton ><div><Link to={`/users/${details.userId}`} style={{textDecoration:'None',textAlign:'center'}} color='textPrimary'>
      
        //     <Avatar src={details.profilePicture}></Avatar>
        //     </Link></div></IconButton>:<Link style={{textDecoration:'None',color:'white',textAlign:'center'}} to='/signup'>SignUp</Link>}
          
        //   </Grid>
        //   <Grid item > 
        //   <IconButton>
        // {user?
        //  <div>
        //   <GoogleLogout
        //   clientId="504774353232-i4ctofb91259kii33088t50e8cl2c2si.apps.googleusercontent.com"
        //   buttonText="Logout"
        //   render={renderProps => (
        //     <Button  variant='contained' color='secondary' onClick={renderProps.onClick}>
        //      Logout
        //     </Button>
        //    )} 
        //   onLogoutSuccess={logout}>
        //   </GoogleLogout>
        //   </div>
        //  :<div>
        // <></>
        // </div>
        // }
        // </IconButton>
        // </Grid>
        // </Grid>
        // </div> 
        // </Grid> 
        
 
          
        //   </Grid>
        //   </Container>
        //   </Toolbar>
        // </AppBar>
        // <Navbar></Navbar>
        <div className={classes.grow}>
        <AppBar position="static">
          <Toolbar>
             <Link style={{textDecoration:'none'}} to='/'>
           {/* <Typography color='textPrimary' className={classes.title} variant="h5">
           Interact
          </Typography> */}
          <img className='logo' src = {logo}></img>
           </Link>
            <div className={classes.search}>
              <SearchComponent/>
            </div>
            <div className={classes.grow} />
            <div className={classes.sectionDesktop} style={{alignItems:'center'}}>
           <IconButton onClick={()=>history.push('/chat')}>
           {!details?.unreadchats?
          <ChatIcon/>:
           <Badge color='secondary' badgeContent={unread}>
           <ChatIcon />
           </Badge>}
           </IconButton>

           <IconButton onClick={()=>history.push('/notification')}>
           {!details?.notifications?
           <NotificationsIcon/>:
           <Badge color='secondary' badgeContent={details.notifications}>
          <NotificationsIcon />
          </Badge>}
           </IconButton>

              {details?<IconButton ><div><Link to={`/users/${details.userId}`} style={{textDecoration:'None',textAlign:'center'}} color='textPrimary'>
      
           <Avatar src={details.profilePicture} className={classes.avatarSmall}></Avatar>
           </Link></div></IconButton>:<Link style={{textDecoration:'None',color:'white',textAlign:'center'}} to='/signup'>SignUp</Link>}
            <IconButton>

         {user?
          <div>
           <GoogleLogout
           clientId="504774353232-i4ctofb91259kii33088t50e8cl2c2si.apps.googleusercontent.com"
           buttonText="Logout"
           render={renderProps => (
             <Button  variant='contained' color='secondary' onClick={renderProps.onClick}>
              Logout
             </Button>
            )} 
           onLogoutSuccess={logout}>
           </GoogleLogout>
           </div>
          :<div>
         <></>
         </div>
         }
         </IconButton>
        </div>
            <div className={classes.sectionMobile}>
              <IconButton
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {/* {renderMenu} */}
      </div>
        }
        <Route path="/signup">
          <GLogin/>
        </Route>
         {/* {signin?<Redirect to='/signup'/>:<></>} */}
        {!signin? <Redirect to='/signup'/>:<></>}
        {/* <Route path="/">
          <Redirect to='/signup'/></Route> */}
          <Route path='/user'>{!details?<></>:<div><User/><Feed /></div>}</Route>
          <Route exact path='/'>{!details?<></>:<Feed />}</Route>
          {/* <Route path='/chat'>{!details?<></>:<Chat/>}</Route> */}
          <Route path='/chat'>{!details?<></>:<Chat setupdate={setupdate}update={update}/>}</Route>
          <Route path='/users/:id' >{!details?<></>:<><User/><Feed/></>}</Route>
          <Route path='/notification' >{!details?<></>:<Notifications/>}</Route>
          <Route path='/search'><SearchComponent/></Route>
          <Route path='/post/:postid'><SinglePost/></Route>
          </>
      </Switch>
      
    {/* </Router> */}
    </AuthContext.Provider>
    </ ThemeProvider>
  );
}



export default App;
 

