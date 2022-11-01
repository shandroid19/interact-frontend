

import CardHeader from '@material-ui/core/CardHeader'
import ButtonBase from '@material-ui/core/ButtonBase'
import {Grid,Avatar,Card, Typography} from '@material-ui/core'
import Container from '@material-ui/core/Container'
import { useEffect, useState,useContext } from 'react'
// import InputBase from '@material-ui/core/TextField'
import InputBase from '@material-ui/core/TextField'
import { makeStyles,fade } from '@material-ui/core/styles'
import {AuthContext} from '../App'

// import {makeStyles,fade} from '@material-ui/core/styles'
// import {Search as SearchIcon} from '@material-ui/icons/Search'
import {useHistory} from 'react-router-dom'
import Search from './Search'
import {Search as SearchIcon} from '@material-ui/icons'
import {Autocomplete} from '@material-ui/lab'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles((theme) => ({
 
  grow: {
    flexGrow: 1,
  },
  // menuButton: {
  //   marginRight: theme.spacing(2),
  // },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    // width:'15rem',
    marginLeft:theme.spacing(1),
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    textDecorationColor:'white',
    color:'white',
    backgroundColor: fade(theme.palette.common.white, 0.05),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    // marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      // marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    color:'white',
    padding: theme.spacing(0,1,0,2),
    height: '100%',
    // position: 'absolute',
    pointerEvents: 'none',
    display: 'none',
    [theme.breakpoints.up('md')]: {
    display: 'flex',
    },
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  
  inputRoot: {  
    color: 'inherit',
    paddingLeft:theme.spacing(1)
    // color:'white',
  },
  inputInput: {
    // padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    // paddingLeft:theme.spacing(1),
    transition: theme.transitions.create('width'),
   
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));
export default function SearchComponent()
{
    const history = useHistory()
      const classes = useStyles()

    const [user,setuser] = useState('')
    const [users,setusers] = useState([])
    const context = useContext(AuthContext)

    const origin = context.origin;


    useEffect(()=>{
        console.log(user)
        
        fetch(origin+'/user/get?key='+user,{
        method:'GET',
        headers:{'Content-Type':'application/json'}
    }).then((resp)=>{return resp.json()}).then((res)=>setusers(res))
    
},[user])
    const objects = users?.map((object)=>{return(object)})
    return( <div style={{width:'100%',display:'flex',alignItems:'center'}}>
           <div className={classes.searchIcon}>
  <SearchIcon />
 </div>
    <Autocomplete
id="autocmplete-clickable"
style={{ color:'white' }}
options={objects}

autoHighlight
getOptionLabel={(option) => option.username}
renderOption={(object) => (
    <ButtonBase style={{padding:0,height:'100%',width:'100%'}} onClick={()=>{
      history.push('/users/'+object.userId);
      }}>
      <Grid container>
        <Grid item>
    <CardHeader style={{padding:0,width:'100%',height:'100%'}} avatar={ <img width='30rem' height='30rem' style={{borderRadius:'50%',objectFit:'contain'}} src={object.profilePicture}></img>} title={object.username}>
    </CardHeader>
      </Grid>
    </Grid>

    </ButtonBase>
)}
renderInput={(params) => (
  <div  className = {classes.search}>

    <InputBase
       placeholder="&nbsp;Search users"
       style={{color:'white',width:'15rem'}}
       onChange={(e)=>{console.log(user)
        setuser(e.target.value)}}
     {...params}
    inputProps={{
      ...params.inputProps,
    
       // disable autocomplete and autofill
    }}
   />
  </div>
)}
/>
</div> 
    )
}


{/* <div >
        <Autocomplete
    id="autocmplete-clickable"
    style={{ color:'white' }}
    options={objects}

    autoHighlight
    getOptionLabel={(option) => option.username}
    renderOption={(object) => (
        <ButtonBase style={{padding:0,height:'100%',width:'100%'}} onClick={()=>{
          history.push('/users/'+object.userId);
          }}>
          <Grid container>
            <Grid item>
        <CardHeader style={{padding:0,width:'100%',height:'100%'}} avatar={ <img width='30rem' height='30rem' style={{borderRadius:'50%'}} src={object.profilePicture}></img>} title={object.username}>
        </CardHeader>
          </Grid>
        </Grid>

        </ButtonBase>
    )}
    renderInput={(params) => (
      <div  className = {classes.search}>
         <div className={classes.searchIcon}>
      <Search/>
     </div>
        <InputBase
           placeholder="Search…"
           style={{paddingLeft:'3rem',color:'white'}}
           onChange={(e)=>{console.log(user)
            setuser(e.target.value)}}
         {...params}
        inputProps={{
          ...params.inputProps,
        
           // disable autocomplete and autofill
        }}
       />
      </div>

    )}
  />
    </div> */}