import {runSpecTests} from '@buggyorg/library-specification'
import {serve} from '../src/restAPI'

runSpecTests(serve)
