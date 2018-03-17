const request = require('snekfetch');
const fs = require("fs")
const downloads = []

// Categories are usually a string starting with PF then a number.
//      (updated 10/3/18)
// PF1 = Desktops
// PF2 = Notebooks
// PF3 = iPod
// PF4 = iTunes
// PF5 = Cinema Display
// PF6 = macOS
// PF7 = AirPort
// PF8 = Peripherals
// PF9 = iOS 4 for iPhone
// PF11 = XServe
// PF12 = Consumer Software
// PF13 = iWork
// PF14 = Professional Software
// PF15 = Safari and iCloud For Windows
// PF16 = macOS X Server
// PF17 = QuickTime 7, and QuickTime 6 for Windows
// PF20 = macOS X Server
// PF21 = Windows Software
// PF22 = iOS 4 for iPad
// PF26 = iOS 5 and later
// PF28 = Apple Watch
// PL147 = iMovie
// PL149 = AppleWorks
// PL151 = Desktops
// PL152 = AppleWorks
// PL153 = iWork
// PL154 - PL159 = Professional Software
// PL160/PL161 = Peripherals
// PL162 - PL165 = Professional Software
// PL165 = Safari
// 133314 = iCloud for Windows

// {no category} = All

function doRequest(url) {
    return new Promise(function (resolve, reject) {
        request.get(url)
            .then(r => resolve(r))
            .catch(e => reject(e));
    });
  }
  
const categories = [{name:"PF1",fn:"Desktops"},{name:"PF2",fn:"Notebooks"},{name:"PF3",fn:"iPod"},{name:"PF4",fn:"iTunes"},{name:"PF5",fn:"Cinema Display"},{name:"PF6",fn:"macOS"},{name:"PF7",fn:"AirPort"},{name:"PF8",fn:"Peripherals"},{name:"PF9",fn:"iOS 4 for iPhone"},{name:"PF11",fn:"XServe"},{name:"PF12",fn:"Consumer Software"},{name:"PF13",fn:"iWork"},{name:"PF14",fn:"Professional Software"},{name:"PF15",fn:"Safari and iCloud For Windows"},{name:"PF16",fn:"macOS X Server"},{name:"PF17",fn:"QuickTime 7, and QuickTime 6 for Windows"},{name:"PF20",fn:"macOS X Server"},{name:"PF21",fn:"Windows Software"},{name:"PF22",fn:"iOS 4 for iPad"},{name:"PF26",fn:"iOS 5 and later"},{name:"PF28",fn:"Apple Watch"},{name:"PL147",fn:"iMovie"},{name:"PL149",fn:"AppleWorks"},{name:"PL151",fn:"Desktops"},{name:"PL152",fn:"AppleWorks"},{name:"PL153",fn:"iWork"},{name:"PL154",fn:"Professional Software"},{name:"PL155",fn:"Professional Software"},{name:"PL156",fn:"Professional Software"},{name:"PL157",fn:"Professional Software"},{name:"PL158",fn:"Professional Software"},{name:"PL159",fn:"Professional Software"},{name:"PL160",fn:"Peripherals"},{name:"PL161",fn:"Peripherals"},{name:"PL162",fn:"Professional Software"},{name:"PL163",fn:"Professional Software"},{name:"PL164",fn:"Professional Software"},{name:"PL165",fn:"Professional Software"},{name:"PL165",fn:"Safari"},{name:"133314",fn:"iCloud for Windows"}]

c = async function() {
    categories.forEach(async function(category) {
        console.log(`Starting on ${category.fn} (${category.name})`)
        var page = await doRequest(`https://km.support.apple.com/kb/index?page=downloads_browse&offset=0&sort=recency&category=` + category.name)
        var pb = JSON.parse(page.body);
        console.log(pb)
        var downloads = pb.downloads
        var estimatedPages = Math.ceil(pb.totalresults / 9);
        console.log("Estimated Pages: " + estimatedPages)
        for (i = 1; i < estimatedPages; i++) {
            console.log(`    Downloading page ${i} of ${category.name}`)
            try {
            var page = await doRequest(`https://km.support.apple.com/kb/index?page=downloads_browse&offset=${i}&sort=recency&category=` + category.name);
            var pb = JSON.parse(page.body);
            console.log("        ",pb.downloads.length, " downloads")
            downloads = downloads.concat(pb.downloads)
            } catch (ede) {
                downloads = downloads.concat([{e: `Failed to download page ${i}`,ed:ede}])
            }
        }
        console.log(downloads)
        fs.writeFile(`${category.name} - ${category.fn}.json`, JSON.stringify(downloads, null, "    "));
    })
}
c()