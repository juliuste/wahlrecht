'use strict'

const parser = require('cheerio')
const moment = require('moment')
const request = require('got')
const numeral = require('numeral')
const round = require('lodash.round')

const url = (institute) => 'http://www.wahlrecht.de/umfragen/'+institute+'.htm'

const removeDots = (x) => x.replace('.', '').replace(',', '.')

const dateModifier = (x) => moment(x, 'DD.MM.YYYY').format()
const sampleSizeModifier = (x) => round(numeral(removeDots(x)).value(), 0)
const periodModifier = (x) => x
const undecidedModifier = (x) => round(numeral(removeDots(x)).value(), 0)
const partyModifier = (x) => round(numeral(removeDots(x)).value(), 3)

// identify coloumn titles
const identify = ($) => {
	$ = parser($)
	if($.attr('class') === 'dat') return {type: 'general', name: 'date', modifier: dateModifier}
	if($.attr('class') === 'befr') return {type: 'general', name: 'sampleSize', modifier: sampleSizeModifier}
	if($.attr('class') === 'dat2'){
		if($.text().toLowerCase() === 'zeitraum') return {type: 'general', name: 'period', modifier: periodModifier}
		if($.children().first().is('span') && $.children().first().attr('title') === 'Anteil der Nichtwähler und Unentschlossenen') return {type: 'general', name: 'undecided', modifier: undecidedModifier}
	}
	// normal institutes
	if($.children().first().is('a')){
		if($.children().first().text().toLowerCase() === 'cdu') return {type: 'party', name: 'union', modifier: partyModifier}
		if($.children().first().text().toLowerCase() === 'spd') return {type: 'party', name: 'spd', modifier: partyModifier}
		if($.children().first().text().toLowerCase() === 'grüne') return {type: 'party', name: 'grüne', modifier: partyModifier}
		if($.children().first().text().toLowerCase() === 'fdp') return {type: 'party', name: 'fdp', modifier: partyModifier}
		if($.children().first().text().toLowerCase() === 'linke') return {type: 'party', name: 'linke', modifier: partyModifier}
		if($.children().first().text().toLowerCase() === 'afd') return {type: 'party', name: 'afd', modifier: partyModifier}
		if($.children().first().text().toLowerCase() === 'sonstige') return {type: 'party', name: 'sonstige', modifier: partyModifier}
	}
	// politbarometer...
	if($.text().toLowerCase() === 'cdu/csu') return {type: 'party', name: 'union', modifier: partyModifier}
	if($.text().toLowerCase() === 'spd') return {type: 'party', name: 'spd', modifier: partyModifier}
	if($.text().toLowerCase() === 'grüne') return {type: 'party', name: 'grüne', modifier: partyModifier}
	if($.text().toLowerCase() === 'fdp') return {type: 'party', name: 'fdp', modifier: partyModifier}
	if($.text().toLowerCase() === 'linke') return {type: 'party', name: 'linke', modifier: partyModifier}
	if($.text().toLowerCase() === 'afd') return {type: 'party', name: 'afd', modifier: partyModifier}
	if($.text().toLowerCase() === 'sonstige') return {type: 'party', name: 'sonstige', modifier: partyModifier}
	return null
}

// split coloumn headers
const coloumns = ($) => {
	const fields = Array.from($('table.wilko thead tr').children())
	const result = []
	
	let counter = -1
	while(counter++ < fields.length){
		const field = identify(fields[counter])
		if(field){
			field['id'] = counter
			result.push(field)
		}
	}
	return result
}

// split rows
const rows = ($) => {
	const rows = $('table.wilko tbody tr') // select table
		.not(':has(.ws)') // exclude 2013 election results
	return Array.from(rows)
}

const filterRows = (coloumns) => (rows) => {
	const res = []
	for(let row of rows){
		const $ = parser(row)
		if($.children().length>=coloumns.length) res.push(row)
	}
	return res
}

const id = (x) => x

// format row
const format = (coloumns, institute) => ($) => {
	$ = parser($).children()
	const result = {results: {}}
	for(let coloumn of coloumns){
		if(!coloumn.modifier) coloumn.modifier = id
		if(coloumn.type === 'general') result[coloumn.name] = coloumn.modifier($.eq(coloumn.id).text())
		if(coloumn.type === 'party') result.results[coloumn.name] = coloumn.modifier($.eq(coloumn.id).text())
	}
	result.institute = institute
	return result
}

const main = (institute) => {
	return request(url(institute))
		.then((r) => r.body)
		.then(parser.load)
		.then(($) => {
			const cols = coloumns($)
			return filterRows(cols)(rows($)).map(format(cols, institute))
		})
}

module.exports = main