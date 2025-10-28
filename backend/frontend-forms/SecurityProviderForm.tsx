import React, { useState } from 'react';

interface SecurityProviderFormData {
  name: string;
  contact: string;
  email: string;
  address?: string;
  description?: string;
  website?: string;
  category: 'SECURITY';
  // Security-specific fields
  security_license?: string;
  security_services?: string;
  staff_qualifications?: string;
  equipment_provided?: string;
  response_time?: string;
  patrol_areas?: string;
}

interface SecurityProviderFormProps {
  onSubmit: (data: SecurityProviderFormData) => void;
  onCancel?: () => void;
}

const SecurityProviderForm: React.FC<SecurityProviderFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<SecurityProviderFormData>({
    name: '',
    contact: '',
    email: '',
    address: '',
    description: '',
    website: '',
    category: 'SECURITY',
    security_license: '',
    security_services: '',
    staff_qualifications: '',
    equipment_provided: '',
    response_time: '',
    patrol_areas: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof SecurityProviderFormData, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof SecurityProviderFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof SecurityProviderFormData, string>> = {};

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
        <h3 className="text-lg font-semibold mb-4">Security Agency</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Basic Information */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Agency Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="e.g., SecureGuard Agency"
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
              placeholder="agency@example.com"
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
              placeholder="Brief description of security services"
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

      {/* Security Specific Fields */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Security Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Security License Number</label>
            <input
              type="text"
              name="security_license"
              value={formData.security_license}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="License number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Security Services</label>
            <input
              type="text"
              name="security_services"
              value={formData.security_services}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., Patrol, Access Control, Crowd Control"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Staff Qualifications</label>
            <input
              type="text"
              name="staff_qualifications"
              value={formData.staff_qualifications}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., Certified, Trained, Licensed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Equipment Provided</label>
            <input
              type="text"
              name="equipment_provided"
              value={formData.equipment_provided}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., Walkie-talkies, CCTV, Metal Detectors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Response Time</label>
            <input
              type="text"
              name="response_time"
              value={formData.response_time}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., Within 15 minutes"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Patrol Areas</label>
            <input
              type="text"
              name="patrol_areas"
              value={formData.patrol_areas}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., Indoor, Outdoor, Parking"
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
          Add Security Agency
        </button>
      </div>
    </form>
  );
};

export default SecurityProviderForm;

