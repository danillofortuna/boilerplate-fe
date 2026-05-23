'use client';

import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface VersionInfo {
    version: string;
    buildDate: string;
    branch: string;
}

export default function ApiDebugPage() {
    const [hostname, setHostname] = useState<string>('');
    const [healthStatus, setHealthStatus] = useState<string>('Checking...');
    const [backendVersion, setBackendVersion] = useState<VersionInfo | null>(null);
    const [backendError, setBackendError] = useState<string | null>(null);
    const [windowLocation, setWindowLocation] = useState<any>(null);

    useEffect(() => {
        setHostname(window.location.hostname);

        setWindowLocation({
            href: window.location.href,
            hostname: window.location.hostname,
            protocol: window.location.protocol,
            port: window.location.port
        });

        // Testa conexão com o backend
        fetch(`${API_URL}/actuator/health`)
            .then(res => res.json())
            .then(data => {
                setHealthStatus(`✅ Backend is ${data.status || 'Unknown'}`);
            })
            .catch(err => {
                setHealthStatus(`❌ Failed to connect: ${err.message}`);
            });

        // Busca versão do backend
        fetch(`${API_URL}/v1/version`)
            .then(res => res.json())
            .then(data => {
                setBackendVersion(data);
            })
            .catch(err => {
                setBackendError(err.message);
            });
    }, []);

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-6xl mx-auto">
                {/* API Configuration Debug */}
                <div className="bg-white dark:bg-card rounded-lg shadow-lg p-6">
                    <h1 className="text-3xl font-bold mb-8 text-center">🔧 API Configuration Debug</h1>

                    {/* Build Version Section - Backend */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 text-green-900 dark:text-green-300 border-b border-green-200 dark:border-green-700 pb-2">
                            ⚙️ Backend Build Version
                        </h2>

                        {backendError ? (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-700">
                                <p className="text-sm text-red-800 dark:text-red-300">
                                    ❌ Error loading backend version: {backendError}
                                </p>
                            </div>
                        ) : backendVersion ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Version:</h3>
                                    <p className="font-mono bg-gray-50 dark:bg-muted p-3 rounded text-sm font-bold border">
                                        {backendVersion.version}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Build Date:</h3>
                                    <p className="font-mono bg-gray-50 dark:bg-muted p-3 rounded text-sm border">
                                        {backendVersion.buildDate}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Branch:</h3>
                                    <p className="font-mono bg-gray-50 dark:bg-muted p-3 rounded text-sm border">
                                        {backendVersion.branch}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400 italic">Loading backend version...</p>
                        )}
                    </div>

                    {/* API Debug Information Section */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 text-blue-900 dark:text-blue-300 border-b border-blue-200 dark:border-blue-700 pb-2">
                            🔍 API Debug Information
                        </h2>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Current Hostname:</h3>
                                    <p className="font-mono bg-gray-50 dark:bg-muted p-3 rounded border">{hostname || 'Loading...'}</p>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Detected API URL:</h3>
                                    <p className="font-mono bg-gray-50 dark:bg-muted p-3 rounded border">{API_URL}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Backend Health:</h3>
                                <p className="font-mono bg-gray-50 dark:bg-muted p-3 rounded border">{healthStatus}</p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Window Location:</h3>
                                <pre className="font-mono bg-gray-50 dark:bg-muted p-3 rounded text-sm border overflow-x-auto">
                                    {windowLocation ? JSON.stringify(windowLocation, null, 2) : 'Loading...'}
                                </pre>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-700">
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                            ℹ️ Esta página mostra informações de debug da API.
                            Em localhost, deve apontar para http://localhost:8080
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
