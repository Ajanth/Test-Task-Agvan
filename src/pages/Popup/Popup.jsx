import React from 'react';
import './Popup.css';

const Popup = () => {
  const APPLY_RANDOM_JOB_ACTION = 'APPLY_RANDOM_JOB_ACTION';
  const formData = {
    email: 'ancientwinterwolf@gmail.com',
    password: 'Test12345!',
    jobTitleToSearch: 'Software Engineer',
    resumePath: '/Users/ajanthkathirkamu/Downloads/resume.pdf',
    baseUrl: 'https://www.monster.com/',
  };

  const applyRandomJob = () => {
    console.log('applyRandomJob called');
    chrome.runtime.sendMessage(
      {
        action: APPLY_RANDOM_JOB_ACTION,
        data: {
          formData,
        },
      },
      (response) => {
        console.log('applyRandomJob response', response);
      }
    );
  };

  return (
    <div className="app">
      <p className="description">Click to automate your task</p>
      <button type="button" className="button" onClick={applyRandomJob}>
        Automate
      </button>
    </div>
  );
};

export default Popup;
