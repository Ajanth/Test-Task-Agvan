import { clickButton, loginUser, searchJob } from './modules/apply-job';

const CONTENT_ACTIONS = {
  APPLY_RANDOM_JOB_ACTION: 'APPLY_RANDOM_JOB_ACTION',
  CLICK_BUTTON_ACTION: 'CLICK_BUTTON_ACTION',
  LOGIN_USER_ACTION: 'LOGIN_USER_ACTION',
  SEARCH_JOB_ACTION: 'SEARCH_JOB_ACTION',
};

// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  console.log(`Content script received command: ${JSON.stringify(msg)}`);
  switch (msg.action) {
    case CONTENT_ACTIONS.APPLY_RANDOM_JOB_ACTION:
      sendResponse(applyJob(msg.data).then((data) => data));
      return true;
    case CONTENT_ACTIONS.CLICK_BUTTON_ACTION:
      sendResponse(clickButton(msg.data.selector).then((data) => data));
      return true;
    case CONTENT_ACTIONS.LOGIN_USER_ACTION:
      sendResponse(loginUser(msg.data).then((data) => data));
      return true;
    case CONTENT_ACTIONS.SEARCH_JOB_ACTION:
      sendResponse(searchJob(msg.data).then((data) => data));
      return true;
  }
});
