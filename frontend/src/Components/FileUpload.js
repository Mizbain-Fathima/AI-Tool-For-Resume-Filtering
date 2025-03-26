import React from 'react';

const FileUpload = ({ setResumes }) => {
  const handleChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setResumes(Array.from(event.target.files));
    }
  };

  return (
    <div className="file-upload-container">
      <label htmlFor="resume-upload" className="file-upload-label">
        <span role="img" aria-label="upload">📁</span>
        Choose Resumes (PDF/DOCX)
        <input
          id="resume-upload"
          type="file"
          multiple
          onChange={handleChange}
          accept=".pdf,.docx"
          className="file-input"
        />
      </label>
    </div>
  );
};

export default FileUpload;