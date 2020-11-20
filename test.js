const tape = require('tape')
const jsonist = require('jsonist')
const fs = require('fs')

const port = (process.env.PORT = process.env.PORT || require('get-port-sync')())
const endpoint = `http://localhost:${port}`

const server = require('./server')

const fsPromises = fs.promises

tape('store data', async function (t) {
  const studentId = 'ab1zya2'
  const url = `${endpoint}/${studentId}/courses/calculus/tests/ab29a82`
  const body = { scores: 12, questions: ['answer1', 'answer2', 'answer3'] }

  jsonist.put(url, body, async (err, responseData) => {
    if (err) t.error(err)

    t.ok(responseData.success, 'should successfully store data in file')
    const data = await fsPromises.readFile(`./data/${studentId}.json`)
    const json = JSON.parse(data)
    t.looseEqual(json.courses.calculus.tests.ab29a82, body)

    t.end()
  })
})

tape('cleanup', function (t) {
  server.close()
  t.end()
})
