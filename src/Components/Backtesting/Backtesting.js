import React, { Component } from 'react';
import { Helmet } from "react-helmet";



export default class Backtesting extends Component {

    componentDidMount() {
        const script = document.createElement("script");

        script.type = "text/javascript"
        script.src = "https://s3.tradingview.com/tv.js"
        document.getElementById('tvcontainer').appendChild(script);

        const script2 = document.createElement("script");

        script2.type = "text/javascript"
        script2.text = `new TradingView.widget(
            {
            "autosize": true,
            "symbol": "COINBASE:BTCUSD",
            "interval": "H",
            "timezone": "Etc/UTC",
            "theme": "light",
            "style": "1",
            "locale": "en",
            "toolbar_bg": "#f1f3f6",
            "enable_publishing": false,
            "allow_symbol_change": true,
            "container_id": "tradingview_a6bc1",
            "range": "1D",
            "details": true,
        }
            );`
        document.getElementById('tvcontainer').appendChild(script2)

    }

    render() {
        return (
            <div className="mainWindow">
                <h1>TradingView</h1>
                <div className="tradingview-widget-container" id="tvcontainer" style={{height: '80vh'}}>
                        <div class="tradingview-widget-container tvcontainer" >
                            <div id="tradingview_a6bc1" style={{height: '80vh'}}></div>
                            <div class="tradingview-widget-copyright"><a href="https://www.tradingview.com/symbols/BTCUSDT/?exchange=BITBAY" rel="noopener" target="_blank">
                            <span class="blue-text">BTCUSDT Chart</span></a> by TradingView</div>
                        </div>
                </div>
            </div>

        )
    }

}
