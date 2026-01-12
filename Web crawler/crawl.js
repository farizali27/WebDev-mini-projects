const { JSDOM } = require("jsdom");

async function crawlPage(baseURL, currentURL, pages) {
  const baseURLObj = new URL(baseURL);
  const currentURLObj = new URL(currentURL);
  if (baseURLObj.hostname !== currentURLObj.hostname) {
    return pages;
  }

  const normalizedCurrentURL = normalizeURL(currentURL);
  if (pages[normalizedCurrentURL]) {
    pages[normalizedCurrentURL]++;
    return pages;
  } else {
    pages[normalizedCurrentURL] = 1;
  }

  console.log(`actively crawling: ${currentURL}`);
  let htmlBody = "";
  try {
    const resp = await fetch(currentURL);

    if (resp.status > 399) {
      console.log(
        `error in fetch with status code: ${resp.status} on page ${currentURL}`
      );
      return pages;
    }

    const contentType = resp.headers.get("content-type");
    if (!contentType || !contentType.includes("text/html")) {
      console.log(
        `non html response, content type: ${contentType}, on page: ${currentURL}`
      );
      return pages;
    }
    htmlBody = await resp.text();
  } catch (err) {
    console.log(`error in fetch ${err.message} on page ${currentURL}`);
    return pages
  }

  const nextURLs = getURLsFromHTML(htmlBody, baseURL);

  for (const nextURL of nextURLs) {
    pages = await crawlPage(baseURL, nextURL, pages);
  }

  return pages;
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
