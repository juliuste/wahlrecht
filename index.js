'use strict'

const union = require('lodash.union')
const fetch = require('./fetch')

const institutes = ['allensbach', 'emnid', 'forsa', 'politbarometer', 'gms', 'dimap', 'insa']

module.exports = {}

// merge results
const merge = (results) => {
	let merged = []
	for(let result of results) merged = union(merged, result)
	return merged
}

// fetch all institutes
const fetchAll = () => {
	const jobs = []
	for(let institute of institutes) jobs.push(fetch(institute))
	return Promise.all(jobs).then(merge)
}

// fetch single institutes
for(let institute of institutes){
	module.exports[institute] = () => fetch(institute)
}

module.exports.all = fetchAll