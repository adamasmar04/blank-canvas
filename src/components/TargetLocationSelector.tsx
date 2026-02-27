import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
interface TargetLocationSelectorProps {
  selectedLocation: string;
  onLocationChange: (value: string) => void;
}
const targetLocations = [
  { name: "Global / All Locations", coordinates: [0, 0] },
  { name: "Afghanistan", coordinates: [67.7090, 33.9391] },
  { name: "Albania", coordinates: [20.1683, 41.1533] },
  { name: "Algeria", coordinates: [1.6596, 28.0339] },
  { name: "Andorra", coordinates: [1.6016, 42.5063] },
  { name: "Angola", coordinates: [17.8739, -11.2027] },
  { name: "Antigua and Barbuda", coordinates: [-61.7965, 17.0608] },
  { name: "Argentina", coordinates: [-63.6167, -38.4161] },
  { name: "Armenia", coordinates: [45.0382, 40.0691] },
  { name: "Australia", coordinates: [133.7751, -25.2744] },
  { name: "Austria", coordinates: [14.5501, 47.5162] },
  { name: "Azerbaijan", coordinates: [47.5769, 40.1431] },
  { name: "Bahamas", coordinates: [-77.3963, 25.0343] },
  { name: "Bahrain", coordinates: [50.6370, 26.0667] },
  { name: "Bangladesh", coordinates: [90.3563, 23.6850] },
  { name: "Barbados", coordinates: [-59.5432, 13.1939] },
  { name: "Belarus", coordinates: [27.9534, 53.7098] },
  { name: "Belgium", coordinates: [4.4699, 50.5039] },
  { name: "Belize", coordinates: [-88.4976, 17.1899] },
  { name: "Benin", coordinates: [2.3158, 9.3077] },
  { name: "Bhutan", coordinates: [90.4336, 27.5142] },
  { name: "Bolivia", coordinates: [-63.5887, -16.2902] },
  { name: "Bosnia and Herzegovina", coordinates: [17.6791, 43.9159] },
  { name: "Botswana", coordinates: [24.6849, -22.3285] },
  { name: "Brazil", coordinates: [-51.9253, -14.2350] },
  { name: "Brunei", coordinates: [114.7277, 4.5353] },
  { name: "Bulgaria", coordinates: [25.4858, 42.7339] },
  { name: "Burkina Faso", coordinates: [-2.1834, 12.2383] },
  { name: "Burundi", coordinates: [29.9189, -3.3731] },
  { name: "Cabo Verde", coordinates: [-24.0132, 16.5388] },
  { name: "Cambodia", coordinates: [104.9910, 12.5657] },
  { name: "Cameroon", coordinates: [12.3547, 7.3697] },
  { name: "Canada", coordinates: [-106.3468, 56.1304] },
  { name: "Central African Republic", coordinates: [20.9394, 6.6111] },
  { name: "Chad", coordinates: [18.7322, 15.4542] },
  { name: "Chile", coordinates: [-71.5430, -35.6751] },
  { name: "China", coordinates: [104.1954, 35.8617] },
  { name: "Colombia", coordinates: [-74.2973, 4.5709] },
  { name: "Comoros", coordinates: [43.8722, -11.8750] },
  { name: "Congo", coordinates: [15.8277, -0.2280] },
  { name: "Congo (Democratic Republic)", coordinates: [21.7587, -4.0383] },
  { name: "Costa Rica", coordinates: [-83.7534, 9.7489] },
  { name: "Croatia", coordinates: [15.2000, 45.1000] },
  { name: "Cuba", coordinates: [-77.7812, 21.5218] },
  { name: "Cyprus", coordinates: [33.4299, 35.1264] },
  { name: "Czech Republic", coordinates: [15.4730, 49.8175] },
  { name: "Denmark", coordinates: [9.5018, 55.6761] },
  { name: "Djibouti", coordinates: [42.5903, 11.8251] },
  { name: "Dominica", coordinates: [-61.3710, 15.4140] },
  { name: "Dominican Republic", coordinates: [-70.1627, 18.7357] },
  { name: "Ecuador", coordinates: [-78.1834, -1.8312] },
  { name: "Egypt", coordinates: [30.8025, 26.8206] },
  { name: "El Salvador", coordinates: [-88.8965, 13.7942] },
  { name: "Equatorial Guinea", coordinates: [10.2679, 1.6508] },
  { name: "Eritrea", coordinates: [39.7823, 15.1794] },
  { name: "Estonia", coordinates: [25.0136, 58.5953] },
  { name: "Eswatini", coordinates: [31.4659, -26.5225] },
  { name: "Ethiopia", coordinates: [40.4897, 9.1450] },
  { name: "Fiji", coordinates: [179.4144, -16.5780] },
  { name: "Finland", coordinates: [25.7482, 61.9241] },
  { name: "France", coordinates: [2.2137, 46.2276] },
  { name: "Gabon", coordinates: [11.6094, -0.8037] },
  { name: "Gambia", coordinates: [-15.3101, 13.4432] },
  { name: "Georgia", coordinates: [43.3569, 42.3154] },
  { name: "Germany", coordinates: [10.4515, 51.1657] },
  { name: "Ghana", coordinates: [-1.0232, 7.9465] },
  { name: "Greece", coordinates: [21.8243, 39.0742] },
  { name: "Grenada", coordinates: [-61.6790, 12.1165] },
  { name: "Guatemala", coordinates: [-90.2308, 15.7835] },
  { name: "Guinea", coordinates: [-9.6966, 9.9456] },
  { name: "Guinea-Bissau", coordinates: [-15.1804, 11.8037] },
  { name: "Guyana", coordinates: [-58.9302, 4.8604] },
  { name: "Haiti", coordinates: [-72.2852, 18.9712] },
  { name: "Honduras", coordinates: [-86.2419, 15.2000] },
  { name: "Hungary", coordinates: [19.5033, 47.1625] },
  { name: "Iceland", coordinates: [-19.0208, 64.9631] },
  { name: "India", coordinates: [78.9629, 20.5937] },
  { name: "Indonesia", coordinates: [113.9213, -0.7893] },
  { name: "Iran", coordinates: [53.6880, 32.4279] },
  { name: "Iraq", coordinates: [43.6793, 33.2232] },
  { name: "Ireland", coordinates: [-8.2439, 53.4129] },
  { name: "Israel", coordinates: [34.8516, 32.1732] },
  { name: "Italy", coordinates: [12.5674, 41.8719] },
  { name: "Jamaica", coordinates: [-77.2975, 18.1096] },
  { name: "Japan", coordinates: [138.2529, 36.2048] },
  { name: "Jordan", coordinates: [36.2384, 30.5852] },
  { name: "Kazakhstan", coordinates: [66.9237, 48.0196] },
  { name: "Kenya", coordinates: [37.9062, -0.0236] },
  { name: "Kiribati", coordinates: [-157.3630, 1.8709] },
  { name: "Korea (North)", coordinates: [127.5101, 40.3399] },
  { name: "Korea (South)", coordinates: [127.7669, 35.9078] },
  { name: "Kuwait", coordinates: [47.4818, 29.3117] },
  { name: "Kyrgyzstan", coordinates: [74.7661, 41.2044] },
  { name: "Laos", coordinates: [102.4955, 19.8563] },
  { name: "Latvia", coordinates: [24.6032, 56.8796] },
  { name: "Lebanon", coordinates: [35.8623, 33.8547] },
  { name: "Lesotho", coordinates: [28.2336, -29.6100] },
  { name: "Liberia", coordinates: [-9.4295, 6.4281] },
  { name: "Libya", coordinates: [17.2283, 26.3351] },
  { name: "Liechtenstein", coordinates: [9.5553, 47.1660] },
  { name: "Lithuania", coordinates: [23.8813, 55.1694] },
  { name: "Luxembourg", coordinates: [6.1296, 49.8153] },
  { name: "Madagascar", coordinates: [46.8691, -18.7669] },
  { name: "Malawi", coordinates: [34.3015, -13.2543] },
  { name: "Malaysia", coordinates: [101.9758, 4.2105] },
  { name: "Maldives", coordinates: [73.2207, 3.2028] },
  { name: "Mali", coordinates: [-3.9962, 17.5707] },
  { name: "Malta", coordinates: [14.3754, 35.9375] },
  { name: "Marshall Islands", coordinates: [171.1845, 7.1315] },
  { name: "Mauritania", coordinates: [-10.9408, 21.0079] },
  { name: "Mauritius", coordinates: [57.5522, -20.3484] },
  { name: "Mexico", coordinates: [-102.5528, 23.6345] },
  { name: "Micronesia", coordinates: [150.5508, 7.4256] },
  { name: "Moldova", coordinates: [28.3699, 47.4116] },
  { name: "Monaco", coordinates: [7.4167, 43.7333] },
  { name: "Mongolia", coordinates: [103.8467, 46.8625] },
  { name: "Montenegro", coordinates: [19.3744, 42.7087] },
  { name: "Morocco", coordinates: [-7.0926, 31.7917] },
  { name: "Mozambique", coordinates: [35.5296, -18.6657] },
  { name: "Myanmar", coordinates: [95.9560, 21.9162] },
  { name: "Namibia", coordinates: [18.4941, -22.9576] },
  { name: "Nauru", coordinates: [166.9315, -0.5228] },
  { name: "Nepal", coordinates: [84.1240, 28.3949] },
  { name: "Netherlands", coordinates: [5.2913, 52.1326] },
  { name: "New Zealand", coordinates: [174.8860, -40.9006] },
  { name: "Nicaragua", coordinates: [-85.2072, 12.8654] },
  { name: "Niger", coordinates: [8.0817, 17.6078] },
  { name: "Nigeria", coordinates: [8.6753, 9.0820] },
  { name: "North Macedonia", coordinates: [21.7453, 41.6086] },
  { name: "Norway", coordinates: [8.4689, 60.4720] },
  { name: "Oman", coordinates: [55.9754, 21.4735] },
  { name: "Pakistan", coordinates: [69.3451, 30.3753] },
  { name: "Palau", coordinates: [134.5825, 7.5150] },
  { name: "Panama", coordinates: [-80.7821, 8.5380] },
  { name: "Papua New Guinea", coordinates: [143.9555, -6.3140] },
  { name: "Paraguay", coordinates: [-58.4438, -23.4425] },
  { name: "Peru", coordinates: [-75.0152, -9.1900] },
  { name: "Philippines", coordinates: [121.7740, 12.8797] },
  { name: "Poland", coordinates: [19.1343, 51.9194] },
  { name: "Portugal", coordinates: [-8.2245, 39.3999] },
  { name: "Qatar", coordinates: [51.1839, 25.3548] },
  { name: "Romania", coordinates: [24.9668, 45.9432] },
  { name: "Russia", coordinates: [105.3188, 61.5240] },
  { name: "Rwanda", coordinates: [29.8739, -1.9403] },
  { name: "Saint Kitts and Nevis", coordinates: [-62.7830, 17.3578] },
  { name: "Saint Lucia", coordinates: [-60.9789, 13.9094] },
  { name: "Saint Vincent and the Grenadines", coordinates: [-61.2872, 12.9843] },
  { name: "Samoa", coordinates: [-172.1046, -13.7590] },
  { name: "San Marino", coordinates: [12.4578, 43.9424] },
  { name: "Sao Tome and Principe", coordinates: [6.6131, 0.1864] },
  { name: "Saudi Arabia", coordinates: [45.0792, 23.8859] },
  { name: "Senegal", coordinates: [-14.4524, 14.4974] },
  { name: "Serbia", coordinates: [21.0059, 44.0165] },
  { name: "Seychelles", coordinates: [55.4920, -4.6796] },
  { name: "Sierra Leone", coordinates: [-11.7799, 8.4606] },
  { name: "Singapore", coordinates: [103.8198, 1.3521] },
  { name: "Slovakia", coordinates: [19.6990, 48.6690] },
  { name: "Slovenia", coordinates: [14.9955, 46.1512] },
  { name: "Solomon Islands", coordinates: [160.1562, -9.6457] },
  { name: "Somalia", coordinates: [46.1996, 5.1521] },
  { name: "Somaliland", coordinates: [44.065, 9.560] },
  { name: "South Africa", coordinates: [22.9375, -30.5595] },
  { name: "South Sudan", coordinates: [31.3069, 6.8770] },
  { name: "Spain", coordinates: [-3.7492, 40.4637] },
  { name: "Sri Lanka", coordinates: [80.7718, 7.8731] },
  { name: "Sudan", coordinates: [30.2176, 12.8628] },
  { name: "Suriname", coordinates: [-56.0278, 3.9193] },
  { name: "Sweden", coordinates: [18.6435, 60.1282] },
  { name: "Switzerland", coordinates: [8.2275, 46.8182] },
  { name: "Syria", coordinates: [38.9968, 34.8021] },
  { name: "Taiwan", coordinates: [120.9605, 23.6978] },
  { name: "Tajikistan", coordinates: [71.2761, 38.8610] },
  { name: "Tanzania", coordinates: [34.8888, -6.3690] },
  { name: "Thailand", coordinates: [100.9925, 15.8700] },
  { name: "Timor-Leste", coordinates: [125.7275, -8.8742] },
  { name: "Togo", coordinates: [0.8248, 8.6195] },
  { name: "Tonga", coordinates: [-175.1982, -21.1789] },
  { name: "Trinidad and Tobago", coordinates: [-61.2225, 10.6918] },
  { name: "Tunisia", coordinates: [9.5375, 33.8869] },
  { name: "Turkey", coordinates: [35.2433, 38.9637] },
  { name: "Turkmenistan", coordinates: [59.5563, 38.9697] },
  { name: "Tuvalu", coordinates: [177.6493, -7.1095] },
  { name: "Uganda", coordinates: [32.2903, 1.3733] },
  { name: "Ukraine", coordinates: [31.1656, 48.3794] },
  { name: "United Arab Emirates", coordinates: [53.8478, 23.4241] },
  { name: "United Kingdom", coordinates: [-3.4360, 55.3781] },
  { name: "United States", coordinates: [-95.7129, 37.0902] },
  { name: "Uruguay", coordinates: [-55.7658, -32.5228] },
  { name: "Uzbekistan", coordinates: [64.5853, 41.3775] },
  { name: "Vanuatu", coordinates: [166.9592, -15.3767] },
  { name: "Vatican City", coordinates: [12.4534, 41.9029] },
  { name: "Venezuela", coordinates: [-66.5897, 6.4238] },
  { name: "Vietnam", coordinates: [108.2772, 14.0583] },
  { name: "Yemen", coordinates: [48.5164, 15.5527] },
  { name: "Zambia", coordinates: [27.8546, -13.1339] },
  { name: "Zimbabwe", coordinates: [29.1549, -19.0154] }
];

// TODO: Replace with your actual Mapbox token
const MAPBOX_TOKEN = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
export const TargetLocationSelector = ({
  selectedLocation,
  onLocationChange
}: TargetLocationSelectorProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [needsMapboxToken, setNeedsMapboxToken] = useState(false);
  useEffect(() => {
    if (!mapContainer.current) return;
    try {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [46.1996, 5.1521],
        // Default to Somalia
        zoom: 5,
        attributionControl: false
      });
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      return () => {
        map.current?.remove();
      };
    } catch (error) {
      console.error('Mapbox error:', error);
      setNeedsMapboxToken(true);
    }
  }, []);
  useEffect(() => {
    if (!map.current || !selectedLocation) return;
    const location = targetLocations.find(l => l.name === selectedLocation);
    if (!location) return;

    // Remove existing marker
    if (marker.current) {
      marker.current.remove();
    }

    // Skip marker for global location
    if (location.name === "Global / All Locations") {
      map.current.flyTo({
        center: [0, 0],
        zoom: 1,
        duration: 2000
      });
      return;
    }

    // Add new marker
    marker.current = new mapboxgl.Marker({
      color: '#0891b2'
    }).setLngLat(location.coordinates as [number, number]).addTo(map.current);

    // Fly to location with appropriate zoom
    const zoomLevel = location.name.includes(',') ? 8 : 6; // Higher zoom for cities
    map.current.flyTo({
      center: location.coordinates as [number, number],
      zoom: zoomLevel,
      duration: 2000
    });
  }, [selectedLocation]);
  if (needsMapboxToken) {
    return <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="location">Select Target Audience Location *</Label>
          <Select value={selectedLocation} onValueChange={onLocationChange}>
            <SelectTrigger className="glass-button border-white/30">
              <SelectValue placeholder="Select target audience location" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg max-h-60">
              {targetLocations.map(location => <SelectItem key={location.name} value={location.name} className="hover:bg-gray-100">
                  {location.name}
                </SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        
        {selectedLocation && <div className="glass-card p-6 text-center border-yellow-200 bg-yellow-50">
            <p className="text-yellow-800 mb-4">
              📍 Target Audience: <strong>{selectedLocation}</strong>
            </p>
            <p className="text-sm text-gray-600">
              Map preview requires Mapbox token configuration
            </p>
          </div>}
      </div>;
  }
  return <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="location">Select Target Audience Location *</Label>
        <Select value={selectedLocation} onValueChange={onLocationChange}>
          <SelectTrigger className="glass-button border-white/30">
            <SelectValue placeholder="Select target audience location" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg max-h-60">
            {targetLocations.map(location => <SelectItem key={location.name} value={location.name} className="hover:bg-gray-100">
                {location.name}
              </SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      
      {selectedLocation && selectedLocation !== "Global / All Locations"}
    </div>;
};