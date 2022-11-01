import {CircularProgress,Typography,CardHeader,Box,CardContent, ButtonBase,Avatar,BottomNavigation,BottomNavigationAction,Card,Button,Grid} from '@material-ui/core'
import { useState,useContext, useEffect } from 'react'
import { AuthContext } from '../App'
import { useHistory } from 'react-router-dom'
import { useTheme } from '@material-ui/styles'



export default function Notifications(){

const history = useHistory()
const context = useContext(AuthContext)
const theme = useTheme();
const origin = context.origin;
const [requests,setrequests] = useState([])
const [alerts,setalerts] = useState([])
const [value,setvalue] = useState(0)
const [loading,setloading] = useState(false)
const [max,setmax] = useState(1)
const [page,setpage] = useState(1)

useEffect(()=>{
    setloading(true)
    fetch(origin+'/user/notifications?p='+page,{
            method:'GET',
            headers:{'Content-Type':'application/json','Authorization':context.tok}
    }).then((resp)=>{return resp.json()})
    .then((res)=>{setmax(res.pages);setrequests(requests.concat(res.requests));setalerts(res.alerts);setloading(false)})
},[page])

const clear= ()=>{
    fetch(origin+'/user/clearnotifications',{
        method:'GET',
        headers:{'Content-Type':'application/json','Authorization':context.tok}
})
setalerts([])
}

const req = requests.map((req,index)=>{
    return  <ButtonBase key={index} onClick={()=>history.push(`users/${req.userId}`)} style={{width:'100%'}} >
        <CardContent style={{width:'100%',paddingTop:'0' }}>
            <Grid container alignItems='center' spacing={2}>
                <Grid item xs={2}>
                    <Avatar src={req.profilePicture}></Avatar>
                </Grid>
                <Grid item xs={4} style={{display:'flex',justifyContent:'left'}}>
                    <b>{req.username}</b>
                </Grid>
                
            </Grid>   
        </CardContent>    </ButtonBase> 
})
const not = alerts.map((item,index)=>{
    return <ButtonBase key={index} onClick={()=>{item.id<2?history.push(`/users/${item.userId}`):history.push(`/post/${item.postId}`)}} style={{width:'100%'}} >
        <CardContent style={{width:'100%',paddingTop:0  }}>
            <Grid container alignItems='center'>
                <Grid item xs={2}>
                    <Avatar src={item.profilePicture}></Avatar>
                </Grid>
                <Grid item xs={10} style={{display:'flex',justifyContent:'left'}}>
                    <Typography variant='subtitle2'>{item.username}</Typography>&nbsp;
                    {item.id>1?<Typography variant='subtitle2'>commented on your post : {item.body}</Typography>:
                    item.id==1?<Typography variant='subtitle2'>accepted your follow request.</Typography>:
                    <Typography variant='subtitle2'>started following you</Typography>}
                </Grid>
            </Grid>   
        </CardContent>    
        </ButtonBase>

   
    
})
    return (<div>
        <Grid style={{marginTop:'5rem'}} container justify='center'>
            <Grid id='this' item sm={10} md={5}>
            <Box boxShadow={20}>

            <Grid container justify='center'>
            <Grid item xs={12}>
                <BottomNavigation style={{background: theme.palette.primary.mainGradient}}
      value={value}
      onChange={(event, newValue) => {
        setvalue(newValue);
      }}
      showLabels
    >
      <BottomNavigationAction label={requests.length?<Typography variant='body2'>Requests</Typography>:<Typography variant='body2'>Requests</Typography>}/>
      <BottomNavigationAction label={requests.length?<Typography variant='body2'>Notifications</Typography>:<Typography variant='body2'>Notifications</Typography>}/>
    </BottomNavigation>
    </Grid>
                <Grid item xs={12}>
                <Card style={{width:'100%',height:'60vh',overflowY:'scroll',background: theme.palette.primary.mainGradient}}>
                {value==0?<div>{req.length===0?
                <Grid  container direction='column' justify='center' alignItems='center'>
                      {loading?
                      <Grid item xs={12} style={{justifyContent:'center'}} >
                        <CircularProgress disableShrink />

                      </Grid>
                      :<Grid item > All caught up</Grid>}</Grid>
                      :<div>{req}
                        {page<max?<p><a onClick={()=>setpage((page)=>page+1)}>show more</a></p>:<></>}
                        </div>}</div>:
                    <div>{not.length===0?<Grid container direction='column' justify='center' alignItems='center'>
                                            <div>{loading?
                      <Grid item style={{width:'100%'}} >
                        <CircularProgress disableShrink />

                      </Grid>
                      :<Grid item > All caught up</Grid>}</div></Grid>:<div><Grid container justify='center'><Grid item><Button variant='outlined' onClick={clear}>Clear</Button></Grid></Grid>{not}</div>}</div>}
                </Card>
                </Grid>

            </Grid>
            </Box>
    </Grid>
    </Grid>


    </div>)
}