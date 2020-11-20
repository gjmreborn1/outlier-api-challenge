const fs = require('fs')

module.exports = {
  storeStudentData
}

const fsPromises = fs.promises

async function storeStudentData (req, res, next) {
  const { studentId } = req.params
  const properties = req.params[0].split('/')
  const body = req.body
  const path = `./data/${studentId}.json`

  try {
    let json = await getFileJson(path)
    checkNestedProperties(json, properties)
    addProperty(json, properties, body)
    await storeJson(path, json)

    res.json({ success: true })
  } catch (e) {
    res.json({ success: false, error: e })
  }
}

async function getFileJson (path) {
  if (!fs.existsSync(path)) {
    await fsPromises.writeFile(path, '{}')
  }

  const data = await fsPromises.readFile(path, 'utf8')
  return JSON.parse(data)
}

function checkNestedProperties (json, properties) {
  for (const property of properties) {
    if (json[property] === undefined) {
      json[property] = {}
    }
    json = json[property]
  }
}

function addProperty (json, properties, lastObject) {
  for (const property of properties) {
    json = json[property]
  }
  Object.assign(json, lastObject)
}

async function storeJson (path, json) {
  const jsonString = JSON.stringify(json)

  await fsPromises.writeFile(path, jsonString)
}
