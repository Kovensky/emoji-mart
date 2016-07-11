import lunr from 'lunr'
import data from '../../data'

var index = lunr(function() {
  this.pipeline.reset()

  this.field('short_name', { boost: 2 })
  this.field('emoticons')
  this.field('name')

  this.ref('id')
})

for (let emoji in data.emojis) {
  let emojiData = data.emojis[emoji],
      { short_name, name, emoticons } = emojiData

  index.add({
    id: short_name,
    emoticons: emoticons,
    short_name: tokenize(short_name),
    name: tokenize(name),
  })
}

function search(value, maxResults = 75) {
  var results = null

  if (value.length) {
    results = index.search(tokenize(value)).map((result) =>
      result.ref
    )

    results = results.slice(0, maxResults)
  }

  return results
}

function tokenize (string) {
  if (['-', '-1', '+', '+1'].indexOf(string) == 0) {
    return string.split('')
  }

  if (/(:|;|=)-/.test(string)) {
    return [string]
  }

  return string.split(/[-|_|\s]+/)
}

export default { search }
