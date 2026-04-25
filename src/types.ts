/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type DeviceStatus = 'online' | 'offline';
export type UpgradeStatus = 'up_to_date' | 'upgradable' | 'upgrading' | 'failed';

export interface FirmwareVersion {
  version: string;
  releaseDate: string;
  content: string[];
  size: string;
  duration: string;
  warnings: string[];
}

export type NotificationType = 'none' | 'weak' | 'strong' | 'mandatory';

export interface Device {
  id: string;
  name: string;
  sn: string;
  status: DeviceStatus;
  upgradeStatus: UpgradeStatus;
  notificationType?: NotificationType;
  coverImage: string;
  currentVersion: string;
  latestVersion?: FirmwareVersion;
}

export interface AutoUpgradeConfig {
  enabled: boolean;
  wifiOnly: boolean;
  nightInstall: boolean;
  timeWindow: string;
  notifyBefore: boolean;
  lastResult?: string;
}

export interface UpgradeHistoryItem {
  id: string;
  deviceId: string;
  deviceName: string;
  timestamp: string;
  status: 'success' | 'failure';
  version: string;
  scenario: string;
  reason?: string;
}
