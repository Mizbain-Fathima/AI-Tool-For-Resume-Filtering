import React from 'react';

const ResumeList = ({ resumes }) => {
  console.log('Rendering resumes:', resumes); // Debug log
  
  if (!resumes || resumes.length === 0) {
    return <div className="no-resumes">No ranked resumes to display</div>;
  }

  return (
    <div className="resume-list">
      <h2>Ranked Resumes ({resumes.length})</h2>
      <div className="resume-grid">
        {resumes.map((resume, index) => (
          <div key={index} className="resume-card">
            <h3>{resume.originalName}</h3>
            <p>Score: {resume.score}/100</p>
            <p>Skills: {resume.skills?.join(', ')}</p>
            <p>Experience: {resume.experience}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResumeList;