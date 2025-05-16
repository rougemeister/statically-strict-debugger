

import Light from '../src/scripts/basicSettings';
import AdvanceSettings from '../src/scripts/advanceSettings';

describe('Light Controller', () => {
  let lightController: Light;

  let mockElement: HTMLElement;

  beforeEach(() => {
    lightController = new Light();
    mockElement = document.createElement('div');
    mockElement.classList.add('hidden');
    document.body.appendChild(mockElement);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('should remove hidden class', () => {
    lightController.removeHidden(mockElement);
    expect(mockElement.classList.contains('hidden')).toBe(false);
  });

  test('should add hidden class', () => {
    mockElement.classList.remove('hidden');
    lightController.addHidden(mockElement);
    expect(mockElement.classList.contains('hidden')).toBe(true);
  });
});

describe('Advanced Settings', () => {
  let advancedSettings: AdvanceSettings;

  beforeEach(() => {
    advancedSettings = new AdvanceSettings();
    document.body.innerHTML = `
      <div class="room-container" id="kitchen">
        <button class="advance-settings_modal">Settings</button>
      </div>
    `;
  });

  test('should find component name from room container ID', () => {
    const button = document.querySelector('.advance-settings_modal') as HTMLElement;
    const roomContainer = button.closest('.room-container') as HTMLElement;
    const result = advancedSettings.findComponentName(roomContainer);
    expect(result).toBe('kitchen');
  });
});
