const fetch = require('electron-fetch').default


const fetchVersions = async () => {
    let response = await fetch('https://api.github.com/repos/coltoneshaw/3c-portfolio-manager/releases',
        {
            method: 'GET',
            timeout: 30000,
        });
    
    const data =  await response.json()
    const downloadArray = {};
    // const downloadsByRelease = []
    let downloadsByOS = {
        'Windows' : 0,
        'Linux' : 0,
        'Mac': 0,
        'Total' : 0
    }

    for (release of data) {

        const {tag_name, assets} = release

        const downloads = {};
        let releaseDownloads = 0;

        for (download of assets) {
            const {name, download_count} = download;
            if(name.includes('.exe')){
                downloads['Windows'] = download_count
                downloadsByOS.Windows += download_count
            } else if(name.includes('.AppImage' || name.includes('.snap'))){
                downloads['Linux'] = download_count
                downloadsByOS.Linux += download_count
            } else if(name.includes('.dmg')){
                downloads['Mac'] = download_count
                downloadsByOS.Mac += download_count
            }

            releaseDownloads += +download_count
        }

        downloads['Total'] = releaseDownloads;
        downloadArray[tag_name] = downloads;
        downloadsByOS.Total += releaseDownloads
        // downloadArray.push({tag_name: downloads})
    }

    console.log(downloadArray)
    // console.log(downloadsByRelease)
    console.log(downloadsByOS)

}

console.log(fetchVersions())