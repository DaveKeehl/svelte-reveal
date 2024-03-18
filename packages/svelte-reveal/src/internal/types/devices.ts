/**
 * List of devices where `string` is the name and `Device` are the settings.
 */
export type Devices = [string, DeviceConfig][];

/**
 * Object containing information about a specific type of device.
 */
export type DeviceConfig = {
  /**
   * Whether the reveal effect is performed on a device.
   */
  enabled: boolean;
  /**
   * The viewport width upper limit that a device can be targeted to work in.
   */
  breakpoint: number;
};

/**
 * The types of device.
 */
export type Device = 'mobile' | 'tablet' | 'laptop' | 'desktop';

/**
 * Information about how the library handles responsiveness.
 * It can be used to enable/disable the reveal effect on some devices.
 */
export type Responsive = {
  /**
   * Object containing information about the responsiveness of a device.
   */
  [P in Device]: DeviceConfig;
};
