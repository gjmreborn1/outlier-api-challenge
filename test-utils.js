const fs = require('fs')

module.exports = {
  createTestStudent,
  deleteTestStudent
}

const fsPromises = fs.promises
const studentId = 'ab1zya2'

async function createTestStudent () {
  const testsProperty = {
    tests: {
      ab29a82: {
        scores: 12,
        questions: ['answer1', 'answer2', 'answer3']
      }
    }
  }
  const json = {
    courses: {
      calculus: {
        quizzes: {
          ye0ab61: {
            score: 98
          }
        }
      }
    }
  }
  const copy = JSON.parse(JSON.stringify(json))

  json.courses.calculus.tests = testsProperty
  const jsonString = JSON.stringify(json)
  await fsPromises.writeFile(`./data/${studentId}.json`, jsonString)

  return { studentId, testsProperty, copy }
}

async function deleteTestStudent () {
  await fsPromises.unlink(`./data/${studentId}.json`)
}
