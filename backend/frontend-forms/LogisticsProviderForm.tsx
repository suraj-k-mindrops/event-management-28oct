import React, { useState } from 'react';

interface LogisticsProviderFormData {
  name: string;
  contact: string;
  email: string;
  address?: string;
  description?: string;
  website?: string;
  category: 'LOGISTICS';
  // Logistics-specific fields
  logistics_id?: string;
  service_type?: string;
  vehicle_types_available?: string;
  equipment_types?: string;
  capacity_handling?: string;
  available_locations?: string;
  contact_person?: string;
  contact_number?: string;
}

interface LogisticsProviderFormProps {
  onSubmit: (data: LogisticsProviderFormData) => void;
  onCancel?: () => void;
}

const LogisticsProviderForm: React.FC<LogisticsProviderFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<LogisticsProviderFormData>({
    name: '',
    contact: '',
    email: '',
    address: '',
    description: '',
    website: '',
    category: 'LOGISTICS',
    logistics_id: '',
    service_type: '',
    vehicle_types_available: '',
    equipment_types: '',
    capacity_handling: '',
    available_locations: '',
    contact_person: '',
    contact_number: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof LogisticsProviderFormData, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof LogisticsProviderFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof LogisticsProviderFormData, string>> = {};

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
        <h3 className="text-lg font-semibold mb-4">Logistics Service Provider</h3>
        
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
              placeholder="e.g., ABC Logistics Services"
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
              placeholder="Brief description of services"
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

      {/* Logistics Specific Fields */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Logistics Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Logistics ID</label>
            <input
              type="text"
              name="logistics_id"
              value={formData.logistics_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Unique logistics identifier"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
            <input
              type="text"
              name="service_type"
              value={formData.service_type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., Delivery, Transport"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Types Available</label>
            <input
              type="text"
              name="vehicle_types_available"
              value={formData.vehicle_types_available}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., Trucks, Vans, Motorcycles"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Equipment Types</label>
            <input
              type="text"
              name="equipment_types"
              value={formData.equipment_types}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., Forklifts, Cranes"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Capacity Handling</label>
            <input
              type="text"
              name="capacity_handling"
              value={formData.capacity_handling}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., Up to 10 tons"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Available Locations</label>
            <input
              type="text"
              name="available_locations"
              value={formData.available_locations}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., City-wide, Nationwide"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
            <input
              type="text"
              name="contact_person"
              value={formData.contact_person}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Name of contact person"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number (Alternate)</label>
            <input
              type="text"
              name="contact_number"
              value={formData.contact_number}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Alternate contact number"
            />
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
          Add Logistics Provider
        </button>
      </div>
    </form>
  );
};

export default LogisticsProviderForm;

