import React from 'react';
import axios from 'axios'
import ReactSpeedometer from "react-d3-speedometer"
import {db} from "../../../firebase"
export default class SentimentSpeedometer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            mini: "",
            maxi: "",
            average: "",
            errorMessage:""
        }
    }
    async componentDidMount() {
        const article = { };
        const response = await axios.post('http://localhost:8080/user/analyse', article);
        this.setState({ mini: response.mini,maxi:response.maxi,average:response.average });
    }

    render() {
        return (
            <div>


                {/*Average*/}
                {/*60.630791107184294*/}
                {/*Max*/}
                {/*20*/}
                {/*Min*/}
                {/*-12.5*/}
                <ReactSpeedometer
                    value={this.props.average}
                    currentValueText={this.props.social}
                    maxValue={this.props.max}
                    minValue={this.props.min}
                    customSegmentLabels={[
                        {
                            text: "Very Bad",
                            position: "INSIDE",
                            color: "#555",
                        },
                        {
                            text: "Bad",
                            position: "INSIDE",
                            color: "#555",
                        },
                        {
                            text: "Ok",
                            position: "INSIDE",
                            color: "#555",
                            fontSize: "19px",
                        },
                        {
                            text: "Good",
                            position: "INSIDE",
                            color: "#555",
                        },
                        {
                            text: "Very Good",
                            position: "INSIDE",
                            color: "#555",
                        },
                    ]}
                />
            </div>
        );
    }
}