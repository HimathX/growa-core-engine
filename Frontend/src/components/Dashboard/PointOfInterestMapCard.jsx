import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes, faMapMarkerAlt, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';

const PointOfInterestMapCard = ({ onClick, imageUrl }) => {
    const [showDialog, setShowDialog] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [manualCoords, setManualCoords] = useState({ lat: '', lng: '' });
    const [isLoading, setIsLoading] = useState(false);


    const defaultCenter = { lat: 37.7749, lng: -122.4194 }; // San Francisco


    const mapCenter = selectedLocation || defaultCenter;


    const GOOGLE_MAPS_API_KEY = "AIzaSyCbKnCllIkyLwTR0gBivAlcKlEcp1chics";

    const handleAddLocationClick = (e) => {
        e.stopPropagation();
        setShowDialog(true);
    };

    const handleUseDeviceLocation = () => {
        setIsLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setSelectedLocation({ lat: latitude, lng: longitude });
                    setIsLoading(false);
                    setShowDialog(false);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    alert('Unable to get your location. Please try manual input.');
                    setIsLoading(false);
                }
            );
        } else {
            alert('Geolocation is not supported by this browser.');
            setIsLoading(false);
        }
    };

    const handleManualSubmit = (e) => {
        e.preventDefault();
        const lat = parseFloat(manualCoords.lat);
        const lng = parseFloat(manualCoords.lng);

        if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            alert('Please enter valid coordinates (Latitude: -90 to 90, Longitude: -180 to 180)');
            return;
        }

        setSelectedLocation({ lat, lng });
        setShowDialog(false);
    };

    return (
        <>
            <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
                <div
                    className="card point-of-interest-map-card"
                    onClick={onClick}
                    style={{ position: 'relative' }}
                >
                    <Map
                        style={{ width: '100%', height: '100%' }}
                        defaultCenter={mapCenter}
                        center={mapCenter}
                        defaultZoom={selectedLocation ? 15 : 10}
                        zoom={selectedLocation ? 15 : 10}
                        mapTypeId="satellite"
                        gestureHandling="greedy"
                        disableDefaultUI={false}
                        clickableIcons={false}
                    >
                        {selectedLocation && (
                            <Marker
                                position={selectedLocation}
                            />
                        )}
                    </Map>

                    <button
                        className="add-location-btn"
                        onClick={handleAddLocationClick}
                        title="Add new location"
                    >
                        <FontAwesomeIcon icon={faPlus} />
                    </button>
                </div>
            </APIProvider>

            {showDialog && (
                <div className="location-dialog-overlay" onClick={() => setShowDialog(false)}>
                    <div className="location-dialog" onClick={(e) => e.stopPropagation()}>
                        <div className="dialog-header">
                            <h3>Add New Location</h3>
                            <button
                                className="close-btn"
                                onClick={() => setShowDialog(false)}
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>

                        <div className="dialog-content">
                            <div className="location-options">
                                <button
                                    className="location-option-btn device-location"
                                    onClick={handleUseDeviceLocation}
                                    disabled={isLoading}
                                >
                                    <FontAwesomeIcon icon={faGlobe} />
                                    <span>{isLoading ? 'Getting location...' : 'Use Device Location'}</span>
                                </button>

                                <div className="divider">OR</div>

                                <form onSubmit={handleManualSubmit} className="manual-coords-form">
                                    <h4>Enter Coordinates Manually</h4>
                                    <div className="coord-inputs">
                                        <div className="input-group">
                                            <label htmlFor="latitude">Latitude:</label>
                                            <input
                                                type="number"
                                                id="latitude"
                                                step="any"
                                                placeholder="e.g., 37.7749"
                                                value={manualCoords.lat}
                                                onChange={(e) => setManualCoords(prev => ({ ...prev, lat: e.target.value }))}
                                                required
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label htmlFor="longitude">Longitude:</label>
                                            <input
                                                type="number"
                                                id="longitude"
                                                step="any"
                                                placeholder="e.g., -122.4194"
                                                value={manualCoords.lng}
                                                onChange={(e) => setManualCoords(prev => ({ ...prev, lng: e.target.value }))}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <button type="submit" className="submit-coords-btn">
                                        Add Location
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PointOfInterestMapCard;