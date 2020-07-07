Dyatlov map maker
=================

The dyatlov map maker is aimed at displaying a map representation of various wideband shortwave radio receivers available around the world. With a modular architecture, it can rely on several interactive map toolkits: for now, only the [Google Maps](https://developers.google.com/maps/documentation/javascript/tutorial) and [Leaflet](https://leafletjs.com/) APIs are supported, but more could be easily added.

A fully set-up receiver map instance is hosted at [rx.linkfanel.net](http://rx.linkfanel.net/).

Legend
======

Receivers are represented on the map by color-coded markers. The colors mean as follows:

* ![Red marker](data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%20standalone%3D%22no%22%3F%3E%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2221%22%20height%3D%2234%22%3E%3Cpath%20d%3D%22M%2019.5%2C9.5469494%20C%2019.5%2C12.03223%2018.097139%2C13.965539%2016.863961%2C15.91091%208.422781%2C29.22709%2012.109244%2C35.147897%2010.6875%2C33.109449%2010.077219%2C32.234449%2012.639719%2C27.66459%204.136039%2C15.91091%202.785922%2C14.044796%201.5%2C12.03223%201.5%2C9.5469494%20c%200%2C-4.9705629%204.029437%2C-9.00000031%209%2C-9.00000031%204.970563%2C-1e-7%209%2C4.02943731%209%2C9.00000031%20z%22%20style%3D%22fill%3A%23FD7567%3Bstroke%3A%23000000%3Bstroke-width%3A1.3%3B%22%20%2F%3E%3Ccircle%20r%3D%221.5%22%20cy%3D%2210%22%20cx%3D%2210.5%22%20style%3D%22fill%3A%23000000%3B%22%20%2F%3E%3C%2Fsvg%3E) means that the receiver is available, with open user slots. The receiver has a limited user capacity, but at least one user slot is currently available. The brighter and more vivid the marker's color shade, the higher the reception quality offered by this receiver was rated. These are usually [KiwiSDR receivers](http://kiwisdr.com/), with at most 8 public user slots.
* ![Gray marker](data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%20standalone%3D%22no%22%3F%3E%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2221%22%20height%3D%2234%22%3E%3Cpath%20d%3D%22M%2019.5%2C9.5469494%20C%2019.5%2C12.03223%2018.097139%2C13.965539%2016.863961%2C15.91091%208.422781%2C29.22709%2012.109244%2C35.147897%2010.6875%2C33.109449%2010.077219%2C32.234449%2012.639719%2C27.66459%204.136039%2C15.91091%202.785922%2C14.044796%201.5%2C12.03223%201.5%2C9.5469494%20c%200%2C-4.9705629%204.029437%2C-9.00000031%209%2C-9.00000031%204.970563%2C-1e-7%209%2C4.02943731%209%2C9.00000031%20z%22%20style%3D%22fill%3A%23807567%3Bstroke%3A%23000000%3Bstroke-width%3A1.3%3B%22%20%2F%3E%3Ccircle%20r%3D%221.5%22%20cy%3D%2210%22%20cx%3D%2210.5%22%20style%3D%22fill%3A%23000000%3B%22%20%2F%3E%3C%2Fsvg%3E) means an available receiver just like above, except that its reception quality has not been rated yet.
* ![Yellow marker](data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%20standalone%3D%22no%22%3F%3E%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2221%22%20height%3D%2234%22%3E%3Cpath%20d%3D%22M%2019.5%2C9.5469494%20C%2019.5%2C12.03223%2018.097139%2C13.965539%2016.863961%2C15.91091%208.422781%2C29.22709%2012.109244%2C35.147897%2010.6875%2C33.109449%2010.077219%2C32.234449%2012.639719%2C27.66459%204.136039%2C15.91091%202.785922%2C14.044796%201.5%2C12.03223%201.5%2C9.5469494%20c%200%2C-4.9705629%204.029437%2C-9.00000031%209%2C-9.00000031%204.970563%2C-1e-7%209%2C4.02943731%209%2C9.00000031%20z%22%20style%3D%22fill%3A%23FFFF6E%3Bstroke%3A%23000000%3Bstroke-width%3A1.3%3B%22%20%2F%3E%3Ccircle%20r%3D%221.5%22%20cy%3D%2210%22%20cx%3D%2210.5%22%20style%3D%22fill%3A%23000000%3B%22%20%2F%3E%3C%2Fsvg%3E) means that the receiver has reached maximum capacity and all its user slots are currently busy. It should be available again a bit later, whenever a current user stopped using it.
* ![Green marker](data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%20standalone%3D%22no%22%3F%3E%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2221%22%20height%3D%2234%22%3E%3Cpath%20d%3D%22M%2019.5%2C9.5469494%20C%2019.5%2C12.03223%2018.097139%2C13.965539%2016.863961%2C15.91091%208.422781%2C29.22709%2012.109244%2C35.147897%2010.6875%2C33.109449%2010.077219%2C32.234449%2012.639719%2C27.66459%204.136039%2C15.91091%202.785922%2C14.044796%201.5%2C12.03223%201.5%2C9.5469494%20c%200%2C-4.9705629%204.029437%2C-9.00000031%209%2C-9.00000031%204.970563%2C-1e-7%209%2C4.02943731%209%2C9.00000031%20z%22%20style%3D%22fill%3A%2300E74C%3Bstroke%3A%23000000%3Bstroke-width%3A1.3%3B%22%20%2F%3E%3Ccircle%20r%3D%221.5%22%20cy%3D%2210%22%20cx%3D%2210.5%22%20style%3D%22fill%3A%23000000%3B%22%20%2F%3E%3C%2Fsvg%3E) means that the receiver is generally available although there is no current dynamic status data for it. Currently, these are hand-picked wideband custom receiver setups, running [PA3FWM's WebSDR software](http://websdr.org/) or the original [OpenWebRX software](http://sdr.hu/openwebrx); they can normally be expected to accept new users at all times.
* ![Purple marker](data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%20standalone%3D%22no%22%3F%3E%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2221%22%20height%3D%2234%22%3E%3Cpath%20d%3D%22M%2019.5%2C9.5469494%20C%2019.5%2C12.03223%2018.097139%2C13.965539%2016.863961%2C15.91091%208.422781%2C29.22709%2012.109244%2C35.147897%2010.6875%2C33.109449%2010.077219%2C32.234449%2012.639719%2C27.66459%204.136039%2C15.91091%202.785922%2C14.044796%201.5%2C12.03223%201.5%2C9.5469494%20c%200%2C-4.9705629%204.029437%2C-9.00000031%209%2C-9.00000031%204.970563%2C-1e-7%209%2C4.02943731%209%2C9.00000031%20z%22%20style%3D%22fill%3A%239067FD%3Bstroke%3A%23000000%3Bstroke-width%3A1.3%3B%22%20%2F%3E%3Ccircle%20r%3D%221.5%22%20cy%3D%2210%22%20cx%3D%2210.5%22%20style%3D%22fill%3A%23000000%3B%22%20%2F%3E%3C%2Fsvg%3E) means that there is a receiver at this location, but it seems temporarily offline or inacessible. Most often, it will be back online at a later time.

Please note that the availability data is not refreshed in real time and the colors are not always reliable, and are only an indication of what you can expect. You might still get lucky trying! (Or unlucky!)

Receiver sources
================

We believe in shortwave for everyone, newcomers and seasoned users alike. We believe in easy one-click access to the waves: because it can and should be as simple as that. This is why we favor wideband shortwave receivers that offer a web-based, free and open access to the public.

The dyatlov map maker supports merging and combining several data sources at the same time to display receivers from different listings on the same map. For now, ready-to-use support is included for:

* a static configuration file featuring a hand-picked list of receivers
* the [KiwiSDR.com receiver network](http://kiwisdr.com/public/), with dynamic availability updates

We will study and work to include more receiver networks in the future.

Hosting
=======

You can install, host and run your own dyatlov map instance: just clone the repository or otherwise download the [index.html](index.html) file, and edit and follow the instructions inside it. You will need to choose one of two map toolkits:

* the [Google Maps](https://developers.google.com/maps/documentation/javascript/tutorial) API is a classic, but you will need a valid API key registered with a proper billing account;
* the [Leaflet](https://leafletjs.com/) library, using [OpenStreetMap](https://www.openstreetmap.org/), is a free alternative; however these maps don't offer satellite pictures - for those you will need extra setup and registration with additional map providers.

There are several other optional libraries that you can use as add-ons. Dyatlov can take advantage of the following libraries for full functionality:

* [marmat](https://github.com/marmat)'s [day/night overlay](https://github.com/marmat/google-maps-api-addons)
* [rossengeorgiev](https://github.com/rossengeorgiev)'s [nite overlay](https://github.com/rossengeorgiev/nite-overlay)
* [joergdietrich](https://github.com/joergdietrich)'s [terminator](https://github.com/joergdietrich/Leaflet.Terminator)
* [Moment.js](https://momentjs.com/)

One more thing you will need to set up is automatic generation of the [KiwiSDR.com](http://kiwisdr.com/public/) receiver data file, created and updated by running the `kiwisdr_com-update` script. Be careful if setting this up as an automated task: like with all scripts fetching external data, this can potentially open attack vectors onto your system; so make sure you know what you are doing and follow good security and system administration practices.

Inspiration
===========

The original people and interests behind the dyatlov map maker are associated with [priyom.org](http://priyom.org/) and foremost geared towards numbers stations, shortwave utilities and other radio oddities. In reference to this, this map maker is named after the Russian [Dyatlov Pass incident](https://en.wikipedia.org/wiki/Dyatlov_Pass_incident) oddity.

These signals of interest span anywhere on the shortwave spectrum, and are not limited to some amateur or broadcast bands for example. This is why the dyatlov map maker targets wideband shortwave receivers.
