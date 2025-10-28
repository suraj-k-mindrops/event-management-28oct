import React, { useState } from 'react';

interface VenueFormData {
  name: string;
  location: string;
  capacity: number;
  description?: string;
  amenities?: string[];
  status: 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE';
}

interface VenuesFormProps {
  onSubmit: (data: VenueFormData) => void;
  onCancel?: () => void;
}

const VenuesForm: React.FC<VenuesFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<VenueFormData>({
    name: '',
    location: '',
    capacity: 0,
    description: '',
    amenities: [],
    status: 'ACTIVE',
  });

  const [amenityInput, setAmenityInput] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof VenueFormData, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value) || 0 : value
    }));
    if (errors[name as keyof VenueFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleAmenityAdd = () => {
    if (amenityInput.trim()) {
      setFormData(prev => ({
        ...prev,
        amenities: [...(prev.amenities || []), amenityInput.trim()]
      }));
      setAmenityInput('');
    }
  };

  const handleAmenityRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities?.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof VenueFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    if (!formData.capacity || formData.capacity <= 0) {
      newErrors.capacity = 'Valid capacity is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Venue Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Venue Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="e.g., Grand Hall, Auditorium A"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="e.g., Building A, Floor 3"
            />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Capacity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              min="1"
              className={`w-full px-3 py-2 border rounded-md ${errors.capacity ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Number of people"
            />
            {errors.capacity && <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="ACTIVE">Active</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Describe the venue, facilities, and features"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAmenityAdd();
                  }
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Add amenity (e.g., WiFi, Parking, Air Conditioning)"
              />
              <button
                type="button"
                onClick={handleAmenityAdd}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Add
              </button>
            </div>
            {formData.amenities && formData.amenities.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    {amenity}
                    <button
                      type="button"
                      onClick={() => handleAmenityRemove(index)}
                      className="text-green-800 hover:text-green-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Venue
        </button>
      </div>
    </form>
  );
};

export default VenuesForm;

