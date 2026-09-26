import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Lock, 
  FileCode, 
  RefreshCw, 
  Hash, 
  ArrowRight,
  Database
} from 'lucide-react';

export const HashLedger = ({
  ledgerBlocks = defaultBlocks,
  onVerifyBlock,
  onRehashLedger,
  isVerifying = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBlock, setSelectedBlock] = useState(ledgerBlocks[0] || null);

  const filteredBlocks = ledgerBlocks.filter(
    (block) =>
      block.hash.toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.candidateId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.blockHeight.toString().includes(searchQuery)
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-200">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Cryptographic Response Ledger</h1>
            <p className="text-xs text-slate-500 mt-1">
              Immutable SHA-256 hash log enforcing candidate response integrity and anti-tamper verification.
            </p>
          </div>
        </div>

        <button
          onClick={onRehashLedger}
          disabled={isVerifying}
          className="flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors duration-150 shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
          <span>{isVerifying ? 'Verifying Hashes...' : 'Verify Entire Chain'}</span>
        </button>
      </div>

      {/* Merkle Root & Chain Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Current Merkle Root</span>
          <p className="text-xs font-mono font-bold text-indigo-900 truncate">
            0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Sealed Blocks</span>
          <p className="text-lg font-bold text-slate-900">
            {ledgerBlocks.length} Signed Submissions
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ledger State</span>
          <div className="flex items-center space-x-1.5 text-emerald-600 pt-0.5">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Verified & Synchronized</span>
          </div>
        </div>
      </div>

      {/* Search & Ledger Blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Block List */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col h-[550px]">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search block height, candidate ID, or hash..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
            {filteredBlocks.map((block) => (
              <div
                key={block.blockHeight}
                onClick={() => setSelectedBlock(block)}
                className={`p-4 cursor-pointer transition-all duration-150 space-y-1.5 ${
                  selectedBlock?.blockHeight === block.blockHeight
                    ? 'bg-indigo-50/50 border-l-4 border-l-indigo-600'
                    : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                      Block #{block.blockHeight}
                    </span>
                    <span className="text-xs font-bold text-slate-800">{block.candidateId}</span>
                  </div>

                  {block.isTampered ? (
                    <span className="inline-flex items-center text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                      <XCircle className="w-3 h-3 mr-1" /> Mismatch
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Valid
                    </span>
                  )}
                </div>

                <div className="text-[11px] font-mono text-slate-500 truncate">
                  Hash: {block.hash}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Block Cryptographic Verification View */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl shadow-xs p-6 flex flex-col justify-between h-[550px]">
          {selectedBlock ? (
            <div className="space-y-5">
              <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Block Verification #{selectedBlock.blockHeight}
                  </h2>
                  <span className="text-xs text-slate-500">Candidate: {selectedBlock.candidateId}</span>
                </div>
                <Lock className="w-5 h-5 text-indigo-600" />
              </div>

              {/* Hashes Breakdown */}
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Previous Block Hash</span>
                  <p className="text-slate-600 break-all">{selectedBlock.prevHash}</p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Payload Payload Payload Hash</span>
                  <p className="text-indigo-900 font-bold break-all">{selectedBlock.hash}</p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Timestamp Signed</span>
                  <p className="text-slate-700">{selectedBlock.timestamp}</p>
                </div>
              </div>

              {/* Status Alert */}
              {selectedBlock.isTampered ? (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3 text-red-800 text-xs">
                  <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
                  <div>
                    <strong>Hash Discrepancy Detected!</strong> Payload payload SHA-256 signature does not match stored block hash.
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center space-x-3 text-emerald-800 text-xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <strong>Valid Block Signature.</strong> Payload integrity mathematically verified via raft consensus nodes.
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => onVerifyBlock && onVerifyBlock(selectedBlock.blockHeight)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Re-Verify Block Payload
                </button>
              </div>

            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              Select a block to inspect cryptographic details.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

// Fallback Default Blocks Data
const defaultBlocks = [
  {
    blockHeight: 14892,
    candidateId: 'CAND-9012',
    hash: '0xa4f82b991c0e3a22f719481bc1d88203f1947264a28b2123',
    prevHash: '0x9e120a11c8812f3847a112bc0912a78129e812a10a',
    timestamp: '2026-09-26 11:45:01 UTC',
    isTampered: false
  },
  {
    blockHeight: 14891,
    candidateId: 'CAND-4410',
    hash: '0x3f1947264a28b2123a4f82b991c0e3a22f719481bc1d882',
    prevHash: '0x8f2a1a49001b2c12a881912a83100129a0021b3812',
    timestamp: '2026-09-26 11:44:12 UTC',
    isTampered: false
  },
  {
    blockHeight: 14890,
    candidateId: 'CAND-1192',
    hash: '0x8f2a1a49001b2c12a881912a83100129a0021b381229a1',
    prevHash: '0x1a8829001ba2910a99d812700112a912b001a118a1',
    timestamp: '2026-09-26 11:42:55 UTC',
    isTampered: true
  }
];

export default HashLedger;