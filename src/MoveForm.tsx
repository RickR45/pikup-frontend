import React, { useState, useCallback } from 'react';
import './MoveForm.css';
import MapComponent from './MapComponent';
import ItemSelector from './ItemSelector';
import { ItemDimension as ConfigItemDimension } from './itemConfig';
import LoadingSkeleton from './LoadingSkeleton';
import ToastNotification from './ToastNotification';
import FormProgress from './FormProgress';

interface FormData {
  name: string;
  email: string;
  phone: string;
  moveType: string;
  pickupAddress: string;
  destinationAddress: string;
  items: Array<{
    item_name: string;
    length: number;
    width: number;
    height: number;
    weight?: number;
  }>;
  usePhotos: boolean;
  currentLat: number | null;
  currentLng: number | null;
  mileageOverride: number | null;
  total_weight?: number;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  moveType?: string;
  pickupAddress?: string;
  destinationAddress?: string;
  items?: string;
  general?: string;
}

interface LocalItemDimension {
  length: number;
  width: number;
  height: number;
  weight?: number;
}

interface Item {
  name: string;
  dimensions: LocalItemDimension;
}

interface ItemSelectorProps {
  onItemAdd: (item: Item) => void;
}

const initialFormState: FormData = {
  name: '',
  email: '',
  phone: '',
  moveType: '',
  pickupAddress: '',
  destinationAddress: '',
  items: [],
  usePhotos: false,
  currentLat: null,
  currentLng: null,
  mileageOverride: null
};

const formSteps = [
  'Personal Info',
  'Move Details',
  'Items',
  'Review'
];

const MoveForm: React.FC = () => {
  const [formDataState, setFormDataState] = useState<FormData>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);

  const handlePickupCoordinatesChange = useCallback((lat: number, lng: number) => {
    setFormDataState(prev => ({
      ...prev,
      currentLat: lat,
      currentLng: lng
    }));
  }, []);

  const handleDestinationCoordinatesChange = useCallback((lat: number, lng: number) => {
    // Store destination coordinates if needed in the future
    console.log('Destination coordinates:', { lat, lng });
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files);
      setUploadedPhotos(prev => [...prev, ...newPhotos]);
    }
  };

  const removePhoto = (index: number) => {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formDataState.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formDataState.email.trim() || !emailRegex.test(formDataState.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!formDataState.phone.trim() || !phoneRegex.test(formDataState.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Address validation
    if (!formDataState.pickupAddress.trim()) {
      newErrors.pickupAddress = 'Pickup address is required';
    }

    if (formDataState.moveType !== 'In-House Move' && !formDataState.destinationAddress.trim()) {
      newErrors.destinationAddress = 'Destination address is required';
    }

    // Items validation
    if (formDataState.items.length === 0) {
      newErrors.items = 'Please add at least one item';
    } else {
      const invalidItems = formDataState.items.some(item => 
        !item.item_name.trim() || 
        item.length <= 0 || 
        item.width <= 0 || 
        item.height <= 0 ||
        (formDataState.moveType === 'Junk Removal' && (!item.weight || item.weight <= 0))
      );

      if (invalidItems) {
        newErrors.items = 'Please fill in all item details correctly';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  };

  const renderFormStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={formDataState.name}
                onChange={(e) => {
                  setFormDataState({...formDataState, name: e.target.value});
                  if (errors.name) {
                    setErrors({...errors, name: undefined});
                  }
                }}
                className={errors.name ? 'error' : ''}
                required
              />
              {errors.name && <div className="error-message">{errors.name}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={formDataState.email}
                onChange={(e) => {
                  setFormDataState({...formDataState, email: e.target.value});
                  if (errors.email) {
                    setErrors({...errors, email: undefined});
                  }
                }}
                className={errors.email ? 'error' : ''}
                required
              />
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                value={formDataState.phone}
                onChange={(e) => {
                  setFormDataState({...formDataState, phone: e.target.value});
                  if (errors.phone) {
                    setErrors({...errors, phone: undefined});
                  }
                }}
                className={errors.phone ? 'error' : ''}
                required
              />
              {errors.phone && <div className="error-message">{errors.phone}</div>}
            </div>
          </>
        );

      case 1:
        return (
          <>
            <div className="form-group">
              <label htmlFor="moveType">Move Type</label>
              <select
                id="moveType"
                value={formDataState.moveType}
                onChange={(e) => setFormDataState({...formDataState, moveType: e.target.value})}
                required
              >
                <option value="">Select a move type</option>
                <option value="Home to Home">Home to Home</option>
                <option value="In-House Move">In-House Move</option>
                <option value="Store Pickup">Store Pickup</option>
                <option value="Home to Storage">Home to Storage</option>
                <option value="Junk Removal">Junk Removal</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="pickupAddress">Pickup Address</label>
              <input
                type="text"
                id="pickupAddress"
                value={formDataState.pickupAddress}
                onChange={(e) => {
                  setFormDataState({...formDataState, pickupAddress: e.target.value});
                  if (errors.pickupAddress) {
                    setErrors({...errors, pickupAddress: undefined});
                  }
                }}
                className={errors.pickupAddress ? 'error' : ''}
                required
              />
              {errors.pickupAddress && <div className="error-message">{errors.pickupAddress}</div>}
            </div>

            {formDataState.moveType !== "In-House Move" && (
              <div className="address-switch-container">
                <button
                  type="button"
                  className="address-switch-button"
                  onClick={() => {
                    const tempAddress = formDataState.pickupAddress;
                    setFormDataState({
                      ...formDataState,
                      pickupAddress: formDataState.destinationAddress,
                      destinationAddress: tempAddress
                    });
                  }}
                  title="Switch addresses"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 16V4M7 4L3 8M7 4L11 8M17 8V20M17 20L21 16M17 20L13 16"/>
                  </svg>
                </button>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="destinationAddress">Destination Address</label>
              <input
                type="text"
                id="destinationAddress"
                value={formDataState.destinationAddress}
                onChange={(e) => {
                  setFormDataState({...formDataState, destinationAddress: e.target.value});
                  if (errors.destinationAddress) {
                    setErrors({...errors, destinationAddress: undefined});
                  }
                }}
                className={errors.destinationAddress ? 'error' : ''}
                required={formDataState.moveType !== "In-House Move"}
              />
              {errors.destinationAddress && <div className="error-message">{errors.destinationAddress}</div>}
            </div>

            <MapComponent
              pickupAddress={formDataState.pickupAddress}
              destinationAddress={formDataState.destinationAddress}
              onPickupCoordinatesChange={handlePickupCoordinatesChange}
              onDestinationCoordinatesChange={handleDestinationCoordinatesChange}
            />
          </>
        );

      case 2:
        return (
          <div className="items-section">
            <h3>Add Items to Move</h3>
            <p className="subtitle">Would you like to upload photos or manually enter your items?</p>
            <p className="manual-entry-note">(manually entered items will get an immediate quote)</p>
            
            <div className="button-group">
              <button 
                onClick={() => setFormDataState({...formDataState, usePhotos: true})} 
                className={`button ${formDataState.usePhotos ? 'active' : ''}`}
              >
                Upload Photos
              </button>
              <button 
                onClick={() => setFormDataState({...formDataState, usePhotos: false})} 
                className={`button ${!formDataState.usePhotos ? 'active' : ''}`}
              >
                Enter Items
              </button>
            </div>

            {formDataState.usePhotos ? (
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
              <div className="manual-items-section">
                <ItemSelector onItemAdd={handleItemAdd} />
            
            {formDataState.items.length > 0 && (
              <div className="items-list">
                {errors.items && <div className="error-message items-error">{errors.items}</div>}
                
                {formDataState.items.map((item, index) => (
                  <div key={index} className="item-entry">
                    <div className="item-details">
                      <span className="item-name">{item.item_name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newItems = formDataState.items.filter((_, i) => i !== index);
                        setFormDataState({...formDataState, items: newItems});
                      }}
                      className="remove-item-button"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="review-section">
            <h3>Review Your Move Details</h3>
            <div className="review-details">
              <div className="review-group">
                <h4>Personal Information</h4>
                <p><strong>Name:</strong> {formDataState.name}</p>
                <p><strong>Email:</strong> {formDataState.email}</p>
                <p><strong>Phone:</strong> {formDataState.phone}</p>
              </div>

              <div className="review-group">
                <h4>Move Details</h4>
                <p><strong>Move Type:</strong> {formDataState.moveType}</p>
                <p><strong>Pickup Address:</strong> {formDataState.pickupAddress}</p>
                {formDataState.moveType !== "In-House Move" && (
                  <p><strong>Destination Address:</strong> {formDataState.destinationAddress}</p>
                )}
              </div>

              <div className="review-group">
                <h4>Items ({formDataState.items.length})</h4>
                <div className="review-items">
                  {formDataState.items.map((item, index) => (
                    <p key={index}>
                      {item.item_name}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const validateCurrentStep = () => {
    const newErrors: FormErrors = {};

    switch (currentStep) {
      case 0:
        if (!formDataState.name.trim()) {
          newErrors.name = 'Name is required';
        }
        if (!formDataState.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formDataState.email)) {
          newErrors.email = 'Please enter a valid email address';
        }
        if (!formDataState.phone.trim() || !/^\+?[\d\s-]{10,}$/.test(formDataState.phone)) {
          newErrors.phone = 'Please enter a valid phone number';
        }
        break;

      case 1:
        if (!formDataState.moveType) {
          newErrors.moveType = 'Please select a move type';
        }
        if (!formDataState.pickupAddress.trim()) {
          newErrors.pickupAddress = 'Pickup address is required';
        }
        if (formDataState.moveType !== 'In-House Move' && !formDataState.destinationAddress.trim()) {
          newErrors.destinationAddress = 'Destination address is required';
        }
        break;

      case 2:
        if (formDataState.items.length === 0) {
          newErrors.items = 'Please add at least one item';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, formSteps.length - 1));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const formData = {
        name: formDataState.name,
        email: formDataState.email,
        phone: formDataState.phone,
        move_type: formDataState.moveType,
        pickup_address: formDataState.pickupAddress,
        destination_address: formDataState.destinationAddress,
        items: formDataState.items,
        use_photos: formDataState.usePhotos,
        current_lat: formDataState.currentLat,
        current_lng: formDataState.currentLng,
        mileage_override: formDataState.mileageOverride
      };

      const response = await fetch('http://localhost:8000/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === 'pending') {
        setRequestId(data.request_id);
        setShowConfirmation(true);
        const price = calculateEstimatedPrice(formData);
        setEstimatedPrice(price);
        showToast('Move request submitted successfully!', 'success');
      } else {
        throw new Error('Failed to submit request');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      showToast('There was an error submitting your request. Please try again.', 'error');
      setErrors({
        general: 'There was an error submitting your request. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmation = async () => {
    if (!requestId) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`http://localhost:8000/confirm/${requestId}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === 'success') {
        alert('Your move request has been confirmed! You will receive a confirmation email shortly.');
        setFormDataState(initialFormState);
        setShowConfirmation(false);
        setRequestId(null);
        setEstimatedPrice(null);
        setErrors({});
      } else {
        throw new Error('Failed to confirm request');
      }
    } catch (error) {
      console.error('Error confirming request:', error);
      setErrors({
        general: 'There was an error confirming your request. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateEstimatedPrice = (formData: any) => {
    const PRICING_CONFIG: Record<string, {
      base: number;
      per_mile: number;
      per_ft3: number;
      per_item: number;
      max_miles?: number;
      per_weight?: number;
    }> = {
      "Home to Home": { 
        base: 100, 
        per_mile: 3, 
        per_ft3: 0.5, 
        per_item: 5,
        max_miles: 80
      },
      "In-House Move": { 
        base: 40, 
        per_mile: 0, 
        per_ft3: 0.5, 
        per_item: 2.5
      },
      "Store Pickup": { 
        base: 100, 
        per_mile: 3, 
        per_ft3: 0.5, 
        per_item: 5,
        max_miles: 80
      },
      "Home to Storage": { 
        base: 100, 
        per_mile: 3, 
        per_ft3: 0.5, 
        per_item: 5,
        max_miles: 80
      },
      "Junk Removal": { 
        base: 100, 
        per_mile: 0, 
        per_ft3: 0, 
        per_item: 5,
        per_weight: 0.1
      }
    };

    let price = 0;
    const config = PRICING_CONFIG[formData.move_type] || PRICING_CONFIG["Home to Home"];
    
    // Start with base price
    price = config.base;

    // Add mileage cost if applicable (and check max miles)
    if (config.per_mile > 0 && formData.distance_miles) {
      const miles = Math.min(formData.distance_miles, config.max_miles || Infinity);
      price += config.per_mile * miles;
    }

    if (formData.items && !formData.use_photos) {
      let total_ft3 = 0;

      // Calculate volume
      formData.items.forEach((item: any) => {
        total_ft3 += (item.length * item.width * item.height) / 1728;
      });

      // Add volume cost
      if (config.per_ft3 > 0) {
        price += config.per_ft3 * total_ft3;
      }

      // Add per-item cost
      price += config.per_item * formData.items.length;

      // Add weight-based cost for junk removal
      if (config.per_weight && formData.total_weight) {
        price += config.per_weight * formData.total_weight;
      }
    }

    return price;
  };

  const handleItemAdd = (item: Item) => {
    setFormDataState(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          item_name: item.name,
          length: item.dimensions.length,
          width: item.dimensions.width,
          height: item.dimensions.height,
          weight: item.dimensions.weight
        }
      ]
    }));
  };

  return (
    <div className="form-container">
      <FormProgress steps={formSteps} currentStep={currentStep} />

      {errors.general && (
        <div className="error-message general-error">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {isLoading ? (
          <div className="loading-container">
            <LoadingSkeleton type="rectangle" height="400px" />
          </div>
        ) : (
          <>
            {renderFormStep()}

            <div className="form-navigation">
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="back-button"
                >
                  Back
                </button>
              )}
              
              {currentStep < formSteps.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="next-button"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="submit-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading-spinner"></span>
                      Submitting...
                    </>
                  ) : (
                    'Submit Request'
                  )}
                </button>
              )}
            </div>
          </>
        )}
      </form>

      {showConfirmation && (
        <div className="modal-overlay">
          <div className="confirmation-modal">
            <h2>Confirm Your Move Request</h2>
            <div className="confirmation-details">
              <p><strong>Name:</strong> {formDataState.name}</p>
              <p><strong>Email:</strong> {formDataState.email}</p>
              <p><strong>Phone:</strong> {formDataState.phone}</p>
              <p><strong>Move Type:</strong> {formDataState.moveType}</p>
              <p><strong>Pickup Address:</strong> {formDataState.pickupAddress}</p>
              {formDataState.moveType !== "In-House Move" && (
                <p><strong>Dropoff Address:</strong> {formDataState.destinationAddress}</p>
              )}
              <p><strong>Number of Items:</strong> {formDataState.items.length}</p>
              {estimatedPrice !== null && (
                <p><strong>Estimated Price:</strong> ${estimatedPrice.toFixed(2)}</p>
              )}
            </div>
            <div className="confirmation-buttons">
              <button 
                type="button" 
                onClick={() => setShowConfirmation(false)}
                disabled={isSubmitting}
              >
                Go Back
              </button>
              <button 
                type="button" 
                onClick={handleConfirmation}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading-spinner"></span>
                    Confirming...
                  </>
                ) : (
                  'Confirm Request'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <ToastNotification
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default MoveForm; 