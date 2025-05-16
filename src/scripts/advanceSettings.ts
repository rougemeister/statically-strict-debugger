'use strict';

import Light from './basicSettings';

// Define Chart.js interface
declare global {
  class Chart {
    constructor(
      ctx: HTMLCanvasElement,
      config: {
        type: string;
        data: {
          labels: string[];
          datasets: Array<{
            label: string;
            data: number[];
            borderWidth: number;
          }>;
        };
        options: {
          scales: {
            y: {
              beginAtZero: boolean;
            };
          };
        };
      }
    );
  }
}

// Define component interface
interface Component {
  name: string;
  numOfLights: number;
  autoOn: string;
  autoOff: string;
  usage: number[];
  element: HTMLElement | null;
  lightIntensity: number;
  isLightOn: boolean;
  [key: string]: any;
}

// Define ComponentsData interface
interface ComponentsData {
  [key: string]: Component;
}

class AdvanceSettings extends Light {
    // Declare properties to support type checking
    declare componentsData: ComponentsData;
    
    constructor() {
        super();
    }

    /**
     * Creates markup for advanced features modal
     */
    #markup(component: Component): string {
        const {name, numOfLights, autoOn, autoOff} = component;
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
    }

    /**
     * Renders usage analytics chart
     */
    #analyticsUsage(data: number[]): void {
        const ctx = document.querySelector('#myChart') as HTMLCanvasElement | null;
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
    }

    /**
     * Finds the component name from an element or its parent
     * @param element - The element to check for component information
     * @returns The component name or null if not found
     */
    findComponentName(element: HTMLElement): string | null {
        // Check if the element itself has a data-room attribute
        if (element.dataset.room) {
            return element.dataset.room;
        }
        
        // Look for a parent element that has the data-room attribute
        const roomElement = element.closest('[data-room]');
        if (roomElement && roomElement instanceof HTMLElement) {
            return roomElement.dataset.room || null;
        }
        
        // Look for a parent room container and get its id
        const roomContainer = element.closest('.room-container');
        if (roomContainer && roomContainer instanceof HTMLElement && roomContainer.id) {
            return roomContainer.id;
        }
        
        return null;
    }

    /**
     * Shows modal popup with advanced settings
     * @param element - The element that triggered the modal or a component name string
     */
    modalPopUp(element: HTMLElement | string): void {
        let selectedRoom: string;
        
        // Handle both element and direct string input
        if (typeof element === 'string') {
            selectedRoom = element;
        } else {
            // Try to find the component name from the element
            const componentName = this.findComponentName(element);
            
            if (!componentName) {
                // If no component name could be determined, try to infer from context
                const currentActive = document.querySelector('.room-container.active');
                if (currentActive && currentActive instanceof HTMLElement && currentActive.id) {
                    selectedRoom = currentActive.id;
                } else {
                    console.error('Cannot determine component name. No room identifier found.');
                    return;
                }
            } else {
                selectedRoom = componentName;
            }
        }
        
        try {
            const componentData = this.getComponent(selectedRoom);
            const parentElement = document.querySelector('.advanced_features_container') as HTMLElement | null;
            
            if (!parentElement) {
                console.error('Advanced features container not found');
                return;
            }
            
            parentElement.classList.remove('hidden');
            
            // Display modal view
            parentElement.insertAdjacentHTML('afterbegin', this.#markup(componentData));
    
            // Graph display
            this.#analyticsUsage(componentData.usage);
        } catch (error) {
            console.error('Error showing modal:', error);
        }
    }

    /**
     * Shows/hides customization options
     */
    displayCustomization(selectedElement: HTMLElement): void {
        const customization = selectedElement.closest('.customization');
        const detailsElement = customization?.querySelector('.customization-details');
        
        if (detailsElement) {
            detailsElement.classList.toggle('hidden');
        }
    }

    /**
     * Closes the modal popup
     */
    closeModalPopUp(): void {
        const parentElement = document.querySelector('.advanced_features_container') as HTMLElement | null;
        const childElement = document.querySelector('.advanced_features') as HTMLElement | null;

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
    customizationCancelled(selectedElement: HTMLElement, parentSelectorIdentifier: string): void {
        const parentElement = selectedElement.closest(parentSelectorIdentifier);
        const inputElement = parentElement?.querySelector('input') as HTMLInputElement | null;
        
        if (!inputElement) {
            console.error('Input element not found for cancellation');
            return;
        }
        
        // Get component name from DOM
        const featuresElement = document.querySelector('.advanced_features');
        const nameElement = featuresElement?.querySelector('.component_name');
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
        } else if (parentSelectorIdentifier === '.defaultOff') {
            inputElement.value = component.autoOff;
        }
    }

    /**
     * Updates automatic ON time setting
     */
    customizeAutomaticOnPreset(selectedElement: HTMLElement): void {
        const parentElement = selectedElement.closest('.defaultOn');
        const inputElement = parentElement?.querySelector('input') as HTMLInputElement | null;
        
        if (!inputElement || !inputElement.value) {
            console.error('Input element or value not found');
            return;
        }
        
        // Get component name from DOM
        const featuresElement = document.querySelector('.advanced_features');
        const nameElement = featuresElement?.querySelector('.component_name');
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
        const lightElement = document.querySelector(`[data-room="${componentName}"]`) as HTMLElement | null;
        if (lightElement) {
            component.element = lightElement;
        }
        
        // Handle light automation
        this.automateLight(component.autoOn, component);
    }

    /**
     * Updates automatic OFF time setting
     */
    customizeAutomaticOffPreset(selectedElement: HTMLElement): void {
        const parentElement = selectedElement.closest('.defaultOff');
        const inputElement = parentElement?.querySelector('input') as HTMLInputElement | null;
        
        if (!inputElement || !inputElement.value) {
            console.error('Input element or value not found');
            return;
        }
        
        // Get component name from DOM
        const featuresElement = document.querySelector('.advanced_features');
        const nameElement = featuresElement?.querySelector('.component_name');
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
        const lightElement = document.querySelector(`[data-room="${componentName}"]`) as HTMLElement | null;
        if (lightElement) {
            component.element = lightElement;
        }
        
        // Handle light automation
        this.automateLight(component.autoOff, component);
    }

    /**
     * Gets component data by name
     */
    getComponent(componentName: string): Component {
        const component = this.componentsData[componentName.toLowerCase()];
        if (!component) {
            throw new Error(`Component "${componentName}" not found`);
        }
        return component;
    }

    /**
     * Gets the name of the selected component from element
     */
    getSelectedComponentName(element: HTMLElement): string {
        const componentName = this.findComponentName(element);
        if (!componentName) {
            throw new Error('Component name not found in element or its parents');
        }
        return componentName;
    }

    /**
     * Gets a component by name or returns all components
     */
    getSelectedComponent(componentName?: string): Component | ComponentsData {
        if (!componentName) return this.componentsData;
        return this.getComponent(componentName);
    }

    /**
     * Gets markup for selected component settings
     */
    getSelectedSettings(componentName: string): string {
        return this.#markup(this.getComponent(componentName));
    }

    /**
     * Updates component data
     */
    setNewData(componentName: string, key: string, data: any): any {
        const component = this.componentsData[componentName.toLowerCase()];
        if (!component) {
            throw new Error(`Component "${componentName}" not found`);
        }
        return component[key] = data;
    }

    /**
     * Capitalizes first letter of a word
     */
    capFirstLetter(word: string): string {
        if (!word || word.length === 0) return word;
        return word.charAt(0).toUpperCase() + word.slice(1);
    }

    /**
     * Gets the current instance
     */
    getObjectDetails(): this {
        return this;
    }

    /**
     * Formats time string into Date object
     */
    formatTime(time: string): Date {
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
    timeDifference(selectedTime: string): number {
        const now = new Date();
        return this.formatTime(selectedTime).getTime() - now.getTime();
    }

    /**
     * Sets a timer for automation
     */
    async timer(time: Date, message: boolean, component: Component): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const checkAndTriggerAlarm = () => {
                const now = new Date();
                
                if (
                    now.getHours() === time.getHours() &&
                    now.getMinutes() === time.getMinutes() &&
                    now.getSeconds() === time.getSeconds()
                ) {
                    if (component.element) {
                        // Toggle light switch
                        component.element.classList.toggle('active');
                        resolve();
                    } else {
                        reject(new Error('Component element not found'));
                    }

                    // Stop timer
                    clearInterval(intervalId);
                }
            };
        
            // Check every second
            const intervalId = setInterval(checkAndTriggerAlarm, 1000);
        });
    }

    /**
     * Automates light based on time setting
     */
    async automateLight(time: string, component: Component): Promise<void> {
        const formattedTime = this.formatTime(time);
        return await this.timer(formattedTime, true, component);
    }
}

export default AdvanceSettings;
