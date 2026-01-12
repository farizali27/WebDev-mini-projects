const { JSDOM } = require('jsdom');

function getURLsFromHTML(htmlBody, baseURL) {
  const urls = []
  const dom = new JSDOM(htmlBody)
  const linkElements = dom.window.document.querySelectorAll('a')
  linkElements.forEach((linkElement) => {
    if (linkElement.href.slice(0,1) === '/') {
      urls.push(`${baseURL}${linkElement.href}`)
    } else if (linkElement.href.slice(0,4) === 'http') {
      urls.push(linkElement.href)
    }
  })
  return urls
}

function normalizeURL(urlString) {
  const urlObj = new URL(urlString)
  const hostpath = `${urlObj.hostname}${urlObj.pathname}`
  if(hostpath.length > 0 && hostpath.slice(-1) === '/') {
    return hostpath.slice(0,-1)
  }
  return hostpath
}

module.exports = {
  normalizeURL,
  getURLsFromHTML
}