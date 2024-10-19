'use client'
import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  Home, 
  Building2, 
  Users, 
  Search, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Star, 
  AlertCircle 
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Map from './Map';

const LocationFlow = () => {
  const [showPermissionModal, setShowPermissionModal] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [addressType, setAddressType] = useState(null);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSelectedLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setShowPermissionModal(false);
          setCurrentStep(2);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  const AddressTypeButton = ({ icon: Icon, label, selected, onClick }) => (
    <Button
      variant={selected ? "default" : "outline"}
      className={`flex flex-col items-center gap-2 h-24 w-24 ${
        selected ? 'bg-blue-600 text-white' : ''
      }`}
      onClick={onClick}
    >
      <Icon size={24} />
      <span className="text-sm">{label}</span>
    </Button>
  );

  const toggleFavorite = (addressIndex) => {
    setSavedAddresses(addresses => 
      addresses.map((addr, idx) => 
        idx === addressIndex 
          ? { ...addr, isFavorite: !addr.isFavorite }
          : addr
      )
    );
  };

  const deleteAddress = (index) => {
    setAddressToDelete(index);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    setSavedAddresses(addresses => 
      addresses.filter((_, idx) => idx !== addressToDelete)
    );
    setShowDeleteConfirm(false);
    setAddressToDelete(null);
  };

  const AddressForm = () => (
    <div className="space-y-4 p-4">
      <Input placeholder="House/Flat/Block No." className="w-full" />
      <Input placeholder="Apartment/Road/Area" className="w-full" />
      <div className="grid grid-cols-3 gap-4">
        <AddressTypeButton
          icon={Home}
          label="Home"
          selected={addressType === 'home'}
          onClick={() => setAddressType('home')}
        />
        <AddressTypeButton
          icon={Building2}
          label="Office"
          selected={addressType === 'office'}
          onClick={() => setAddressType('office')}
        />
        <AddressTypeButton
          icon={Users}
          label="Friends"
          selected={addressType === 'friends'}
          onClick={() => setAddressType('friends')}
        />
      </div>
      <Button className="w-full mt-4" onClick={() => {
        setSavedAddresses(prev => [...prev, {
          type: addressType || 'home',
          address: "123 Sample Street",
          isFavorite: false,
          location: selectedLocation
        }]);
        setShowAddressForm(false);
        setCurrentStep(4);
      }}>
        Save Address
      </Button>
    </div>
  );

  const SavedAddressList = () => {
    const filteredAddresses = savedAddresses
      .filter(addr => 
        addr.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        addr.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        // Sort by favorite status first
        if (a.isFavorite && !b.isFavorite) return -1;
        if (!a.isFavorite && b.isFavorite) return 1;
        return 0;
      });

    return (
      <div className="space-y-4">
        <div className="sticky top-0 bg-white p-4 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              className="pl-10" 
              placeholder="Search saved addresses..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="p-4 space-y-4">
          {filteredAddresses.length === 0 && searchQuery && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No addresses found matching your search.
              </AlertDescription>
            </Alert>
          )}

          {filteredAddresses.map((addr, idx) => (
            <Card 
              key={idx} 
              className={`p-4 hover:shadow-md transition-shadow ${
                addr.isFavorite ? 'border-yellow-400 border-2' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                {addr.type === 'home' && <Home className="text-blue-600" />}
                {addr.type === 'office' && <Building2 className="text-blue-600" />}
                {addr.type === 'friends' && <Users className="text-blue-600" />}
                <div className="flex-1">
                  <h3 className="font-medium capitalize">{addr.type}</h3>
                  <p className="text-sm text-gray-500">{addr.address}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleFavorite(idx)}
                    className={addr.isFavorite ? 'text-yellow-500' : 'text-gray-400'}
                  >
                    <Star className="h-5 w-5" fill={addr.isFavorite ? 'currentColor' : 'none'} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteAddress(idx)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                  <ChevronRight className="text-gray-400" />
                </div>
              </div>
            </Card>
          ))}
          
          <Button 
            onClick={() => setShowAddressForm(true)}
            className="w-full flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Add New Address
          </Button>
        </div>
      </div>
    );
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Location Permission Modal */}
      <Dialog open={showPermissionModal} onOpenChange={setShowPermissionModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enable Location Services</DialogTitle>
            <DialogDescription>
              Please enable location services to help us serve you better.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Button 
              className="w-full flex items-center gap-2"
              onClick={getCurrentLocation}
            >
              <MapPin size={20} />
              Enable Location
            </Button>
            <Button 
              variant="outline" 
              className="w-full flex items-center gap-2"
              onClick={() => {
                setShowPermissionModal(false);
                setCurrentStep(2);
              }}
            >
              <Search size={20} />
              Search Manually
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Map Selection View */}
      {currentStep === 2 && (
        <div className="h-screen flex flex-col">
          <div className="h-1/2 bg-gray-200 relative">
            <Map onLocationSelect={setSelectedLocation} />
            <div className="absolute bottom-4 right-4">
              <Button 
                className="flex items-center gap-2"
                onClick={getCurrentLocation}
              >
                <Navigation size={20} />
                Locate Me
              </Button>
            </div>
          </div>
          <div className="flex-1 p-4">
            <Card className="p-4">
              <h2 className="font-semibold mb-4">Selected Location</h2>
              <p className="text-gray-600 mb-4">
                {selectedLocation 
                  ? `Latitude: ${selectedLocation.lat.toFixed(6)}, Longitude: ${selectedLocation.lng.toFixed(6)}`
                  : 'No location selected'}
              </p>
              <Button 
                className="w-full"
                onClick={() => setCurrentStep(3)}
                disabled={!selectedLocation}
              >
                Confirm Location
              </Button>
            </Card>
          </div>
        </div>
      )}

      {/* Address Form */}
      {currentStep === 3 && <AddressForm />}

      {/* Saved Addresses */}
      {currentStep === 4 && <SavedAddressList />}

      {/* Address Form Modal */}
      <Dialog open={showAddressForm} onOpenChange={setShowAddressForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Address</DialogTitle>
          </DialogHeader>
          <AddressForm />
        </DialogContent>
      </Dialog>
      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Address</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this address? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LocationFlow;