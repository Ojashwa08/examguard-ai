import React from "react";

const examCenters = [
  {
    name: "Bhopal Exam Center 01",
    region: "Bhopal Region",
    candidates: 850,
    latency: "38ms",
    status: "Healthy",
  },
  {
    name: "Indore Digital Testing Hub",
    region: "Indore Region",
    candidates: 920,
    latency: "42ms",
    status: "Healthy",
  },
  {
    name: "Delhi NCR Mega Center",
    region: "Delhi Region",
    candidates: 1200,
    latency: "31ms",
    status: "Healthy",
  },
  {
    name: "Mumbai Tech Assessment Hall",
    region: "Mumbai Region",
    candidates: 780,
    latency: "45ms",
    status: "Healthy",
  },
  {
    name: "Pune Knowledge Campus",
    region: "Pune Region",
    candidates: 450,
    latency: "36ms",
    status: "Healthy",
  },
  {
    name: "Bengaluru Tech Park Hub",
    region: "Bengaluru Region",
    candidates: 627,
    latency: "29ms",
    status: "Healthy",
  },
];

function CenterCard({ center }) {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-[14px] p-6 shadow-sm flex flex-col justify-between h-[145px]">
      {/* Top Row */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-[18px] font-bold text-[#0f172a] leading-snug">
            {center.name}
          </h3>
          <p className="text-[14px] text-[#64748b] mt-0.5">
            {center.region}
          </p>
        </div>
        <span className="px-3 py-0.5 text-[13px] font-medium text-[#059669] bg-[#ecfdf5] border border-[#a7f3d0] rounded-full shrink-0">
          {center.status}
        </span>
      </div>

      {/* Divider & Bottom Row */}
      <div className="pt-3 border-t border-[#e2e8f0] flex items-center justify-between text-[14px]">
        <div className="text-[#64748b]">
          Candidates: <span className="font-bold text-[#0f172a]">{center.candidates}</span>
        </div>
        <div className="text-[#64748b]">
          Latency: <span className="font-bold text-[#0f172a]">{center.latency}</span>
        </div>
      </div>
    </div>
  );
}

export default function CenterMap() {
  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen font-sans">
      {/* Page Header */}
      <div className="mb-7">
        <h1 className="text-[24px] font-bold text-[#0f172a] tracking-tight leading-tight">
          Regional Examination Centers
        </h1>
        <p className="text-[16px] text-[#64748b] mt-1">
          Physical center connectivity, active candidate headcount, and network latency
        </p>
      </div>

      {/* 3-Column Center Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {examCenters.map((center, index) => (
          <CenterCard key={index} center={center} />
        ))}
      </div>
    </div>
  );
}