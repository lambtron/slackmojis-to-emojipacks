
/**
 * Module dependencies.
 */

const request = require('request-promise-native')
const cheerio = require('cheerio')
const YAML = require('yamljs')
const fs = require('fs')

/**
 * Save function.
 */

async function save() {
  let $ = cheerio.load(await request('https://slackmojis.com/'))

  // Get groups.
  let groups = $('li.group')

  // Initialize yaml object.
  for (var i = 0; i < groups.length; i++) {
    let yaml = {
      title: '',
      emojis: []
    }
    yaml.title = format($(groups[i]).find('.title').text())
    let emojis = $(groups[i]).find('ul.emojis').find('a.downloader')
    for (var j = 0; j < emojis.length; j++) {
      yaml.emojis.push({
        name: format($(emojis[j]).text()).replace(/:/g, ''),
        src: format($(emojis[j]).attr('href'))
      })
    }

    // Save yaml to file.
    fs.writeFileSync('./packs/' + yaml.title + '.yml', YAML.stringify(yaml, 2), 'utf-8')
  }
}

/**
 * Do thing.
 */

save()

/**
 * Remove spaces and lowercase name.
 */

function format(string) {
  return string.toLowerCase().replace(/ /g, '').replace(/\n/g, '')
}
