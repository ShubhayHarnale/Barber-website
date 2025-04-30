import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { type WorkingDaySettings, type BarberSettings } from "@shared/schema";

const timeOptions = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", 
  "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
];

const days = [
  { id: "monday", label: "Monday" },
  { id: "tuesday", label: "Tuesday" },
  { id: "wednesday", label: "Wednesday" },
  { id: "thursday", label: "Thursday" },
  { id: "friday", label: "Friday" },
  { id: "saturday", label: "Saturday" },
  { id: "sunday", label: "Sunday" },
];

export default function SettingsForm() {
  const [settings, setSettings] = useState<BarberSettings>({
    workingDays: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
      startTime: "09:00",
      endTime: "17:00",
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        // Add a timestamp to prevent caching and ensure we're hitting the API
        const response = await fetch('/api/settings?t=' + new Date().getTime(), {
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          setSettings(data.data);
        } else {
          toast({
            title: "Error",
            description: data.message || "Failed to fetch settings",
            variant: "destructive",
          });
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
        toast({
          title: "Error",
          description: "An error occurred while fetching settings",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [toast]);

  const handleDayChange = (day: keyof WorkingDaySettings, checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      workingDays: {
        ...prev.workingDays,
        [day]: checked
      }
    }));
  };

  const handleTimeChange = (timeType: 'startTime' | 'endTime', value: string) => {
    setSettings(prev => ({
      ...prev,
      workingDays: {
        ...prev.workingDays,
        [timeType]: value
      }
    }));
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      
      // Validate that end time is after start time
      const startHour = parseInt(settings.workingDays.startTime.split(':')[0], 10);
      const endHour = parseInt(settings.workingDays.endTime.split(':')[0], 10);
      
      if (startHour >= endHour) {
        toast({
          title: "Invalid Time Range",
          description: "End time must be after start time",
          variant: "destructive",
        });
        return;
      }
      
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Settings Saved",
          description: "Your availability settings have been updated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to save settings",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Error saving settings:', err);
      toast({
        title: "Error",
        description: "An error occurred while saving settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Working Hours Settings</CardTitle>
          <CardDescription>Configure your availability</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Working Hours Settings</CardTitle>
        <CardDescription>Configure your availability</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Available Days</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {days.map((day) => (
                <div key={day.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={day.id} 
                    checked={settings.workingDays[day.id as keyof WorkingDaySettings] as boolean} 
                    onCheckedChange={(checked) => 
                      handleDayChange(day.id as keyof WorkingDaySettings, checked as boolean)
                    }
                  />
                  <Label htmlFor={day.id}>{day.label}</Label>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Working Hours</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Select 
                  value={settings.workingDays.startTime} 
                  onValueChange={(value) => handleTimeChange('startTime', value)}
                >
                  <SelectTrigger id="startTime">
                    <SelectValue placeholder="Select start time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((time) => (
                      <SelectItem key={`start-${time}`} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Select 
                  value={settings.workingDays.endTime} 
                  onValueChange={(value) => handleTimeChange('endTime', value)}
                >
                  <SelectTrigger id="endTime">
                    <SelectValue placeholder="Select end time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((time) => (
                      <SelectItem key={`end-${time}`} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <Button 
            className="w-full" 
            onClick={handleSaveSettings}
            disabled={saving}
          >
            {saving ? (
              <>
                <span className="mr-2">Saving...</span>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
              </>
            ) : (
              "Save Settings"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
