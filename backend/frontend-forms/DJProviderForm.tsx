import React, { useState } from 'react';

interface DJProviderFormData {
  name: string;
  contact: string;
  email: string;
  address?: string;
  description?: string;
  website?: string;
  category: 'DJ';
  // DJ-specific fields
  equipment_owned?: string;
  music_genres?: string;
  experience_years?: string;
  event_types_handled?: string;
  lighting_available?: boolean;
  sound_system_power?: string;
}

interface DJProviderFormProps {
  onSubmit: (data: DJProviderFormData) => void;
  onCancel?: () => void;
}

const DJProviderForm: React.FC<DJProviderFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<DJProviderFormData>({
    name: '',
    contact: '',
    email: '',
    address: '',
    description: '',
    website: '',
    category: 'DJ',
    equipment_owned: '',
    music_genres: '',
    experience_years: '',
    event_types_handled: '',
    lighting_available: false,
    sound_system_power: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof DJProviderFormData, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof DJProviderFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof DJProviderFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.contact.trim()) {
      newErrors.contact = 'Contact is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
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
        <h3 className="text-lg font-semibold mb-4">DJ Service</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Basic Information */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              DJ Name/Business <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="e.g., DJ SoundWave Productions"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="dj@example.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.contact ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="+1234567890"
            />
            {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Full address"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Brief description of DJ services"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="https://example.com"
            />
          </div>
        </div>
      </div>

      {/* DJ Specific Fields */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">DJ Service Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Equipment Owned</label>
            <input
              type="text"
              name="equipment_owned"
              value={formData.equipment_owned}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., Mixers, Speakers, Turntables"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Music Genres</label>
            <input
              type="text"
              name="music_genres"
              value={formData.music_genres}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., EDM, Hip-Hop, Pop, R&B"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
            <input
              type="text"
              name="experience_years"
              value={formData.experience_years}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., 5 years"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Event Types Handled</label>
            <input
              type="text"
              name="event_types_handled"
              value={formData.event_types_handled}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., Wedding, Corporate, Party"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sound System Power</label>
            <input
              type="text"
              name="sound_system_power"
              value={formData.sound_system_power}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., 10,000 watts"
            />
          </div>

          <div className="md:col-span-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="lighting_available"
                checked={formData.lighting_available}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm font-medium text-gray-700">Lighting Available</label>
            </div>
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
          Add DJ Service
        </button>
      </div>
    </form>
  );
};

export default DJProviderForm;

