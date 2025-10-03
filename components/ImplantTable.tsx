
import React from 'react';
import { Implant, ImplantStatus } from '../types';
import { StatusOnlineIcon, StatusOfflineIcon } from './icons';

interface ImplantTableProps {
  implants: Implant[];
  selectedImplantId: string | null;
  onSelectImplant: (id: string) => void;
  isLoading: boolean;
}

const ImplantTable: React.FC<ImplantTableProps> = ({ implants, selectedImplantId, onSelectImplant, isLoading }) => {
  const formatTimeAgo = (isoString: string) => {
      const date = new Date(isoString);
      const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
      let interval = seconds / 31536000;
      if (interval > 1) return Math.floor(interval) + " years ago";
      interval = seconds / 2592000;
      if (interval > 1) return Math.floor(interval) + " months ago";
      interval = seconds / 86400;
      if (interval > 1) return Math.floor(interval) + " days ago";
      interval = seconds / 3600;
      if (interval > 1) return Math.floor(interval) + " hours ago";
      interval = seconds / 60;
      if (interval > 1) return Math.floor(interval) + " minutes ago";
      return Math.floor(seconds) + " seconds ago";
  };

  return (
    <div className="bg-brand-surface border border-brand-border rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 border-b border-brand-border">
        <h2 className="text-lg font-semibold text-gray-100">Active Implants</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-brand-border">
          <thead className="bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-secondary uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-secondary uppercase tracking-wider">Hostname</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-secondary uppercase tracking-wider">IP Address</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-secondary uppercase tracking-wider">OS</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-secondary uppercase tracking-wider">Last Check-in</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-secondary uppercase tracking-wider">First Seen</th>
            </tr>
          </thead>
          <tbody className="bg-brand-surface divide-y divide-brand-border">
            {isLoading ? (
              <tr><td colSpan={6} className="text-center p-8 text-brand-secondary">Loading implants...</td></tr>
            ) : implants.map((implant) => (
              <tr
                key={implant.id}
                onClick={() => onSelectImplant(implant.id)}
                className={`cursor-pointer ${selectedImplantId === implant.id ? 'bg-brand-primary/10' : 'hover:bg-brand-border/20'}`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="flex items-center gap-2 text-sm font-medium">
                    {implant.status === ImplantStatus.Online ? <StatusOnlineIcon/> : <StatusOfflineIcon/>}
                    {implant.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{implant.hostname}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">{implant.ip}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{implant.os}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{formatTimeAgo(implant.lastCheckIn)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{formatTimeAgo(implant.firstSeen)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ImplantTable;
