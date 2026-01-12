const { JSDOM } = require("jsdom");

async function crawlPage(currentURL) {
  console.log(`actively crawling: ${currentURL}`);
  try {
    const resp = await fetch(currentURL);

    if(resp.status > 399) {
      console.log(`error in fetch with status code: ${resp.status} on page ${currentURL}`)
      return
    }

    const contentType = resp.headers.get("content-type")
    if(!contentType.includes('text/html')) {
      console.log(`non html response, content type: ${contentType}, on page: ${currentURL}`)
      return
    }
    
    console.log(await resp.text())
  } catch (err) {
    console.log(`error in fetch ${err.message} on page ${currentURL}`)
  }
}

function getURLsFromHTML(htmlBody, baseURL) {
  const urls = [];
  const dom = new JSDOM(htmlBody);
  const linkElements = dom.window.document.querySelectorAll("a");
  linkElements.forEach((linkElement) => {
    if (linkElement.href.slice(0, 1) === "/") {
      urls.push(`${baseURL}${linkElement.href}`);
    } else if (linkElement.href.slice(0, 4) === "http") {
      urls.push(linkElement.href);
    }
  });
  return urls;
}

function normalizeURL(urlString) {
  const urlObj = new URL(urlString);
  const hostpath = `${urlObj.hostname}${urlObj.pathname}`;
  if (hostpath.length > 0 && hostpath.slice(-1) === "/") {
    return hostpath.slice(0, -1);
  }
  return hostpath;
}

module.exports = {
  normalizeURL,
  getURLsFromHTML,
  crawlPage,
};
