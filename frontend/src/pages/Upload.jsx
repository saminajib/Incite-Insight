import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  File, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Download,
  FileSpreadsheet,
  Trash2,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const CSVUploadPage = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error', 'processing'
  const [uploadProgress, setUploadProgress] = useState(0);

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
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    // Check if file has .csv extension (more lenient than MIME type check)
    if (file.name.toLowerCase().endsWith('.csv')) {
      setUploadedFile(file);
      processAndStoreFile(file);
    } else {
      setUploadStatus('error');
      setTimeout(() => setUploadStatus(null), 3000);
    }
  };

  const processAndStoreFile = async (file) => {
    setUploadStatus('processing');
    setUploadProgress(0);
    
    try {
      // Create FormData to send the file
      const formData = new FormData();
      formData.append('csv', file);
      
      // Simulate progress during upload
      setUploadProgress(30);
      
      // Make API request
      const response = await fetch('YOUR_API_ENDPOINT_HERE', {
        method: 'POST',
        body: formData,
        // Add headers if needed
        // headers: {
        //   'Authorization': 'Bearer YOUR_TOKEN'
        // }
      });
      
      setUploadProgress(70);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      // Get JSON response
      const jsonData = await response.json();
      
      setUploadProgress(90);
      
      // Store JSON response in sessionStorage
      sessionStorage.setItem('processedData', JSON.stringify(jsonData));
      sessionStorage.setItem('csvFileName', file.name);
      sessionStorage.setItem('uploadTime', new Date().toISOString());
      
      setUploadProgress(100);
      setUploadStatus('success');
      
    } catch (error) {
      console.error('Error processing file:', error);
      setUploadStatus('error');
      setTimeout(() => setUploadStatus(null), 3000);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setUploadStatus(null);
    setUploadProgress(0);
    
    // Clear sessionStorage
    sessionStorage.removeItem('processedData');
    sessionStorage.removeItem('csvFileName');
    sessionStorage.removeItem('uploadTime');
  };

  const sampleData = [
    { field: 'Date', example: '2025-10-24', required: true },
    { field: 'Description', example: 'Whole Foods Market', required: true },
    { field: 'Category', example: 'Food', required: true },
    { field: 'Amount', example: '127.45', required: true },
    { field: 'Payment Method', example: 'Credit Card', required: false }
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Container */}
      <div className="relative max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-slate-300">Import your financial data</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-100">Upload CSV File</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Upload your transaction data to get instant insights and visualization. 
            We support standard CSV formats from most banking institutions.
          </p>
        </div>

        {/* Status Alerts */}
        {uploadStatus === 'success' && (
          <Alert className="border-emerald-500/50 bg-emerald-500/10 backdrop-blur-sm">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <AlertDescription className="text-emerald-200">
              File uploaded successfully! Your data is ready to be processed.
            </AlertDescription>
          </Alert>
        )}

        {uploadStatus === 'error' && (
          <Alert className="border-red-500/50 bg-red-500/10 backdrop-blur-sm">
            <XCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-200">
              Invalid file type. Please upload a CSV file.
            </AlertDescription>
          </Alert>
        )}

        {/* Upload Area */}
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
          <CardContent className="p-8">
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
              {!uploadedFile ? (
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
                      className="hidden"
                    />
                    <label htmlFor="file-upload">
                      <Button 
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white cursor-pointer"
                        onClick={() => document.getElementById('file-upload').click()}
                      >
                        Select File
                      </Button>
                    </label>
                  </div>
                </div>
              ) : (
                <div className="p-8 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FileSpreadsheet className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-200 truncate">{uploadedFile.name}</p>
                      <p className="text-sm text-slate-400">
                        {(uploadedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={removeFile}
                      className="text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {uploadStatus === 'processing' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Uploading...</span>
                        <span className="text-cyan-400">{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2 bg-slate-800" />
                    </div>
                  )}

                  {uploadStatus === 'success' && (
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="text-sm font-medium">Upload complete</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {uploadedFile && (
              <div className="mt-6 flex gap-3">
                {uploadStatus === 'success' && (
                  <>
                    <Button 
                      className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                      onClick={() => {
                        // Navigate to dashboard or another page
                        window.location.href = '/dashboard';
                        // Or use React Router: navigate('/dashboard');
                      }}
                    >
                      Go to Dashboard
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                      onClick={removeFile}
                    >
                      Upload Another
                    </Button>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* CSV Format Guide */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <File className="w-5 h-5 text-cyan-400" />
                Required Format
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Your CSV should include these columns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sampleData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-700">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-slate-200">{item.field}</p>
                        {item.required && (
                          <span className="text-xs px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded-full">
                            Required
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">e.g., {item.example}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-cyan-400" />
                Tips & Guidelines
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Best practices for data upload
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-200">Use standard date format</p>
                    <p className="text-xs text-slate-400 mt-1">YYYY-MM-DD or MM/DD/YYYY</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-200">Remove currency symbols</p>
                    <p className="text-xs text-slate-400 mt-1">Use plain numbers for amounts</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-200">Include headers</p>
                    <p className="text-xs text-slate-400 mt-1">First row should contain column names</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-200">Keep it clean</p>
                    <p className="text-xs text-slate-400 mt-1">Remove empty rows and special characters</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Download Template */}
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl flex items-center justify-center">
                  <Download className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="font-medium text-slate-200">Need a template?</p>
                  <p className="text-sm text-slate-400">Download our sample CSV file to get started</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                Download Template
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Note */}
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

export default CSVUploadPage;