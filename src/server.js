
import * as DB from './fileDB'
import * as Rest from './restAPI'
import tempfile from 'tempfile'

var dbFileName = tempfile('.json')
if (!process.env.BUGGY_LIBRARY_FILEDB) {
  console.error('You did not specify a database file. Using the temporary file: ' + dbFileName +
    '\nPlease specify the Environment variable BUGGY_LIBRARY_FILEDB to set the database file.')
}
var port = process.env.BUGGY_LIBRARY_PORT || 8818

var db = DB.load(dbFileName)
Rest.serve(db, port)

