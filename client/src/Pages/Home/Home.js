import React, { useState}  from "react";

import "bootstrap/dist/css/bootstrap.css";
import Sidebar from "../../components/Sidebar/SidebarView.js";
import HeaderStats from "./Headers/HeaderStats.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../assets/styles/tailwind.css";
import AllCryptos from "../AllCrypto/AllCrypto.js";

function Home(){
    let [favObserver, setFavObserver] = useState(false) 
    let user = localStorage.getItem("emailSession")

    /*
        Triggers headerstats component to refresh crypto cards
    */
    const alertObserver = ()=>{
        if(favObserver){
            setFavObserver(false)
        }
        else{
            setFavObserver(true)
        }
    }
    return (
        <>
            <Sidebar />
            <div className="md:ml-64">
                <div className="container" >
                    <div className="row pb-5 pt-3" style={{backgroundColor:"#cbd5e1"}}>
                        {
                            user !== null ? <div className="uppercase text-xl font-bold p-2 px-0" style={{color:"#58667e",margin:"auto"}}>Cryptocurrencies you're following <hr/></div>
                            :<div className="uppercase text-xl font-bold p-2 px-0" style={{color:"#58667e",margin:"auto"}}>Top 10 cryptocurrencies by market cap <hr/></div>
                        }
                        <HeaderStats ob={favObserver}/>
                    </div>
                    <div className="row pt-3" style={{backgroundColor:"#23292f",color:"white"}}>
                        <div className="uppercase text-xl font-bold p-2 px-0" style={{display:"flex",color:"white",margin:"auto"}}> Top 250 Cryptocurrencies<hr style={{borderColor:"white"}}/></div>
                        <div className="container" style={{display:"flex",color:"white",margin:"auto"}}>
                        <AllCryptos alert={alertObserver}/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;