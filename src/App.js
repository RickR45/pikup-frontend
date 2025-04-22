import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import './App.css';
import logo from './images/logo.png';

function App() {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([{ item_name: "", length: "", width: "", height: "", use_ai: false }]);
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
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
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
        if (autocompleteRef.current) {
          const autocomplete = new window.google.maps.places.Autocomplete(
            autocompleteRef.current,
            { fields: ["formatted_address", "geometry"], types: ["geocode", "establishment"] }
          );
          autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            setDestinationAddress(place.formatted_address || "");
          });
        }

        if (pickupAutocompleteRef.current) {
          const pickupAutocomplete = new window.google.maps.places.Autocomplete(
            pickupAutocompleteRef.current,
            { fields: ["formatted_address"], types: ["geocode", "establishment"] }
          );
          pickupAutocomplete.addListener("place_changed", () => {
            const place = pickupAutocomplete.getPlace();
            setPickupAddress(place.formatted_address || "");
          });
        }

        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

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

  const validatePage1 = () => {
    return name && isValidEmail(email) && isValidPhone(phone) && 
           destinationAddress && scheduledDate && scheduledTime &&
           (moveType === "In-House Move" || moveType === "Junk Removal" || pickupAddress);
  };

  const validatePage2 = () => {
    if (usePhotos) {
      return uploadedPhotos.length > 0;
    } else {
      return items.every(item => item.item_name && item.length && item.width && item.height);
    }
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
      items: usePhotos ? [] : items.map(item => ({
        ...item,
        length: parseFloat(item.length),
        width: parseFloat(item.width),
        height: parseFloat(item.height)
      }))
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
              required 
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="example@email.com" 
              required 
            />
          </div>

          <div className="form-group">
            <label>Phone:</label>
            <input 
              value={phone} 
              onChange={e => setPhone(e.target.value)} 
              placeholder="(123) 456-7890" 
              required 
            />
          </div>

          <div className="form-group">
            <label>Move Type:</label>
            <select 
              value={moveType} 
              onChange={e => setMoveType(e.target.value)}
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
              required
            />
          </div>

          <div className="form-group">
            <label>Scheduled Date:</label>
            <input 
              type="date" 
              value={scheduledDate} 
              onChange={e => setScheduledDate(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Scheduled Time:</label>
            <input 
              type="time" 
              value={scheduledTime} 
              onChange={e => setScheduledTime(e.target.value)} 
              required 
            />
          </div>

          <div id="map" ref={mapRef} className="map" />

          <button 
            onClick={() => validatePage1() && setPage(2)} 
            className={`button ${!validatePage1() ? 'disabled' : ''}`}
            disabled={!validatePage1()}
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
              className="button"
            >
              Upload Photos
            </button>
            <button 
              onClick={() => { setUsePhotos(false); }} 
              className="button"
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
              {items.map((item, index) => (
                <div key={index} className="item-row">
                  <select 
                    value={item.item_name} 
                    onChange={e => handleChange(index, "item_name", e.target.value)}
                  >
                    <option value="">Select Item Type</option>
                    {itemTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <input 
                    placeholder="Length (in)" 
                    value={item.length} 
                    onChange={e => handleChange(index, "length", e.target.value)}
                  />
                  <input 
                    placeholder="Width (in)" 
                    value={item.width} 
                    onChange={e => handleChange(index, "width", e.target.value)}
                  />
                  <input 
                    placeholder="Height (in)" 
                    value={item.height} 
                    onChange={e => handleChange(index, "height", e.target.value)}
                  />
                </div>
              ))}
              <button onClick={addItem} className="button">Add Another Item</button>
            </div>
          )}

          <button 
            onClick={() => { validatePage2() && submitForm(); setPage(3); }}
            className={`button ${!validatePage2() ? 'disabled' : ''}`}
            disabled={!validatePage2()}
          >
            Finish
          </button>
        </div>
      )}

      {page === 3 && (
        <div className="content-wrapper centered">
          {loading ? (
            <div>
              <div className="spinner" />
              <p className="subtitle">Submitting your info...</p>
            </div>
          ) : (
            <div>
              {response?.error && <p className="error">{response.error}</p>}
              {response?.type === "manual" && <h2 className="title">Your estimated price: ${response.data?.estimated_price?.toFixed(2)}</h2>}
              {response?.type === "photos" && <h2 className="title">Thank you! We'll get back to you within 24 hours with a quote.</h2>}
            </div>
          )}
        </div>
      )}

      {response && (
        <div className="final-page">
          <div className="quote-header">
            <h2>Quote Summary</h2>
            {response.type === "manual" && response.data && response.data.price && (
              <div className="price-display">
                <span className="price-label">Estimated Price:</span>
                <span className="price-amount">${response.data.price.toFixed(2)}</span>
              </div>
            )}
          </div>
          
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
            </div>
          </div>

          <div className="payment-notice">
            <p>Please note: Payment will be collected in person at the time of service.</p>
          </div>

          {!isConfirmed ? (
            <button 
              className="confirm-button"
              onClick={() => setIsConfirmed(true)}
            >
              Confirm Submission
            </button>
          ) : (
            <div className="confirmation-message">
              <h3>Thank you for your submission!</h3>
              <p>We'll send you an email shortly to confirm your move details.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
