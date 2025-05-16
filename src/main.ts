'use strict';

// Type definitions for DOM elements
const homepageButton = document.querySelector('.entry_point') as HTMLElement;
const homepage = document.querySelector('main') as HTMLElement;
const mainRoomsContainer = document.querySelector('.application_container') as HTMLElement;
const advanceFeaturesContainer = document.querySelector('.advanced_features_container') as HTMLElement;
const nav = document.querySelector('nav') as HTMLElement;
const loader = document.querySelector('.loader-container') as HTMLElement;

// Import statements
import Light from './scripts/basicSettings';
import AdvanceSettings from './scripts/advanceSettings';

// Type definitions for the imported classes
interface LightController {
  addHidden(element: HTMLElement): void;
  removeHidden(element: HTMLElement): void;
  toggleLightSwitch(lightSwitch: HTMLElement): void;
  handleLightIntensitySlider(slider: HTMLInputElement, value: number): void;
}

interface AdvancedSettingsController {
  modalPopUp(button: HTMLElement): void;
  closeModalPopUp(): void;
  displayCustomization(element: HTMLElement): void;
  customizeAutomaticOnPreset(element: HTMLElement): void;
  customizeAutomaticOffPreset(element: HTMLElement): void;
  customizationCancelled(element: HTMLElement, selector: string): void;
}

// Object creation
const lightController: LightController = new Light();
const advancedSettings: AdvancedSettingsController = new AdvanceSettings();

// Global variables with type annotations
let selectedComponent: HTMLElement | null = null;
let isWifiActive: boolean = true;

// Event handlers
// Hide homepage after button is clicked
homepageButton.addEventListener('click', function(e: Event): void {
  lightController.addHidden(homepage);
  lightController.removeHidden(loader);
  
  setTimeout(() => {
    lightController.removeHidden(mainRoomsContainer);
    lightController.removeHidden(nav);
  }, 1000);
});

mainRoomsContainer.addEventListener('click', (e: Event): void => {
  const selectedElement = e.target as HTMLElement;

  // When click occurs on light switch
  const lightSwitch = selectedElement.closest(".light-switch") as HTMLElement;
  if (lightSwitch) {
    lightController.toggleLightSwitch(lightSwitch);
    return;
  }

  // When click occurs on advance modal
  const advancedSettingsBtn = selectedElement.closest('.advance-settings_modal') as HTMLElement;
  if (advancedSettingsBtn) {
    advancedSettings.modalPopUp(advancedSettingsBtn);
  }
});

// Make slider changes responsive in real-time
mainRoomsContainer.addEventListener('input', (e: Event): void => {
  const slider = e.target as HTMLInputElement;
  if (slider.id === 'light_intensity') {
    const value: number = parseInt(slider.value);
    lightController.handleLightIntensitySlider(slider, value);
  }
});

// For final change when user stops dragging the slider
mainRoomsContainer.addEventListener('change', (e: Event): void => {
  const slider = e.target as HTMLInputElement;
  if (slider.id === 'light_intensity') {
    const value: number = parseInt(slider.value);
    lightController.handleLightIntensitySlider(slider, value);
  }
});

// Advance settings modal
advanceFeaturesContainer.addEventListener('click', (e: Event): void => {
  const selectedElement = e.target as HTMLElement;

  if (selectedElement.closest('.close-btn')) {
    advancedSettings.closeModalPopUp();
  }

  // Display customization markup
  if (selectedElement.closest('.customization-btn')) {
    advancedSettings.displayCustomization(selectedElement);
  }

  // Set light on time customization
  if (selectedElement.matches('.defaultOn-okay')) {
    advancedSettings.customizeAutomaticOnPreset(selectedElement);
  }
  
  // Set light off time customization
  if (selectedElement.matches('.defaultOff-okay')) {
    advancedSettings.customizeAutomaticOffPreset(selectedElement);
  }

  // Cancel light time customization
  if (selectedElement.textContent && selectedElement.textContent.includes("Cancel")) {
    if (selectedElement.matches('.defaultOn-cancel')) {
      advancedSettings.customizationCancelled(selectedElement, '.defaultOn');
    } else if (selectedElement.matches('.defaultOff-cancel')) {
      advancedSettings.customizationCancelled(selectedElement, '.defaultOff');
    }
  }
});
