var cheerio = require('cheerio')
var path = require('path')
var fs = require('fs')
var url = require('url')
var inliner = require('imageinliner')

module.exports = function(html, base) {
  base = base || process.cwd()
  var dom = cheerio.load(String(html))
  injectStyles(dom)
  return new Buffer(dom.html())
  
  function injectStyles(dom) {
    dom('link').each(function(idx, el) {
      el = dom(el)
      var href = el.attr('href')
      if (el.attr('rel') === 'stylesheet' && isLocal(href)) {
        var dir = path.dirname(href)
        var file = path.join(base, href)
        var style = fs.readFileSync(file)
        var inlined = inliner.css(style.toString(), { cssBasePath: dir })
        var inlinedTag = "<style>\n" + inlined.toString() + '\n</style>'
        el.replaceWith(inlinedTag)
      }
    })
  }
  
  function isLocal(href) {
    return href && !url.parse(href).hostname;
  }
  
}
