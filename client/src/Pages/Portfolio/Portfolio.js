import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    SafeAreaView,
    Image,
    ScrollView,
} from "react-native";
import axios from "axios";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import image from "../../images/background.jpg";
import Box from "@material-ui/core/Box"
import AddIcon from "@material-ui/icons/Add";
import PortfolioModal from "./PortfolioModal"
import ClipLoader from "react-spinners/ClipLoader";
import TextField from "@material-ui/core/TextField";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import {IconButton, Link} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    box: {
        height: 80,
        display: "inline-flex",
        padding:1,
    },
    centerBox:{
        display: "inline-flex",
        justifyContent:'flex-end',
        alignItems:"flex-end",
        paddingTop:100,
        paddingBottom: 0,
        paddingRight: 20
    },
}));


const Portfolio = () => {
    const classes = useStyles();
    let [coinData, setCoinData] = useState([])
    const [openModal, setOpenModal] = useState(false);
    let [loading, setLoading] = useState(true);
    const [searchCrypto, setSearchCrypto] = useState("");
    let [cryptos, setCryptos] = useState([]);
    const [showModal, setShowModal] = useState(false)
    const [show, setShow] = useState(false)
    useEffect( () => {
        axios.get('https://api.coingecko.com/api/v3/coins/')
            .then( response => {
                setCoinData(response.data);
                console.log("data is ", response.data);
            })
            .catch( error => {
                console.log(error);
            })

        setShow(true)

    },[]);

    /*
      Get a list of coins from Coingecko. For each crypto, check if it matches crypto a user
      follows and mark it as selected
  */
    function getCoins(coinsList){
        axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=zar&order=market_cap_desc&per_page=10&page=1&sparkline=false')
            .then(async (response_data) => {

                setCryptos(response_data.data)
                setLoading(false)

            })
            .catch(err => {
                console.error(err)
                setLoading(false)

            })
    }
    getCoins();
    //sets search to whats typed in the search input field
    const searchCoin = (event) => { setSearchCrypto(event.target.value) }


    //filter list based on the search input
    const searchedCryptos = cryptos.filter((crypto)=>{

        return crypto.name.toLowerCase().includes(searchCrypto.toLowerCase()) ||  crypto.symbol.toLowerCase().includes(searchCrypto.toLowerCase())
    })

    const returnModalText = () =>{
        return  (

            <div>

                <div className="crypto-search">
                    <input type="search" className="form-control rounded" placeholder="Search..."
                           onChange={searchCoin} />
                </div>

                <div className="container">

                            <div className="row">
                                <div className=" overflow-auto block crypto-wrapper" style={{height:"600px",margin:"auto"}}>
                                    {loading ? <ClipLoader loading={loading} size={150} />:
                                        searchedCryptos.length < 1 ? <div id="response-alert"><p className="text-center">Oops :( <br/>We don't have that coin</p></div>
                                            :<React.Fragment>
                                                {searchedCryptos.map((myCrypto,index) =>{

                                                    return(
                                                        <React.Fragment>
                                                            <div style={{flexDirection:"row", justifyContent:"space-between",alignItems:"center"}} key={index} className="body">
                                                                <div className='coin-row'>
                                                                    <div className='coin'>
                                                                        <img src={myCrypto.image} alt='crypto' />
                                                                        <h1>{myCrypto.name}</h1>
                                                                        <h1 className='coin-symbol'>{myCrypto.symbol}</h1>



                                                                            <Button  href={"/Portfolios"} color={"transparent"}>
                                                                                <KeyboardArrowRightIcon />
                                                                            </Button>


                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </React.Fragment>
                                                    )}
                                                )
                                                }
                                            </React.Fragment>
                                    }
                                </div>
                            </div>
                </div>
            </div>
    )
    };

    const returnOtherModalText = () =>{

        return  (

            <div>
                <form noValidate autoComplete={"off"}>
                    <TextField
                        label={"Quantity"} variant={"outlined"} color={"secondary"} value={"0.00"}
                    />
                </form>

            </div>
        )
    };

    const onCancel =(e)=>{
        setShow(false);
    }
    const OnContinue =()=>{
        setShowModal(true)
    }

    return(


            <PortfolioModal onHide={onCancel} show={show} text={returnModalText()} cancel={onCancel} continue={OnContinue} />


    )
}
export default Portfolio;