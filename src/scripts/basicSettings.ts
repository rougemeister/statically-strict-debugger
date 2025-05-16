'use strict';

import General from './general';

class Light extends General {
    constructor() {
        super();
    }

    notification(message: string): string {
        return `
            <div class="notification">
                <div>
                    <img src="./src/assets/svgs/checked.svg" alt="checked svg icon on notifications" >
                </div>
                <p>${message}</p>
            </div>
        `;
    }

    displayNotification(message: string, position: InsertPosition, container: HTMLElement): void {
        const html = this.notification(message);
        this.renderHTML(html, position, container);
    }

    removeNotification(element: HTMLElement): void {
        setTimeout(() => {
            element.remove();
        }, 5000);
    }

    lightSwitchOn(lightButtonElement: HTMLImageElement): void {
        lightButtonElement.setAttribute('src', './src/assets/svgs/light_bulb.svg');
        lightButtonElement.setAttribute('data-lightOn', './src/assets/svgs/light_bulb_off.svg');
    }

    lightSwitchOff(lightButtonElement: HTMLImageElement): void {
        lightButtonElement.setAttribute('src', './src/assets/svgs/light_bulb_off.svg');
        lightButtonElement.setAttribute('data-lightOn', './src/assets/svgs/light_bulb.svg');
    }

    lightComponentSelectors(lightButtonElement: HTMLElement) {
        const room = this.getSelectedComponentName(lightButtonElement);
        const componentData = this.getComponent(room);
        const childElement = lightButtonElement.firstElementChild as HTMLImageElement;
        const background = this.closestSelector(lightButtonElement, '.rooms', 'img') as HTMLElement;
        return { room, componentData, childElement, background };
    }

    toggleLightSwitch(lightButtonElement: HTMLElement): void {
        const { componentData: component, childElement, background } = this.lightComponentSelectors(lightButtonElement);
        const slider = this.closestSelector(lightButtonElement, '.rooms', '#light_intensity') as HTMLInputElement;

        if (!component) return;

        component.isLightOn = !component.isLightOn;

        if (component.isLightOn) {
            this.lightSwitchOn(childElement);
            const lightIntensity = component.lightIntensity / 10;
            this.handleLightIntensity(background, lightIntensity);
            slider.value = component.lightIntensity.toString();
        } else {
            this.lightSwitchOff(childElement);
            this.handleLightIntensity(background, 0);
            slider.value = '0';
        }
    }

    handleLightIntensitySlider(element: HTMLElement, intensity: number | string): void {
        const { componentData, background } = this.lightComponentSelectors(element);

        const value = Number(intensity);
        if (isNaN(value)) return;

        componentData.lightIntensity = value;

        const lightIntensity = value > 0 ? value / 10 : 0;
        this.handleLightIntensity(background, lightIntensity);

        const lightSwitch = this.closestSelector(element, '.rooms', '.light-switch') as HTMLElement;

        if (value === 0) {
            componentData.isLightOn = false;
            this.sliderLight(false, lightSwitch);
            return;
        }

        componentData.isLightOn = true;
        this.sliderLight(true, lightSwitch);
    }

    sliderLight(isLightOn: boolean, lightButtonElement: HTMLElement): void {
        const { componentData: component, childElement } = this.lightComponentSelectors(lightButtonElement);

        if (!component) return;

        if (isLightOn) {
            this.lightSwitchOn(childElement);
        } else {
            this.lightSwitchOff(childElement);
        }
    }
}

export default Light;
