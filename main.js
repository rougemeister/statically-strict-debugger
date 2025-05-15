'use strict'
// elements declarations
const homepageButton = document.querySelector('.entry_point');
const homepage = document.querySelector('main');
const mainRoomsContainer = document.querySelector('.application_container');
const advanceFeaturesContainer = document.querySelector('.advanced_features_container');
const nav = document.querySelector('nav');
const loader = document.querySelector('.loader-container');

// imports
import Light from './js/basicSettings.js';
import AdvanceSettings from './js/advanceSettings.js';

// object creation
const lightController = new Light();
const advancedSettings = new AdvanceSettings();

// global variables
let selectedComponent;
let isWifiActive = true;

// Event handlers
// hide homepage after button is clicked
homepageButton.addEventListener('click', function(e) {
    lightController.addHidden(homepage);
    lightController.removeHidden(loader);
    
    setTimeout(() => {
        lightController.removeHidden(mainRoomsContainer);
        lightController.removeHidden(nav);
    }, 1000);
});

mainRoomsContainer.addEventListener('click', (e) => {
    const selectedElement = e.target;

    // when click occurs on light switch
    if (selectedElement.closest(".light-switch")) {
        const lightSwitch = selectedElement.closest(".light-switch");
        lightController.toggleLightSwitch(lightSwitch);
        return;
    }

    // when click occurs on advance modal
    if (selectedElement.closest('.advance-settings_modal')) {
        const advancedSettingsBtn = selectedElement.closest('.advance-settings_modal');
        advancedSettings.modalPopUp(advancedSettingsBtn);
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

// advance settings modal
advanceFeaturesContainer.addEventListener('click', (e) => {
    const selectedElement = e.target;

    if (selectedElement.closest('.close-btn')) {
       advancedSettings.closeModalPopUp();
    }

    // display customization markup
    if (selectedElement.closest('.customization-btn')) {
        advancedSettings.displayCustomization(selectedElement);
    }

    // set light on time customization
    if (selectedElement.matches('.defaultOn-okay')) {
        advancedSettings.customizeAutomaticOnPreset(selectedElement);
    }
    
    // set light off time customization
    if (selectedElement.matches('.defaultOff-okay')) {
        advancedSettings.customizeAutomaticOffPreset(selectedElement);
    }

    // cancel light time customization
    if (selectedElement.textContent.includes("Cancel")) {
        if (selectedElement.matches('.defaultOn-cancel')) {
            advancedSettings.customizationCancelled(selectedElement, '.defaultOn');
        } else if (selectedElement.matches('.defaultOff-cancel')) {
            advancedSettings.customizationCancelled(selectedElement, '.defaultOff');
        }
    }
});
