const tape = require('tape')
const jsonist = require('jsonist')
const fs = require('fs')

const port = (process.env.PORT = process.env.PORT || require('get-port-sync')())
const endpoint = `http://localhost:${port}`

const server = require('./server')
const testUtils = require('./test-utils')

const fsPromises = fs.promises

tape('store data', async function (t) {
  const studentId = 'ab1zya2'
  const url = `${endpoint}/${studentId}/courses/calculus/tests/ab29a82`
  const body = { scores: 12, questions: ['answer1', 'answer2', 'answer3'] }

  jsonist.put(url, body, async (err, responseData) => {
    if (err) t.error(err)

    t.ok(responseData.success, 'should successfully store data in file')
    const student = await getStudentById(studentId)
    t.looseEqual(student.courses.calculus.tests.ab29a82, body)

    t.end()
  })
})

tape('get data', async function (t) {
  t.test('student does not exist', async function (t) {
    const studentId = 'randomStudentId'
    const url = `${endpoint}/${studentId}/courses/calculus/tests`

    jsonist.get(url, async (err, responseData, responseObject) => {
      if (err) t.error(err)

      t.equal(responseObject.statusCode, 404)
      t.end()
    })
  })

  t.test('student exists', async function (t) {
    const { studentId, testsProperty } = await testUtils.createTestStudent()
    const url = `${endpoint}/${studentId}/courses/calculus/tests`

    jsonist.get(url, async (err, responseData) => {
      if (err) t.error(err)

      t.looseEqual(responseData.body, testsProperty)
      await testUtils.deleteTestStudent()
      t.end()
    })
  })
})

tape('delete data', async function (t) {
  t.test('student does not exist', async function (t) {
    const studentId = 'randomStudentId'
    const url = `${endpoint}/${studentId}/courses/calculus/tests`

    jsonist.delete(url, null, async (err, responseData, responseObject) => {
      if (err) t.error(err)

      t.equal(responseObject.statusCode, 404)
      t.end()
    })
  })

  t.test('student exists', async function (t) {
    // eslint-disable-next-line no-unused-vars
    const { studentId, testsProperty, copy: restOfObject } =
      await testUtils.createTestStudent()
    const url = `${endpoint}/${studentId}/courses/calculus/tests`

    jsonist.delete(url, null, async (err, responseData) => {
      if (err) t.error(err)

      t.ok(responseData.success, 'should successfully delete data')
      const student = await getStudentById(studentId)
      t.looseEqual(student, restOfObject)

      await testUtils.deleteTestStudent()
      t.end()
    })
  })
})

tape('cleanup', function (t) {
  server.close()
  t.end()
})

async function getStudentById (studentId) {
  const data = await fsPromises.readFile(`./data/${studentId}.json`)
  return JSON.parse(data)
}
