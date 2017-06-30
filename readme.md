# wahlrecht

Scrapes [wahlrecht.de](http://wahlrecht.de) for the latest public opinion polls on the german general election (Bundestagswahl).

[![npm version](https://img.shields.io/npm/v/wahlrecht.svg)](https://www.npmjs.com/package/wahlrecht)
[![Build Status](https://travis-ci.org/juliuste/wahlrecht.svg?branch=master)](https://travis-ci.org/juliuste/wahlrecht)
[![dependency status](https://img.shields.io/david/juliuste/wahlrecht.svg)](https://david-dm.org/juliuste/wahlrecht)
[![dev dependency status](https://img.shields.io/david/dev/juliuste/wahlrecht.svg)](https://david-dm.org/juliuste/wahlrecht#info=devDependencies)
[![license](https://img.shields.io/github/license/juliuste/wahlrecht.svg?style=flat)](LICENSE)
[![chat on gitter](https://badges.gitter.im/juliuste.svg)](https://gitter.im/juliuste)

## Installation

```shell
npm install wahlrecht
```

## Usage

The module provides seperate methods for each institute:

- `allensbach()`
- `emnid()`
- `forsa()`
- `politbarometer()` - *Forschungsgruppe Wahlen*
- `gms()`
- `dimap()` - *Infratest Dimap*
- `insa()`

and a method that combines all polls:

- `all()`

Each method returns a `promise` that resolves in an array of objects like this:
```js
{
	date: '2017-01-27T00:00:00+01:00',
	results: {
		union: 0.36,
		spd: 0.24,
		'grüne': 0.08,
		fdp: 0.06,
		linke: 0.1,
		afd: 0.11,
		sonstige: 0.05
	},
	sampleSize: 1303,
	period: '24.01.–26.01.',
	institute: 'politbarometer'
}
```

Simple example:
```js
const wahlrecht = require('wahlrecht')

wahlrecht.all().then(console.log)
wahlrecht.dimap().then(console.log)
```

## See also

- [`sainte-lague`](https://github.com/juliuste/sainte-lague) - Sainte-Laguë seat distribution method
- [`hare-niemeyer`](https://github.com/juliuste/hare-niemeyer) - Hare-Niemeyer seat distribution method
- [`parliament-svg`](https://github.com/juliuste/parliament-svg/) - Parliament charts

## Contributing

If you found a bug, want to propose a feature or feel the urge to complain about your life, feel free to visit [the issues page](https://github.com/juliuste/wahlrecht/issues).
