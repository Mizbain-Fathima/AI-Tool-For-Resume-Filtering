import React, { useState, useEffect } from 'react';
import FileUpload from './Components/FileUpload';
import JobDescriptionInput from './Components/JobDescriptionInput';
import ResumeList from './Components/ResumeList';
import './App.css';

function App() {
  const [resumes, setResumes] = useState([]);
  const [jobDescription, setJobDescription] = useState('');
  const [rankedResumes, setRankedResumes] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Ranked resumes updated:", rankedResumes);
  }, [rankedResumes]);

  const handleRankResumes = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const formData = new FormData();
      resumes.forEach(file => formData.append('resumes[]', file));
      formData.append('jobDescription', jobDescription);
  
      const response = await fetch('/api/process.php', {
        method: 'POST',
        body: formData,
      });
  
      const responseText = await response.text();
      
      try {
        const data = JSON.parse(responseText);
        
        if (!data.success) {
          throw new Error(data.error || 'Request failed');
        }
  
        setRankedResumes(data.data?.topCandidates || []);
      } catch (jsonError) {
        console.error('Failed to parse JSON:', responseText);
        throw new Error(`Server returned invalid response. Status: ${response.status}`);
      }
  
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="app-container">
      <header className="app-header">
        <h1><span className="gradient-text">AI Resume Ranker</span></h1>
        <p>Upload resumes or a folder to find the best candidates</p>
      </header>

      <div className="main-content">
        <div className="input-section">
          <FileUpload setResumes={setResumes} />
          
          <div className="folder-upload">
            <label htmlFor="folder-upload" className="folder-upload-label">
              📁 Upload Folder
              <input 
                id="folder-upload"
                type="file" 
                webkitdirectory="true"
                multiple 
                onChange={(e) => setResumes(prev => [...prev, ...Array.from(e.target.files)])}
                style={{ display: 'none' }}
              />
            </label>
          </div>
          
          <p className="file-count">
            {resumes.length} {resumes.length === 1 ? 'file' : 'files'} selected
          </p>
          
          <JobDescriptionInput value={jobDescription} onChange={setJobDescription} />
          
          <button
            className={`rank-button ${isProcessing ? 'processing' : ''}`}
            onClick={handleRankResumes}
            disabled={isProcessing || resumes.length === 0}
          >
            {isProcessing ? '🔄 Processing...' : '📊 Rank Resumes'}
          </button>
          
          {error && <div className="error-message">⚠️ {error}</div>}
        </div>

        {rankedResumes.length > 0 ? (
          <ResumeList resumes={rankedResumes} />
        ) : (
          <div className="no-results">
            {isProcessing ? '⌛ Processing resumes...' : 'No results to display'}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
