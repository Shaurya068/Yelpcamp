maptilersdk.config.apiKey = mapToken;

// Create the map
const map = new maptilersdk.Map({
    container: 'map',
    style: maptilersdk.MapStyle.STREETS,
    center: campgroundCoordinates,
    zoom: 14
});

// Add navigation controls
map.addControl(new maptilersdk.NavigationControl(), 'top-right');

// Create a custom marker element
const el = document.createElement('div');
el.className = 'marker';
el.style.width = '30px';
el.style.height = '30px';
el.style.backgroundImage = 'url(https://cdn-icons-png.flaticon.com/512/2776/2776067.png)';
el.style.backgroundSize = 'cover';
el.style.cursor = 'pointer';

// Create the marker
const marker = new maptilersdk.Marker()
    .setLngLat(campgroundCoordinates)
    .addTo(map);

// Create a popup
const popup = new maptilersdk.Popup({
    offset: 25,
    closeButton: false,
    closeOnClick: false
})
    .setHTML(`<h3 style="color: #ffcc00; margin: 0; font-size: 1.2rem;">${campgroundTitle}</h3>`);

// Add the popup to the marker
marker.setPopup(popup);

// Show popup by default
marker.togglePopup();

// Add hover effect to marker
el.addEventListener('mouseenter', () => {
    el.style.transform = 'scale(1.2)';
    el.style.transition = 'transform 0.3s ease';
});

el.addEventListener('mouseleave', () => {
    el.style.transform = 'scale(1)';
    el.style.transition = 'transform 0.3s ease';
});
