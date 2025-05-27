
import { useState } from 'react';
import { User, Settings, MapPin, LogOut, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import Header from '@/components/Header';
import { toast } from 'sonner';

const Profile = () => {
  const [userEmail, setUserEmail] = useState('user@example.com');
  const [maxDistance, setMaxDistance] = useState([50]);
  const [useMetric, setUseMetric] = useState(true);

  const mockItineraries = [
    { id: '1', name: 'Paris Weekend', date: '2024-06-15', stops: 5 },
    { id: '2', name: 'Tokyo Adventure', date: '2024-05-22', stops: 8 },
    { id: '3', name: 'Santorini Getaway', date: '2024-04-10', stops: 3 },
  ];

  const handleSaveAccount = () => {
    toast.success('Account settings saved successfully!');
  };

  const handleSavePreferences = () => {
    toast.success('Preferences updated successfully!');
  };

  const handleDeleteItinerary = (id: string) => {
    toast.success('Itinerary deleted successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header variant="dashboard" />
      
      <div className="pt-16">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile & Settings</h1>
            <p className="text-gray-600">Manage your account and travel preferences</p>
          </div>

          <Tabs defaultValue="account" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="account" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Account</span>
              </TabsTrigger>
              <TabsTrigger value="itineraries" className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>My Itineraries</span>
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Preferences</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">New Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Leave blank to keep current password"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-4">
                    <Button 
                      variant="outline" 
                      className="text-red-600 hover:text-red-700"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                    <Button onClick={handleSaveAccount} className="travel-button">
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="itineraries">
              <Card>
                <CardHeader>
                  <CardTitle>My Itineraries</CardTitle>
                </CardHeader>
                <CardContent>
                  {mockItineraries.length === 0 ? (
                    <div className="text-center py-12">
                      <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">No itineraries yet</h3>
                      <p className="text-gray-500 mb-4">
                        Start planning your first trip to see your saved itineraries here.
                      </p>
                      <Button className="travel-button">
                        Create Itinerary
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {mockItineraries.map((itinerary) => (
                        <div
                          key={itinerary.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div>
                            <h4 className="font-semibold">{itinerary.name}</h4>
                            <p className="text-sm text-gray-600">
                              {itinerary.stops} stops • Created {itinerary.date}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteItinerary(itinerary.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Travel Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label>Maximum Daily Travel Distance</Label>
                    <div className="px-2">
                      <Slider
                        value={maxDistance}
                        onValueChange={setMaxDistance}
                        max={200}
                        min={10}
                        step={10}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-2">
                        <span>10 {useMetric ? 'km' : 'mi'}</span>
                        <span className="font-semibold">{maxDistance[0]} {useMetric ? 'km' : 'mi'}</span>
                        <span>200 {useMetric ? 'km' : 'mi'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Distance Units</Label>
                      <p className="text-sm text-gray-600">
                        Use {useMetric ? 'kilometers' : 'miles'} for distance calculations
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Miles</span>
                      <Switch
                        checked={useMetric}
                        onCheckedChange={setUseMetric}
                      />
                      <span className="text-sm">Kilometers</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button onClick={handleSavePreferences} className="travel-button">
                      Save Preferences
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
