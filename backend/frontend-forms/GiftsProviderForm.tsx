import React, { useState } from 'react';

interface GiftsProviderFormData {
  name: string;
  contact: string;
  email: string;
  address?: string;
  description?: string;
  website?: string;
  category: 'GIFTS';
  // Gifts-specific fields
  gift_categories?: string;
  price_range?: string;
  customization_available?: boolean;
  delivery_available?: boolean;
  bulk_discounts?: boolean;
}

interface GiftsProviderFormProps {
  onSubmit: (data: GiftsProviderFormData) => void;
  onCancel?: () => void;
}

const GiftsProviderForm: React.FC<GiftsProviderFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<GiftsProviderFormData>({
    name: '',
    contact: '',
    email: '',
    address: '',
    description: '',
    website: '',
    category: 'GIFTS',
    gift_categories: '',
    price_range: '',
    customization_available: false,
    delivery_available: false,
    bulk_discounts: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof GiftsProviderFormData, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof GiftsProviderFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof GiftsProviderFormData, string>> = {};

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
        <h3 className="text-lg font-semibold mb-4">Gift Shop</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Basic Information */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shop Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="e.g., Gifts Galore"
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
              placeholder="shop@example.com"
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
              placeholder="Brief description of gift shop"
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

      {/* Gift Shop Specific Fields */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Gift Shop Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gift Categories</label>
            <input
              type="text"
              name="gift_categories"
              value={formData.gift_categories}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., Custom Merchandise, Branded Items, Awards"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
            <input
              type="text"
              name="price_range"
              value={formData.price_range}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., $10 - $500"
            />
          </div>

          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="customization_available"
                checked={formData.customization_available}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm font-medium text-gray-700">Customization Available</label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="delivery_available"
                checked={formData.delivery_available}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm font-medium text-gray-700">Delivery Available</label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="bulk_discounts"
                checked={formData.bulk_discounts}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm font-medium text-gray-700">Bulk Discounts Available</label>
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
          Add Gift Shop
        </button>
      </div>
    </form>
  );
};

export default GiftsProviderForm;

