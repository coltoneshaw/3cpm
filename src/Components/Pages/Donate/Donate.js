import React, { useContext } from 'react';

import { ConfigContext } from '../../../Context/Config';

const DonatePage = () => {
    const config = useContext(ConfigContext)
    console.log({config})

    return (
        <>
            <h1>Donate</h1>
            <script data-name="BMC-Widget" data-cfasync="false" src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js" data-id="ColtonS" data-description="Support me on Buy me a coffee!" data-message="" data-color="#5F7FFF" data-position="Right" data-x_margin="18" data-y_margin="18"></script>
        </>

    )
}

export default DonatePage;