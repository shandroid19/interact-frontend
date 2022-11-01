
import {useContext, useRef, useState,useEffect} from 'react';
import {AuthContext} from '../App';
import { useHistory} from 'react-router-dom'
import {useGoogleLogin} from 'react-google-login'
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AddCircle from '@material-ui/icons/AddCircle';
import { CircularProgress, Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Compressor from 'compressorjs';


export default function Addpost()
{ 
    
    const clientId='504774353232-i4ctofb91259kii33088t50e8cl2c2si.apps.googleusercontent.com'
    const {signIn} = useGoogleLogin({client_id:clientId})
    const [loading,setloading] = useState(false)
    const context = useContext(AuthContext)
    const origin = context.origin;
    useEffect(()=>{
        if(!context.details)
           signIn()
     },[])
    const [autherr,setautherr] = useState(false)
    let history = useHistory();
    const cap = useRef('')
    const [img,setImage]= useState(null)
    const uploadImage = async e=> {
        setloading(true)
        const files = e.target.files
        if (!files[0]) {
            return;
          }
        // const data = new FormData()
        // data.append('file',files[0])
        // data.append('upload_preset','pigeon')
        // let filname=files[0].name.toLowerCase();
        // if(!(filname.endsWith('.jpg')||filname.endsWith('.png')||filname.endsWith('.jpeg')))
        //   {
        //     alert("Only '.png' , '.jpg' and '.jpeg' formats supported!");
        //     return;
        //   }      
        // console.log(files[0])   

        // const res = await fetch("https://api.cloudinary.com/v1_1/shandroid/image/upload",
        // {
        //     method: 'POST',
        //     body:data
        // })
        // const file = await res.json()
        // setImage(file.secure_url);
        // setloading(false)
        new Compressor(files[0], {
            quality: 0.6,
            async success(result) {
        const data = new FormData()
        data.append('file',result)
        data.append('upload_preset','pigeon')
        let filname=result.name.toLowerCase();
        if(!(filname.endsWith('.jpg')||filname.endsWith('.png')||filname.endsWith('.jpeg')))
          {
            alert("Only '.png' , '.jpg' and '.jpeg' formats supported!");
            return;
          }      
        console.log(result)   

        const res = await fetch("https://api.cloudinary.com/v1_1/shandroid/image/upload",
        {
            method: 'POST',
            body:data
        })
        const file = await res.json()
        setImage(file.secure_url);
        setloading(false)
            },
            error(err) {
              console.log(err.message);
            },
          });

    }


    function handleSubmit(e)
    {   
        e.preventDefault();            
        fetch(origin+'/posts/',{
            method:'PUT',
            headers:{'Content-Type':'application/json','Authorization':context.tok},
            body: JSON.stringify({caption:cap.current.value, image:img}),
        }).then((resp)=>{
            console.log(resp);
            history.push('/')
        })
    } 
  

    return (<div style={{width:'100%',justifyContent:'center',display:'flex',paddingTop:'1rem'}}>
            <Grid container direction='column'  item xs={11} lg={5} md={6} sm={8}> 
            <Accordion>
                <AccordionSummary expandIcon={<AddCircle />}>
                    Add post
                </AccordionSummary>
                <AccordionDetails>

                <div style={{width:'100%'}}>
                 <form onSubmit={handleSubmit}>
                    <Grid>
                    <Grid item xs ={12}> 
                    <TextField
                    fullWidth
                    style={{width:'100%',padding:'1rem'}}
                    inputRef={cap}
                    label="Caption"
                    multiline
                    rows={4}
                    />
                    </Grid>
                    <Grid className='upload' >
                      <input type="file"  hidden onChange={uploadImage} id="file" /> 
                        <label htmlFor="file">click here to upload image</label>
                      </Grid>
                 <div>
                 {loading?<div style={{justifyContent:'center',display:'flex',marginTop:"2rem",marginBottom:'2rem'}}><CircularProgress/></div>:
                 img?    <div style={{width:'100%',display:'flex', justifyContent:'center'}}>
                 <img style={{objectFit:'contain',maxHeight:'30rem',width:'100%',marginBottom:'2rem'}} src={img}/>
                </div>:<></>}
                </div>
                 <div style={{width:'100%',justifyContent:'center',display:'flex',marginBottom:'2rem'}}>
                    <Grid ><Button variant='contained'color='primary' type='submit'>Post</Button></Grid>
                    </div>
                    </Grid>
                </form>
                </div>
                </AccordionDetails>
            </Accordion>
            </Grid>
            </div>
           
    )
} 