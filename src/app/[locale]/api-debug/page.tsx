'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Send, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Suspense } from 'react';

interface RequestHistory {
    id: string;
    method: string;
    url: string;
    status?: number;
    statusText?: string;
    response?: any;
    error?: string;
    timestamp: string;
}

function ApiDebugContent() {
    const [method, setMethod] = useState('GET');
    const [url, setUrl] = useState('/v1/users/me');
    const [body, setBody] = useState('');
    const [response, setResponse] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState<RequestHistory[]>([]);

    const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

    const addToHistory = (req: Omit<RequestHistory, 'id' | 'timestamp'>) => {
        const newEntry: RequestHistory = {
            ...req,
            id: Date.now().toString(),
            timestamp: new Date().toLocaleString('pt-BR'),
        };
        setHistory(prev => [newEntry, ...prev].slice(0, 10)); // Mantém apenas os últimos 10
    };

    const sendRequest = async () => {
        setLoading(true);
        setResponse(null);

        try {
            let result;
            const config = body ? { data: JSON.parse(body) } : undefined;

            switch (method) {
                case 'GET':
                    result = await api.get(url);
                    break;
                case 'POST':
                    result = await api.post(url, config?.data);
                    break;
                case 'PUT':
                    result = await api.put(url, config?.data);
                    break;
                case 'PATCH':
                    result = await api.patch(url, config?.data);
                    break;
                case 'DELETE':
                    result = await api.delete(url);
                    break;
            }

            if (result) {
                setResponse({
                    status: result.status,
                    statusText: result.statusText,
                    headers: result.headers,
                    data: result.data,
                });

                addToHistory({
                    method,
                    url,
                    status: result.status,
                    statusText: result.statusText,
                    response: result.data,
                });
            }
        } catch (error: any) {
            const errorResponse = {
                error: error.message,
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
            };
            setResponse(errorResponse);

            addToHistory({
                method,
                url,
                status: error.response?.status,
                statusText: error.response?.statusText,
                error: error.message,
                response: error.response?.data,
            });
        } finally {
            setLoading(false);
        }
    };

    const clearHistory = () => {
        setHistory([]);
    };

    const loadFromHistory = (item: RequestHistory) => {
        setMethod(item.method);
        setUrl(item.url);
        setResponse({
            status: item.status,
            statusText: item.statusText,
            data: item.response,
            error: item.error,
        });
    };

    return (
        <div className="min-h-screen bg-background p-8">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/">
                        <Button variant="ghost" size="sm" className="gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Voltar ao Início
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold">API Debug</h1>
                </div>
                <p className="text-muted-foreground">
                    Teste endpoints da API diretamente do navegador
                </p>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Request Panel */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Request</CardTitle>
                            <CardDescription>Configure e envie requisições para a API</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Method & URL */}
                            <div className="flex gap-2">
                                <select
                                    value={method}
                                    onChange={(e) => setMethod(e.target.value)}
                                    className="px-3 py-2 border rounded-md bg-background"
                                >
                                    {methods.map((m) => (
                                        <option key={m} value={m}>
                                            {m}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="/v1/endpoint"
                                    className="flex-1 px-3 py-2 border rounded-md bg-background"
                                />
                                <Button onClick={sendRequest} disabled={loading} className="gap-2">
                                    <Send className="w-4 h-4" />
                                    {loading ? 'Enviando...' : 'Enviar'}
                                </Button>
                            </div>

                            {/* Body */}
                            {['POST', 'PUT', 'PATCH'].includes(method) && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Body (JSON)</label>
                                    <textarea
                                        value={body}
                                        onChange={(e) => setBody(e.target.value)}
                                        placeholder='{\n  "key": "value"\n}'
                                        className="w-full min-h-[200px] px-3 py-2 font-mono text-sm border rounded-md bg-background"
                                    />
                                </div>
                            )}

                            {/* Quick Actions */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Quick Actions</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setMethod('GET');
                                            setUrl('/v1/users/me');
                                        }}
                                    >
                                        GET /users/me
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setMethod('GET');
                                            setUrl('/v1/users');
                                        }}
                                    >
                                        GET /users
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Response Panel */}
                    {response && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    Response
                                    {response.status && (
                                        <span
                                            className={`text-sm px-2 py-1 rounded ${response.status >= 200 && response.status < 300
                                                ? 'bg-green-500/20 text-green-500'
                                                : 'bg-red-500/20 text-red-500'
                                                }`}
                                        >
                                            {response.status} {response.statusText}
                                        </span>
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <pre className="bg-secondary p-4 rounded-md overflow-x-auto text-sm">
                                    {JSON.stringify(response.data || response, null, 2)}
                                </pre>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* History Panel */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>History</CardTitle>
                                    <CardDescription>Últimas 10 requisições</CardDescription>
                                </div>
                                {history.length > 0 && (
                                    <Button variant="ghost" size="sm" onClick={clearHistory}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            {history.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-8">
                                    Nenhuma requisição ainda
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {history.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => loadFromHistory(item)}
                                            className="w-full text-left p-3 rounded-md border hover:bg-accent transition-colors"
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-mono font-semibold">
                                                    {item.method}
                                                </span>
                                                <span
                                                    className={`text-xs px-1.5 py-0.5 rounded ${item.status && item.status >= 200 && item.status < 300
                                                        ? 'bg-green-500/20 text-green-500'
                                                        : 'bg-red-500/20 text-red-500'
                                                        }`}
                                                >
                                                    {item.status || 'ERR'}
                                                </span>
                                            </div>
                                            <p className="text-xs font-mono text-muted-foreground truncate">
                                                {item.url}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {item.timestamp}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Info Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Info</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-2">
                            <p className="text-muted-foreground">
                                Esta página permite testar endpoints da API diretamente.
                            </p>
                            <p className="text-muted-foreground">
                                Os cookies de autenticação são enviados automaticamente.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default function ApiDebugPage() {
    return (
        <Suspense fallback={<div>Loading…</div>}>
            <ApiDebugContent />
        </Suspense>
    );
}
