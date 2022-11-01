import React, {useRef,useState, useContext, useEffect} from "react";
import '../App.css'
import Addpost from './Addpost'
import {useParams,useHistory } from 'react-router-dom'
import {makeStyles,useTheme} from '@material-ui/styles'

import LinearProgress from '@material-ui/core/LinearProgress'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'


import {AuthContext} from '../App'
import { Typography,Switch,DialogContent,Dialog,DialogTitle,CardHeader,CardContent,Card,Grid,CircularProgress,InputBase,TextField,ButtonBase,Avatar } from "@material-ui/core";
import Compressor from 'compressorjs';

function User()
{
    const {id} = useParams()
    const context = useContext(AuthContext)
    const origin = context.origin;

    const [details,setdetails ] = useState(null)
    var eyed = id
    const [edit,setedit] = useState(false)
    const [loading,setloading] = useState(false)
    // const [cover,setcover]= useState(context.details.cover)
    const [dp,setdp]= useState(null)
    const [openfollowers,setopenfollowers] = useState(false)
    const [openfollowings,setopenfollowings] = useState(false)
    const [followers,setfollowers] = useState([])
    const [followings,setfollowings] = useState([])
    const username = useRef(context.details.username)
    const bio = useRef(context.details.bio)
    const city = useRef(context.details.city)
    const name = useRef(context.details.name)
    const [priv,setpriv] = useState(context.details.private)
    const [dark,setdark] = useState(context.details.darkmode)
    const followingsloader = useRef(null);
    const [autherr,setautherr]=useState(false)
const [followingspage,setfollowingspage] = useState(1)
const [followingsmax,setfollowingsmax] = useState(1)
const followerloader = useRef(null);
const [followerpage,setfollowerpage] = useState(1)
const [followermax,setfollowermax] = useState(1)
    const history = useHistory()
    const theme = useTheme()


    useEffect(()=>{
        if(!window.gapi)
           history.push('/signup')
    },[])
    useEffect(()=>{
        fetch(origin+'/user/'+id+'/get',
        {
            method:'GET',
            headers:{'Content-Type':'application/json','Authorization':context.tok}
        }).then((resp)=>{return resp.json()}).then((res)=>{setdetails(res);})
    },[id])
    useEffect(()=>{if(details)setdp(details.profilePicture)},[details])
    const setEdit = ()=>{setedit(true);setdark(details.darkmode);setpriv(details.private)}
    const follow = ()=>{
        fetch(origin+'/user/'+eyed+'/follow',
        {
            method:'PUT',
            headers:{'Content-Type':'application/json','Authorization':context.tok}
        }).then((resp)=>{console.log(resp.json())}).then(()=>window.location.reload())
    }
    const unfollow = ()=>{
        fetch(origin+'/user/'+eyed+'/unfollow',
        {
            method:'PUT',
            headers:{'Content-Type':'application/json','Authorization':context.tok}
        }).then((resp)=>{console.log(resp.json())}).then(()=>window.location.reload())
     
    }

    const sendrequest = ()=>{
        fetch(origin+'/user/'+eyed+'/sendrequest',
        {
            method:'POST',
            headers:{'Content-Type':'application/json','Authorization':context.tok}
        }).then((resp)=>{console.log(resp.json())}).then(()=>window.location.reload())
    
    }

    const cancelrequest = ()=>{
        fetch(origin+'/user/'+eyed+'/cancelrequest',
        {
            method:'DELETE',
            headers:{'Content-Type':'application/json','Authorization':context.tok}
        }).then((resp)=>{console.log(resp.json())}).then(()=>window.location.reload())
    }

    const rejectrequest = ()=>{
        fetch(origin+'/user/'+eyed+'/rejectrequest',
        {
            method:'DELETE',
            headers:{'Content-Type':'application/json','Authorization':context.tok}
        }).then((resp)=>{window.location.reload()})
        
    }
    const acceptrequest = ()=>{
        fetch(origin+'/user/'+eyed+'/acceptrequest',
        {
            method:'POST',
            headers:{'Content-Type':'application/json','Authorization':context.tok}
        }).then((resp)=>{window.location.reload()})
        
    }
    const uploadImage = async e=> {
        const files = e.target.files
        if (!files[0]) {
            return;
          }
        
          new Compressor(files[0], {
            quality: 0.6,
        
            // The compression process is asynchronous,
            // which means you have to access the `result` in the `success` hook function.
            async success(result) {

        setloading(true)
        const data = new FormData()
        data.append('file',result)
        data.append('upload_preset','pigeon')
        let filname=result.name.toLowerCase();
        if(!(filname.endsWith('.jpg')||filname.endsWith('.png')||filname.endsWith('.jpeg')))
          {
            alert("Only '.png' , '.jpg' and '.jpeg' formats supported!");
            return;
          }          
        const res = await fetch("https://api.cloudinary.com/v1_1/shandroid/image/upload",
        {
            method: 'POST',
            body:data
        })
        const file = await res.json()
        setdp(file.secure_url);
        setloading(false)
    
    }})
}

    async function handleSubmit(e)
    {   
        e.preventDefault();
        console.log(context.tok)
        fetch(origin+'/user',{
            method:'PUT',
            headers:{'Content-Type':'application/json','Authorization':context.tok},
            body: JSON.stringify({username:username.current.value,name:name.current.value,profilePicture:dp,city:city.current.value,bio:bio.current.value,darkmode:dark,private:priv}),
        }).then((resp)=>{
            if (resp.status ===500 ){
                setautherr(true)
            }
            else
                window.location.reload()})
        } 

    const getfollowers = ()=>{
        fetch(origin+'/user/'+details.userId+'/followers?p=1',{
            method:'GET',
            headers:{'Content-Type':'application/json','Authorization':context.tok},
            
        }).then((res)=>{return res.json()})
        .then((resp)=>{
            console.log(resp)
            setfollowers(resp.followers)
            setfollowermax(resp.pages)
        }).then(()=>setopenfollowers(true))
    } 


    const getfollowings = ()=>{
        fetch(origin+'/user/'+details.userId+'/followings?p=1',{
            method:'GET',
            headers:{'Content-Type':'application/json','Authorization':context.tok},
            
        }).then((res)=>{return res.json()})
        .then((resp)=>{
            console.log(resp)
            setfollowings(resp.followings)
            setfollowingsmax(resp.pages)
        }).then(()=>setopenfollowings(true))
    } 

    const pushconversation = ()=>{
        history.push('/chat?id='+details.userId)
    }

//followers handler  

const handleObserver = (entities) => {
    const target = entities[0];
    if (target.isIntersecting && followerpage<followermax) {  
        setfollowerpage((followerpage) => followerpage + 1)
    }
    
}

useEffect(()=>{
    if(details){
    fetch(origin+'/user/'+details?.userId+'/followers?p='+followerpage,{
        method:'GET',
        headers:{'Content-Type':'application/json','Authorization':context.tok},
    }).then((res)=>{return res.json()})
    .then((resp)=>{
        setfollowers(followers.concat(resp.followers))
        setfollowermax(resp.pages)
    }).then(()=>setopenfollowers(true))
    }
},[followerpage])

useEffect(() => {

     var options = {
        root: null,
        rootMargin: "20px",
        threshold: 1.0
     };


     const observer = new IntersectionObserver(handleObserver, options);
     if (followerloader.current) {
        observer.observe(followerloader.current)
     }

}, [followers,followermax]);

const followersdialog =<Dialog  open={openfollowers} onClose={()=>setopenfollowers(false)}>
<DialogTitle style={{paddingBottom:0}}><Typography>Followers</Typography></DialogTitle>
<DialogContent style={{height:'60vh'}}>
{ followers.map((user,index)=>{return <ButtonBase style={{width:'100%'}} onClick={()=>history.push(user.userId)}><Grid container><CardHeader  key={index} avatar={<Avatar src={user.profilePicture}></Avatar>} title={user.username}>
</CardHeader></Grid></ButtonBase>})}
<div ref={followerloader}></div>
</DialogContent>
</Dialog>

//follower handler ends here

//following handler starts here

const handleobserver = (entities) => {
    const target = entities[0];
    if (target.isIntersecting && followingspage<followingsmax) {  
        setfollowerpage((followingspage) => followingspage + 1)
    }
    
}

useEffect(()=>{
    if(details){
    fetch(origin+'/user/'+details.userId+'/followings?p='+followingspage,{
        method:'GET',
        headers:{'Content-Type':'application/json','Authorization':context.tok},
    }).then((res)=>{return res.json()})
    .then((resp)=>{
        setfollowings(followings.concat(resp.followings))
        setfollowingsmax(resp.pages)
    }).then(()=>setopenfollowings(true))
}
},[followingspage])

useEffect(() => {

     var options = {
        root: null,
        rootMargin: "20px",
        threshold: 1.0
     };


     const observer = new IntersectionObserver(handleobserver, options);
     if (followingsloader.current) {
        observer.observe(followingsloader.current)
     }

}, [followings,followingsmax]);

const followingsdialog =<Dialog  open={openfollowings} onClose={()=>setopenfollowings(false)}>
<DialogTitle style={{paddingBottom:0}}><Typography>Following</Typography></DialogTitle>
<DialogContent style={{height:'60vh'}}>
{ followings.map((user,index)=>{return <ButtonBase style={{width:'100%'}} onClick={()=>history.push(user.userId)}><Grid container><CardHeader  key={index} avatar={<Avatar src={user.profilePicture}></Avatar>} title={user.username}>
</CardHeader></Grid></ButtonBase>})}
<div ref={followingsloader}></div>
</DialogContent>
</Dialog>
//following handler ends here


    return(<>
       
        <div>{details?
        <div>
        {edit?<>
        
        <Grid container justify='center' alignItems='center'>
  <Grid item  lg={7} md={9} sm={10}>
  <Box elevation={0} style={{margin:'1rem',border:'none'}}>
  <Card elevation={0}  style={{background: theme.palette.primary.card}} >
      <CardContent>
          <Grid container justify='center' alignItems='center' spacing={4}>
                 <Grid item xs={12} sm={3} style={{justifyContent:'center',display:'flex'}} >
                 {loading?<CircularProgress/>:<label htmlFor='inputpic'>     
                 <img className='roundedImage' src={dp}/>  
               {/* <Button variant='contained' style={{marginTop:'1rem'}} color='primary' component='span'>upload</Button> */}
                </label>}
               <input  onChange={uploadImage} accept="image/*" id='inputpic' type='file' hidden/> 
                 

                </Grid>
      <Grid item xs={12} sm={9}>
      <Grid container direction='column' spacing={1}>
              <Grid item sm={8}>
                 <TextField inputRef={username} fullWidth variant='standard' label='Username' defaultValue={details.username} />
              </Grid>
              <Grid item sm={12}>
              <TextField inputRef={name} fullWidth variant='standard' label='name' defaultValue={details.name} />
              </Grid>
              <Grid item sm={8}>
              <TextField inputRef={city} fullWidth variant='standard' label='City' defaultValue={details.city} />
              </Grid>
              <Grid item sm={8}>
              <TextField inputRef={bio} fullWidth rows={4} multiline variant='filled' label='Bio' defaultValue={details.bio} />
              </Grid>
              <Grid item xs={8}>
                <Grid container>
                    <Grid item xs={6}>
                    <label>Dark theme</label>
                    <Switch  checked={dark} onChange={()=>{setdark(!dark);console.log(dark)}}></Switch>
                    </Grid>
                    <Grid item xs={6}>
                    <label>Private</label>
                    <Switch   checked={priv} onChange={()=>setpriv(!priv)}></Switch>
                    </Grid>
                </Grid>
                </Grid>
                <Grid item>
                    {autherr?<p style={{color:'red'}}>Username is already taken.</p>:<></>}
                </Grid>
              <Grid item sm={4}>
             
                <Grid container>
                    <Grid item xs={6}>
                    <Button onClick={handleSubmit} variant='outlined'>save</Button>
                    </Grid>
                    <Grid item xs={6}>
                    <Button onClick={()=>{setedit(false)}} variant='outlined' >close</Button>
                    </Grid>
                </Grid>
              </Grid>
          </Grid>

      </Grid>
      </Grid>
      </CardContent>
  </Card>
  </Box>
  </Grid>
</Grid>
        </>:
        <>
        {followersdialog}
        {followingsdialog}
        <Grid container justify='center' alignItems='center'>
  <Grid item lg={7} md={9} sm={10}>

 <Box elevation={0} style={{margin:'1rem',border:'none'}}> 

  <Card elevation={0} style={{background: theme.palette.primary.card}}  >

      <CardContent>
          <Grid  container justify='center' alignItems='center' spacing ={4}>
          <Grid item xs={12} sm={3} style={{justifyContent:'center',display:'flex'}}>
              <img className = 'roundedImage' src={details.profilePicture}/>
          </Grid>
      <Grid item xs={12} sm={9}>
          <Grid container >
              <Grid item xs={12}>
                 <Typography variant='h5'>{details.username}</Typography>
              </Grid>
              <Grid item xs={12}>
              <Typography>{details.name}</Typography>
              </Grid>
              <Grid item xs={12}>
              <Typography>{details.city}</Typography>
              </Grid>
              <Grid item  sm={4} xs={6}>
                <a onClick={getfollowers}><Typography>Followers : {details.followers.length}</Typography></a>
              </Grid>
              <Grid item sm={4} xs={6}>
                <a onClick={getfollowings}><Typography>Following : {details.followings.length}</Typography></a>
              </Grid>
              <Grid item xs={12}>
                <Typography>{details.bio}</Typography>
              </Grid>
              <Grid item xs={6} style={{marginTop:'1rem'}}>
                  <Grid container>
<div style={{width:'100%'}}>{
context.user.googleId===id?<Grid item md={6} xs={12}><Button variant='outlined' onClick={setEdit}>Edit profile</Button></Grid>:  
<div >
        
{ details.requests.indexOf(context.user.googleId)===-1?
      <Grid item xs={3}>{details.followers.indexOf(context.user.googleId)===-1?
    <Button onClick={sendrequest} variant="contained" color="secondary">
      Follow
  </Button>:
  <Button onClick={unfollow} variant="contained" color="secondary">
      Unfollow
  </Button>}</Grid>:    <Grid item xs={3}>
    <Button onClick={cancelrequest} variant="contained" color="secondary">
    Requested
</Button></Grid>}
<Grid item xs={3}><Button onClick={pushconversation} style={{marginTop:'1rem'}} variant='outlined'>Chat</Button></Grid>
  {details.requested.indexOf(context.details.userId)===-1?<></>:
        <Grid item xs={12} style={{marginTop:'1rem'}}>
        <Grid container>
            <Grid item xs={6}>
        <Button color='secondary' variant='contained' onClick={acceptrequest}>Accept</Button>
            </Grid>
            <Grid item xs={6}>
        <Button style={{backgroundColor:'red'}} variant='contained' onClick={rejectrequest}>Reject</Button>
            </Grid>
        </Grid>
        </Grid>
    }
  </div>
  }</div>
</Grid>
    </Grid>

    </Grid>
 
      </Grid>
      </Grid>
      </CardContent>
  </Card>
  </Box>
  </Grid>
</Grid>
        </>}</div>
  
    :<LinearProgress />}</div>
    {eyed===context.user.googleId?<Addpost/>:<></>}
    </>
    )
    
}
export default User;

