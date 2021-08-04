import React, {useEffect, useState} from 'react'
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import styled from 'styled-components';
import {Avatar, Tabs, AppBar, Tab} from "@material-ui/core"
import EditIcon from "@material-ui/icons/Edit"
import axios from "axios";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./Profile.css"
import { SocialIcon } from 'react-social-icons';


const Button = styled.button`
display: block;
text-align: center;
background-color: #d3d3d3;
color:black;
padding: 5px 15px;
border-radius: 5px;
outline: 5px;
width: 150%;
`

const Profile = props =>
{

    let[socs,setSoc] =useState([]);

    const [selectedTab, setSelectedTab] = React.useState(0)
    const [userToSearch, setUserToSearch] = useState({})
    let [err, setErr] = useState([])
    let [follows, setFollows] = useState(false)

    const handleChange = (event, newValue) =>
    {
        setSelectedTab(newValue);
    }

    let[crypts, setCrypt] = useState([]);
    let  userReq = {
        email: localStorage.getItem("emailSession")
    }
    useEffect(async () => {

        axios.post('http://localhost:8080/user/getUserCryptos/',userReq)
            .then( response => {
                let soc = [];
                for(const crypto of response.data)
                    soc.push({socName: crypto});
                setSoc(soc);
            })
            .catch(err => {console.error(err);})

        axios.post('http://localhost:8080/user/fetchUserSocialMedia/',userReq)
            .then(response => {
                let socialName = [];
                for(const platform of response.data)
                    socialName.push({socMediaName: platform});
                setCrypt(socialName);
            })
            .catch(err => {console.error(err);})

    },[])

    const handleFollow = (user)=>{

       
        let target =  document.getElementById('followBtn')
       
        if(target.children.length >= 1){ target.removeChild(target.childNodes[0]) }

        let btn = document.createElement("button")
        btn.setAttribute("class","btn btn-success")
        btn.style.backgroundColor = "#1b95e0"
        btn.innerText = "follow @" + userToSearch 
        target.append(btn)
      
        
    }

    const followUser = ()=>{
        let user = {email: localStorage.getItem("emailSession"), screen_name: userToSearch }
        console.log("Follow")
        axios.post('http://localhost:8080/twitter/follow/',user)
        .then(response=>{
            console.log(response)
            setFollows(true)
        })
        .catch(err => {console.error(err)})

    }

    const searchInput = (event) =>{ setUserToSearch(event.target.value) }

    const searchUsername = async () =>{
        
        
        let user = { screen_name: userToSearch }
        axios.post('http://localhost:8080/twitter/validateScreenName/',user)
        .then(()=>{
            setErr(null)
            handleFollow(userToSearch)

        },(reject)=>{
            setErr(reject.response.data.error)
        })
        .catch(err => {console.error(err)})
    }

    
    return(

        <>
            <Sidebar />
            <script sync src="https://platform.twitter.com/widgets.js%22%3E"></script>
            <div className="md:ml-64">
                <div className="container" >

                    <div>
                        <div style={{
                            display:"flex",
                            justifyContent:"space-around",
                            margin:"18px 0px",
                            borderBottom: "1px solid grey"
                        }}>
                            <div>

                                <Avatar style={{width: "160px", height: "160px", borderRadius: "80px" }} className="aV" src='https://static.vecteezy.com/system/resources/previews/002/318/271/non_2x/user-profile-icon-free-vector.jpg'
                                />

                            </div>

                            <div>
                                <div style={{display:"flex",justifyContent:"space-between", width: "108%"}}>
                                    <h4>{userReq.email}</h4>
                                </div>


                                <div style={{display:"flex",justifyContent:"space-between", width: "108%"}}>
                                    <h6>Follows {socs.length} cryptos</h6>
                                    <h6>Follows {crypts.length} social media sites</h6>
                                </div>

                                <div style={{display:"flex",justifyContent:"space-between", width: "108%",  position: "relative", bottom: "-30px", right: "-100px"}}>
                                    <Link
                                        className={
                                            "text-xs lowercase py-3 font-bold block " +
                                            (window.location.href.indexOf("/updateProfile") !== -1
                                                ? "text-lightBlue-500 hover:text-lightBlue-600"
                                                : "text-blueGray-700 hover:text-blueGray-500")
                                        }
                                        to="/updateProfile"

                                        style={{position:"centre", display:"flex", font:"verdana"}}
                                    >

                                        <i
                                            className={
                                                "fas fa-User-Edit mr-2 text-sm " +
                                                (window.location.href.indexOf("/updateProfile") !== -1
                                                    ? "opacity-75"
                                                    : "text-blueGray-300")
                                            }
                                        />{" "}

                                        <Button>
                                            <EditIcon />
                                            Update Profile Details
                                        </Button>
                                    </Link>
                                </div>


                            </div>
                        </div>
                    </div>

                    <AppBar position={"static"}>
                        <Tabs value={selectedTab} onChange={handleChange}>
                            <Tab label="Cryptos Followed" />
                            <Tab label="Platforms Followed"/>
                            <Tab label="Preferences"/>
                        </Tabs>
                    </AppBar>

                    {
                        selectedTab === 0 &&
                        <ul className="list-group list-group-flush">
                            {
                                socs.map((Soc, index) =>{
                                    return(
                                        <div>
                                            <li className="list-group-item" key={index}>{Soc.socName}</li>
                                        </div>
                                    )
                                })
                            }
                        </ul>

                    }

                    {
                        selectedTab === 1 &&
                        <ul className="list-group list-group-flush">
                            <ul className="list-group list-group-flush">
                                {
                                    crypts.map((Soc, index) =>{
                                        return(
                                            <div>
                                                <li className="list-group-item" key={index}>{Soc.socMediaName}</li>
                                            </div>
                                        )
                                    })
                                }
                            </ul>
                        </ul>
                    }
                    {
                        selectedTab === 2 &&
                        <div id="searchContainer" className="container" >
                           <script sync src="https://platform.twitter.com/widgets.js%22%3E"></script>
                            <div className="row searchFilter" >
                               
                                <div className="col-sm-12" >
                                    <div className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0">Search for a twitter user you want us to check out for you</div>
                                    <div className="input-group" >
                                        <input id="table_filter" type="text" className="form-control" aria-label="Text input with segmented button dropdown" onChange={searchInput}/>
                                        <div className="input-group-btn" >
                                            {/* <button type="button" className="btn btn-secondary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" ><span className="label-icon" >Platform</span> <span className="caret" >&nbsp;</span></button>
                                            <div className="dropdown-menu dropdown-menu-right" >
                                                <ul className="category_filters" >
                                                    <li >
                                                        <input className="cat_type category-input" data-label="Twitter" id="twitter" value="" name="radios" type="radio" /><label htmlFor="twitter" >Twitter</label>
                                                    </li>
                                                    <li >
                                                        <input type="radio" name="radios" id="reddit" value="Reddi" /><label className="category-label" htmlFor="reddit" >Reddit</label>
                                                    </li>
                                                    <li >
                                                        <input type="radio" name="radios" id="4chan" value="4chan" /><label className="category-label" htmlFor="4chan" >4chan</label>
                                                    </li>
                                                </ul>
                                            </div> */}
                                            <button id="searchBtn" type="button" className="btn btn-secondary btn-search" onClick={searchUsername} ><span className="glyphicon glyphicon-search" >&nbsp;</span> <span className="label-icon" >Search</span></button>
                                        </div>
                                    </div>
                                    <div>
                                        {err && err.includes("Screen name does not exist") ? <span className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0">User does not exist</span>
                                        : follows ? <span className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0">Follow successful</span>
                                        :<span id='followBtn' className="mt-16" onClick={()=>{followUser()}}></span>}
                                    </div>
                                    
                                </div>
                                
                            </div>
                        </div>
                    }

                </div>
            </div>
        </>
    );
}
export default Profile;