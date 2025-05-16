import AdvanceSettings from './AdvanceSettings'; // Adjust path
import Light from './basicSettings';

jest.mock('./basicSettings'); // Mock parent class

describe('AdvanceSettings', () => {
  let instance: AdvanceSettings;
  let mockComponentData: any;

  beforeEach(() => {
    document.body.innerHTML = `
      <div class="advanced_features_container hidden"></div>
      <div data-room="livingroom" class="room-container active" id="livingroom"></div>
    `;

    instance = new AdvanceSettings();
    instance.componentsData = {
      livingroom: {
        name: 'livingroom',
        numOfLights: 3,
        autoOn: '06:30',
        autoOff: '22:00',
        usage: [2, 3, 1, 4, 3, 2, 5],
        lightIntensity: 50,
        isLightOn: true,
        element: document.querySelector('[data-room="livingroom"]') as HTMLElement,
      },
    };

    jest.spyOn(instance as any, 'getComponent').mockImplementation((name: string) => {
      return instance.componentsData[name];
    });

    // Stub external Chart call
    (global as any).Chart = jest.fn();
  });

  test('modalPopUp should insert markup and render chart', () => {
    instance.modalPopUp('livingroom');

    const modal = document.querySelector('.advanced_features');
    expect(modal).not.toBeNull();

    const canvas = document.querySelector('#myChart') as HTMLCanvasElement;
    expect(canvas).not.toBeNull();
    expect(Chart).toHaveBeenCalled();
  });

  test('closeModalPopUp should remove the modal and hide parent container', () => {
    instance.modalPopUp('livingroom');
    instance.closeModalPopUp();

    const modal = document.querySelector('.advanced_features');
    const parent = document.querySelector('.advanced_features_container');
    expect(modal).toBeNull();
    expect(parent?.classList.contains('hidden')).toBe(true);
  });

  test('customizationCancelled resets value to original autoOn', () => {
    instance.modalPopUp('livingroom');

    const input = document.querySelector('#autoOnTime') as HTMLInputElement;
    input.value = '12:00'; // Simulate user change

    const cancelBtn = document.querySelector('.defaultOn-cancel') as HTMLElement;
    instance.customizationCancelled(cancelBtn, '.defaultOn');

    expect(input.value).toBe('06:30'); // Reset to original
  });

  test('customizeAutomaticOnPreset updates autoOn time', () => {
    instance.modalPopUp('livingroom');

    const input = document.querySelector('#autoOnTime') as HTMLInputElement;
    input.value = '08:00';

    const okayBtn = document.querySelector('.defaultOn-okay') as HTMLElement;
    const automateSpy = jest.spyOn(instance, 'automateLight');

    instance.customizeAutomaticOnPreset(okayBtn);

    expect(instance.componentsData.livingroom.autoOn).toBe('08:00');
    expect(automateSpy).toHaveBeenCalledWith('08:00', expect.any(Object));
  });

  test('customizeAutomaticOffPreset updates autoOff time', () => {
    instance.modalPopUp('livingroom');

    const input = document.querySelector('#autoOffTime') as HTMLInputElement;
    input.value = '23:45';

    const okayBtn = document.querySelector('.defaultOff-okay') as HTMLElement;
    const automateSpy = jest.spyOn(instance, 'automateLight');

    instance.customizeAutomaticOffPreset(okayBtn);

    expect(instance.componentsData.livingroom.autoOff).toBe('23:45');
    expect(automateSpy).toHaveBeenCalledWith('23:45', expect.any(Object));
  });
});
