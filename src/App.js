import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import './App.css';
import logo from './images/logo.png';
import ItemSelector from './ItemSelector.tsx';
import { itemCategories, ItemDimension } from './itemConfig.ts';

function App() {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [moveType, setMoveType] = useState("Home to Home");
  const [pickupAddress, setPickupAddress] = useState("");
  const [currentLat, setCurrentLat] = useState("");
  const [currentLng, setCurrentLng] = useState("");
  const [response, setResponse] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [usePhotos, setUsePhotos] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [scheduledDate, setScheduledDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [scheduledTime, setScheduledTime] = useState(() => {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    
    // Round up to next 15-minute increment
    minutes = Math.ceil(minutes / 15) * 15;
    if (minutes === 60) {
      minutes = 0;
      hours++;
    }
    
    // If after 8 PM, set to 8 AM next day
    if (hours >= 20) {
      hours = 8;
      minutes = 0;
    }
    // If before 8 AM, set to 8 AM
    else if (hours < 8) {
      hours = 8;
      minutes = 0;
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  });
  const [loading, setLoading] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const mapRef = useRef(null);
  const autocompleteRef = useRef(null);
  const pickupAutocompleteRef = useRef(null);

  const itemTypes = [
    "Couch", "Bed", "Dresser", "Table", "Chair", "TV", "Bookshelf", "Desk",
    "Lamp", "Mattress", "Rug", "Washer", "Dryer", "Refrigerator", "Oven",
    "Microwave", "Cabinet", "Mirror", "Nightstand", "Storage Bin", "Box"
  ];

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCurrentLat(pos.coords.latitude);
        setCurrentLng(pos.coords.longitude);
        fetchPickupAddress(pos.coords.latitude, pos.coords.longitude);

        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          zoom: 14
        });

        new window.google.maps.Marker({
          position: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          map: map
        });
      },
      (err) => {
        console.warn("Geolocation failed:", err);
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: 37.7749, lng: -122.4194 },
          zoom: 12
        });
      }
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.google && window.google.maps) {
        // Create map instance
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: currentLat || 37.7749, lng: currentLng || -122.4194 },
          zoom: 14
        });

        // Function to handle place selection
        const handlePlaceSelect = (place, inputField, setAddress) => {
          if (place.geometry) {
            setAddress(place.formatted_address || "");
            
            // Update map
            map.setCenter(place.geometry.location);
            map.setZoom(15);
            
            // Add marker
            new window.google.maps.Marker({
              position: place.geometry.location,
              map: map
            });
          }
        };

        // Setup autocomplete for pickup address
        if (pickupAutocompleteRef.current) {
          const pickupAutocomplete = new window.google.maps.places.Autocomplete(
            pickupAutocompleteRef.current,
            { 
              fields: ["formatted_address", "geometry"],
              types: ["address"]
            }
          );
          pickupAutocomplete.addListener("place_changed", () => {
            const place = pickupAutocomplete.getPlace();
            handlePlaceSelect(place, pickupAutocompleteRef.current, setPickupAddress);
          });
        }

        // Setup autocomplete for destination address
        if (autocompleteRef.current) {
          const destinationAutocomplete = new window.google.maps.places.Autocomplete(
            autocompleteRef.current,
            { 
              fields: ["formatted_address", "geometry"],
              types: ["address"]
            }
          );
          destinationAutocomplete.addListener("place_changed", () => {
            const place = destinationAutocomplete.getPlace();
            handlePlaceSelect(place, autocompleteRef.current, setDestinationAddress);
          });
        }

        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [currentLat, currentLng, moveType]);

  // Update map when move type changes
  useEffect(() => {
    if (window.google && window.google.maps && mapRef.current) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: currentLat || 37.7749, lng: currentLng || -122.4194 },
        zoom: 14
      });

      // Add marker for current location
      if (currentLat && currentLng) {
        new window.google.maps.Marker({
          position: { lat: currentLat, lng: currentLng },
          map: map
        });
      }
    }
  }, [moveType, currentLat, currentLng]);

  // Style for address inputs
  const addressInputStyle = {
    backgroundColor: '#333',
    color: 'white',
    border: '1px solid #444',
    borderRadius: '0.25rem',
    padding: '0.75rem',
    width: '100%',
    height: '3.5rem',
    fontSize: '1rem',
    lineHeight: '2rem'
  };

  const fetchPickupAddress = async (lat, lng) => {
    try {
      const res = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
        params: {
          latlng: `${lat},${lng}`,
          key: "YOUR_GOOGLE_API_KEY"
        }
      });
      const address = res.data.results[0]?.formatted_address || "";
      setPickupAddress(address);
    } catch (err) {
      console.error("Failed to fetch address:", err);
    }
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone) => /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/.test(phone);

  const handleChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { item_name: "", length: "", width: "", height: "", use_ai: false }]);
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedPhotos((prev) => [...prev, ...files]);
  };

  const removePhoto = (index) => {
    setUploadedPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const checkValidationPage1 = () => {
    const errors = {};
    if (!name) errors.name = true;
    if (!email || !isValidEmail(email)) errors.email = true;
    if (!phone || !isValidPhone(phone)) errors.phone = true;
    if (!destinationAddress) errors.destinationAddress = true;
    if (!scheduledDate) errors.scheduledDate = true;
    if (!scheduledTime) errors.scheduledTime = true;
    if (moveType !== "In-House Move" && moveType !== "Junk Removal" && !pickupAddress) {
      errors.pickupAddress = true;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const checkValidationPage2 = () => {
    const errors = {};
    if (usePhotos && uploadedPhotos.length === 0) {
      errors.photos = true;
    } else if (!usePhotos && items.length === 0) {
      errors.items = true;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submitForm = async () => {
    if (!isValidEmail(email)) return alert("Please enter a valid email.");
    if (!isValidPhone(phone)) return alert("Please enter a valid 10-digit US phone number.");

    setLoading(true);

    let lat = parseFloat(currentLat);
    let lng = parseFloat(currentLng);
    let distOverride = null;

    if (moveType === "In-House Move") distOverride = 0;
    if (moveType === "Junk Removal") distOverride = 5;

    // Create an array of items where each item is repeated based on its quantity
    const expandedItems = items.flatMap(item => 
      Array(item.quantity).fill({
        item_name: item.item_name,
        length: parseFloat(item.length),
        width: parseFloat(item.width),
        height: parseFloat(item.height),
        weight: item.weight ? parseFloat(item.weight) : null
      })
    );

    const formPayload = {
      name,
      email,
      phone,
      move_type: moveType,
      pickup_address: pickupAddress,
      destination_address: destinationAddress,
      current_lat: lat,
      current_lng: lng,
      scheduled_date: scheduledDate,
      scheduled_time: scheduledTime,
      mileage_override: distOverride,
      use_photos: usePhotos,
      additional_info: additionalInfo,
      items: usePhotos ? [] : expandedItems
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(formPayload));
    uploadedPhotos.forEach(file => {
      formData.append("files", file);
    });

    try {
      const res = await axios.post("https://pikup-backend.onrender.com/submit", formData);
      setResponse({ type: usePhotos ? "photos" : "manual", data: res.data });
    } catch (err) {
      console.error(err);
      setResponse({ error: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  const showPickup = moveType === "Home to Home" || moveType === "Store Pickup" || moveType === "Home to Storage Unit";
  const labelPickup = moveType === "Store Pickup" ? "Store Address" : "Pickup Address";
  const labelDropoff = moveType === "Home to Storage Unit" ? "Storage Unit Location" : (moveType === "In-House Move" || moveType === "Junk Removal" ? "Address" : "Dropoff Address");

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="app-container">
      <div className="navigation-bar">
        <div className="nav-item" onClick={() => {
          if (isConfirmed) {
            setPage(1);
          }
        }}>
          <span className={`nav-number ${page === 1 ? 'active' : ''}`}>1</span>
          <span className="nav-label">Contact Info</span>
        </div>
        <div 
          className={`nav-item ${page < 2 ? 'disabled' : ''}`} 
          onClick={() => {
            if (isConfirmed) {
              setPage(2);
            } else if (checkValidationPage1()) {
              setPage(2);
            }
          }}
        >
          <span className={`nav-number ${page === 2 ? 'active' : ''}`}>2</span>
          <span className="nav-label">Items</span>
        </div>
        <div 
          className={`nav-item ${page < 3 ? 'disabled' : ''}`} 
          onClick={() => {
            if (isConfirmed) {
              setPage(3);
            } else if (checkValidationPage1() && checkValidationPage2()) {
              setPage(3);
            }
          }}
        >
          <span className={`nav-number ${page === 3 ? 'active' : ''}`}>3</span>
          <span className="nav-label">Review</span>
        </div>
      </div>

      {page === 1 && (
        <div className="content-wrapper">
          <div className="header">
            <img src={logo} alt="PikUp Logo" className="logo" />
            <h1 className="title">PikUp</h1>
            <p className="subtitle">The easiest way to move your stuff. Affordable. Reliable. Fast.</p>
          </div>

          <div className="form-group">
            <label>Full Name:</label>
            <input 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="John Doe" 
              className={validationErrors.name ? 'error' : ''}
              required 
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="example@email.com" 
              className={validationErrors.email ? 'error' : ''}
              required 
            />
          </div>

          <div className="form-group">
            <label>Phone:</label>
            <input 
              value={phone} 
              onChange={e => setPhone(e.target.value)} 
              placeholder="(123) 456-7890" 
              className={validationErrors.phone ? 'error' : ''}
              required 
            />
          </div>

          <div className="form-group">
            <label>Move Type:</label>
            <select 
              value={moveType} 
              onChange={e => setMoveType(e.target.value)}
              className={validationErrors.moveType ? 'error' : ''}
            >
              <option>Home to Home</option>
              <option>Home to Storage Unit</option>
              <option>In-House Move</option>
              <option>Store Pickup</option>
              <option>Junk Removal</option>
            </select>
          </div>

          {showPickup && (
            <div className="form-group">
              <label>{labelPickup}:</label>
              <input
                ref={pickupAutocompleteRef}
                value={pickupAddress}
                onChange={e => setPickupAddress(e.target.value)}
                className={validationErrors.pickupAddress ? 'error' : ''}
                placeholder="Enter pickup address"
                style={addressInputStyle}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>{labelDropoff}:</label>
            <input
              ref={autocompleteRef}
              value={destinationAddress}
              onChange={e => setDestinationAddress(e.target.value)}
              placeholder="Enter destination address"
              className={validationErrors.destinationAddress ? 'error' : ''}
              style={addressInputStyle}
              required
            />
          </div>

          <div className="form-group">
            <label>Scheduled Date:</label>
            <input 
              type="date" 
              value={scheduledDate} 
              onChange={e => setScheduledDate(e.target.value)}
              className={validationErrors.scheduledDate ? 'error' : ''}
              min={new Date().toISOString().split('T')[0]}
              required 
            />
          </div>

          <div className="form-group">
            <label>Scheduled Time:</label>
            <input 
              type="time" 
              value={scheduledTime} 
              onChange={e => setScheduledTime(e.target.value)}
              className={validationErrors.scheduledTime ? 'error' : ''}
              required 
            />
          </div>

          <div id="map" ref={mapRef} className="map" />

          <button 
            onClick={() => {
              if (checkValidationPage1()) {
                setPage(2);
              }
            }} 
            className="button"
          >
            Next
          </button>
        </div>
      )}

      {page === 2 && (
        <div className="content-wrapper">
          <h1 className="title">Item Info</h1>
          <p className="subtitle">Would you like to upload photos or manually enter your items?</p>
          <p className="manual-entry-note">(manually entered items will get an immediate quote)</p>
          
          <div className="button-group">
            <button 
              onClick={() => { setUsePhotos(true); }} 
              className={`button ${usePhotos ? 'active' : ''}`}
            >
              Upload Photos
            </button>
            <button 
              onClick={() => { setUsePhotos(false); }} 
              className={`button ${!usePhotos ? 'active' : ''}`}
            >
              Enter Items
            </button>
          </div>

          {usePhotos ? (
            <div className="photo-upload-section">
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handlePhotoUpload}
                className="file-input"
              />
              <div className="photo-grid">
                {uploadedPhotos.map((photo, index) => (
                  <div key={index} className="photo-item">
                    <img 
                      src={URL.createObjectURL(photo)} 
                      alt="upload" 
                    />
                    <button 
                      onClick={() => removePhoto(index)}
                      className="remove-photo"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="items-section">
              <ItemSelector onItemAdd={(item) => {
                setItems(prev => [...prev, {
                  item_name: item.name,
                  length: item.dimensions.length,
                  width: item.dimensions.width,
                  height: item.dimensions.height,
                  weight: item.dimensions.weight,
                  quantity: 1
                }]);
              }} />
              
              {items.length > 0 && (
                <div className="items-list">
                  {items.map((item, index) => (
                    <div key={index} className="item-entry">
                      <div className="item-details">
                        <span className="item-name">{item.item_name}</span>
                        <div className="quantity-controls">
                          <button 
                            onClick={() => {
                              const newItems = [...items];
                              if (newItems[index].quantity > 1) {
                                newItems[index].quantity -= 1;
                                setItems(newItems);
                              }
                            }}
                            className="quantity-button"
                          >
                            -
                          </button>
                          <span className="quantity">{item.quantity}</span>
                          <button 
                            onClick={() => {
                              const newItems = [...items];
                              newItems[index].quantity += 1;
                              setItems(newItems);
                            }}
                            className="quantity-button"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const newItems = items.filter((_, i) => i !== index);
                          setItems(newItems);
                        }}
                        className="remove-item-button"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="form-group">
            <label>Additional Information (Optional):</label>
            <textarea
              value={additionalInfo}
              onChange={e => setAdditionalInfo(e.target.value)}
              placeholder="e.g., Special instructions, fragile items, or any other details we should know"
              className="additional-info-input"
            />
          </div>

          <button 
            onClick={() => {
              if (checkValidationPage2()) {
                setPage(3);
              }
            }}
            className="button"
          >
            Finish
          </button>
        </div>
      )}

      {page === 3 && !isConfirmed && (
        <div className="content-wrapper centered">
            <div>
            <h2 className="title">Review Your Submission</h2>
            <div className="submission-details">
              <h3>Your Move Details</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Name:</span>
                  <span className="detail-value">{name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{email}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Phone:</span>
                  <span className="detail-value">{phone}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Move Type:</span>
                  <span className="detail-value">{moveType}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Pickup Address:</span>
                  <span className="detail-value">{pickupAddress}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Destination Address:</span>
                  <span className="detail-value">{destinationAddress}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Scheduled Date:</span>
                  <span className="detail-value">{formatDate(scheduledDate)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Scheduled Time:</span>
                  <span className="detail-value">{formatTime(scheduledTime)}</span>
                </div>
                {additionalInfo && (
                  <div className="detail-item">
                    <span className="detail-label">Additional Information:</span>
                    <span className="detail-value">{additionalInfo}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="payment-notice">
              <p>Please note: Payment will be collected in person at the time of service.</p>
            </div>

            <button 
              className="confirm-button"
              onClick={() => {
                setIsConfirmed(true);
                submitForm();
              }}
            >
              Confirm Submission
            </button>
          </div>
        </div>
      )}

      {isConfirmed && (
        <div className="final-page">
          <div className="confirmation-message">
            <h3>Thank you for your submission!</h3>
            <p>We'll send you an email shortly to confirm your move details and price.</p>
            {response?.type === "manual" && response?.data?.price && (
              <div className="price-display">
                <span className="price-label">Estimated Price:</span>
                <span className="price-amount">${response.data.price.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
