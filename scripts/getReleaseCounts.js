const fetch = require('electron-fetch').default;

const fetchVersions = async () => {
  const response = await fetch(
    'https://api.github.com/repos/coltoneshaw/3c-portfolio-manager/releases',
    {
      method: 'GET',
      timeout: 30000,
    },
  );

  const data = await response.json();
  const downloadArray = {};
  // const downloadsByRelease = []
  const downloadsByOS = {
    Windows: 0,
    Linux: 0,
    Mac: 0,
    Total: 0,
  };

  data.forEach((release) => {
    const { tag_name: tagName, assets } = release;

    const downloads = {};
    let releaseDownloads = 0;

    assets.forEach((download) => {
      const { name, download_count: downloadCount } = download;
      if (name.includes('.exe')) {
        downloads.Windows = downloadCount;
        downloadsByOS.Windows += downloadCount;
      } else if (name.includes('.AppImage' || name.includes('.snap'))) {
        downloads.Linux = downloadCount;
        downloadsByOS.Linux += downloadCount;
      } else if (name.includes('.dmg')) {
        downloads.Mac = downloadCount;
        downloadsByOS.Mac += downloadCount;
      }

      releaseDownloads += +downloadCount;
    });

    downloads.Total = releaseDownloads;
    downloadArray[tagName] = downloads;
    downloadsByOS.Total += releaseDownloads;
    // downloadArray.push({tag_name: downloads})
  });

  console.log(downloadArray);
  // console.log(downloadsByRelease)
  console.log(downloadsByOS);
};

console.log(fetchVersions());
