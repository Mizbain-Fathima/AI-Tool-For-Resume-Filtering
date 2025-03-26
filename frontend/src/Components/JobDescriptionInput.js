import React from 'react';

const JobDescriptionInput = ({ value, onChange }) => {
  return (
    <div className="jd-container">
      <h3>Job Description</h3>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Paste job description here..."
        className="jd-textarea"
        rows={5}
      />
    </div>
  );
};

export default JobDescriptionInput;