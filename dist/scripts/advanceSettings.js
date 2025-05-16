'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _AdvanceSettings_instances, _AdvanceSettings_markup, _AdvanceSettings_analyticsUsage;
import Light from './basicSettings.js';
class AdvanceSettings extends Light {
    constructor() {
        super();
        _AdvanceSettings_instances.add(this);
    }
    /**
     * Shows modal popup with advanced settings
     */
    modalPopUp(element) {
        const selectedRoom = this.getSelectedComponentName(element);
        const componentData = this.getComponent(selectedRoom);
        const parentElement = document.querySelector('.advanced_features_container');
        if (!parentElement) {
            console.error('Advanced features container not found');
            return;
        }
        parentElement.classList.remove('hidden');
        // Display modal view
        parentElement.insertAdjacentHTML('afterbegin', __classPrivateFieldGet(this, _AdvanceSettings_instances, "m", _AdvanceSettings_markup).call(this, componentData));
        // Graph display
        __classPrivateFieldGet(this, _AdvanceSettings_instances, "m", _AdvanceSettings_analyticsUsage).call(this, componentData.usage);
    }
    /**
     * Shows/hides customization options
     */
    displayCustomization(selectedElement) {
        const customization = selectedElement.closest('.customization');
        const detailsElement = customization === null || customization === void 0 ? void 0 : customization.querySelector('.customization-details');
        if (detailsElement) {
            detailsElement.classList.toggle('hidden');
        }
    }
    /**
     * Closes the modal popup
     */
    closeModalPopUp() {
        const parentElement = document.querySelector('.advanced_features_container');
        const childElement = document.querySelector('.advanced_features');
        if (!parentElement || !childElement) {
            console.error('Elements not found for close modal action');
            return;
        }
        // Remove child element from the DOM
        childElement.remove();
        // Hide parent element
        parentElement.classList.add('hidden');
    }
    /**
     * Resets customization input to original value when cancelled
     */
    customizationCancelled(selectedElement, parentSelectorIdentifier) {
        const parentElement = selectedElement.closest(parentSelectorIdentifier);
        const inputElement = parentElement === null || parentElement === void 0 ? void 0 : parentElement.querySelector('input');
        if (!inputElement) {
            console.error('Input element not found for cancellation');
            return;
        }
        // Get component name from DOM
        const featuresElement = document.querySelector('.advanced_features');
        const nameElement = featuresElement === null || featuresElement === void 0 ? void 0 : featuresElement.querySelector('.component_name');
        if (!nameElement || !nameElement.textContent) {
            console.error('Component name element not found');
            return;
        }
        // Get component data by name
        const componentName = nameElement.textContent.trim().toLowerCase();
        const component = this.componentsData[componentName];
        if (!component) {
            console.error('Component data not found');
            return;
        }
        // Reset to original value
        if (parentSelectorIdentifier === '.defaultOn') {
            inputElement.value = component.autoOn;
        }
        else if (parentSelectorIdentifier === '.defaultOff') {
            inputElement.value = component.autoOff;
        }
    }
    /**
     * Updates automatic ON time setting
     */
    customizeAutomaticOnPreset(selectedElement) {
        const parentElement = selectedElement.closest('.defaultOn');
        const inputElement = parentElement === null || parentElement === void 0 ? void 0 : parentElement.querySelector('input');
        if (!inputElement || !inputElement.value) {
            console.error('Input element or value not found');
            return;
        }
        // Get component name from DOM
        const featuresElement = document.querySelector('.advanced_features');
        const nameElement = featuresElement === null || featuresElement === void 0 ? void 0 : featuresElement.querySelector('.component_name');
        if (!nameElement || !nameElement.textContent) {
            console.error('Component name element not found');
            return;
        }
        // Get component data by name
        const componentName = nameElement.textContent.trim().toLowerCase();
        const component = this.componentsData[componentName];
        if (!component) {
            console.error('Component data not found');
            return;
        }
        // Update component data
        component.autoOn = inputElement.value;
        // Update display
        const spanElement = document.querySelector('.auto_on > span:last-child');
        if (spanElement) {
            spanElement.textContent = component.autoOn;
        }
        // Store component element reference
        const lightElement = document.querySelector(`[data-room="${componentName}"]`);
        if (lightElement) {
            component.element = lightElement;
        }
        // Handle light automation
        this.automateLight(component.autoOn, component);
    }
    /**
     * Updates automatic OFF time setting
     */
    customizeAutomaticOffPreset(selectedElement) {
        const parentElement = selectedElement.closest('.defaultOff');
        const inputElement = parentElement === null || parentElement === void 0 ? void 0 : parentElement.querySelector('input');
        if (!inputElement || !inputElement.value) {
            console.error('Input element or value not found');
            return;
        }
        // Get component name from DOM
        const featuresElement = document.querySelector('.advanced_features');
        const nameElement = featuresElement === null || featuresElement === void 0 ? void 0 : featuresElement.querySelector('.component_name');
        if (!nameElement || !nameElement.textContent) {
            console.error('Component name element not found');
            return;
        }
        // Get component data by name
        const componentName = nameElement.textContent.trim().toLowerCase();
        const component = this.componentsData[componentName];
        if (!component) {
            console.error('Component data not found');
            return;
        }
        // Update component data
        component.autoOff = inputElement.value;
        // Update display
        const spanElement = document.querySelector('.auto_off > span:last-child');
        if (spanElement) {
            spanElement.textContent = component.autoOff;
        }
        // Store component element reference
        const lightElement = document.querySelector(`[data-room="${componentName}"]`);
        if (lightElement) {
            component.element = lightElement;
        }
        // Handle light automation
        this.automateLight(component.autoOff, component);
    }
    /**
     * Gets component data by name
     */
    getComponent(componentName) {
        const component = this.componentsData[componentName.toLowerCase()];
        if (!component) {
            throw new Error(`Component "${componentName}" not found`);
        }
        return component;
    }
    /**
     * Gets the name of the selected component from element
     */
    getSelectedComponentName(element) {
        const room = element.dataset.room;
        if (!room) {
            throw new Error('Component name not found in data-room attribute');
        }
        return room;
    }
    /**
     * Gets a component by name or returns all components
     */
    getSelectedComponent(componentName) {
        if (!componentName)
            return this.componentsData;
        return this.getComponent(componentName);
    }
    /**
     * Gets markup for selected component settings
     */
    getSelectedSettings(componentName) {
        return __classPrivateFieldGet(this, _AdvanceSettings_instances, "m", _AdvanceSettings_markup).call(this, this.getComponent(componentName));
    }
    /**
     * Updates component data
     */
    setNewData(componentName, key, data) {
        const component = this.componentsData[componentName.toLowerCase()];
        if (!component) {
            throw new Error(`Component "${componentName}" not found`);
        }
        return component[key] = data;
    }
    /**
     * Capitalizes first letter of a word
     */
    capFirstLetter(word) {
        if (!word || word.length === 0)
            return word;
        return word.charAt(0).toUpperCase() + word.slice(1);
    }
    /**
     * Gets the current instance
     */
    getObjectDetails() {
        return this;
    }
    /**
     * Formats time string into Date object
     */
    formatTime(time) {
        const [hour, min] = time.split(':').map(val => parseInt(val, 10));
        const dailyAlarmTime = new Date();
        dailyAlarmTime.setHours(hour || 0);
        dailyAlarmTime.setMinutes(min || 0);
        dailyAlarmTime.setSeconds(0);
        return dailyAlarmTime;
    }
    /**
     * Calculates time difference in milliseconds
     */
    timeDifference(selectedTime) {
        const now = new Date();
        return this.formatTime(selectedTime).getTime() - now.getTime();
    }
    /**
     * Sets a timer for automation
     */
    timer(time, message, component) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const checkAndTriggerAlarm = () => {
                    const now = new Date();
                    if (now.getHours() === time.getHours() &&
                        now.getMinutes() === time.getMinutes() &&
                        now.getSeconds() === time.getSeconds()) {
                        if (component.element) {
                            // Toggle light switch
                            component.element.classList.toggle('active');
                            resolve();
                        }
                        else {
                            reject(new Error('Component element not found'));
                        }
                        // Stop timer
                        clearInterval(intervalId);
                    }
                };
                // Check every second
                const intervalId = setInterval(checkAndTriggerAlarm, 1000);
            });
        });
    }
    /**
     * Automates light based on time setting
     */
    automateLight(time, component) {
        return __awaiter(this, void 0, void 0, function* () {
            const formattedTime = this.formatTime(time);
            return yield this.timer(formattedTime, true, component);
        });
    }
}
_AdvanceSettings_instances = new WeakSet(), _AdvanceSettings_markup = function _AdvanceSettings_markup(component) {
    const { name, numOfLights, autoOn, autoOff } = component;
    return `
        <div class="advanced_features">
            <h3>Advanced features</h3>
            <section class="component_summary">
                <div>
                    <p class="component_name">${this.capFirstLetter(name)}</p>
                    <p class="number_of_lights">${numOfLights}</p>
                </div>
                <div>
                    <p class="auto_on">
                        <span>Automatic turn on:</span>
                        <span>${autoOn}</span>
                    </p>
                    <p class="auto_off">
                        <span>Automatic turn off:</span>
                        <span>${autoOff}</span>
                    </p>
                </div>
            </section>
            <section class="customization">
                <div class="edit">
                    <p>Customize</p>
                    <button class="customization-btn">
                        <img src="./src/assets/svgs/edit.svg" alt="customize settings svg icon">
                    </button>
                </div>
                <section class="customization-details hidden">
                    <div>
                        <h4>Automatic on/off settings</h4>
                        <div class="defaultOn">
                            <label for="autoOnTime">Turn on</label>
                            <input type="time" name="autoOnTime" id="autoOnTime" value="${autoOn}">
                            <div>
                                <button class="defaultOn-okay">Okay</button>
                                <button class="defaultOn-cancel">Cancel</button>
                            </div>
                        </div>
                        <div class="defaultOff">
                            <label for="autoOffTime">Go off</label>
                            <input type="time" name="autoOffTime" id="autoOffTime" value="${autoOff}">
                            <div>
                                <button class="defaultOff-okay">Okay</button>
                                <button class="defaultOff-cancel">Cancel</button>
                            </div>
                        </div>
                    </div>
                </section>
                <section class="summary">
                    <h3>Summary</h3>
                    <div class="chart-container">
                        <canvas id="myChart"></canvas>
                    </div>
                </section>
                <button class="close-btn">
                    <img src="./src/assets/svgs/close.svg" alt="close button svg icon">
                </button>
            </section>
            <button class="close-btn">
                <img src="./src/assets/svgs/close.svg" alt="close button svg icon">
            </button>
        </div>
        `;
}, _AdvanceSettings_analyticsUsage = function _AdvanceSettings_analyticsUsage(data) {
    const ctx = document.querySelector('#myChart');
    if (!ctx) {
        console.error('Canvas element for chart not found');
        return;
    }
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
            datasets: [{
                    label: 'Hours of usage',
                    data: data,
                    borderWidth: 1
                }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
};
export default AdvanceSettings;
