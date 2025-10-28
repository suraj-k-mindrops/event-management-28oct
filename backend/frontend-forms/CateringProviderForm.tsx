import React, { useState } from 'react';

interface CateringProviderFormData {
  name: string;
  contact: string;
  email: string;
  address?: string;
  description?: string;
  website?: string;
  category: 'CATERING';
  // Catering-specific fields
  cuisine_types?: string;
  menu_categories?: string;
  serving_capacity?: string;
  equipment_available?: string;
  staff_count?: string;
  halal_certified?: boolean;
  vegetarian_options?: boolean;
}

interface CateringProviderFormProps {
  onSubmit: (data: CateringProviderFormData) => void;
  onCancel?: () => void;
}

const CateringProviderForm: React.FC<CateringProviderFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<CateringProviderFormData>({
    name: '',
    contact: '',
    email: '',
    address: '',
    description: '',
    website: '',
    category: 'CATERING',
    cuisine_types: '',
    menu_categories: '',
    serving_capacity: '',
    equipment_available: '',
    staff_count: '',
    halal_certified: false,
    vegetarian_options: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CateringProviderFormData, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof CateringProviderFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CateringProviderFormData, string>> = {};

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
        <h3 className="text-lg font-semibold mb-4">Catering Service Provider</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Basic Information */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Provider Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="e.g., Delicious Catering Services"
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
              placeholder="provider@example.com"
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
              placeholder="Brief description of catering services"
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

      {/* Catering Specific Fields */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Catering Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cuisine Types</label>
            <input
              type="text"
              name="cuisine_types"
              value={formData.cuisine_types}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., Italian, Chinese, Indian, BBQ"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Menu Categories</label>
            <input
              type="text"
              name="menu_categories"
              value={formData.menu_categories}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., Appetizers, Main Course, Desserts"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Serving Capacity</label>
            <input
              type="text"
              name="serving_capacity"
              value={formData.serving_capacity}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., 50-500 guests"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Equipment Available</label>
            <input
              type="text"
              name="equipment_available"
              value={formData.equipment_available}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., Ovens, Grills, Serving Stations"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Staff Count</label>
            <input
              type="text"
              name="staff_count"
              value={formData.staff_count}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., 5-20 staff members"
            />
          </div>

          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="halal_certified"
                checked={formData.halal_certified}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm font-medium text-gray-700">Halal Certified</label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="vegetarian_options"
                checked={formData.vegetarian_options}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm font-medium text-gray-700">Vegetarian Options Available</label>
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
          Add Catering Provider
        </button>
      </div>
    </form>
  );
};

export default CateringProviderForm;

