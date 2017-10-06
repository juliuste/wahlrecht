'use strict'

const tape = require('tape')
const round = require('lodash.round')
const wahlrecht = require('./index')

const instituteTest = (institute) => (test) =>
	wahlrecht[institute]().then((r) => {
		test.plan(7)
		test.notEqual(r.length, 0, 'result count')
		test.ok(r[0].date, 'date field')
		test.ok(r[0].sampleSize, 'sampleSize field')
		test.ok(r[0].period, 'period field')
		test.ok(r[0].institute, 'institute field')
		test.ok(r[0].results, 'results field')
		let sum = 0
		for(let party in r[0].results){
			sum += r[0].results[party]
		}
		test.equal(round(sum, 3), 1, 'results sum')
	})

for(let institute in wahlrecht)
	tape('wahlrecht: '+institute, instituteTest(institute))
