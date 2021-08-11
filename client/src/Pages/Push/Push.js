import React from "react";
import {
    Alert,
    Card,
    Container,
    Row,
    Col,Toast
} from "react-bootstrap";
import {Link} from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/Sidebar/Sidebar";
import {db} from "../../firebase"
class Push extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            elements: [  <Col class="col-md-6 offset-md-4">
                <button  onClick={this.handleSubscribe}  type="button" className="btn btn-outline-warning">
                    Subscribe</button>
            </Col>]
        }
        this.handleSubscribe = this.handleSubscribe.bind(this);
    }
    handleSubscribe= async (e)=> {
        let  PushReq = {
            email: localStorage.getItem("emailSession")
        }
        axios.post('http://localhost:8080/user/GETPush/',PushReq)
            .then(response => {
                console.log(response.data)
                if(Object.keys(response.data).length !== 0)
                {
                    const notification_Arrays = [];
                    notification_Arrays.push(<Col class="col-md-6 offset-md-4">
                        <button  onClick={this.handleSubscribe}  type="button" className="btn btn-outline-warning">
                            Subscribed</button>
                    </Col>);
                    this.setState({elements: notification_Arrays});
                }
                else{
                    const notificationpush= [];
                    notificationpush.push(<Col class="col-md-6 offset-md-4">
                        <button  onClick={this.handleSubscribe}  type="button" className="btn btn-outline-warning">
                            Subscribe</button>
                    </Col>);
                    this.setState({elements: notificationpush});
                }

            })
            .catch(err => {console.error(err);})
        const publicVapidKey =
            "BC0gVsYz3ljCKUO5KCfEcpaTFj3Ye_Q_q8vAWBTKDd_53jXsvtRMOYqTCUggv62UE3As_8psAJwXwTKTgXYUKNs";
        if ("serviceWorker" in navigator) {
            send().catch(err => console.error(err));
        }
        async function send() {
            // Register Service Worker
            console.log("Registering service worker...");
            //registerServiceWorker();
            const register = await navigator.serviceWorker.register("sw.js", {
                scope: "/"
            });
            console.log("Service Worker Registered...");

            console.log("Registering Push...");
            const subscription = await register.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
            });
            console.log("Push Registered...");

            // Send Push Notification
            console.log("Sending Push...");
            console.log(subscription)
            let  PushReq = {
                email: localStorage.getItem("emailSession"),
                object: subscription
            }
            axios.post('http://localhost:8080/user/subscribe/',PushReq)
                .then(response => {
                    console.log(response)

                })
                .catch(err => {console.error(err);})
            axios.post('http://localhost:8080/user/storePush/',PushReq)
                .then(response => {
                    console.log(response)

                })
                .catch(err => {console.error(err);})

            console.log("Push Sent...");
        }
        function urlBase64ToUint8Array(base64String) {
            const padding = "=".repeat((4 - base64String.length % 4) % 4);
            const base64 = (base64String + padding)
                .replace(/\-/g, "+")
                .replace(/_/g, "/");

            const rawData = window.atob(base64);
            const outputArray = new Uint8Array(rawData.length);

            for (let i = 0; i < rawData.length; ++i) {
                outputArray[i] = rawData.charCodeAt(i);
            }
            return outputArray;
        }

    }
    componentDidMount(){

    }
    render() {
        return (
            <>
                <div className="md:ml-64">
                         {this.state.elements}
                </div>
            </>
        );
    }
}

export default Push;