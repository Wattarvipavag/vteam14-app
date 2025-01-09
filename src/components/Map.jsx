import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';
import ReactDOM from 'react-dom/client';
import { TbScooter, TbParking, TbChargingPile } from 'react-icons/tb';
import logo from '../images/logo.png';
import { API_URL } from '../config/envConfig.js';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebaseConfig.js';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';

export default function Map({ location, zoom }) {
    const mapRef = useRef();
    const mapContainerRef = useRef();
    const [markersVisible, setMarkersVisible] = useState(true);
    const markersRef = useRef([]);
    const citiesRef = useRef([]);
    const [cities, setCities] = useState([]);
    const [bikes, setBikes] = useState([]);
    const [chargingStations, setChargingStations] = useState([]);
    const [parkingAreas, setParkingAreas] = useState([]);
    const currentLocationMarkerRef = useRef(null);
    const [user] = useAuthState(auth);
    const token = user.accessToken;
    const navigate = useNavigate();

    const isTestEnvironment = import.meta.env.NODE_ENV === 'test';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const cities = await axios.get(`${API_URL}/cities`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const bikes = await axios.get(`${API_URL}/bikes`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const chargingStations = await axios.get(`${API_URL}/chargingstations`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const parkingAreas = await axios.get(`${API_URL}/parkingareas`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCities(cities.data);
                setBikes(bikes.data);
                setChargingStations(chargingStations.data);
                setParkingAreas(parkingAreas.data);
            } catch (error) {
                console.log(error);
                await signOut();
                navigate('/');
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY;

        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            center: [location.longitude, location.latitude],
            zoom: zoom,

            style: 'mapbox://styles/mapbox/standard',
        });

        map.on('zoom', () => {
            const currentZoom = map.getZoom();
            setMarkersVisible(currentZoom >= 10);
        });

        const currentLocationMarker = document.createElement('div');
        currentLocationMarker.className = 'current-location-icon';

        currentLocationMarkerRef.current = new mapboxgl.Marker({ element: currentLocationMarker })
            .setLngLat([location.longitude, location.latitude])
            .addTo(map);

        mapRef.current = map;

        return () => map.remove();
    }, []);

    useEffect(() => {
        if (currentLocationMarkerRef.current) {
            currentLocationMarkerRef.current.setLngLat([location.longitude, location.latitude]);
        }
    }, [location]);

    useEffect(() => {
        if (markersVisible) {
            renderChargingStationMarkers();
            renderParkingAreaMarkers();
            renderBikeMarkers();
        } else {
            renderCityMarkers();
        }

        if (!markersVisible && markersRef.current.length > 0) {
            markersRef.current.forEach((marker) => marker.remove());
            markersRef.current = [];
        }

        if (markersVisible && citiesRef.current.length > 0) {
            citiesRef.current.forEach((marker) => marker.remove());
            citiesRef.current = [];
        }
    }, [markersVisible, cities]);

    if (isTestEnvironment) {
        return;
    }

    function renderCityMarkers() {
        cities.forEach((city) => {
            const markerElement = document.createElement('div');
            markerElement.style.width = '40px';
            markerElement.style.height = '40px';
            markerElement.style.borderRadius = '50%';
            markerElement.style.overflow = 'hidden';
            markerElement.style.backgroundImage = `url(${logo})`;
            markerElement.style.backgroundSize = 'cover';
            markerElement.style.backgroundPosition = 'center';
            markerElement.style.border = '2px solid black';

            const marker = new mapboxgl.Marker({ element: markerElement })
                .setLngLat([city.location.longitude, city.location.latitude])
                .addTo(mapRef.current);
            citiesRef.current.push(marker);
        });
    }

    function renderBikeMarkers() {
        let chargingCounter = {};
        chargingStations.forEach((chargingstation) => {
            chargingCounter[chargingstation._id] = 0;
        });

        let parkingCounter = {};
        parkingAreas.forEach((parkingarea) => {
            parkingCounter[parkingarea._id] = 0;
        });

        bikes.forEach((bike) => {
            if (!bike.available) return;
            const markerElement = document.createElement('div');
            markerElement.style.display = 'none';
            markerElement.dataset.bikeId = bike._id;

            let chargeColor = bike.charge >= 70 ? 'green' : bike.charge >= 50 ? '#FDCE06' : bike.charge >= 30 ? '#EB841F' : '#D61E2A';

            const popup = new mapboxgl.Popup({ closeOnMove: true }).setHTML(`
            <div>
                <h3>${bike._id}</h3>
                <div class="popup-body">
                    <p><strong>Position:</strong> ${bike.location.latitude}, ${bike.location.longitude}</p>
                    <p><strong>Laddning:</strong> ${bike.charge}%</p>
                    <p><strong>Tillgänglig:</strong> ${bike.available ? 'Ja' : 'Nej'}</p>
                </div>
            </div>
        `);

            const root = ReactDOM.createRoot(markerElement);
            let offset = 0;

            if (bike.chargingStationId && chargingCounter[bike.chargingStationId] <= 4) {
                offset = chargingCounter[bike.chargingStationId]++;
                markerElement.style.display = 'block';
            } else if (bike.parkingAreaId && parkingCounter[bike.parkingAreaId] <= 4) {
                offset = parkingCounter[bike.parkingAreaId]++;
                markerElement.style.display = 'block';
            } else if (!bike.parkingAreaId && !bike.chargingStationId) {
                markerElement.style.display = 'block';
            }

            root.render(
                <TbScooter
                    style={{
                        backgroundColor: chargeColor,
                        transform: `translate(${-5 + offset * 3}px, 20px)`,
                    }}
                    size={30}
                    color='black'
                    className='scooter-icon'
                />
            );

            const marker = new mapboxgl.Marker({ element: markerElement })
                .setLngLat([bike.location.longitude, bike.location.latitude])
                .setPopup(popup)
                .addTo(mapRef.current);

            markersRef.current.push(marker);
        });
    }

    function renderParkingAreaMarkers() {
        parkingAreas.forEach((parkingArea) => {
            const markerElement = document.createElement('div');
            const root = ReactDOM.createRoot(markerElement);
            root.render(<TbParking className='parking-icon' size={50} color='white' fill='#0271c0' />);

            const popup = new mapboxgl.Popup({
                closeOnMove: true,
            }).setHTML(
                `<div>
                <h3>${parkingArea.name}</h3>
                <div class="popup-body">
                    <p><strong>Antal elsparkcyklar:</strong> ${parkingArea.bikes.length}</p>
                </div>
            </div>`
            );

            const marker = new mapboxgl.Marker({ element: markerElement })
                .setLngLat([parkingArea.location.longitude, parkingArea.location.latitude])
                .addTo(mapRef.current)
                .setPopup(popup);
            markersRef.current.push(marker);
        });
    }

    function renderChargingStationMarkers() {
        chargingStations.forEach((chargingStation) => {
            const markerElement = document.createElement('div');
            const root = ReactDOM.createRoot(markerElement);
            root.render(<TbChargingPile className='charging-icon' size={50} fill='#41ab5d' />);

            const popup = new mapboxgl.Popup({
                closeOnMove: true,
            }).setHTML(
                `<div>
                <h3>${chargingStation.name}</h3>
                <div class="popup-body">
                    <p><strong>Antal elsparkcyklar:</strong> ${chargingStation.bikes.length}</p>
                </div>
            </div>`
            );

            const marker = new mapboxgl.Marker({ element: markerElement })
                .setLngLat([chargingStation.location.longitude, chargingStation.location.latitude])
                .addTo(mapRef.current)
                .setPopup(popup);
            markersRef.current.push(marker);
        });
    }

    return <div className='map' ref={mapContainerRef}></div>;
}
