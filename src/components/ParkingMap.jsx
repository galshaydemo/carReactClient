import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function ParkingMap({ locations }) {
  if (!locations.length) {
    return <p className="muted">No parking locations reported yet.</p>;
  }

  const latest = locations[0];
  const center = [latest.lat, latest.lng];

  return (
    <MapContainer center={center} zoom={15} style={{ height: '350px', width: '100%' }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((loc) => (
        <Marker key={loc.id} position={[loc.lat, loc.lng]} icon={defaultIcon}>
          <Popup>
            {loc.user_name}
            <br />
            {new Date(loc.created_at + 'Z').toLocaleString()}
            {loc.accuracy ? (
              <>
                <br />
                Accuracy: ~{Math.round(loc.accuracy)}m
              </>
            ) : null}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
