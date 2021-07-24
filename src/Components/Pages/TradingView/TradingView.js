import React, { Component } from 'react';



export default class TradingViewPage extends Component {

    componentDidMount() {
        const script = document.createElement("script");

        script.type = "text/javascript"
        script.src = "https://s3.tradingview.com/tv.js"
        script.async = true
        document.getElementById('tvcontainer').appendChild(script);

        const script2 = document.createElement("script");

        script2.type = "text/javascript"
        script2.async = true

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
            <>
                <h1>TradingView</h1>
                <div className="tradingview-widget-container" id="tvcontainer" style={{height: '80vh'}}>
                        <div className="tradingview-widget-container tvcontainer" >
                            <div id="tradingview_a6bc1" style={{height: '80vh'}}></div>
                            <div className="tradingview-widget-copyright"><a href="https://www.tradingview.com/symbols/BTCUSDT/?exchange=BITBAY" rel="noopener" target="_blank">
                            <span className="blue-text">BTCUSDT Chart</span></a> by TradingView</div>
                        </div>
                </div>
            </>

        )
    }

}
