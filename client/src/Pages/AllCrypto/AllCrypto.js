import "bootstrap/dist/css/bootstrap.css";
import React, { useState, useEffect } from 'react';
import axios from "axios";

import Sidebar from '../../components/Sidebar/Sidebar'
import "../Settings/Settings.css"
import "./AllCrypto.css"

export default function AllCryptos({})
{
    // cryptos = cryptos
    let [cryptos, setCryptos] = useState([]);
    const [searchCrypto, setSearchCrypto] = useState("");

   

    useEffect(async () => {
        axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=zar&order=market_cap_desc&per_page=50&page=1&sparkline=false')
            .then(response => {
                //set lists
                setCryptos(response.data)
                
            })
            .catch(err => {console.error(err);})
    },[]);


    //sets search to whats typed in the search input field
    const searchCoin = (event) => {setSearchCrypto(event.target.value)}
   

    //filter list based on the search input
    const searchedCryptos = cryptos.filter((crypto)=>{
        return crypto.name.toLowerCase().includes(searchCrypto.toLowerCase())
    })
    
    return(
        <>       
        {/* <Sidebar /> */}
         <div className="container">
            <div className="row"> 
                <div className=" overflow-auto block crypto-wrapper" style={{height:"600px",margin:"auto"}}>
                    <div className="crypto-search">
                        <form>
                            <input type="search" className="form-control rounded" placeholder="Search..."
                                   onChange={searchCoin}/>
                        </form>
                    </div>
                    {
                        searchedCryptos.map((myCrypto) =>{
                            
                            return(
                                <div className='coin-container'>


                                        <div className='coin-row'>

                                                <div className='coin'>
                                                    <a id="link" href= {"https://www.coingecko.com/en/coins/"+ myCrypto.name.toLowerCase()}>
                                                    <img src={myCrypto.image} alt='crypto' />
                                                    <h1>{myCrypto.name}</h1>
                                                    </a>
                                                    <p className='coin-symbol'>{myCrypto.symbol}</p>
                                                </div>


                                            <div className='coin-data'>
                                                <p className='coin-price'>R{myCrypto.current_price}</p>
                                                <p className='coin-volume'>R{myCrypto.total_volume.toLocaleString()}</p>

                                                {myCrypto.price_change_percentage_24h < 0 ? (
                                                    <p className='coin-percent red'>{myCrypto.price_change_percentage_24h.toFixed(2)}%</p>
                                                ) : (
                                                    <p className='coin-percent green'>{myCrypto.price_change_percentage_24h.toFixed(2)}%</p>
                                                )}

                                                <p className='coin-marketcap'>
                                                    Mkt Cap: R{myCrypto.market_cap.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>



                              </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
        </>
    );
}