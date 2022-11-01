import {useEffect,useContext, useState} from 'react' //this page is not included
import Post from './posts'
import { AuthContext } from "../App"
import { useParams } from 'react-router-dom'
import {Grid} from '@material-ui/core'
export default function SinglePost()
{
    const [post,setpost] = useState(null)
    const {postid} = useParams();
    const [autherr,setautherr] = useState(false)
    const context = useContext(AuthContext)
    const origin = context.origin;

    useEffect(()=>{
        if (context.tok){
        fetch(origin+'/posts/'+postid+'/post',
        {
            method:'POST',
            headers:{'Content-Type':'application/json','Authorization':context.tok},
            body:JSON.stringify({postid:postid})
        }).then((res)=>{if(res.status===401) setautherr(true);return res.json()}).then((resp)=>setpost(resp.post))
    }},[context.details])
    return(<div><Grid container justify='center'><Grid item sm={6}>{!autherr?<>{post && context.details?<Post post={post}/>:<h1>Post doesnt exist</h1>}</>:<h1>unauthorized</h1>}</Grid></Grid></div>)

}