
// Simple service to manage ads throughout the app
type AdPreference = {
  frequency: 'low' | 'medium' | 'high';
  enabled: boolean;
  lastShown?: number;
};

class AdService {
  private static instance: AdService;
  private preferences: AdPreference = {
    frequency: 'medium',
    enabled: true,
    lastShown: 0
  };

  private constructor() {
    // Try to load user preferences
    try {
      const savedPrefs = localStorage.getItem('ad_preferences');
      if (savedPrefs) {
        this.preferences = JSON.parse(savedPrefs);
      }
    } catch (e) {
      console.error('Error loading ad preferences:', e);
    }
  }

  public static getInstance(): AdService {
    if (!AdService.instance) {
      AdService.instance = new AdService();
    }
    return AdService.instance;
  }

  public shouldShowAd(context?: string): boolean {
    if (!this.preferences.enabled) return false;
    
    const now = Date.now();
    const lastShown = this.preferences.lastShown || 0;
    
    // Determine minimum time between ads based on frequency
    let minInterval = 300000; // 5 minutes default (medium)
    
    if (this.preferences.frequency === 'low') {
      minInterval = 600000; // 10 minutes
    } else if (this.preferences.frequency === 'high') {
      minInterval = 120000; // 2 minutes
    }
    
    // If in study context, reduce ad frequency
    if (context === 'study' || context === 'quiz') {
      minInterval *= 2;
    }
    
    if (now - lastShown > minInterval) {
      this.preferences.lastShown = now;
      this.savePreferences();
      return true;
    }
    
    return false;
  }

  public disableAds(): void {
    this.preferences.enabled = false;
    this.savePreferences();
  }

  public enableAds(): void {
    this.preferences.enabled = true;
    this.savePreferences();
  }

  public setFrequency(frequency: 'low' | 'medium' | 'high'): void {
    this.preferences.frequency = frequency;
    this.savePreferences();
  }

  private savePreferences(): void {
    try {
      localStorage.setItem('ad_preferences', JSON.stringify(this.preferences));
    } catch (e) {
      console.error('Error saving ad preferences:', e);
    }
  }
}

export default AdService.getInstance();
