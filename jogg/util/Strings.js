function Strings(){}

Strings.si_formats = [
	{value: 1E-18, symbol: "a"},
	{value: 1E-15, symbol: "f"},
	{value: 1E-12, symbol: "p"},
	{value: 1E-9, symbol: "n"},
	{value: 1E-6, symbol: "u"},
	{value: 1E-3, symbol: "m"},
	{value: 1, symbol: ""},
	{value: 1E3, symbol: "k"},
	{value: 1E6, symbol: "M"},
	{value: 1E9, symbol: "G"},
	{value: 1E12, symbol: "T"},
	{value: 1E15, symbol: "P"},
	{value: 1E18, symbol: "E"}
]

Strings.si_formats.nFormat = function(num, digits) {
	digits = digits || 2
	if(num == 0) return 0
	var rx = /\.0+$|(\.[0-9]*[1-9])0+$/
	var i
	var pos = Math.abs(num)
	for (i = si_formats.length - 1; i > 0; i--) {
		if (pos >= si_formats[i].value) {
			break
		}
	}
	return (num / si_formats[i].value).toFixed(digits).replace(rx, "$1") + si_formats[i].symbol
}

Strings.pad = function(pad, str, padLeft) {
	if (typeof str === 'undefined') 
		return pad
	if (padLeft) {
		return (pad + str).slice(-pad.length)
	} else {
		return (str + pad).substring(0, pad.length)
	}
}

export default Strings