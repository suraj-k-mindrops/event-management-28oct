/**
 * USAGE EXAMPLE - How to use these forms in your React application
 * 
 * This file demonstrates how to integrate these forms into your existing frontend.
 * Copy this pattern and customize based on your application structure.
 */

import React, { useState } from 'react';
import LogisticsProviderForm from './LogisticsProviderForm';
import CateringProviderForm from './CateringProviderForm';
import SecurityProviderForm from './SecurityProviderForm';
import GiftsProviderForm from './GiftsProviderForm';
import DJProviderForm from './DJProviderForm';
import PhotographersProviderForm from './PhotographersProviderForm';
import EventTypesForm from './EventTypesForm';
import VenuesForm from './VenuesForm';
import { 
  submitProviderForm, 
  submitEventTypeForm, 
  submitVenueForm 
} from './apiHelpers';

// Example: Modal component showing different forms
const FormsExample: React.FC = () => {
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (data: any, formType: string) => {
    setLoading(true);
    setMessage(null);

    try {
      let response;

      switch (formType) {
        case 'provider':
          response = await submitProviderForm(data);
          break;
        case 'event-type':
          // Convert subEvents array to proper format
          const eventTypeData = {
            ...data,
            subEvents: data.subEvents && data.subEvents.length > 0 ? data.subEvents : null
          };
          response = await submitEventTypeForm(eventTypeData);
          break;
        case 'venue':
          // Convert amenities array to proper format
          const venueData = {
            ...data,
            amenities: data.amenities && data.amenities.length > 0 ? data.amenities : null
          };
          response = await submitVenueForm(venueData);
          break;
        default:
          throw new Error('Unknown form type');
      }

      setMessage({ type: 'success', text: response.message || 'Successfully created!' });
      setTimeout(() => {
        setActiveForm(null);
        setMessage(null);
        // Optionally refresh the data list
        window.location.reload();
      }, 1500);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to submit form' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setActiveForm(null);
    setMessage(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Add New Entry</h1>

      {/* Message Display */}
      {message && (
        <div className={`mb-4 p-4 rounded-md ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Form Selection Buttons */}
      {!activeForm && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => setActiveForm('logistics')}
            className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-left border border-blue-200"
          >
            <div className="font-semibold text-blue-900">📦 Logistics Service Provider</div>
            <div className="text-sm text-blue-700 mt-1">Add logistics provider</div>
          </button>

          <button
            onClick={() => setActiveForm('catering')}
            className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-left border border-orange-200"
          >
            <div className="font-semibold text-orange-900">🍽️ Catering Service Provider</div>
            <div className="text-sm text-orange-700 mt-1">Add catering service</div>
          </button>

          <button
            onClick={() => setActiveForm('security')}
            className="p-4 bg-red-50 hover:bg-red-100 rounded-lg text-left border border-red-200"
          >
            <div className="font-semibold text-red-900">🛡️ Security Agency</div>
            <div className="text-sm text-red-700 mt-1">Add security agency</div>
          </button>

          <button
            onClick={() => setActiveForm('gifts')}
            className="p-4 bg-pink-50 hover:bg-pink-100 rounded-lg text-left border border-pink-200"
          >
            <div className="font-semibold text-pink-900">🎁 Gift Shop</div>
            <div className="text-sm text-pink-700 mt-1">Add gift shop</div>
          </button>

          <button
            onClick={() => setActiveForm('dj')}
            className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-left border border-purple-200"
          >
            <div className="font-semibold text-purple-900">🎵 DJ Service</div>
            <div className="text-sm text-purple-700 mt-1">Add DJ service</div>
          </button>

          <button
            onClick={() => setActiveForm('photographers')}
            className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-left border border-blue-200"
          >
            <div className="font-semibold text-blue-900">📸 Photographer</div>
            <div className="text-sm text-blue-700 mt-1">Add photographer</div>
          </button>

          <button
            onClick={() => setActiveForm('event-type')}
            className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-left border border-green-200"
          >
            <div className="font-semibold text-green-900">📅 Event Type</div>
            <div className="text-sm text-green-700 mt-1">Add event type</div>
          </button>

          <button
            onClick={() => setActiveForm('venue')}
            className="p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-left border border-indigo-200"
          >
            <div className="font-semibold text-indigo-900">🏢 Venue</div>
            <div className="text-sm text-indigo-700 mt-1">Add venue</div>
          </button>
        </div>
      )}

      {/* Display Active Form */}
      {activeForm === 'logistics' && (
        <LogisticsProviderForm
          onSubmit={(data) => handleSubmit(data, 'provider')}
          onCancel={handleCancel}
        />
      )}

      {activeForm === 'catering' && (
        <CateringProviderForm
          onSubmit={(data) => handleSubmit(data, 'provider')}
          onCancel={handleCancel}
        />
      )}

      {activeForm === 'security' && (
        <SecurityProviderForm
          onSubmit={(data) => handleSubmit(data, 'provider')}
          onCancel={handleCancel}
        />
      )}

      {activeForm === 'gifts' && (
        <GiftsProviderForm
          onSubmit={(data) => handleSubmit(data, 'provider')}
          onCancel={handleCancel}
        />
      )}

      {activeForm === 'dj' && (
        <DJProviderForm
          onSubmit={(data) => handleSubmit(data, 'provider')}
          onCancel={handleCancel}
        />
      )}

      {activeForm === 'photographers' && (
        <PhotographersProviderForm
          onSubmit={(data) => handleSubmit(data, 'provider')}
          onCancel={handleCancel}
        />
      )}

      {activeForm === 'event-type' && (
        <EventTypesForm
          onSubmit={(data) => handleSubmit(data, 'event-type')}
          onCancel={handleCancel}
        />
      )}

      {activeForm === 'venue' && (
        <VenuesForm
          onSubmit={(data) => handleSubmit(data, 'venue')}
          onCancel={handleCancel}
        />
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-center">Submitting...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormsExample;

