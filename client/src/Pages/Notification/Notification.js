import React, {useEffect, useState} from "react";
import NotificationAlert from "react-notification-alert";
import {
    Alert,
    Card,
    Container,
    Row,
    Col,
} from "react-bootstrap";
import db from "../../firebase";
import {Link} from "react-router-dom";

function Notifications() {
    let[Notification_object,setNotification] =useState([]);
    let[elem,setElem] =useState([]);
    const notificationAlertRef = React.useRef(null);
    const handleView= async (e)=> {
        await db.firestore().collection('Users').doc(localStorage.getItem("emailSession")).get().then((notify)=> {
            let viewObject = notify.data().notification;
            if(viewObject[e].Read!=='undefined'){
                viewObject[e].Read =true;
            }
            const notification_view_object ={
                notification: viewObject
            }
            db.firestore().collection('Users').doc(localStorage.getItem("emailSession")).set(notification_view_object,
                {merge: true});
        })
    }
   const handleDelete= async (e)=> {
        e.preventDefault();
        await db.firestore().collection('Users').doc(localStorage.getItem("emailSession")).get().then((notify)=> {
            let object = notify.data().notification;
            delete object[e.target.value];
            const notification_object ={
                notification:object
            }
            db.firestore().collection('Users').doc(localStorage.getItem("emailSession")).set(notification_object,
                {merge: true});
        })
    }
    useEffect( () => {
        let notification_Array = [];
        db.firestore().collection('Users').doc(localStorage.getItem("emailSession")).get().then((notify)=>{
            let i = 0;
            for (const [key, value] of Object.entries(notify.data().notification)) {
                i=i+1;

                if(value.Read===true){
                    notification_Array.push( <Alert variant="info">
                        <Link  onClick={()=>handleView(key)} value={key}
                               className={
                                   "text-xs uppercase py-3 font-bold block " +
                                   (window.location.href.indexOf("/Profile") !== -1
                                       ? "text-lightBlue-500 hover:text-lightBlue-600"
                                       : "text-blueGray-700 hover:text-blueGray-500")
                               }
                               to="/Profile"
                        >
                            <i className="far fa-bell"></i>
                            <span>
                                        <p className="text-success"><h3>Cryptocurrency Notification {Notification_object.Email}</h3></p><p>{key}</p>

                                {value.Email}
                                <br></br>

                                                 <button  onClick={handleDelete} value={key} type="button" className="btn btn-outline-warning"><i className="fas fa-trash-alt"></i>Delete</button>
                    </span>
                        </Link>
                    </Alert>)
                }
               else if(value.Read===false){
                    notification_Array.push( <Alert variant="info">
                        <Link  onClick={()=>handleView(key)} value={key}
                               className={
                                   "text-xs uppercase py-3 font-bold block " +
                                   (window.location.href.indexOf("/Profile") !== -1
                                       ? "text-lightBlue-500 hover:text-lightBlue-600"
                                       : "text-blueGray-700 hover:text-blueGray-500")
                               }
                               to="/Profile"
                        >
                            <i className="far fa-bell"></i>
                            <span>
                                        <p className="text-warning"><h3>Cryptocurrency Notification {Notification_object.Email}</h3></p><p>{key}</p>

                                {value.Email}
                                <br></br>

                                                 <button  onClick={handleDelete} value={key} type="button" className="btn btn-outline-warning"><i className="fas fa-trash-alt"></i>Delete</button>
                    </span>
                        </Link>
                    </Alert>)
                }

                if(i === Object.entries(notify.data().notification).length){
                    setElem(notification_Array);
                }
            }

        })
    },)
    return (
        <>
            <div className="rna-container">
                <NotificationAlert ref={notificationAlertRef} />
            </div>
            <Container fluid>
                <Card>
                    <Card.Header>
                        <Card.Title as="h4">Notifications</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <Row>
                            <Col class="col-md-6 offset-md-4">
                                {elem}
                            </Col>
                        </Row>

                    </Card.Body>
                </Card>
            </Container>
        </>
    );
}

export default Notifications;