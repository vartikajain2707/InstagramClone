import React , {useState,useEffect} from 'react';
import './Post.css'
import Avatar from '@material-ui/core/Avatar'
import { db } from './firebase';
import firebase from 'firebase';

function Post({username, caption, imageUrl,postId,user}) {
    const [comments,setComments]=useState([]);
    const [comment,setComment]=useState([]);
   

    useEffect(()=>{
        let unsubscribe;
        if (postId){
            unsubscribe=db
            .collection("posts")
            .doc(postId)
            .collection("comments")
            .orderBy('timestamp','desc')
            .onSnapshot((snapshot)=>{
                setComments(snapshot.docs.map((doc)=>doc.data()));
            
        
            });
        }
        return()=>{
            unsubscribe();

        };
    },[postId]);
    const postComment=(event)=>{
        event.preventDefault();
        db.collection('posts').doc(postId).collection('comments').add({
            text:comment,
            username:user.displayName,
            timestamp:firebase.firestore.FieldValue.serverTimestamp(),
        });
        setComment('');


    }
    
    return (
        <div className='post'>
            <div className='post_header'>
               
                <Avatar className='post_avatar' src='/static/images/avatar/1.jpg'></Avatar>
                <h4> {username}</h4>
            </div>
            
            <img className='post_image' src={imageUrl}></img>
            <div className='post_caption'><strong>{username}</strong> {caption} </div>
            <div className='post_comments'>
                {comments.map((comment)=>(
                    <p> 
                        <strong>{comment.username} </strong>
                        {comment.text}
                    </p>
                ))}
            </div>
            {user &&(
                 <form className='post_commentbox'>
                 <input className='post_input' placeholder="Write a comment" type='text' value={comment} onChange={(e)=>setComment(e.target.value)}></input>
                 <button disabled={!comment} className='post_button' type='submit' onClick={postComment}>Post</button>
                 </form>

            )}
           
        </div>
    );

    }
export default Post;
