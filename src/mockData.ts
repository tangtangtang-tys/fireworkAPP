/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Device, AutoUpgradeConfig } from './types';

export const LATEST_RELEASE = {
  version: 'V6.2.0.108',
  releaseDate: '2026-04-12',
  content: [
    '核心引擎优化：提升4K超清画质流转稳定性',
    'AI算法增强：新增人体跌倒检测与宠物追踪算法',
    '安全补丁：修复多个已知的网络连接安全漏洞',
    '体验改进：优化夜视模式下的切换灵敏度'
  ],
  size: '56.4 MB',
  duration: '约 5-8 分钟',
  warnings: [
    '升级期间设备将短时离线，无法进行实时监控与云录制',
    '请务必保持设备供电连接稳定，切勿在进度中切断电源',
    '升级完成后设备会自动重启以生效配置'
  ]
};

export const MOCK_DEVICES: Device[] = [
  {
    id: '1',
    name: '客厅摄像机 Pro',
    sn: 'DS-2CD2T87-X1',
    status: 'online',
    upgradeStatus: 'upgradable',
    notificationType: 'weak',
    coverImage: 'https://picsum.photos/seed/ipc_1/800/450',
    currentVersion: 'V6.1.2.95',
    latestVersion: LATEST_RELEASE
  },
  {
    id: '2',
    name: '入户玄关',
    sn: 'EZ-C8W-WF',
    status: 'online',
    upgradeStatus: 'upgradable',
    notificationType: 'none',
    coverImage: 'https://picsum.photos/seed/ipc_2/800/450',
    currentVersion: 'V6.2.0.108',
    latestVersion: LATEST_RELEASE
  },
  {
    id: '3',
    name: '花园球机 PTZ',
    sn: 'PTZ-9292-S1',
    status: 'online',
    upgradeStatus: 'upgradable',
    notificationType: 'strong',
    coverImage: 'https://picsum.photos/seed/ipc_3/800/450',
    currentVersion: 'V5.8.0.22',
    latestVersion: LATEST_RELEASE
  },
  {
    id: '4',
    name: '车库入口',
    sn: 'GK-7X-99',
    status: 'online',
    upgradeStatus: 'upgradable',
    notificationType: 'mandatory',
    coverImage: 'https://picsum.photos/seed/ipc_4/800/450',
    currentVersion: 'V4.2.0.01',
    latestVersion: LATEST_RELEASE
  }
];

export const INITIAL_AUTO_UPGRADE: AutoUpgradeConfig = {
  enabled: true,
  wifiOnly: true,
  nightInstall: true,
  timeWindow: '02:00 - 05:00',
  notifyBefore: true,
  lastResult: '2026-04-12 03:22 自动升级成功'
};
