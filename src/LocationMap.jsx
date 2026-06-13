import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

function LocationMap({ lat, lng }) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <Marker position={[lat, lng]}>
        <Popup>
          Latitude: {lat}<br />
          Longitude: {lng}
        </Popup>
      </Marker>
    </MapContainer>
  );
}

export default LocationMap;