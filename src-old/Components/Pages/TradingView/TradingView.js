import React, { Component, useEffect, createRef } from 'react';



const TradingViewPage = () => {

    const tvContainer = createRef()

    useEffect(() => {
        const script = document.createElement("script");
        script.type = "text/javascript"
        script.src = "https://s3.tradingview.com/tv.js"
        const script2 = document.createElement("script");
        script2.type = "text/javascript"
        script2.async = true
        script2.text = `new TradingView.widget(
            {
                "autosize": true,
                "symbol": "COINBASE:BTCUSD",
                "interval": "60",
                "timezone": "Etc/UTC",
                "theme": "light",
                "style": "1",
                "locale": "en",
                "toolbar_bg": "#f1f3f6",
                "enable_publishing": false,
                "allow_symbol_change": true,
                "container_id": "tradingview_a6bc1",
                "details": true,
            }
        );`

        tvContainer.current.appendChild(script);
        tvContainer.current.appendChild(script2);

    })





    return (
        <>
            <h1>TradingView</h1>
            <div className="tradingview-widget-container" id="tvcontainer" style={{ height: '80vh' }} ref={tvContainer}>
                <div className="tradingview-widget-container" >
                    <div id="tradingview_a6bc1" style={{ height: '80vh' }}></div>
                    <div className="tradingview-widget-copyright"><a href="https://www.tradingview.com/symbols/" rel="noopener" target="_blank">
                        <span className="blue-text">Chart</span></a> by TradingView</div>
                </div>
            </div>
        </>

    )


}

export default TradingViewPage;