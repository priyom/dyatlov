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
			// Availability of user slots, if applicable
			availability: function() {
				if (this.raw.users == null ||
				    this.raw.users == '' ||
				    this.raw.users_max == null ||
				    this.raw.users_max == '')
					return null;

				var current = Number(this.raw.users);
				var max = Number(this.raw.users_max);

				// Reject NaN
				if (((! current) && current != 0) ||
				    ((! max) && max != 0))
					return null;

				return (current < max);
			},
			// Color-coded icon URL to use as marker on the map
			marker_icon: function() {
				var avail = this.availability();
				var color;
				if (avail != null)
					color = avail ? 'red' : 'yellow';
				else
					color = 'green';

				return 'https://maps.google.com/mapfiles/ms/icons/' + color + '-dot.png';
			},
			// HTML content of marker info bubble
			bubble_HTML: function() {
				return '<a href="' + this.xml_escape(this.raw.url) + '" style="color:teal;font-weight:bold;text-decoration:none">' + this.xml_escape(this.raw.name) + '</a>';
			},
			// Create a Google API marker object for this receiver
			create_marker: function() {
				return new google.maps.Marker({
					title: this.xml_escape(this.raw.name),
					position: new google.maps.LatLng(this.coords()),
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
		// Static method - validate imported RX data and filter RX
		C.validate = function(data) {
			if ((! data.name) || (! data.url) || (! data.bands))
				return false;

			// Only keep wideband receivers (more than 5 MHz)
			var result = data.bands.match(/(\d+)-(\d+)/);
			if (result == null)
				return false;
			var min = Number(result[1]);
			var max = Number(result[2]);

			return (max - min >= 5000000);
		},
	C),
	// Merge and list valid receivers from available data sources
	receivers: function() {
		return [].concat(
			// Each data source is optional and may or may not
			// have been loaded
			(typeof static_rx == "object" && static_rx) ? static_rx : []
		).filter(this.RX.validate).map(function(rx) {
			return new this.RX(rx);
		}, this);
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
		return map;
	},
	// Clear all info bubbles of all markers
	clear_bubbles: function() {
		this.bubbles.forEach(function(bubble) {
			bubble.close();
		});
	},
};

