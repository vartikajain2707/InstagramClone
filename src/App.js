import React,{useState,useEffect} from 'react';
import './App.css';
import Post from './Post';
import {auth, db} from './firebase';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { Button,Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';



function getModalStyle() {
  const top = 50; 
  const left = 50; 

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const [modalStyle] = useState(getModalStyle);
  const classes = useStyles();
  const[posts,setPosts]=useState([]);
  const[email,setEmail]=useState('');
  const[username,setUsername]=useState('');
  const[password,setPassword ]=useState('');
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const[user,setUser]=useState(null);


  useEffect(()=>{
    const unsubscribe =auth.onAuthStateChanged((authUser)=>{
      if (authUser){
        console.log(authUser);
        setUser(authUser);
        
      }
      else{
        setUser(null);
      }
    })
    return()=>{
      unsubscribe();
    }
  },[user,username]);
  useEffect(()=>{
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot =>{
      setPosts(snapshot.docs.map(doc=>({
        id:doc.id,
        post:doc.data(),
      }) ));
    })
  },[]);
  const signUp=(event)=>{
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email,password)
      .then((authUser)=>{
        return authUser.user.updateProfile({
          displayName:username
        })
      })
      .catch((error)=>alert(error.message));

    setOpen(false);
  }
  const signIn=(event)=>{
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email,password)
      .catch((error)=>alert(error.message));
    setOpenSignIn(false);


  }
  return (

    <div className="app">
     

      <Modal
        open={open}
        onClose={()=>setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
        <form className='form_login'>
            <center>
            <img className='app_headerImage' src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'></img>
            </center>
            
            <Input type='text'  placeholder='Username' value={username} onChange={(e)=>setUsername(e.target.value)}></Input>
            <Input type='text'  placeholder='Email' value={email} onChange={(e)=>setEmail(e.target.value)}></Input>
            <Input type='password' placeholder='Password' value={password} onChange={(e)=>setPassword(e.target.value)}></Input>
            <Button onClick={signUp} type='submit'>Sign UP</Button>
        </form>
           
          
        </div>
      </Modal>
      <Modal
        open={openSignIn}
        onClose={()=>setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
        <form className='form_login'>
            <center>
            <img className='app_headerImage' src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'></img>
            </center>
            
            <Input type='text' name='email' placeholder='Email' value={email} onChange={(e)=>setEmail(e.target.value)}></Input>
            <Input type='password' placeholder='Password' value={password} onChange={(e)=>setPassword(e.target.value)}></Input>
            <Button onClick={signIn} type='submit'>Sign In</Button>
        </form>
           
          
        </div>
      </Modal>
      <div className='app_header'>
        <img className='app_headerImage' src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png' alt=''></img>
        {user ?(
         <Button onClick={()=>auth.signOut()}>LogOut</Button>
      ):(
        <div className='app_loginContainer'>
          <Button onClick={()=>setOpenSignIn(true)}>Sign In</Button>
          <Button onClick={()=>setOpen(true)}>Sign Up</Button>
        </div>
        
      )}
      </div>
      <div className='app_post'>
        <div className='app_postleft'>
          {
            posts.map(({id,post}) =>(
              <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl}></Post>
          ))
          }

        </div>
        
        
      
      <div className='app_postright'>
        <InstagramEmbed
          url='https://www.instagram.com/p/B_uf9dmAGPw/'
          maxWidth={320}
          hideCaption={false}
          containerTagName='div'
          protocol=''
          injectScript
          onLoading={() => {}}
          onSuccess={() => {}}
          onAfterRender={() => {}}
          onFailure={() => {}}
        />
      </div>
      </div>
      
     
      
     
       {user?.displayName ? (
      <ImageUpload username={user.displayName}></ImageUpload>
      ) :(
        <h3>Sorry you need to login to upload</h3>
      )}
      
      
    </div>
  );
}

export default App;
