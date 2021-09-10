import {Link, useLocation} from "react-router-dom";
import Posts from "../Posts/Posts";
import axios from "axios";
import React, {useEffect, useRef, useState} from "react";
import {Button, Card, Form} from "react-bootstrap";

function Comments() {
    let [posts,setposts] = useState([]);
    let data = useLocation();
    let postId = data.state.postId;
    let email = "bhekindhlovu7@gmail";
    const body = useRef();

    let obj ={
        postId: postId,
        email: email
    }


    useEffect( () => {
        axios.post('http://localhost:8080/chat/returnPost/',obj)
            .then(response => {
                let posts_ = [];
                for(let j = 0; j<response.data.posts_array.length; j++)
                {
                    posts_.push(response.data.posts_array[j])
                }
                console.log(posts_)

                setposts(posts_);
            })
            .catch(err => {console.error(err);})
        setTimeout(()=>{
        },10000)
    },[]);


    function handleSubmit(e) {
        e.preventDefault()

        let time = new Date().toLocaleString();


        let request = {
            postId:postId,
            owner:email,
            room:"Altcoins",
            body:body.current.value,
            time: time
        };

        axios.post('http://localhost:8080/chat/postReply/',request)
            .then(response => {
                console.log(response);
                // history.push("/");
                window.location.reload();
            })
            .catch(err => {console.error(err);})
        setTimeout(()=>{
        },10000)

    }


    return(

        <>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Create Form</h2>
                    <Form onSubmit={handleSubmit}>

                        <Form.Group id="body">
                            <Form.Label>body</Form.Label>
                            <Form.Control
                                ref={body}
                                required
                            />
                        </Form.Group>


                        <Button className="w-100" type="submit">
                            <Link to="/Comments">Post Reply</Link>
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
            {
                posts.map((post) =>{

                    return(

                        <div className="container">

                            <div className="row">
                                <div className="col-md-8">
                                    <div className="media g-mb-30 media-comment">
                                        <div className="media-body u-shadow-v18 g-bg-secondary g-pa-30">
                                            <div className="g-mb-15">
                                                <h5 className="h5 g-color-gray-dark-v1 mb-0">{post.owner}</h5>
                                                <span className="g-color-gray-dark-v4 g-font-size-12">{post.time}</span>
                                            </div>
                                            <p>{post.body}</p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                    )

                })
            }

        </>
    )
}
export default Comments;
