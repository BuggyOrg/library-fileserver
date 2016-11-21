
import fs from 'fs'
import jq from 'json-query'
import {Component} from '@buggyorg/graphtools'
import _ from 'lodash'
import semver from 'semver'

var defaultDB = {
  components: [],
  meta: {},
  config: {}
}

var helpers = {
  and: (A, B) => A && B
}

export function load (filename) {
  if (!fs.existsSync(filename)) {
    fs.writeFileSync(filename, JSON.stringify(defaultDB))
  }
  return JSON.parse(fs.readFileSync(filename, 'utf8'))
}

export function importJSON (json) {
  return _.merge({}, defaultDB, _.cloneDeep(json))
}

export function components (db) {
  return db.components
}

const compQuery = (db, componentId, version) => {
  if (!version) {
    return jq(`[*componentId=${Component.id(componentId)}]`, {data: db.components})
  } else {
    return jq(`[*componentId=${Component.id(componentId)} & version=${semver.clean(version)}]`, {data: db.components, helpers})
  }
}

export function hasComponent (db, componentId, version) {
  return compQuery(db, componentId, version).value.length !== 0
}

export function component (db, componentId, version) {
  if (!version) version = latestVersion(db, componentId)
  return compQuery(db, componentId, version).value[0]
}

export function componentVersions (db, componentId) {
  return compQuery(db, componentId).value.map((cmp) => cmp.version)
}

export function latestVersion (db, componentId) {
  return componentVersions(db, componentId).sort(semver.rcompare)[0]
}

export function addComponent (db, component) {
  if (hasComponent(db, Component.id(component), component.version)) {
    throw new Error('Component already exists in registry. Please use a new version when updating components.')
  } else {
    db.components.push(component)
  }
}

export function setMetaInfo (db, component, version, key, value) {
  if (!version) version = latestVersion(db, component)
  const componentId = Component.id(component)
  if (!_.has(db, `meta.${componentId}.${key}`)) {
    return _.set(db, `meta.${componentId}.${key}`, [{value, version}])
  }
  db.meta[componentId][key].push({value: value, version})
}

export function metaInfos (db, component, version) {
  if (!version) version = latestVersion(db, component)
  var res = _(db.meta[Component.id(component)])
    .toPairs()
    .map(([key, list]) => {
      return [key, _.filter(list, (l) => semver.gte(version, l.version)).sort((a, b) => semver.rcompare(a.version, b.version))[0]]
    })
    .reject(([key, list]) => list === undefined)
    .map(([key, elem]) => [key, elem.value])
    .fromPairs()
    .value()
  return res
}

export function metaInfo (db, component, version, key) {
  if (!version) version = latestVersion(db, component)
  return metaInfos(db, component, version)[key]
}

export function config (db, key) {
  return _.get(db, `config.${key}`)
}

export function setConfig (db, key, value) {
  _.set(db, `config.${key}`, value)
}
