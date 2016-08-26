import {runSpecTests} from '@buggyorg/library-specification'
import {serve} from '../src/restAPI'

runSpecTests((db) => Promise.resolve(serve(db)))
