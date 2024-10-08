const fs = require('fs');

const isSetDone = (groupID, _db) => {
  let found = false
  Object.keys(_db).forEach((x) => {
    if (_db[x].id === groupID) {
      found = true
    }
  })
  return found
}

const changeSetDone = (groupID, teks, _db) => {
  let position = null
  Object.keys(_db).forEach((x) => {
    if (_db[x].id === groupID) {
      position = x
    }
  })
  if (position !== null) {
    _db[position].text = teks
    fs.writeFileSync('./database/set-done.json', JSON.stringify(_db, null, 3))
  }
}

const addSetDone = (groupID, teks, _db) => {
  const obj_add = {
    id: groupID,
    text: teks
  }
  _db.push(obj_add)
  fs.writeFileSync('./database/set-done.json', JSON.stringify(_db, null, 3))
}

const delSetDone = (groupID, _db) => {
  let position = null
  Object.keys(_db).forEach((x) => {
    if (_db[x].id === groupID) {
      position = x
    }
  })
  if (position !== null) {
    _db.splice(position, 1)
    fs.writeFileSync('./database/set-done.json', JSON.stringify(_db, null, 3))
  }
}

const getTextSetDone = (groupID, _db) => {
  let position = null
  Object.keys(_db).forEach((x) => {
    if (_db[x].id === groupID) {
      position = x
    }
  })
  if (position !== null) {
    return _db[position].text
  }
}

module.exports = {
  isSetDone,
  addSetDone,
  delSetDone,
  changeSetDone,
  getTextSetDone
}