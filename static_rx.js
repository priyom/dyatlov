// Static receiver list for dyatlov map maker
// Copyright 2017, 2020 Pierre Ynard
// Licensed under GPLv3+

var static_rx = [
	{
		name: '0-29 MHz WebSDR, University of Twente, Enschede, Netherlands',
		url: 'http://websdr.ewi.utwente.nl:8901/',
		gps: '(52.2381,6.8577)',
		bands: '0-29160000',
		users_max: '800',
		sdr_hw: 'WebSDR / custom, high-performance GPU-based setup',
		antenna: 'Mini-Whip',
	},
	{
		name: '2-16 MHz WebSDR, Silec, Poland',
		url: 'http://websdr.printf.cc:8901/',
		gps: '(54.1605231, 21.5543704)',
		bands: '2000000-16000000',
		users_max: '20',
		sdr_hw: 'WebSDR / multiple RTL-SDR dongles with converter',
		antenna: '30m random wire',
	},
	{
		name: '1.8-7.9 MHz (and more) WebSDR, Cherepovets, Russia',
		url: 'http://websdr.ru/',
		gps: '(59.10, 37.96)',
		bands: '1800000-7900000',
		sdr_hw: 'WebSDR / RTL-SDR and Afedri',
		antenna: 'City-Windom CW80100',
	},
];
