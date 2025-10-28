import React, { useState } from 'react';

interface PhotographersProviderFormData {
  name: string;
  contact: string;
  email: string;
  address?: string;
  description?: string;
  website?: string;
  category: 'PHOTOGRAPHERS';
  // Photographers-specific fields
  photography_style?: string;
  equipment_used?: string;
  years_experience?: string;
  event_types_handled?: string;
  portfolio_link?: string;
  editing_services?: boolean;
  drone_photography?: boolean;
}

interface PhotographersProviderFormProps {
  onSubmit: (data: PhotographersProviderFormData) => void;
  onCancel?: () => void;
}

const PhotographersProviderForm: React.FC<PhotographersProviderFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<PhotographersProviderFormData>({
    name: '',
    contact: '',
    email: '',
    address: '',
    description: '',
    website: '',
    category: 'PHOTOGRAPHERS',
    photography_style: '',
    equipment_used: '',
    years_experience: '',
    event_types_handled: '',
    portfolio_link: '',
    editing_services: false,
    drone_photography: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof PhotographersProviderFormData, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof PhotographersProviderFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof PhotographersProviderFormData, string>> = {};

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
        <h3 className="text-lg font-semibold mb-4">Photographer Service</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Basic Information */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photographer/Studio Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="e.g., Capture Moments Studio"
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
              placeholder="photographer@example.com"
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
              placeholder="Brief description of photography services"
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio Link</label>
            <input
              type="url"
              name="portfolio_link"
              value={formData.portfolio_link}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="https://portfolio.example.com"
            />
          </div>
        </div>
      </div>

      {/* Photography Specific Fields */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Photography Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Photography Style</label>
            <input
              type="text"
              name="photography_style"
              value={formData.photography_style}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., Portrait, Event, Documentary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Equipment Used</label>
            <input
              type="text"
              name="equipment_used"
              value={formData.equipment_used}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., Canon, Nikon, Sony"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
            <input
              type="text"
              name="years_experience"
              value={formData.years_experience}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., 8 years"
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
              placeholder="e.g., Wedding, Corporate, Sports"
            />
          </div>

          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="editing_services"
                checked={formData.editing_services}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm font-medium text-gray-700">Editing Services Included</label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="drone_photography"
                checked={formData.drone_photography}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm font-medium text-gray-700">Drone Photography Available</label>
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
          Add Photographer
        </button>
      </div>
    </form>
  );
};

export default PhotographersProviderForm;

