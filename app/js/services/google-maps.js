define('gmaps', ['async!http://maps.google.com/maps/api/js?v=3&libraries=places,geometry&sensor=false'], function() {
    return window.google.maps;
});
