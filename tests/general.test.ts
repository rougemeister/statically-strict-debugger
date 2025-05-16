import General from '../src/scripts/general'; // Update path as necessary

describe('General class', () => {
  let general: General;

  beforeEach(() => {
    general = new General();
  });

  it('should retrieve correct component data', () => {
    const component = general.getComponent('hall');
    expect(component).toBeDefined();
    expect(component.name).toBe('hall');
  });

  it('should update component data correctly', () => {
    general.updateComponentData({
      name: 'hall',
      lightIntensity: 8,
      numOfLights: 6,
      isLightOn: true,
      autoOn: '07:00',
      autoOff: '21:00',
      usage: [10, 10, 10, 10, 10, 10, 10],
    });

    const updated = general.getComponent('hall');
    expect(updated.lightIntensity).toBe(8);
    expect(updated.isLightOn).toBe(true);
    expect(updated.autoOn).toBe('07:00');
  });

  it('should return correct wifi connections', () => {
    const wifi = general.getWifi();
    expect(wifi.length).toBeGreaterThan(0);
    expect(wifi[0]).toHaveProperty('wifiName');
  });
});
