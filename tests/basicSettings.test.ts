import Light from '../src/scripts/basicSettings';

describe('Light Class', () => {
    let light: Light;
    let lightButtonElement: HTMLImageElement;
    let backgroundElement: HTMLElement;
    let sliderElement: HTMLInputElement;

    beforeEach(() => {
        document.body.innerHTML = `
            <div class="rooms">
                <div class="hall">
                    <button class="light-switch">
                        <img src="./src/assets/svgs/light_bulb_off.svg" />
                    </button>
                    <input type="range" id="light_intensity" />
                    <p>hall</p>
                    <img />
                </div>
            </div>
        `;

        light = new Light();
        const component = light.getComponent('hall');
        

        light.setComponentElement(component);

        lightButtonElement = document.querySelector('.light-switch img')!;
        backgroundElement = document.querySelector('.hall img')!;
        sliderElement = document.getElementById('light_intensity') as HTMLInputElement;
    });

    test('lightSwitchOn sets correct attributes', () => {
        light.lightSwitchOn(lightButtonElement);
        expect(lightButtonElement.getAttribute('src')).toBe('./src/assets/svgs/light_bulb.svg');
        expect(lightButtonElement.getAttribute('data-lightOn')).toBe('./src/assets/svgs/light_bulb_off.svg');
    });

    test('lightSwitchOff sets correct attributes', () => {
        light.lightSwitchOff(lightButtonElement);
        expect(lightButtonElement.getAttribute('src')).toBe('./src/assets/svgs/light_bulb_off.svg');
        expect(lightButtonElement.getAttribute('data-lightOn')).toBe('./src/assets/svgs/light_bulb.svg');
    });

    test('toggleLightSwitch turns light on and off correctly', () => {
        // Turn ON
        light.toggleLightSwitch(document.querySelector('.light-switch')!);
        expect(light.getComponent('hall').isLightOn).toBe(true);
        expect(sliderElement.value).toBe('5');
        expect(backgroundElement.style.filter).toBe('brightness(0.5)');

        // Turn OFF
        light.toggleLightSwitch(document.querySelector('.light-switch')!);
        expect(light.getComponent('hall').isLightOn).toBe(false);
        expect(sliderElement.value).toBe('0');
        expect(backgroundElement.style.filter).toBe('brightness(0)');
    });

    test('handleLightIntensitySlider updates intensity and visual', () => {
        light.handleLightIntensitySlider(document.querySelector('.light-switch')!, 7);
        expect(light.getComponent('hall').lightIntensity).toBe(7);
        expect(backgroundElement.style.filter).toBe('brightness(0.7)');
    });

    test('notification returns HTML string', () => {
        const message = 'Light turned on';
        const html = light.notification(message);
        expect(html).toContain('<p>Light turned on</p>');
        expect(html).toContain('checked.svg');
    });

    test('displayNotification renders notification', () => {
        const container = document.createElement('div');
        light.displayNotification('Test message', 'beforeend', container);
        expect(container.innerHTML).toContain('Test message');
    });

    test('removeNotification removes element after timeout', () => {
        jest.useFakeTimers();
        const element = document.createElement('div');
        document.body.appendChild(element);

        light.removeNotification(element);
        jest.advanceTimersByTime(5000);
        expect(document.body.contains(element)).toBe(false);
        jest.useRealTimers();
    });
});
