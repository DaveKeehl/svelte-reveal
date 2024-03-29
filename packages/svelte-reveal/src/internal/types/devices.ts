/**
 * The device type.
 */
export type Device = 'mobile' | 'tablet' | 'laptop' | 'desktop';

/**
 * The configuration of a device.
 */
export type DeviceConfig = {
  /**
   * Whether the reveal effect is performed on the device.
   */
  enabled: boolean;
  /**
   * The max viewport width of the device.
   */
  breakpoint: number;
};

/**
 * Record of configured devices.
 */
export type Devices = [Device, DeviceConfig][];

/**
 * Specifies how the library handles responsiveness. It can be used to enable/disable the reveal effect on some devices.
 */
export type Responsive = Record<Device, DeviceConfig>;
