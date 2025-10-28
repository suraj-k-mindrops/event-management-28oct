import React, { useState } from 'react';

interface EventTypeFormData {
  name: string;
  color: string;
  description?: string;
  category?: string;
  subEvents?: string[];
  active: boolean;
}

interface EventTypesFormProps {
  onSubmit: (data: EventTypeFormData) => void;
  onCancel?: () => void;
}

const EventTypesForm: React.FC<EventTypesFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<EventTypeFormData>({
    name: '',
    color: '#3B82F6',
    description: '',
    category: '',
    subEvents: [],
    active: true,
  });

  const [subEventInput, setSubEventInput] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof EventTypeFormData, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name as keyof EventTypeFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubEventAdd = () => {
    if (subEventInput.trim()) {
      setFormData(prev => ({
        ...prev,
        subEvents: [...(prev.subEvents || []), subEventInput.trim()]
      }));
      setSubEventInput('');
    }
  };

  const handleSubEventRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      subEvents: prev.subEvents?.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof EventTypeFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.color || !/^#[0-9A-F]{6}$/i.test(formData.color)) {
      newErrors.color = 'Valid color code is required (e.g., #3B82F6)';
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
        <h3 className="text-lg font-semibold mb-4">Event Type</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Type Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="e.g., Conference, Workshop, Seminar"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className={`flex-1 px-3 py-2 border rounded-md ${errors.color ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="#3B82F6"
                pattern="^#[0-9A-Fa-f]{6}$"
              />
            </div>
            {errors.color && <p className="text-red-500 text-sm mt-1">{errors.color}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., Academic, Social, Sports"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Describe the event type"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Sub-Events</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={subEventInput}
                onChange={(e) => setSubEventInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSubEventAdd();
                  }
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Add sub-event"
              />
              <button
                type="button"
                onClick={handleSubEventAdd}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Add
              </button>
            </div>
            {formData.subEvents && formData.subEvents.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.subEvents.map((subEvent, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {subEvent}
                    <button
                      type="button"
                      onClick={() => handleSubEventRemove(index)}
                      className="text-blue-800 hover:text-blue-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm font-medium text-gray-700">Active</label>
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
          Add Event Type
        </button>
      </div>
    </form>
  );
};

export default EventTypesForm;

