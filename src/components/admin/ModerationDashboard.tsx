import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { useViewLoading } from '../../hooks/useViewLoading';
import { TableSkeleton } from '../common/Skeletons';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Clock,
  UserX,
  FileText,
  AlertTriangle,
  History,
  Lock,
} from 'lucide-react';

export const ModerationDashboard: React.FC = () => {
  const { isLoading } = useViewLoading(400);
  const { reports, resolveReport, auditLogs, currentUser } = usePlatform();
  const [activeTab, setActiveTab] = useState<'reports' | 'audit_logs'>('reports');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredReports = reports.filter(
    (r) => filterStatus === 'all' || r.status === filterStatus
  );

  if (isLoading) {
    return (
      <div className="space-y-6 pb-12 max-w-7xl mx-auto px-4 md:px-8 pt-4">
        {/* Header Shimmer */}
        <div className="space-y-2 animate-pulse">
          <div className="h-6 bg-slate-800 rounded w-64" />
          <div className="h-3 bg-slate-800/60 rounded w-96" />
        </div>
        <TableSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto px-4 md:px-8 pt-4">
      <div>
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <h1 className="text-xl font-bold text-white tracking-tight">
            Moderation & Platform Governance
          </h1>
          <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/20">
            {reports.filter((r) => r.status === 'pending').length} Pending Cases
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Review user incident flags, audit security events, and manage disciplinary actions
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'reports'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Incident Reports ({reports.length})
          </button>
          <button
            onClick={() => setActiveTab('audit_logs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'audit_logs'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Security Audit Logs ({auditLogs.length})
          </button>
        </div>

        {activeTab === 'reports' && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-semibold">Filter:</span>
            {['all', 'pending', 'resolved', 'dismissed'].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-2.5 py-1 rounded-lg capitalize cursor-pointer ${
                  filterStatus === s
                    ? 'bg-slate-800 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Reports Queue */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {filteredReports.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-xs text-slate-500">
              No reports found in this view.
            </div>
          ) : (
            filteredReports.map((report) => (
              <div
                key={report.id}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        report.status === 'pending'
                          ? 'bg-amber-500/20 text-amber-400'
                          : report.status === 'resolved'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {report.status}
                    </span>
                    <span className="text-xs font-bold text-white">{report.targetTitle}</span>
                    <span className="text-[10px] text-slate-500 uppercase font-mono">
                      Target: {report.targetType}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-500 font-mono">
                    Reported by {report.reporterName}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs space-y-1">
                  <p className="font-semibold text-rose-300">Reason: {report.reason}</p>
                  <p className="text-slate-400">{report.details}</p>
                </div>

                {report.status === 'pending' && (
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/80">
                    <button
                      onClick={() => resolveReport(report.id, 'dismissed')}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Dismiss as False Positive</span>
                    </button>

                    <button
                      onClick={() => resolveReport(report.id, 'resolved')}
                      className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Take Action & Sanction Target</span>
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Security Audit Logs */}
      {activeTab === 'audit_logs' && (
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-[11px] uppercase font-bold text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Target</th>
                  <th className="py-3 px-4">Details</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono font-bold text-rose-400">{log.action}</td>
                    <td className="py-3 px-4 font-semibold text-white">{log.actorName}</td>
                    <td className="py-3 px-4 font-mono text-slate-400">{log.target}</td>
                    <td className="py-3 px-4 text-slate-300 max-w-xs truncate">{log.details}</td>
                    <td className="py-3 px-4 font-mono text-slate-500 tabular-nums">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
