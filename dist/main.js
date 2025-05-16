'use strict';
// Type definitions for DOM elements
const homepageButton = document.querySelector('.entry_point');
const homepage = document.querySelector('main');
const mainRoomsContainer = document.querySelector('.application_container');
const advanceFeaturesContainer = document.querySelector('.advanced_features_container');
const nav = document.querySelector('nav');
const loader = document.querySelector('.loader-container');
// Import statements
import Light from './scripts/basicSettings.js';
import AdvanceSettings from './scripts/advanceSettings.js';
// Object creation
const lightController = new Light();
const advancedSettings = new AdvanceSettings();
// Global variables with type annotations
let selectedComponent = null;
let isWifiActive = true;
// Event handlers
// Hide homepage after button is clicked
homepageButton.addEventListener('click', function (e) {
    lightController.addHidden(homepage);
    lightController.removeHidden(loader);
    setTimeout(() => {
        lightController.removeHidden(mainRoomsContainer);
        lightController.removeHidden(nav);
    }, 1000);
});
mainRoomsContainer.addEventListener('click', (e) => {
    const selectedElement = e.target;
    // When click occurs on light switch
    const lightSwitch = selectedElement.closest(".light-switch");
    if (lightSwitch) {
        lightController.toggleLightSwitch(lightSwitch);
        return;
    }
    // When click occurs on advance modal
    const advancedSettingsBtn = selectedElement.closest('.advance-settings_modal');
    if (advancedSettingsBtn) {
        // Find the component name associated with this button
        const roomContainer = advancedSettingsBtn.closest('.room-container');
        if (roomContainer) {
            // If we found a parent room container, use it to determine the component
            if (roomContainer.id) {
                // If the room container has an ID, we can use that
                advancedSettings.modalPopUp(roomContainer.id);
            }
            else if (roomContainer.dataset.room) {
                // If the room container has a data-room attribute, use that
                advancedSettings.modalPopUp(roomContainer.dataset.room);
            }
            else {
                // Fallback to using the button element and letting the AdvanceSettings class handle it
                advancedSettings.modalPopUp(advancedSettingsBtn);
            }
        }
        else {
            // If no room container was found, fall back to using the button element
            // The modified AdvanceSettings class will try to find a component name
            advancedSettings.modalPopUp(advancedSettingsBtn);
        }
    }
});
// Make slider changes responsive in real-time
mainRoomsContainer.addEventListener('input', (e) => {
    const slider = e.target;
    if (slider.id === 'light_intensity') {
        const value = parseInt(slider.value);
        lightController.handleLightIntensitySlider(slider, value);
    }
});
// For final change when user stops dragging the slider
mainRoomsContainer.addEventListener('change', (e) => {
    const slider = e.target;
    if (slider.id === 'light_intensity') {
        const value = parseInt(slider.value);
        lightController.handleLightIntensitySlider(slider, value);
    }
});
// Advance settings modal
advanceFeaturesContainer.addEventListener('click', (e) => {
    const selectedElement = e.target;
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
        }
        else if (selectedElement.matches('.defaultOff-cancel')) {
            advancedSettings.customizationCancelled(selectedElement, '.defaultOff');
        }
    }
});
