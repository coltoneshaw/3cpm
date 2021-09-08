import React, { useEffect } from 'react';

import { useThemeProvidor } from '@/app/Context/ThemeEngine';

const TradingViewPage = () => {

    const tvContainer = React.createRef<HTMLInputElement>();

    const { theme } = useThemeProvidor()


    const assignScript = (theme:string) => {
        const script = document.createElement("script");
        script.type = "text/javascript"
        script.src = "https://s3.tradingview.com/tv.js"


        script.addEventListener('load', () => {
            const widget = document.createElement("script");
            widget.type = "text/javascript"
            widget.async = true
            widget.text = `new TradingView.widget(
                    {
                        "autosize": true,
                        "symbol": "COINBASE:BTCUSD",
                        "interval": "60",
                        "timezone": "Etc/UTC",
                        "theme": "${theme}",
                        "style": "1",
                        "locale": "en",
                        "toolbar_bg": "#f1f3f6",
                        "enable_publishing": false,
                        "allow_symbol_change": true,
                        "container_id": "tradingview_a6bc1",
                        "details": true,
                    }
                );`
            // @ts-ignore
            tvContainer.current.appendChild(widget)
        });



        // In test
        if (tvContainer !== null && tvContainer.current !== null) {
            // Handle the case where header isn't set yet
            tvContainer.current.appendChild(script)

        }
    }

    //@ts-ignore
    useEffect(() => {
        let mounted = true
        if (mounted) {
            assignScript((theme === "lightMode") ? "light" : "dark");

        }
        return () => mounted = false
    }, [])

    //@ts-ignore
    useEffect(() => {
        let mounted = true
        if (mounted) {
            assignScript((theme === "lightMode") ? "light" : "dark");

        }
        return () => mounted = false
    }, [theme])





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