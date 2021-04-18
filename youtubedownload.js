let puppeteer = require("puppeteer");
let fs = require("fs");
const { request } = require("http");
let input = process.argv.slice(2);
let name = input[0];
let site = "https://en.savefrom.net/1-youtube-video-downloader-5/"
console.log(name);
(async function () {
    try {
        let browserInstance = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: ["--start-maximized","incognito"]
        });
                // Getting Link
        let gTab = await browserInstance.newPage();
        await gTab.goto("https://www.youtube.com/");
        await gTab.waitForSelector("input[aria-label='Search']", { visible: true });
        await gTab.type("input[aria-label='Search']", name, { delay: 100 });
        await waitAndClick("button[id='search-icon-legacy']", gTab);

        let link;
        await gTab.waitForTimeout(5000);
      
        await gTab.evaluate(() => {
            let videos = document.querySelectorAll("#video-title.yt-simple-endpoint.style-scope.ytd-video-renderer");
            videos[0].click();
            link=document.URL;
        });
              gTab.close();
             //  saving
               link=gTab.url();
               let newTab = await browserInstance.newPage();
               await newTab.goto(site);
               await newTab.type("#sf_url", link, { delay: 100 });
               await waitAndClick("#sf_submit", newTab);
               await waitAndClick("#sf_result .def-btn-box", newTab);
               await newTab.waitForTimeout(5000);
                newTab.close();
    }
    catch {
        console.log("error");
    }
})();

async function waitAndClick(selector, newTab) {
    await newTab.waitForSelector(selector, { visible: true });
    let selectorClickPromise = newTab.click(selector);
    //we didn't await this promise because the calling person to await this promise
    // console.log("Clicked");
    return selectorClickPromise;

}
