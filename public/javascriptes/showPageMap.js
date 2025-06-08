
maptilersdk.config.apiKey = mapToken;
const map = new maptilersdk.Map({
    container: 'map',
    style: maptilersdk.MapStyle.STREETS,
    center: campgroundCoordinates, // Use the correct variable passed from show.ejs
    zoom: 14
});
const marker = new maptilersdk.Marker()
    .setLngLat(campgroundCoordinates) // Use campground coordinates for marker
    .addTo(map);
