import React from 'react';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

export const SyncBanner = ({ 
  syncState = 'synced', // 'synced' | 'syncing' | 'offline' | 'error'
  pendingCount = 0,
  lastSyncedAt = null,
  onRetrySync
}) => {
  // Do not render banner if everything is completely synced and healthy
  if (syncState === 'synced' && pendingCount === 0) {
    return null;
  }

  return (
    <div className="w-full transition-all duration-300 ease-in-out">
      {/* Offline State */}
      {syncState === 'offline' && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-center justify-between text-xs font-medium text-amber-900">
          <div className="flex items-center space-x-2">
            <WifiOff className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>You are offline.</strong> {pendingCount} {pendingCount === 1 ? 'response is' : 'responses are'} saved locally and will sync when reconnected.
            </span>
          </div>
          <span className="text-[11px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-semibold">
            Local Backup Active
          </span>
        </div>
      )}

      {/* Syncing State */}
      {syncState === 'syncing' && (
        <div className="bg-sky-50 border-b border-sky-200 px-4 py-2.5 flex items-center justify-between text-xs font-medium text-sky-900">
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-4 h-4 text-sky-600 animate-spin shrink-0" />
            <span>
              Syncing exam progress... ({pendingCount} pending {pendingCount === 1 ? 'item' : 'items'})
            </span>
          </div>
          <span className="text-[11px] text-sky-700">
            Encrypted & Syncing
          </span>
        </div>
      )}

      {/* Error / Failed Sync State */}
      {syncState === 'error' && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-2.5 flex items-center justify-between text-xs font-medium text-red-900">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>
              Failed to sync {pendingCount} {pendingCount === 1 ? 'response' : 'responses'}. Don't worry, your answers are saved locally.
            </span>
          </div>
          {onRetrySync && (
            <button
              onClick={onRetrySync}
              className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-2.5 py-1 rounded text-[11px] font-semibold transition-colors duration-150"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry Sync</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SyncBanner;