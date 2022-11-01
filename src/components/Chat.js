import {useContext,useEffect,useState,useRef} from 'react'
import {Typography,IconButton,Popover,Grid,Card,CardHeader,Avatar,CardContent,Box,ButtonBase,TextField,Badge} from '@material-ui/core'
import {EmojiEmotions,ArrowBackIos} from '@material-ui/icons'
import SendRoundedIcon from '@material-ui/icons/SendRounded';
import { AuthContext } from '../App'
import {useGoogleLogin} from 'react-google-login'
import Picker from 'emoji-picker-react'
import { useHistory,useLocation } from 'react-router-dom';
import {format} from 'timeago.js'
import { useTheme } from '@material-ui/styles';
import {io} from 'socket.io-client'
import Skeleton from '@material-ui/lab/Skeleton'

export default function Chat({setupdate,update})
{
    // const socket = io("ws://localhost:8900") 
    const clientId='504774353232-i4ctofb91259kii33088t50e8cl2c2si.apps.googleusercontent.com'
    const {signIn} = useGoogleLogin({client_id:clientId})
    
    function useQuery() {
        return new URLSearchParams(useLocation().search);
      } 
    
    const theme = useTheme();
    const query = useQuery()
    const chatid = query.get("id")
    const history = useHistory();
    const [user,setuser] = useState()
    const [anchorEl, setAnchorEl] = useState(null);
    const context = useContext(AuthContext)
    const msg = useRef('')
    const socket = useRef()
    const ope = Boolean(anchorEl);
    const id = ope ? 'emotes' : undefined;
    const [chats,setchats] = useState([]);   
    const [messages,setmessages] = useState([])
    const [onlineusers,setonlineusers] = useState([])
    const [incoming,setincoming] = useState()
    const scrollRef = useRef(null);
    const newref = useRef(null)
    const [page, setPage] = useState(1);
    const [max,setmax] = useState(1)
    const [old,setold] = useState([])
    const [init,setinit] = useState(false)
    const [unread,setunread] = useState([])
    const [loading,setloading] = useState(false)
    const origin = context.origin;
    const chatorigin = proces.env.CHAT_URL


    useEffect(()=>{
        if(!window.gapi)
           signIn()
        if(!chatid) setloading(true)
        fetch(origin+'/chats'+(chatid?`?id=${chatid}&p=${page}`:''),{
            method:'GET',
            headers:{'Content-Type':'application/json','Authorization':context.tok},
        }).then((resp)=>{return resp.json()})
        .then((res)=>{
        if(chatid){setuser(res);scrollRef.current?.scrollIntoView({ behavior: "auto" }); }
        else{setchats(res.conversations);setunread(res.unread)}
        }
    )
    setloading(false)
     },[window.gapi,chatid]) 

    useEffect(()=>{
        socket.current = io(chatorigin)
        socket.current.on('getMessage',data=>{
            setincoming({
                sender:data.sender,
                message: data.message,
                createdAt: Date.now()
            })
        })
    },[])

    const loader = useRef(null);

    const handleObserver = (entities) => {
        const target = entities[0];
        if (target.isIntersecting && page<max) {  
            
            
            setPage((page) => page + 1)
        }
        
    }
    useEffect(() => {
  
         var options = {
            root: null,
            rootMargin: "20px",
            threshold: 1.0
         };


         const observer = new IntersectionObserver(handleObserver, options);
         if (loader.current) {
            observer.observe(loader.current)
         }

    }, [messages,max]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      }, [messages]);

    useEffect(()=>{
        incoming && (chatid===incoming.sender || context.details.userId===incoming.sender) && setmessages((prev)=>[...prev,incoming]) &&  scrollRef.current?.scrollIntoView({ behavior: "smooth" })
        if(max>=page){fetch(origin+'/chats',{
            method:'GET',
            headers:{'Content-Type':'application/json','Authorization':context.tok},
        }).then((resp)=>{return resp.json()})
        .then((res)=>{
            if(!chatid)
            {
            setunread(res.unread)
        }
        })
    }

            fetch(origin+'/chats'+`?id=${chatid}&p=1`,{
                method:'GET',
                headers:{'Content-Type':'application/json','Authorization':context.tok},
            }).then((resp)=>{return resp.json()})
            .then((res)=>{
            if(chatid){setunread(res.unread)} else {setchats(res.conversations);}
            }).catch((err)=>{setchats([])})
        
        
        setupdate(!update)
    },[incoming,user,chatid])

     useEffect(()=>{
        if(max>=page &&user){

        fetch(origin+'/chats/'+user.conversationId+`?id=${chatid}&p=${page}`,{
            method:'GET',
            headers:{'Content-Type':'application/json','Authorization':context.details.tok},
        }).then((resp)=>{return resp.json()}).then((res)=>{
            setmessages((prev)=>old.concat(prev));
            setold(res.messages)
            if(!init){   
            scrollRef.current?.scrollIntoView();
            setinit(true)
            }
            else{
                newref.current?.scrollIntoView();
            }
            setmax(res.pages)})
    }
    },[user,page])
    useEffect(()=>{
        if(context.details.userId)
        socket.current.emit('addUser',context.details.userId)
        socket.current.on('getUsers',users=>{
            setonlineusers(users)
        })
    },[context.details])




    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    

    const handleClose = () => {
      setAnchorEl(null);
    };

 

    


    const sendmessage = (e)=>{
        if(msg.current.value.replace(/\s/g, '').length){
            e.preventDefault();
            socket.current.emit("sendMessage",{
                sender:context.details.userId,
                receiverId:chatid,
                message:msg.current.value
            });
            
            fetch(origin+'/chats/sendmessage',{
            method:'POST',
            body: JSON.stringify({message:msg.current.value,conversationId:user.conversationId}),
            headers:{'Content-Type':'application/json','Authorization':context.tok},
             }).then((res)=>{
                 msg.current.value='';
                 return res.json()}).then((res)=>
                
                 setmessages([...messages,res.message])
             ).catch((err)=>{
                  console.log(err);
              })  
              scrollRef.current?.scrollIntoView({ behavior: "smooth"})
            }            

        }
    const conversations = 
            chats?.length?
            chats
            .map((item,index)=>{ return <Grid item key={index} xs={12}>
            <ButtonBase onClick = {()=>history.push(`?id=${item.userId}`)} style={{width:'100%'}}>
            <Grid container alignItems='center'>
            <Grid item xs={9}>
            <Grid container> 
            <Grid item>
            <CardHeader avatar={onlineusers.find((it)=>{return it.userId===item.userId})?
            <Badge color="secondary" overlap="circle" variant='dot' badgeContent=" ">
                        <Avatar src={item.profilePicture}></Avatar>
                        </Badge>:
                        <Avatar src={item.profilePicture}></Avatar>
                        } 
            title={
            <Grid container content='flex-start' alignItems='center'>
                <Grid item sm={3}>
                    <Typography>{item.username}</Typography>
                    </Grid>
                    
                </Grid>}
            >
            </CardHeader>
            </Grid>
            </Grid>
            </Grid>

            <Grid item xs={3}>
            {unread?.indexOf(item.userId)!==-1?<Badge color="primary" overlap="circle"  variant='dot' badgeContent=" ">
            </Badge>:<></>}
            </Grid>
            </Grid>

            </ButtonBase>
        </Grid>}
        ):<Grid container justify='center'>
    {loading?
                      <Grid item style={{width:'100%'}} >
                          <CardHeader 
                          title={
                            <Skeleton animation="wave" height={10} width="80%" style={{ marginBottom: 6 }} />
                          }
                          avatar={                   
                            <Skeleton animation="wave" variant="circle" width={40} height={40} />
                            }
                        subheader={
                            <Skeleton animation="wave" height={10} width="40%" />
                        }
                          >
                          </CardHeader>
                      </Grid>
                      :<Grid item > no conversations</Grid>}
            </Grid>

        const oldmessages = old.map((item,key)=>{

            return <Grid  key={key} item xs={12}  > 
                      <Grid container justify={item.sender==context.details.userId?'flex-end':'flex-start'}>
             <Grid item xs={5}>
                 <Box style={{borderRadius:'1rem'}} bgcolor="primary.main" color="primary.text">
                     
                     <CardContent  style={{padding:'0.5rem'}}>
                  <Typography variant='subtitle1'>{item.message}</Typography>
                  <Typography variant='subtitle2' color='textSecondary'>{format(item.createdAt)}</Typography>
                      </CardContent>
                  </Box>
              </Grid>
              </Grid>
              </Grid>
        })

        const message = messages.map((item,key)=>{
            return <Grid  key={key} item xs={12}  > 
                      <Grid container justify={item.sender==context.details.userId?'flex-end':'flex-start'}>
             <Grid item xs={5}>
                 <Box style={{borderRadius:'1rem'}} bgcolor="primary.main" color="primary.text">
                     
                     <CardContent  style={{padding:'0.5rem'}}>
                  <Typography  variant='subtitle1'>{item.message}</Typography>
                  <Typography variant='subtitle2' color='textSecondary'>{format(item.createdAt)}</Typography>
                      </CardContent>
                  </Box>
              </Grid>
              </Grid>
              </Grid>
        })

return (<>
<Grid container justify='center'>
    <Grid item md={5} xs={12}>
    <Box style={{margin:'1rem'}} boxShadow={22}>

    <Card style={{ background: theme.palette.primary.mainGradient }}>
        <CardContent style={{overflowY:'scroll'}}>
        {user?<div><Grid container alignItems='center'><Grid item xs={1}><IconButton onClick={()=>{
            setold([]);
            setmessages([]);
            history.push('/chat');
            setuser(null)
        }}>
        <ArrowBackIos/></IconButton></Grid><Grid item xs={11}><CardHeader 
         avatar={<Avatar src={user.profilePicture}></Avatar>}  title={<Grid container content='flex-start' alignItems='center'><Grid item xs={12}>{user.username}</Grid>{onlineusers?.find(user=>user.userId === chatid)?<Grid item sm={3}>Online</Grid>:<></>}</Grid>} /></Grid></Grid></div>:<></>}
            <div style={{height:'70vh'}}>
            {user?// if user is selected , display the selected user conversation
            <div style={{width:'100%',height:'100%'}}> 
                <Grid container style={{height:'100%'}} alignItems='flex-end'>
                    <Grid item xs={12}>
                    <Grid container style={{height:'100%'}} spacing={1} alignItems='flex-start' direction='row'>
                            
                    <Grid item xs={12}>
                            <div style={{height: '60vh',overflowY:'scroll'}}>
                                <div ref={loader}></div>
                                {oldmessages}
                                <div ref={newref}></div>
                                {message} 
                                <div ref={scrollRef}>

                                </div>
                            </div>
                    </Grid>
                    <Grid item xs={12} >
                        <Grid container>
                            <Grid item xs={10}> 
                                <TextField fullWidth onKeyUp={(e)=>{if(e.keyCode==13){document.getElementById('sendButton').click()}}} inputRef={msg} position='static' placeholder='Type something..' /> 
                            </Grid>
                            <Grid item xs={1}>
                                <IconButton aria-describedby={id}  variant="contained" color="primary" onClick={handleClick}>
                                    <EmojiEmotions/>
                                </IconButton>
                            </Grid>
                            <Grid item xs={1}>
                                <IconButton  id='sendButton' onClick={sendmessage} variant="contained" color="primary">
                                    <SendRoundedIcon/>
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Grid>
                    </Grid>
                    </Grid>
                    </Grid>
            </div>:   //to display the list of conversations if user is not selected
            <div style={{height:'100%',width:'100%'}}>
            <Grid container alignItems='flex-start'>
            <Grid item xs={12}>
             <Grid container>
                {conversations}
                </Grid>
                </Grid>
                </Grid>
                </div>
                }
                </div>
        </CardContent>
    </Card>
    </Box>
    </Grid>
</Grid>



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
        <Picker Native={true} onEmojiClick={(e,ob)=>{msg.current.value=msg.current.value+ob.emoji }}/>
      </Popover> 
</>)
}

