/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  Settings, 
  ChevronRight, 
  Download,
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Zap, 
  Wifi, 
  Camera,
  Play,
  Info,
  AlertTriangle,
  History,
  ShieldCheck,
  Loader2,
  Circle,
  Volume2,
  VolumeX,
  Maximize2,
  Square
} from 'lucide-react';

import { Device, DeviceStatus, UpgradeStatus, UpgradeHistoryItem } from './types';
import { MOCK_DEVICES } from './mockData';

// --- Shared Components ---

const Button = ({ 
  children, 
  onClick, 
  className = '', 
  variant = 'primary', 
  size = 'md',
  disabled = false 
}: { 
  children: React.ReactNode; 
  onClick?: () => void; 
  className?: string; 
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'soft';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}) => {
  const base = "relative overflow-hidden inline-flex items-center justify-center font-bold transition-all active:scale-95 disabled:opacity-40 disabled:active:scale-100 rounded-2xl tracking-tight";
  const variants = {
    primary: "bg-[#0062FF] text-white shadow-[0_8px_20px_-4px_rgba(0,98,255,0.3)]",
    secondary: "bg-white text-gray-800 border border-gray-200",
    danger: "bg-red-500 text-white shadow-[0_8px_20px_-4px_rgba(239,68,68,0.3)]",
    ghost: "bg-transparent text-gray-500",
    soft: "bg-blue-50 text-[#0062FF]"
  };
  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3.5 text-sm",
    lg: "px-8 py-4 text-base"
  };

  return (
    <button onClick={onClick} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} disabled={disabled}>
      {children}
    </button>
  );
};

const Card = ({ children, className = "", onClick, ...props }: { children: React.ReactNode, className?: string, onClick?: () => void, [key: string]: any }) => (
  <div 
    {...props}
    onClick={onClick}
    className={`bg-white rounded-[24px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] border border-gray-100/50 overflow-hidden ${onClick ? 'active:scale-[0.98] transition-all cursor-pointer' : ''} ${className}`}
  >
    {children}
  </div>
);

const Badge = ({ status }: { status: UpgradeStatus | DeviceStatus }) => {
  const map: Record<string, { label: string, color: string }> = {
    online: { label: '在线', color: 'bg-green-500' },
    offline: { label: '离线', color: 'bg-gray-400' },
    upgradable: { label: '发现更新', color: 'bg-orange-500' },
    upgrading: { label: '升级中', color: 'bg-primary' },
    failed: { label: '升级失败，可重试', color: 'bg-red-500' },
    up_to_date: { label: '最新版本', color: 'bg-blue-400' }
  };
  const config = map[status] || { label: status, color: 'bg-gray-400' };
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/20 shadow-sm">
      <div className={`w-1.5 h-1.5 rounded-full ${config.color} shadow-[0_0_8px_rgba(255,255,255,0.4)]`} />
      <span className="text-[10px] font-black text-white uppercase tracking-wider">{config.label}</span>
    </div>
  );
};

// --- Video Components ---

const VideoPlayer = ({ device }: { device: Device }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [showControls, setShowControls] = useState(false);

  // Mock static "dynamic" stream source
  const streamUrl = "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&q=80&w=800";

  if (device.status === 'offline') {
    return (
      <div className="aspect-[16/10] bg-[#1A1C1E] rounded-[32px] overflow-hidden relative shadow-lg flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <Wifi className="w-16 h-16 text-white/20" />
        </div>
        <div className="text-center">
          <p className="text-white/60 font-black text-sm uppercase tracking-widest">信号丢失</p>
          <p className="text-white/30 text-[10px] mt-1">NO SIGNAL - CHECK CONNECTION</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="aspect-[16/10] bg-black rounded-[32px] overflow-hidden relative shadow-lg group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      onClick={() => setShowControls(!showControls)}
    >
      {/* Simulated Video Stream Layer */}
      <div className="absolute inset-0">
        <img 
          src={device.coverImage || streamUrl} 
          className={`w-full h-full object-cover transition-all duration-700 ${isPlaying ? 'opacity-90' : 'opacity-60 grayscale-[0.5]'}`} 
          alt="Live Stream" 
          referrerPolicy="no-referrer" 
        />
        
        {/* Dynamic Overlay Scanline */}
        {isPlaying && (
          <div 
            className="absolute inset-x-0 h-px bg-white/10 shadow-[0_0_10px_white] animate-pulse"
            style={{ top: '50%' }}
          />
        )}
      </div>

      {/* Live Badge */}
      <div className="absolute top-4 left-5 flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2 py-1 bg-red-600 rounded-lg shadow-lg border border-red-500/50">
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">LIVE</span>
        </div>
        <div className="px-2 py-1 bg-black/40 backdrop-blur-md rounded-lg border border-white/10">
          <span className="text-[10px] font-mono text-white/80 uppercase">00:12:45 / 4K</span>
        </div>
      </div>

      {/* Central Play/Pause State Indicator (Temporary) */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center z-10 transition-all">
          <div className="w-16 h-16 bg-black/40 backdrop-blur-xl rounded-full flex items-center justify-center">
            <Play className="w-8 h-8 text-white fill-current translate-x-0.5" />
          </div>
        </div>
      )}

      {/* Video Controls Overlay */}
      {showControls && (
        <div 
          className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col gap-4 transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Progress Bar (Fake) */}
          <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#0062FF] shadow-[0_0_8px_#0062FF] transition-all"
              style={{ width: isPlaying ? '40%' : '20%' }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="text-white hover:text-[#0062FF] transition-colors"
              >
                {isPlaying ? <Square className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
              </button>
              
              <div className="flex items-center gap-3 group/vol">
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-white hover:text-[#0062FF] transition-colors"
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden relative">
                  <div 
                    className="absolute inset-y-0 left-0 bg-white" 
                    style={{ width: `${isMuted ? 0 : volume}%` }} 
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-5">
              <span className="text-[10px] font-mono text-white/60">SIMULATED FEED</span>
              <button className="text-white hover:text-[#0062FF] transition-colors">
                <Maximize2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Watermark */}
      <div className="absolute bottom-4 right-5 opacity-40">
        <p className="text-[10px] font-black text-white/50 tracking-tighter uppercase">{device.sn}</p>
      </div>
    </div>
  );
};

const Header = ({ title, sub, onBack, right }: { title: string, sub?: string, onBack?: () => void, right?: React.ReactNode }) => (
  <div className="px-5 pt-12 pb-4 bg-[#F8F9FB]/90 backdrop-blur-xl sticky top-0 z-40 border-b border-gray-100/50 flex items-center justify-between">
    <div className="flex items-center gap-3">
      {onBack && (
        <button onClick={onBack} className="p-2 -ml-2 active:bg-gray-200/50 rounded-2xl transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-900" />
        </button>
      )}
      <div>
        <h1 className="text-xl font-black text-gray-900 leading-none">{title}</h1>
        {sub && <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{sub}</p>}
      </div>
    </div>
    {right}
  </div>
);

const MandatoryCardOverlay = ({ device, onUpgrade }: { device: Device, onUpgrade: (e: React.MouseEvent) => void }) => (
  <div className="absolute inset-0 z-30 bg-black/75 backdrop-blur-[2px] flex items-center justify-center p-4 animate-in fade-in duration-500 overflow-hidden group">
    {/* Subtle pulsing background effect */}
    <div className="absolute inset-0 bg-blue-500/5 animate-pulse-slow pointer-events-none" />
    
    <div className="relative flex flex-col items-center w-full text-center">
      {/* 1. Camera Lens Visual Element */}
      <div className="relative mb-3 group-hover:scale-105 transition-transform duration-500">
        <div className="w-16 h-16 bg-[#1A1C1E] rounded-full border-[3px] border-gray-700/50 flex items-center justify-center shadow-2xl relative overflow-hidden">
          {/* Inner lens glass effect */}
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-gray-800 via-black to-gray-900" />
          <div className="absolute inset-2 rounded-full bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.1),_transparent)]" />
          <div className="w-6 h-6 rounded-full bg-[#0A0A0A] border border-gray-800/50 flex items-center justify-center z-10 shadow-inner">
            <div className="w-2 h-2 rounded-full bg-blue-500/20 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
          </div>
          {/* Outer ring reflections */}
          <div className="absolute inset-0 border border-white/5 rounded-full" />
        </div>
        {/* Futuristic accent ring */}
        <div className="absolute -inset-1 border border-blue-500/20 rounded-full animate-pulse-slow" />
      </div>

      {/* 2. Concise Futurist Header & SN */}
      <h3 className="text-lg font-black text-white tracking-tight mb-0.5">发现新固件</h3>
      <div className="flex items-center justify-center gap-1.5 mb-3">
        <div className="w-1 h-1 rounded-full bg-orange-500 animate-pulse" />
        <p className="text-[9px] font-mono font-bold text-gray-400 tracking-[0.2em] uppercase">{device.sn}</p>
      </div>
      
      <p className="text-[10px] font-medium text-gray-200 leading-relaxed mb-5 max-w-[160px] opacity-80">
        系统已锁定关键更新，请立即完成升级以恢复使用
      </p>

      {/* 3. Orange Upgrade Button */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onUpgrade(e);
        }}
        className="w-full max-w-[140px] py-2.5 bg-[#FF7D29] text-white rounded-xl font-black text-xs shadow-[0_12px_24px_-4px_rgba(255,125,41,0.4)] hover:shadow-[0_16px_32px_-4px_rgba(255,125,41,0.5)] active:scale-95 transition-all outline-none"
      >
        立即升级
      </button>
    </div>
  </div>
);

const HomeView = ({ devices, onNavigate }: { devices: Device[], onNavigate: (v: any, id?: string) => void }) => (
  <div className="flex flex-col gap-6 p-5">
    <div className="flex items-center justify-between py-2">
      <div>
        <h2 className="text-2xl font-black text-gray-900">我的设备</h2>
        <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-tighter">My Secure Devices</p>
      </div>
      <button 
        onClick={() => onNavigate('history')}
        className="w-10 h-10 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-gray-100 active:scale-95 transition-transform"
      >
        <History className="w-5 h-5 text-gray-400" />
      </button>
    </div>

    <div className="grid gap-5">
      {devices.map(device => (
        <Card key={device.id} onClick={() => onNavigate('detail', device.id)} className="group hover:ring-2 ring-blue-500/10 relative">
          {/* 4. Mandatory Upgrade Overlay on Card */}
          {device.notificationType === 'mandatory' && device.upgradeStatus === 'upgradable' && (
            <MandatoryCardOverlay 
              device={device} 
              onUpgrade={() => onNavigate('detail', device.id)} 
            />
          )}

          <div className="relative aspect-[16/9] bg-gray-100">
            <img 
              src={device.coverImage} 
              className={`w-full h-full object-cover transition-opacity duration-500 ${device.status === 'offline' ? 'opacity-40 grayscale' : 'opacity-100'}`} 
              alt={device.name} 
              referrerPolicy="no-referrer" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
            
            {/* Top Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge status={device.status} />
              <Badge status={device.upgradeStatus} />
            </div>

            {/* Weak Notification (Tiny Red Dot) */}
            {device.notificationType === 'weak' && device.upgradeStatus === 'upgradable' && (
              <div className="absolute top-3 right-3">
                <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-sm animate-pulse" />
              </div>
            )}

            {/* Prominent Offline Badge */}
            {device.status === 'offline' && (
              <div className="absolute top-4 right-4 animate-in fade-in zoom-in duration-300">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-2xl shadow-lg border border-red-500/50">
                  <Wifi className="w-3.5 h-3.5 opacity-80" />
                  <span className="text-[11px] font-black uppercase tracking-widest">离线 OFFLINE</span>
                </div>
              </div>
            )}
          </div>
          <div className="p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-gray-900 text-base">{device.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-gray-400 font-mono">{device.sn}</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase">{device.currentVersion}</span>
                </div>
              </div>
              {device.status === 'offline' ? (
                <div className="flex flex-col items-end gap-1">
                   <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">无法连接</span>
                   <ChevronRight className="w-5 h-5 text-gray-200" />
                </div>
              ) : (device.upgradeStatus === 'upgradable' || device.upgradeStatus === 'failed' ? (
                 <button className={`${device.upgradeStatus === 'failed' ? 'bg-red-500' : 'bg-[#0062FF]'} text-white text-[11px] font-black px-4 py-2 rounded-xl shadow-lg`}>
                  {device.upgradeStatus === 'failed' ? '去重试' : '去升级'}
                </button>
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-300" />
              ))}
            </div>

            {/* Strong Notification (Banner below info) */}
            {device.notificationType === 'strong' && device.upgradeStatus === 'upgradable' && (
              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-[10px] font-bold text-blue-600">最新固件 {device.latestVersion?.version} 已发布</span>
                </div>
                <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">点击查看详情</span>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  </div>
);

const DetailView = ({ 
  device, 
  onNavigate, 
  showToast, 
  onToggleStatus 
}: { 
  device: Device | undefined, 
  onNavigate: (v: any) => void, 
  showToast: (msg: string, type?: 'error' | 'success') => void,
  onToggleStatus: (id: string) => void
}) => {
  if (!device) return null;

  const isMandatory = device.notificationType === 'mandatory' && device.upgradeStatus === 'upgradable';

  return (
    <div className="flex flex-col h-full relative">
      {isMandatory && (
        <div className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-8 animate-in fade-in duration-500 group">
          <div className="flex flex-col items-center w-full max-w-[320px] text-center">
            {/* Visual background element - simulated device icon */}
            <div className="relative mb-8 group-hover:scale-105 transition-transform duration-500">
              <div className="w-24 h-24 bg-[#1A1C1E] rounded-full border-[4px] border-gray-700/50 flex items-center justify-center shadow-2xl relative overflow-hidden">
                <div className="absolute inset-1 rounded-full bg-gradient-to-br from-gray-800 via-black to-gray-900" />
                <div className="w-10 h-10 rounded-full bg-[#0A0A0A] border border-gray-800/50 flex items-center justify-center z-10">
                  <div className="w-4 h-4 rounded-full bg-orange-500/20 shadow-[0_0_12px_rgba(249,115,22,0.5)]" />
                </div>
              </div>
              <div className="absolute -inset-2 border border-orange-500/20 rounded-full animate-pulse-slow" />
            </div>

            <h3 className="text-2xl font-black text-white tracking-tight mb-1">发现新固件</h3>
            <p className="text-[11px] font-mono font-bold text-gray-400 mb-4 tracking-widest uppercase">{device.sn}</p>
            
            <p className="text-sm font-medium text-gray-300 leading-relaxed mb-10 max-w-[240px]">
              为了不影响您的正常使用，请尽快升级
            </p>

            <div className="w-full space-y-4">
              <button 
                onClick={() => onNavigate('firmware')}
                className="w-full py-4 bg-[#FF7D29] text-white rounded-full font-black text-lg shadow-[0_12px_24px_-4px_rgba(255,125,41,0.4)] active:scale-95 transition-all outline-none"
              >
                立即升级
              </button>
              <button 
                onClick={() => onNavigate('list')}
                className="text-xs font-bold text-white/40 hover:text-white/60 transition-colors uppercase tracking-widest"
              >
                暂不处理，直接返回
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Header title={device.name} onBack={() => onNavigate('list')} />
      
      {/* Top Offline Warning Banner */}
      {device.status === 'offline' && (
        <div 
          className="bg-red-500 text-white overflow-hidden transition-all duration-300"
          style={{ height: 'auto', opacity: 1 }}
        >
          <div className="px-5 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-[11px] font-black tracking-tight">当前设备已离线，无法进行实时监控与固件升级</span>
            </div>
          </div>
        </div>
      )}

      <div className="p-5 space-y-6 flex-1 overflow-y-auto pb-10">
        <VideoPlayer device={device} />

        {(device.upgradeStatus === 'upgradable' || device.upgradeStatus === 'failed') && (
          <div className={`p-5 rounded-[28px] border flex items-center justify-between shadow-sm transition-all ${device.upgradeStatus === 'failed' ? 'bg-red-50/50 border-red-100' : 'bg-white border-blue-50'}`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${device.upgradeStatus === 'failed' ? 'bg-red-500 text-white' : 'bg-blue-50 text-[#0062FF]'}`}>
                {device.upgradeStatus === 'failed' ? <AlertTriangle className="w-6 h-6" /> : <RefreshCw className="w-6 h-6" />}
              </div>
              <div>
                <h4 className="font-black text-gray-900 text-sm">
                  {device.upgradeStatus === 'failed' ? '升级失败，可重试' : '新固件可更新'}
                </h4>
                <p className="text-xs text-gray-400 font-bold tracking-tight">V5.8.1.05 • 128.5MB</p>
              </div>
            </div>
            <Button 
              onClick={() => {
                if (device.status === 'offline') {
                  showToast('设备目前处于离线状态，无法进行固件升级', 'error');
                } else {
                  onNavigate('firmware');
                }
              }} 
              size="sm" 
              variant={device.upgradeStatus === 'failed' ? 'danger' : 'primary'}
            >
               {device.status === 'offline' ? '设备离线' : '立即处理'}
            </Button>
          </div>
        )}

        {device.upgradeStatus === 'up_to_date' && (
          <div className="bg-white p-5 rounded-[28px] flex items-center justify-between border border-gray-100 shadow-sm">
             <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center">
                 <ShieldCheck className="w-6 h-6 text-green-500" />
               </div>
               <div>
                 <h4 className="font-black text-gray-900 text-sm">已是最新版本</h4>
                 <p className="text-xs text-gray-400 font-bold tracking-tight">{device.currentVersion}</p>
               </div>
             </div>
             <CheckCircle2 className="w-5 h-5 text-gray-200" />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {['云端回放', '更多设置', '手动截图', '报警记录'].map(label => (
            <Card key={label} className={`p-6 flex flex-col items-center gap-3 ${device.status === 'offline' ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                <Camera className="w-5 h-5 text-gray-400" />
              </div>
              <span className="text-xs font-black text-gray-800 tracking-tight">{label}</span>
            </Card>
          ))}
        </div>

        {/* Debug Toggle Status Button */}
        <div className="pt-4 mt-4 border-t border-gray-50">
           <button 
             onClick={() => onToggleStatus(device.id)}
             className={`w-full py-4 rounded-[28px] border-2 border-dashed flex items-center justify-center gap-2 transition-all ${
               device.status === 'offline' ? 'bg-green-50 border-green-200 text-green-600' : 'bg-red-50 border-red-200 text-red-600'
             }`}
           >
             <Settings className="w-4 h-4" />
             <span className="text-[11px] font-black uppercase tracking-widest">
               模拟：切换设备为 {device.status === 'offline' ? '在线' : '离线'}
             </span>
           </button>
        </div>
      </div>
    </div>
  );
};

const FirmwareView = ({ device, onBack, onConfirm }: { device: Device, onBack: () => void, onConfirm: () => void }) => {
  const firmware = device.latestVersion || {
    version: 'V5.8.1.05',
    releaseDate: '2024-04-15',
    size: '128.5 MB',
    content: ['优化夜视算法', '提升稳定性', '安全漏洞修复'],
    warnings: ['请勿断电', '重启需2分钟']
  };

  return (
    <div className="h-full bg-white flex flex-col">
      <Header title="升级详情" onBack={onBack} />
      <div className="px-6 py-8 flex-1 overflow-y-auto">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-[#0062FF] rounded-[28px] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-500/20">
              <Zap className="w-10 h-10 text-white fill-current" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">{firmware.version}</h2>
            <p className="text-xs text-gray-400 font-bold mt-2 uppercase tracking-widest">{firmware.releaseDate} • {firmware.size}</p>
          </div>
          <div className="space-y-8">
            <section>
               <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">更新日志 Change Log</h4>
               <div className="bg-[#F8F9FB] rounded-3xl p-7 space-y-4">
                 {firmware.content.map((txt, i) => (
                   <div key={i} className="flex gap-4">
                     <div className="w-1.5 h-1.5 mt-2 bg-blue-500 rounded-full shrink-0" />
                     <p className="text-sm text-gray-600 font-medium leading-relaxed">{txt}</p>
                   </div>
                 ))}
               </div>
            </section>
          </div>
      </div>
      <div className="p-6 pb-12">
        <Button className="w-full" size="lg" onClick={onConfirm}>确认并升级</Button>
      </div>
    </div>
  );
};

const UpgradingView = ({ onFinish, scenario }: { onFinish: (res: 'success' | 'failure', reason?: string) => void, scenario: string }) => {
  const [progress, setProgress] = useState(0);
  const stages = ['下载固件包', '传输到设备', '写入安装', '重启恢复连接'];
  
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) return 100;
        const next = p + Math.random() * 4 + 0.5;
        return next > 100 ? 100 : next;
      });
    }, 400);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      setTimeout(() => {
        if (scenario === 'fail_download') onFinish('failure', '固件下载超时，请检查路由器连接');
        else if (scenario === 'fail_install') onFinish('failure', '校验安装包失败，设备闪存写入异常');
        else onFinish('success');
      }, 500);
    }
  }, [progress, scenario, onFinish]);

  const currentStageIndex = Math.min(Math.floor(progress / 25), 3);
  const currentStageTitle = stages[currentStageIndex];

  return (
    <div className="h-full bg-white flex flex-col p-8 pt-16 items-center">
      <div className="text-center mb-10 w-full">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full border border-blue-100 mb-4">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">系统处理中</span>
        </div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">{currentStageTitle}</h2>
        <p className="text-xs text-gray-400 font-bold mt-1 tracking-widest uppercase opacity-60">请保持设备电源连接</p>
      </div>

      <div className="relative w-56 h-56 mb-16 group">
        <svg className="w-full h-full transform -rotate-90">
          {/* Dashed background track */}
          <circle 
            cx="112" cy="112" r="92" 
            strokeWidth="2" stroke="#E2E8F0" 
            fill="transparent" 
            strokeDasharray="4 4" 
            className="opacity-50"
          />
          {/* Main progress track */}
          <circle cx="112" cy="112" r="92" strokeWidth="8" stroke="#F1F5F9" fill="transparent" />
          <circle 
            cx="112" cy="112" r="92" strokeWidth="8" stroke="#0062FF" fill="transparent" 
            strokeDasharray={2 * Math.PI * 92}
            strokeDashoffset={2 * Math.PI * 92 * (1 - progress / 100)}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
           <span className="text-6xl font-mono font-black text-gray-900 tracking-tighter leading-none">
             {Math.floor(progress).toString().padStart(2, '0')}
             <span className="text-2xl ml-1 font-sans text-gray-400 font-bold">%</span>
           </span>
           <div className="h-px w-8 bg-gray-100 my-3" />
           <span className="text-[10px] font-mono text-blue-500 font-black tracking-widest uppercase">固件升级中</span>
        </div>
      </div>

      <div className="w-full space-y-2 max-w-[320px]">
        {stages.map((s, i) => {
          const isCompleted = i < currentStageIndex || (i === 3 && progress === 100);
          const isProcessing = i === currentStageIndex && progress < 100;
          const isPending = i > currentStageIndex;

          return (
            <div 
              key={i} 
              className={`flex items-center gap-4 p-4 rounded-[24px] border transition-all duration-300 ${
                isProcessing ? 'bg-blue-50/30 border-blue-100 shadow-sm' : 'border-transparent'
              }`}
            >
              <div className="shrink-0">
                {isCompleted ? (
                  <div className="w-9 h-9 rounded-2xl bg-green-50 flex items-center justify-center border border-green-100">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </div>
                ) : isProcessing ? (
                  <div className="w-9 h-9 rounded-2xl bg-blue-500 flex items-center justify-center shadow-[0_8px_16px_-4px_rgba(0,98,255,0.4)]">
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100">
                    <Circle className="w-4 h-4 text-gray-200" strokeWidth={3} />
                  </div>
                )}
              </div>
              
              <div className="flex-1 flex items-center justify-between">
                <div>
                  <span className={`text-[13px] font-black block ${
                    isCompleted ? 'text-gray-900' : isProcessing ? 'text-[#0062FF]' : 'text-gray-300'
                  }`}>
                    {s}
                  </span>
                  {isProcessing && (
                    <span 
                      className="text-[9px] font-mono text-blue-400 font-bold uppercase tracking-widest mt-0.5 block opacity-80"
                    >
                      正在执行中...
                    </span>
                  )}
                </div>
                
                <div className={`px-2 py-1 rounded-md border text-[9px] font-black uppercase tracking-widest ${
                  isCompleted ? 'bg-green-50 text-green-600 border-green-100' : 
                  isProcessing ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                  'bg-gray-50 text-gray-300 border-gray-100'
                }`}>
                  {isCompleted ? '已完成' : isProcessing ? '进行中' : '等待中'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ResultView = ({ 
  type, 
  device, 
  reason, 
  onAction, 
  onRetry 
}: { 
  type: 'success' | 'failure', 
  device?: Device, 
  reason?: string, 
  onAction: () => void, 
  onRetry: () => void 
}) => (
  <div className="h-full bg-white flex flex-col items-center justify-center p-10 text-center">
    <div className={`w-24 h-24 rounded-[32px] flex items-center justify-center mb-10 ${type === 'success' ? 'bg-green-500 shadow-xl shadow-green-200' : 'bg-red-50 text-red-500'}`}>
      {type === 'success' ? <CheckCircle2 className="w-12 h-12 text-white" /> : <XCircle className="w-12 h-12" />}
    </div>
    <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-4">{type === 'success' ? '固件更新成功' : '升级未能完成'}</h2>
    <p className="text-sm text-gray-400 font-medium mb-12">
      {type === 'success' ? `您的设备已升级至 ${device?.latestVersion?.version || '最新版本'}` : reason}
    </p>
    <div className="w-full space-y-3">
       <Button className="w-full" onClick={type === 'success' ? onAction : onRetry}>{type === 'success' ? '立即查看' : '重新尝试升级'}</Button>
       <Button className="w-full" variant="ghost" onClick={onAction}>{type === 'success' ? '返回首页' : '放弃并返回'}</Button>
    </div>
  </div>
);

const HistoryView = ({ history, onBack }: { history: UpgradeHistoryItem[], onBack: () => void }) => (
  <div className="h-full bg-white flex flex-col">
    <Header title="升级历史" sub="Upgrade Logs" onBack={onBack} />
    <div className="flex-1 overflow-y-auto px-5 py-6">
      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
             <History className="w-8 h-8 text-gray-200" />
          </div>
          <p className="text-gray-400 text-sm font-bold">暂无升级记录</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div key={item.id} className="p-4 rounded-3xl border border-gray-100 bg-[#F8F9FB] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${item.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className={`text-[10px] font-black uppercase tracking-widest ${item.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                    {item.status === 'success' ? '升级成功' : '升级失败'}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-gray-400 font-bold">{item.timestamp}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-gray-900">{item.deviceName}</h4>
                  <p className="text-[10px] font-mono text-gray-400 mt-0.5">{item.version}</p>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">测试场景</span>
                  <span className="text-[10px] font-bold text-gray-600">{item.scenario}</span>
                </div>
              </div>

              {item.reason && (
                <div className="mt-1 p-3 bg-red-50/50 rounded-xl border border-red-50">
                  <div className="flex gap-2">
                    <AlertTriangle className="w-3 h-3 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-red-600 font-medium leading-tight">{item.reason}</p>
                  </div>
                </div>
              )}
            </div>
          )).reverse()}
        </div>
      )}
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  const [view, setView] = useState<'list' | 'detail' | 'firmware' | 'upgrading' | 'success' | 'failed' | 'history'>('list');
  const [activeDeviceId, setActiveDeviceId] = useState<string | null>(null);
  const [devices, setDevices] = useState<Device[]>(MOCK_DEVICES);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [scenario, setScenario] = useState<'success' | 'fail_download' | 'fail_install'>('success');
  const [failReason, setFailReason] = useState('');
  const [history, setHistory] = useState<UpgradeHistoryItem[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

  const activeDevice = devices.find(d => d.id === activeDeviceId);
  const targetDevice = devices[0]; // For debug controls targeting

  const handleUpdateNotificationType = (type: any) => {
    setDevices(prev => prev.map((d, i) => i === 0 ? { ...d, notificationType: type, upgradeStatus: 'upgradable' } : d));
    showToast(`提示方式已切换: ${type}`, 'success');
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: 'error' | 'success' = 'error') => {
    setToast({ message, type });
  };

  const navigateTo = (v: typeof view, id?: string) => {
    if (id) setActiveDeviceId(id);
    setView(v);
  };

  const handleToggleStatus = (id: string) => {
    setDevices(prev => prev.map(d => 
      d.id === id ? { ...d, status: d.status === 'online' ? 'offline' : 'online' } : d
    ));
    const device = devices.find(d => d.id === id);
    const newStatus = device?.status === 'online' ? '离线' : '在线';
    showToast(`${device?.name || '设备'} 已切换为${newStatus}状态`, 'success');
  };

  const handleFinish = (result: 'success' | 'failure', reason?: string) => {
    const timestamp = new Date().toLocaleString('zh-CN', { 
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const newLog: UpgradeHistoryItem = {
      id: Math.random().toString(36).substr(2, 9),
      deviceId: activeDeviceId || '',
      deviceName: activeDevice?.name || '未知设备',
      timestamp,
      status: result,
      version: activeDevice?.latestVersion?.version || 'V5.8.1.05',
      scenario: scenario === 'success' ? '成功升级' : scenario === 'fail_download' ? '下载环节失败' : '安装环节失败',
      reason
    };

    setHistory(prev => [...prev, newLog]);

    if (result === 'success') {
      setDevices(prev => prev.map(d => 
        d.id === activeDeviceId ? { ...d, upgradeStatus: 'up_to_date', currentVersion: d.latestVersion?.version || d.currentVersion } : d
      ));
      setView('success');
    } else {
      setDevices(prev => prev.map(d => 
        d.id === activeDeviceId ? { ...d, upgradeStatus: 'failed' } : d
      ));
      setFailReason(reason || '网络超时');
      setView('failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans tracking-tight">
      {/* External Debug Controls */}
      <div className="fixed top-8 left-8 z-[60] flex flex-col gap-3 p-5 bg-white/90 backdrop-blur-md rounded-[32px] border border-gray-200 shadow-2xl hidden lg:flex">
        <div className="flex items-center gap-2 mb-2 px-1">
          <Settings className="w-4 h-4 text-gray-400" />
          <span className="text-xs font-black text-gray-500 uppercase tracking-widest">测试控制中心</span>
        </div>
        <div className="flex flex-col gap-2">
          {[
            { id: 'success', label: '模拟成功流', color: 'bg-green-500' },
            { id: 'fail_download', label: '模拟下载失败', color: 'bg-red-500' },
            { id: 'fail_install', label: '模拟安装失败', color: 'bg-orange-500' }
          ].map(s => (
            <button 
              key={s.id} 
              onClick={() => setScenario(s.id as any)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group ${
                scenario === s.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-[1.02]' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${scenario === s.id ? 'bg-white animate-pulse' : s.color}`} />
              <span className="text-xs font-black tracking-tight">{s.label}</span>
            </button>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-3 px-1">
            <Volume2 className="w-4 h-4 text-gray-400" />
            <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest">模拟固件提示方式</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'none', label: '不提示' },
              { id: 'weak', label: '弱提示' },
              { id: 'strong', label: '强提示' },
              { id: 'mandatory', label: '强制提示' }
            ].map(t => (
              <button 
                key={t.id} 
                onClick={() => handleUpdateNotificationType(t.id)}
                className={`px-3 py-2.5 rounded-xl text-[10px] font-black transition-all border ${
                  targetDevice?.notificationType === t.id 
                    ? 'bg-blue-50 border-blue-200 text-blue-600' 
                    : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-[10px] text-gray-400 font-medium px-1">当前预期结果: <span className="font-black text-blue-500 ml-1">
            {scenario === 'success' ? '升级成功' : '升级失败'}
          </span></p>
        </div>
      </div>

      {/* Mobile view top bar for debug (only if on small screen) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-[60] p-4 bg-white/80 backdrop-blur flex flex-col gap-3 border-b border-gray-100">
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {['success', 'fail_download', 'fail_install'].map(s => (
            <button 
              key={s} 
              onClick={() => setScenario(s as any)}
              className={`text-[9px] px-3 py-1.5 rounded-full font-black shrink-0 ${scenario === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}
            >
              {s === 'success' ? '模拟成功' : s === 'fail_download' ? '下载失败' : '安装失败'}
            </button>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {['none', 'weak', 'strong', 'mandatory'].map(t => (
            <button 
              key={t} 
              onClick={() => handleUpdateNotificationType(t)}
              className={`text-[9px] px-3 py-1.5 rounded-full font-black shrink-0 ${targetDevice?.notificationType === t ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500'}`}
            >
              {t === 'none' ? '无提示' : t === 'weak' ? '点提示' : t === 'strong' ? '条提示' : '弹提示'}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full max-w-[400px] h-[844px] bg-[#F8F9FB] sm:rounded-[48px] overflow-hidden flex flex-col relative shadow-2xl border-x sm:border-8 border-gray-900 group">
        {/* Toast Notification (Refactored with Motion) */}
        <AnimatePresence>
          {toast && (
            <motion.div 
              initial={{ opacity: 0, y: -20, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: -20, x: '-50%' }}
              className="absolute top-16 left-1/2 z-[200] w-[calc(100%-48px)] max-w-[340px] pointer-events-none"
            >
              <div className={`p-4 rounded-3xl shadow-[0_12px_40px_-12px_rgba(0,0,0,0.2)] border flex items-center gap-3 backdrop-blur-xl ${
                toast.type === 'error' ? 'bg-red-500 text-white border-red-400/50' : 'bg-gray-900 text-white border-white/10'
              }`}>
                <div className={`w-8 h-8 rounded-2xl flex items-center justify-center shrink-0 ${
                  toast.type === 'error' ? 'bg-white/20' : 'bg-blue-600'
                }`}>
                  {toast.type === 'error' ? <AlertTriangle className="w-5 h-5 text-white" /> : <RefreshCw className="w-5 h-5 text-white animate-spin-slow" />}
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-black tracking-tight leading-none">
                    {toast.type === 'error' ? '操作受阻' : '模拟配置成功'}
                  </p>
                  <p className="text-[11px] font-medium opacity-80 mt-1">
                    {toast.message}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 overflow-hidden relative">
          {view === 'list' && (
            <div className="h-full overflow-y-auto">
              <HomeView devices={devices} onNavigate={navigateTo} />
            </div>
          )}
          {view === 'detail' && activeDevice && (
            <div className="h-full">
              <DetailView device={activeDevice} onNavigate={navigateTo} showToast={showToast} onToggleStatus={handleToggleStatus} />
            </div>
          )}
          {view === 'firmware' && activeDevice && (
            <div className="h-full">
              <FirmwareView device={activeDevice} onBack={() => setView('detail')} onConfirm={() => setIsSheetOpen(true)} />
            </div>
          )}
          {view === 'upgrading' && (
            <div className="h-full">
              <UpgradingView scenario={scenario} onFinish={handleFinish} />
            </div>
          )}
          {(view === 'success' || view === 'failed') && activeDevice && (
            <div className="h-full">
              <ResultView 
                type={view === 'success' ? 'success' : 'failure'} 
                device={activeDevice}
                reason={failReason}
                onAction={() => setView('list')}
                onRetry={() => setView('upgrading')}
              />
            </div>
          )}
          {view === 'history' && (
            <div className="h-full">
              <HistoryView history={history} onBack={() => setView('list')} />
            </div>
          )}
        </div>

        {isSheetOpen && activeDevice && (
          <div 
            className="fixed inset-0 z-50 flex items-end justify-center"
          >
            <div 
              onClick={() => setIsSheetOpen(false)} 
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300" 
              style={{ opacity: 1 }}
            />
            <div 
              className="relative w-full max-w-[400px] bg-white rounded-t-[32px] px-6 pt-10 pb-12 shadow-2xl transition-transform duration-300 transform translate-y-0"
            >
              {/* Visual Drag Handle */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1 bg-gray-200 rounded-full" />
              
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-blue-100">
                  <Zap className="w-8 h-8 text-[#0062FF]" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">准备好升级了吗？</h3>
                <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">{activeDevice.name}</p>
              </div>

              <div className="space-y-4 mb-10">
                {/* Version Transition Box */}
                <div className="bg-[#F8F9FB] rounded-3xl p-6 border border-gray-100 flex items-center justify-between shadow-inner">
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">当前</span>
                    <span className="text-base font-mono font-black text-gray-500">{activeDevice.currentVersion}</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center border border-gray-100">
                      <ChevronRight className="w-5 h-5 text-blue-500" />
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest leading-none mb-1.5">更新至</span>
                    <span className="text-lg font-mono font-black text-gray-900">{activeDevice.latestVersion?.version || 'V5.8.1.05'}</span>
                  </div>
                </div>

                {/* Refined Risk Warning */}
                <div className="bg-gray-50/80 rounded-[28px] p-5 border border-gray-100 flex gap-4">
                  <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center shrink-0 border border-orange-100">
                    <Info className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="flex-1 pt-0.5">
                    <h4 className="text-[11px] font-black text-gray-600 uppercase tracking-wider mb-1">升级提醒</h4>
                    <p className="text-[13px] text-gray-500 font-medium leading-[1.6]">
                      建议在网络良好的环境下进行。升级期间设备将无法录像，过程约为 <span className="text-gray-900 font-black">2-5 分钟</span>，请保持电源连接。
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button 
                  className="w-full h-14" 
                  onClick={() => { setIsSheetOpen(false); setView('upgrading'); }}
                >
                  立即开始升级
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setIsSheetOpen(false)} 
                  className="text-gray-400 font-bold hover:text-gray-600"
                >
                  暂不升级
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
