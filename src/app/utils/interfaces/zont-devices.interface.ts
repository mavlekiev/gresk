export interface ZontSensor {
  id: number;
  name: string;
  type: string;
  status: string;
  value?: number;
  unit?: string;
  color?: string;
  triggered?: boolean;
}

export interface ZontCircuit {
  id: number;
  name: string;
  status: string;
  type: string;
  actual_temp: number | null;
  target_temp: number | null;
  current_mode: number | null;
  active: boolean;
  is_off: boolean;
  in_summer_mode: boolean;
  min: number;
  max: number;
}

export interface ZontMode {
  id: number;
  name: string;
  color: string;
  applied: number[];
  can_be_applied: number[];
}

export interface ZontDeviceInfo {
  id: string;
  model: string;
  serial: string;
  version: {
    hardware: string;
    software: string;
  };
  widget_type: string;
}

export interface ZontDevice {
  id: number;
  name: string;
  online: boolean;
  device_info: ZontDeviceInfo;
  circuits: ZontCircuit[];
  modes?: ZontMode[];
  sensors: ZontSensor[];
}

export interface ZontApiResponse {
  ok: boolean;
  devices: ZontDevice[];
}
