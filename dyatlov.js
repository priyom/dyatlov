// Dyatlov map maker
// Copyright 2017 Pierre Ynard
// Licensed under GPLv3+

// Helper variable for inline class declaration
var C;

// Dyatlov map maker class: creates a Google API map and lists receiver
// objects to place them as markers on the map
var Dyatlov = function(element_id) {
	this.map = this.create_map(element_id);
	this.bubbles = [];
	this.receivers().map(function(rx) {
		return rx.attach(this);
	}, this);
};

Dyatlov.prototype = {
	// RX class for receivers placed on the map
	RX: (
		C = function(data) {
			this.raw = data;
			this.parsed = {
				bandwidth: this.bandwidth(),
				coords: this.coords(),
				updated: this.parse_date(this.raw.updated),
				users: {
					current: this.parse_number(this.raw.users),
					max: this.parse_number(this.raw.users_max),
				},
			};
			this.age = this.liveness_age();

			if (! this.validate())
				return {};
			this.marker = this.create_marker();
			this.bubble = this.create_bubble();
		},
		C.prototype = {
			xml_escape: function(text) {
				var xml_entities = {
					'&': '&amp;',
					'<': '&lt;',
					'>': '&gt;',
					'"': '&quot;',
					"'": '&apos;',
				};
				return text.replace(/[&<>"']/g, function(c) {
					return xml_entities[c];
				});
			},
			parse_number: function(val) {
				if (val == null || val == '')
					return null;
				var num = Number(val);
				return Number.isNaN(num) ? null : num;
			},
			parse_date: function(val) {
				if (! val)
					return null;
				var time = Date.parse(val.replace(/-/g, ' '));
				return Number.isNaN(time) ? null : time;
			},
			// Parse and return bandwidth of accessible spectrum
			bandwidth: function() {
				if (! this.raw.bands)
					return null;

				var result = this.raw.bands.match(/(\d+)-(\d+)/);
				if (result == null)
					return null;
				var min = Number(result[1]);
				var max = Number(result[2]);

				return max - min;
			},
			// Parse and return GPS coordinates
			coords: function() {
				var coords = this.raw.gps ?
					this.raw.gps.match(/([\d\.-]+).*?[, ].*?([\d\.-]+)/)
					: null;

				return coords != null ? {
					lat: Number(coords[1]),
					lng: Number(coords[2]),
				} : {
					// Place unlocated receivers around
					// (0, 0), there is not much else
					// there to conflict with
					lat: Math.random(),
					lng: Math.random(),
				};
			},
			// Age of last liveness indication
			liveness_age: function() {
				// Lack of update information means
				// it's considered as always valid
				if (this.parsed.updated == null)
					return 0;

				return Date.now() - this.parsed.updated;
			},
			// Check that receiver is wideband (more than 5 MHz)
			wideband: function() {
				return (this.parsed.bandwidth >= 5000000);
			},
			// Temporary or permanent downtime, if receiver
			// missed latest status probes
			downtime: function() {
				// KiwiSDR.com updates receivers every
				// 30 minutes, consider temporarily down
				// after one hour
				if (this.age < 3900000)
					return null;
				else
					// Consider down for more than
					// 10 days as permanent
					return (this.age > 864000000);
			},
			// Availability of user slots, if applicable
			availability: function() {
				var users = this.parsed.users;
				if (users.current == null || users.max == null)
					return null;

				return (users.current < users.max);
			},
			// Reception quality score,
			// from 0 (lowest) to 1 (highest)
			quality: function() {
				// TODO: implement from definitive data source
				return 1;
			},
			// Precedence score among other receivers,
			// from 0 (bottom) to 1 (top)
			precedence: function() {
				var quality = this.quality();
				if (quality == null)
					quality = 0.5;

				// Put offline receivers at the bottom
				if (this.downtime())
					return 0.01 * quality;
				if (this.downtime() != null)
					return 0.1 * quality;

				// TODO: take availability into account
				// once it is more reliable

				return quality;
			},
			// Validate data and receiver for display
			validate: function() {
				return (
					this.raw.name &&
					this.raw.url &&
					this.wideband() &&
					(! this.downtime())
				);
			},
			// Helper for color-coded marker icon URL
			marker_color: function() {
				if (this.downtime() != null)
					return '9067FD'; // Purple

				var avail = this.availability();
				if (avail == null)
					return '00E74C'; // Green
				if (! avail)
					return 'FFFF6E'; // Yellow

				// TODO: color scale based on reception quality
				return 'FD7567';
			},
			// Color-coded icon URL to use as marker on the map
			marker_icon: function() {
				return 'https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2%7C' + this.marker_color();
			},
			// HTML content of marker info bubble
			bubble_HTML: function() {
				return '<a href="' + this.xml_escape(this.raw.url) + '" style="color:teal;font-weight:bold;text-decoration:none">' + this.xml_escape(this.raw.name) + '</a>';
			},
			// Create a Google API marker object for this receiver
			create_marker: function() {
				return new google.maps.Marker({
					title: this.xml_escape(this.raw.name),
					position: new google.maps.LatLng(this.parsed.coords),
					zIndex: google.maps.Marker.MAX_ZINDEX +
					        Math.round(65536 * this.precedence()),
					icon: this.marker_icon(),
				});
			},
			// Create a Google API info bubble object for the
			// marker of this receiver
			create_bubble: function() {
				return new google.maps.InfoWindow({
					content: this.bubble_HTML(),
				});
			},
			// Attach receiver to map
			attach: function(map_maker) {
				map_maker.bubbles.push(this.bubble);
				var rx = this;
				this.marker.addListener('click', function() {
					map_maker.clear_bubbles();
					rx.bubble.open(map_maker.map, rx.marker);
				});
				this.marker.setMap(map_maker.map);
			},
		},
	C),
	// Merge and list valid receivers from available data sources
	receivers: function() {
		return [].concat(
			// Each data source is optional and may or may not
			// have been loaded
			(typeof static_rx == "object" && static_rx) ? static_rx : [],
			(typeof kiwisdr_com == "object" && kiwisdr_com) ? kiwisdr_com : []
		).map(function(rx) {
			return new this.RX(rx);
			// If this receiver data is rejected, an empty object
			// is returned instead, so filter these afterwards
		}, this).filter(function(rx) {
			return (rx.attach != null);
		});
	},
	// Create and set up the Google API map object
	create_map: function(element_id) {
		var map = new google.maps.Map(document.getElementById(element_id), {
			mapTypeId: 'hybrid',
		});
		// Arbitrary area of interest, should suffice and work well
		map.fitBounds({
			north: 70,
			south: -60,
			west: -180,
			east: 180,
		});

		// Overlay day/night separation on the map, if an
		// implementation was loaded.
		// DayNightOverlay API implementation available at
		// https://github.com/marmat/google-maps-api-addons
		if (typeof DayNightOverlay == "function") {
			new DayNightOverlay({
				map: map,
			});
		}
		// nite API implementation available at
		// https://github.com/rossengeorgiev/nite-overlay
		else if (typeof nite == "object" && nite &&
		         typeof nite.init == "function") {
			nite.init(map);
		}

		return map;
	},
	// Clear all info bubbles of all markers
	clear_bubbles: function() {
		this.bubbles.forEach(function(bubble) {
			bubble.close();
		});
	},
};

