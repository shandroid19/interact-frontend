import React, { useContext,useRef,useState,useEffect} from "react";
import { useHistory } from "react-router-dom";
import {AuthContext} from '../App'
import CheckCircleOutlinedIcon from '@material-ui/icons/CheckCircleOutlined';
import DeleteForeverOutlined from '@material-ui/icons/DeleteForeverOutlined';
import CheckCircle from '@material-ui/icons/CheckCircle';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EmojiEmotions from '@material-ui/icons/EmojiEmotions'
import {makeStyles,useTheme} from '@material-ui/styles'

import Picker from 'emoji-picker-react';
import { Dialog,Typography,DialogTitle,DialogContent,TextField,Grid,Popover,Accordion,AccordionSummary,AccordionDetails,CardContent,Box,Button,ButtonBase,Avatar,Card,CardHeader } from "@material-ui/core";
import {format} from 'timeago.js'



// background:'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',


// const useStyles = makeStyles((theme) => ({
//   small: {
//       margin:theme.spacing(1)
//   },
// }))

export default function Post({post})
{

    const context = useContext(AuthContext)
    const origin = context.origin;

    const theme = useTheme()
    const add = post.likes.indexOf(context.user.googleId)===-1
    const [likes,setlikes] = useState(!add)
    const [open,setopen] = useState(false)
    const number = add?post.likes.length:post.likes.length-1
    const comm = useRef('')
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [liked,setliked] = useState([])
    const [openlikes,setopenlikes] = useState(false)
    const [allcomments,setcomments] = useState([])
    const [commentpages,setcommentpages]= useState(1)
    const [commentmax,setcommentmax] = useState(1)    
    const history = useHistory()
    // const handleclose =()=>{
    //     setopen(false)
    // }
    const handleOpen =()=>{
        setopen(true)
    }
    const ope = Boolean(anchorEl);
    const id = ope ? 'emotes' : undefined;

    
    const like = ()=>
    {
        fetch(origin+'/posts/'+post.userId+'/'+post._id+'/like',
        {
            method:'PUT',
            headers:{'Content-Type':'application/json','Authorization':context.tok},
        }).catch(()=>{
          console.log("could not like")
        })
        setlikes(!likes)
        // setadd(add==1?0:1)
    }
  
  
  
    const deletepost = ()=>
    {
        fetch(origin+'/posts/'+post._id,
        {
            method:'DELETE',
            headers:{'Content-Type':'application/json','Authorization':context.tok}
        }).then(()=>window.location.reload())
        setopen(false)
        
    }
   
   
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
   
    const handleClose = () => {
      setAnchorEl(null);
    };
   
   
    const postcomment = ()=>{
      // console.log(post.userId,post._id)
      fetch(origin+'/posts/'+post.userId+'/'+post._id+'/comment',
      {
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':context.tok},
      body: JSON.stringify({
        comment:comm.current.value,
      })
      }).then(()=>window.location.reload())
      
    }
    


    const comments = allcomments.map((comment,index)=>{

      const deletecomment = ()=>{
        // console.log(post.userId,post._id)
        fetch(origin+'/posts/'+post.userId+'/'+post._id+'/comment/'+comment._id,
        {
        method:'DELETE',
        headers:{'Content-Type':'application/json','Authorization':context.tok},
        }).then(()=>window.location.reload())

      }
      return(
        <CardHeader key={index} style={{padding:'0',width:"100%"}} avatar={<Avatar src={comment.profilePicture}></Avatar>}
        title={<div><b>{comment.username}</b><p style={{padding:0}}>{comment.comment}</p></div>}
      
        
        action={(comment.userId===context.user.googleId || context.user.googleId===post.userId)?
          <IconButton onClick={deletecomment}>
        <DeleteForeverOutlined/>
          </IconButton>:null
        }
        >
        </CardHeader>
          )
    })

    const getlikes = ()=>{
      fetch(origin+'/posts/'+post.userId+'/'+post._id+'/getlikes?p='+1,
      {
          method:'GET',
          headers:{'Content-Type':'application/json','Authorization':context.tok},
      }).then((res)=>{return res.json()})
      .then((resp)=>{
          console.log(resp)
          setliked(resp.likes)
          setlikemax(resp.pages)
      }).then(()=>setopenlikes(true))
  } 

  const getcomments = ()=>{
    if(commentpages<=commentmax){
    fetch(origin+'/posts/'+post.userId+'/'+post._id+'/comment?p='+commentpages,
    {
        method:'GET',
        headers:{'Content-Type':'application/json','Authorization':context.tok},
    }).then((res)=>{return res.json()})
    .then((resp)=>{
        setcomments(allcomments.concat(resp.comments))
        setcommentmax(resp.pages)
    }).then(()=>{if(commentpages<=commentmax)setcommentpages(commentpages+1)})
    }
} 

  //like handler
  const likeloader = useRef(null);
  const [likepage,setlikepage] = useState(1)
  const [likemax,setlikemax] = useState(1)
  const handleObserver = (entities) => {
      const target = entities[0];
      if (target.isIntersecting && likepage<likemax) {  
          setlikepage((likepage) => likepage + 1)
      }
      
  }

useEffect(()=>{

  fetch(origin+'/posts/'+post.userId+'/'+post._id+'/getlikes?p='+likepage,
  {
      method:'GET',
      headers:{'Content-Type':'application/json','Authorization':context.tok},
  }).then((res)=>{return res.json()})
  .then((resp)=>{
      setliked(liked.concat(resp.likes))
      setlikemax(resp.pages)
  })
  
},[likepage])

  useEffect(() => {

       var options = {
          root: null,
          rootMargin: "20px",
          threshold: 1.0
       };


       const observer = new IntersectionObserver(handleObserver, options);
       if (likeloader.current) {
          observer.observe(likeloader.current)
       }

  }, [liked,likemax]);


  const getliked =<Dialog open={openlikes} onClose={()=>setopenlikes(false)}>
      <DialogTitle style={{paddingBottom:0}}>Likes</DialogTitle>
      <DialogContent style={{height:'60vh'}}>
     { liked.map((user,index)=>{return <ButtonBase key={index} style={{width:'100%'}} onClick={()=>history.push(user.userId)}><Grid container><Grid item><CardHeader  avatar={<Avatar src={user.profilePicture}></Avatar>} title={user.username}>
      <div ref={likeloader}></div>
      </CardHeader></Grid></Grid></ButtonBase>})}
      </DialogContent>
  </Dialog>

// like handler ends here

    return(
        <>
        {getliked}
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
        <DialogTitle id="simple-dialog-title">Confirm</DialogTitle>
        <DialogContent>
            <Typography>Are you sure you want to delete this post? This cannot be undone.</Typography>
            <Button onClick={deletepost}>Yes</Button>
            <Button onClick={handleClose}>Cancel</Button>
        </DialogContent>        
      </Dialog>

    <Box boxShadow={20} style={{margin:'1rem'}}>
    <Card className={theme.root} style={{ background: theme.palette.primary.mainGradient }}
 >
      <CardHeader
        avatar={
            <Avatar src={post.profilePicture}></Avatar>
        }
        action={post.userId===context.user.googleId?
          <IconButton aria-label="settings" onClick={handleOpen} >
        <DeleteForeverOutlined/>
          </IconButton>:null
        }
        title={<a onClick={()=>history.push('/users/'+post.userId)}><Typography variant='h6' on>{post.username}</Typography></a>}
        subheader={format(post.createdAt)}
      />
<div style={{width:'100%',display:'flex', justifyContent:'center', backgroundColor:'black'}} >
                 <img style={{objectFit:'contain',maxHeight:'30rem',width:'100%'}} src={post.img}/>
                </div>
        <CardContent >
        <Typography color="textSecondary" component="p">
            {post.caption}
        </Typography>
        </CardContent>
        <IconButton aria-label="like" onClick={()=>like()}>
        {likes?<CheckCircle/>:<CheckCircleOutlinedIcon/>}
        </IconButton>
        <a onClick={()=>getlikes()}><b >Likes: {likes?number+1:number}</b></a>

    <Accordion  onClick={()=>{getcomments()}} style={{margin:0,padding:0,background: theme.palette.primary.mainGradient }}>
    <AccordionSummary style={{padding:0}}>
    <b>&nbsp; comments: {post.comments} <IconButton

          aria-label="show more"
        >
          <ExpandMoreIcon  />
        </IconButton></b>
    </AccordionSummary>
    <AccordionDetails >
    <Grid container>
        <Grid  style={{maxHeight:'50vh',overflowY:'scroll',overflowX:'hidden'}} item xs={12}>{comments}</Grid>
        <Grid item xs={12}>{commentmax>=commentpages?<a onClick={()=>getcomments()}>show more</a>:<></>}</Grid>
        <Grid item xs={12}>
        <CardHeader style={{paddingBottom:'0',width:"100%"}} avatar={<img width='50rem' height='50rem' style={{borderRadius:'50%'}} src={context.details.profilePicture}></img>}
        title={<><b>{context.details.username}</b>

        <Grid container>       
          <Grid item xs={7}>
          <TextField style={{marginBottom:'1rem'}}
          fullWidth
          inputRef = {comm}
          placeholder="Type your comment"
          multiline
          rowsMax={6}
        />
         <Popover
       id={id}
       open={ope}
       anchorEl={anchorEl}
       onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Picker Native={true} onEmojiClick={(e,ob)=>{comm.current.value=comm.current.value+ob.emoji }}/>
      </Popover>        
        </Grid>
        <Grid item xs={2}>
        <IconButton aria-describedby={id} variant="contained" color="primary" onClick={(e)=>handleClick(e)}>
          <EmojiEmotions/>
        </IconButton>
        </Grid>
        <Grid item xs={3}>
          <Button variant='contained' color='primary' onClick={()=>postcomment()}>
            Comment
          </Button></Grid>
        </Grid>
        </>}>
        </CardHeader>
        </Grid>
        
</Grid>

    </AccordionDetails>
    </Accordion>
    </Card>
    </Box>
    </>
)
}

