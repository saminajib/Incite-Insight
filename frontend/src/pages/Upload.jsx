import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  DollarSign, 
  FileSpreadsheet, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Trash2,
  ArrowRight,
  Sparkles,
  Eye,
  Loader2
} from 'lucide-react';

const API_URL_UPLOAD = 'http://localhost:3000/upload';
const API_URL_GEMINI = 'http://localhost:3000/Gemini';

const TransactionUploadPage = () => {
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [csvFile, setCsvFile] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [transactionCount, setTransactionCount] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileValidation(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileValidation(e.target.files[0]);
    }
  };

  const handleFileValidation = (file) => {
    setError(null);
    
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit');
      return;
    }
    
    setCsvFile(file);
    parseCSVPreview(file);
  };

  const parseCSVPreview = (file) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length === 0) {
        setError('CSV file is empty');
        return;
      }
      
      const headers = lines[0].split(',').map(h => h.trim());
      const dataRows = lines.slice(1, Math.min(11, lines.length));
      
      const preview = dataRows.map(line => {
        const values = line.split(',').map(v => v.trim());
        return {
          Date: values[0] || '',
          Category: values[1] || '',
          Amount: values[2] || ''
        };
      });
      
      setPreviewData(preview);
      setTransactionCount(lines.length - 1);
    };
    
    reader.onerror = () => {
      setError('Failed to read CSV file');
    };
    
    reader.readAsText(file);
  };

  const removeFile = () => {
    setCsvFile(null);
    setPreviewData(null);
    setTransactionCount(0);
    setError(null);
  };

  const handleProcessData = async () => {
    if (!monthlyIncome || parseFloat(monthlyIncome) <= 0) {
      setError('Please enter your monthly income');
      return;
    }
    
    if (!csvFile) {
      setError('Please upload a CSV file');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', csvFile);
      formData.append('monthlyIncome', monthlyIncome);
      
      setLoadingMessage('Uploading...');
      
      const response = await fetch(API_URL_UPLOAD, {
        method: 'POST',
        body: formData
      });

      const response_ai = await fetch(API_URL_GEMINI, {
        method: 'POST',
        body: formData
      })
      
      setLoadingMessage('Processing transactions...');
      
      if (!response.ok) {
        throw new Error('Failed to process data. Please try again.');
      }
      
      setLoadingMessage('Generating insights...');
      
      const jsonResponse = await response.json();
      const jsonResponse_ai = await response_ai.json();
      
      sessionStorage.setItem('financialData', JSON.stringify(jsonResponse));
      sessionStorage.setItem('monthlyIncome', monthlyIncome);
      sessionStorage.setItem('transactionCount', transactionCount.toString());
      sessionStorage.setItem('uploadTime', new Date().toISOString());
      sessionStorage.setItem('ai', JSON.stringify(jsonResponse_ai));
      
      setSuccess(true);
      setIsLoading(false);
      
    } catch (err) {
      setError(err.message || 'Failed to process data. Please try again.');
      setIsLoading(false);
    }
  };

  const handleUploadAgain = () => {
    setMonthlyIncome('');
    setCsvFile(null);
    setPreviewData(null);
    setTransactionCount(0);
    setError(null);
    setSuccess(false);
    
    sessionStorage.removeItem('financialData');
    sessionStorage.removeItem('monthlyIncome');
    sessionStorage.removeItem('transactionCount');
    sessionStorage.removeItem('uploadTime');
  };

  const handleGoToDashboard = () => {
    window.location.href = '/dashboard';
  };

  const canProcess = monthlyIncome && parseFloat(monthlyIncome) > 0 && csvFile && !isLoading;

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-slate-300">Import your data</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-100">Upload Transactions</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Upload your transaction data and enter your monthly income to get personalized financial insights
          </p>
        </div>

        {error && (
          <Alert className="border-red-500/50 bg-red-500/10 backdrop-blur-sm">
            <XCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-200">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-emerald-500/50 bg-emerald-500/10 backdrop-blur-sm">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <AlertDescription className="text-emerald-200">
              Successfully processed {transactionCount} transactions! Your insights are ready.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-cyan-400" />
                <span className="text-white">Monthly Income</span>
                <span className="text-red-400 text-sm">*</span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Enter your total monthly income
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <span className="absolute left-3 top-3 text-slate-400 text-lg">$</span>
                <Input
                  type="number"
                  placeholder="e.g., 5000"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(e.target.value)}
                  disabled={success}
                  className="pl-8 h-12 bg-slate-800/50 border-slate-700 text-white text-lg placeholder:text-slate-500 focus:border-cyan-500"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-cyan-400" />
                <span className='text-white'>Required Format</span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Your CSV must have these exact column names
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span className="text-slate-300 font-medium">Date</span>
                  <span className="text-slate-500 text-xs">(e.g., 2025-10-24)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span className="text-slate-300 font-medium">Category</span>
                  <span className="text-slate-500 text-xs">(e.g., Food)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span className="text-slate-300 font-medium">Amount</span>
                  <span className="text-slate-500 text-xs">(e.g., 127.45)</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-4">
                ⚠️ Column names must match exactly (case-sensitive)
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
          <CardContent className="p-6">
            {!csvFile ? (
              <div
                className={`relative border-2 border-dashed rounded-xl transition-all ${
                  dragActive 
                    ? 'border-cyan-500 bg-cyan-500/10' 
                    : 'border-slate-700 hover:border-slate-600'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="p-12 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center">
                    <Upload className="w-8 h-8 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-slate-200 mb-2">
                      Drop your CSV file here or click to browse
                    </p>
                    <p className="text-sm text-slate-400">
                      Maximum file size: 10MB
                    </p>
                  </div>
                  <div>
                    <input
                      type="file"
                      id="file-upload"
                      accept=".csv"
                      onChange={handleChange}
                      disabled={success}
                      className="hidden"
                    />
                    <label htmlFor="file-upload">
                      <Button 
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white cursor-pointer"
                        disabled={success}
                        onClick={() => document.getElementById('file-upload').click()}
                      >
                        Select File
                      </Button>
                    </label>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-700">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileSpreadsheet className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-200 truncate">{csvFile.name}</p>
                    <p className="text-sm text-slate-400">
                      {(csvFile.size / 1024).toFixed(2)} KB • {transactionCount} transactions
                    </p>
                  </div>
                  {!success && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={removeFile}
                      className="text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {previewData && previewData.length > 0 && !success && (
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Eye className="w-5 h-5 text-cyan-400" />
                    Data Preview
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-400">
                    Review your data before processing
                  </CardDescription>
                </div>
                <div className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-medium">
                  {transactionCount} transactions
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Date</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Category</th>
                      <th className="text-right py-3 px-4 text-slate-400 font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, idx) => (
                      <tr key={idx} className="border-b border-slate-800 hover:bg-slate-800/30">
                        <td className="py-3 px-4 text-slate-300">{row.Date}</td>
                        <td className="py-3 px-4 text-slate-300">{row.Category}</td>
                        <td className="py-3 px-4 text-right text-slate-300">${row.Amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {previewData.length < transactionCount && (
                <p className="text-xs text-slate-500 text-center mt-3">
                  Showing first {previewData.length} of {transactionCount} transactions
                </p>
              )}
            </CardContent>
          </Card>
        )}

        <div className="flex gap-4">
          {!success ? (
            <Button
              className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!canProcess}
              onClick={handleProcessData}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {loadingMessage}
                </>
              ) : (
                <>
                  Process Data
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          ) : (
            <>
              <Button
                className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-lg"
                onClick={handleGoToDashboard}
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                className="h-12 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                onClick={handleUploadAgain}
              >
                Upload Again
              </Button>
            </>
          )}
        </div>

        <div className="text-center">
          <p className="text-xs text-slate-500 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-3 h-3" />
            Your data is encrypted and secure. We never share your financial information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransactionUploadPage;