
import * as DB from './fileDB'
import * as Rest from './restAPI'

export function serve (port, file) {
  var db = DB.load(file)
  Rest.serve(db, port)
}

export function serveJSON (port, json) {
  var db = DB.importJSON(json)
  Rest.serve(db, port)
}
