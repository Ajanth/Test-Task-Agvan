import { SELECTORS } from '../Content/modules/apply-job';

const ACTION = {
  APPLY_RANDOM_JOB_ACTION: 'APPLY_RANDOM_JOB_ACTION',
  LOGIN_USER_ACTION: 'LOGIN_USER_ACTION',
  CLICK_BUTTON_ACTION: 'CLICK_BUTTON_ACTION',
  SEARCH_JOB_ACTION: 'SEARCH_JOB_ACTION',
};

let formData = {};
const searchUrl =
  'https://www.monster.com/jobs/search?q=Software+Engineer&where=&page=1';

/**
 * Receives command messages from popup or content scripts
 */
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log(`BG: message received : ${JSON.stringify(message)}`);
  switch (message.action) {
    case ACTION.APPLY_RANDOM_JOB_ACTION:
      applyRandomJob(message.data).then((data) => sendResponse(data));
      return true;
  }
});

const applyRandomJob = async (data) => {
  formData = data.formData;
  await openBaseUrlAndClickLogin(formData);
  await loginUser(formData);
  console.log('BG: applyRandomJob  login done');

  searchJobAndClick();
  return true;
};

const searchJobAndClick = async () => {
  await new Promise((resolve) => setTimeout(resolve, 6000));
  await searchJob(formData);
  console.log('BG: applyRandomJob  search done');
  await new Promise((resolve) => setTimeout(resolve, 6000));
  await clickFirstJob();
  console.log('BG: applyRandomJob  click done');
};

const clickFirstJob = async () => {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ currentWindow: true, active: true }, (tabArray) => {
      const activeTab = tabArray[0];
      chrome.runtime.lastError = undefined;
      if (activeTab.id) {
        checkElementPresence(
          activeTab.id,
          SELECTORS.firstJobQuickApplyButton
        ).then((_) => {
          chrome.tabs.sendMessage(
            activeTab.id,
            {
              action: ACTION.CLICK_BUTTON_ACTION,
              data: {
                selector: SELECTORS.firstJobQuickApplyButton,
              },
            },
            async (response) => {
              console.log(`BG: clickFirstJob ${JSON.stringify(response)}`);
              resolve(response);
            }
          );
        });
      }
    });
  });
};

const checkElementPresence = (tabId, selector) => {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    const interval = setInterval(() => {
      // Increase the attempts counter
      attempts++;
      // Check for the element's presence in the DOM
      chrome.scripting.executeScript(
        {
          target: { tabId },
          function: (path) => {
            try {
              // Using the evaluate method from the document object to retrieve the node using XPath
              let result = document.evaluate(
                path,
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
              );
              return result.singleNodeValue; // This returns the first node matching the XPath or null if none match.
            } catch (e) {
              console.error(
                'Invalid XPath or an error occurred while fetching the element:',
                e
              );
              return null;
            }
          },
          args: [selector],
        },
        ([result] = []) => {
          if (chrome.runtime.lastError) {
            clearInterval(interval);
            reject(chrome.runtime.lastError);
          } else if (result.result) {
            // If the element is found
            clearInterval(interval);
            resolve(true);
          } else if (attempts >= 15) {
            // If 15 attempts (i.e., 15 seconds) have passed
            clearInterval(interval);
            resolve(false);
          }
        }
      );
    }, 1000); // Check every second
  });
};

const searchJob = async (formData) => {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ currentWindow: true, active: true }, (tabArray) => {
      const activeTab = tabArray[0];
      chrome.runtime.lastError = undefined;
      if (activeTab.id) {
        checkElementPresence(activeTab.id, SELECTORS.searchInput).then((_) => {
          chrome.tabs.sendMessage(
            activeTab.id,
            {
              action: ACTION.SEARCH_JOB_ACTION,
              data: {
                jobTitleToSearch: formData.jobTitleToSearch,
              },
            },
            async (response) => {
              console.log(`BG: searchJob ${JSON.stringify(response)}`);
              resolve(response);
            }
          );
        });
      }
    });
  });
};

const loginUser = async (formData) => {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ currentWindow: true, active: true }, (tabArray) => {
      const activeTab = tabArray[0];
      chrome.runtime.lastError = undefined;
      if (activeTab.id) {
        checkElementPresence(activeTab.id, SELECTORS.loginSubmitButton).then(
          (_) => {
            chrome.tabs.sendMessage(
              activeTab.id,
              {
                action: ACTION.LOGIN_USER_ACTION,
                data: {
                  email: formData.email,
                  password: formData.password,
                },
              },
              async (response) => {
                console.log(`BG: loginUser ${JSON.stringify(response)}`);
                resolve(response);
              }
            );
          }
        );
      }
    });
  });
};

const openBaseUrlAndClickLogin = (formData) => {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ currentWindow: true, active: true }, (tabArray) => {
      const activeTab = tabArray[0];
      chrome.runtime.lastError = undefined;
      if (activeTab.id) {
        chrome.tabs.update(activeTab.id || 0, { url: formData.baseUrl }, () => {
          checkElementPresence(activeTab.id, SELECTORS.loginButton).then(
            (_) => {
              chrome.tabs.sendMessage(
                activeTab.id,
                {
                  action: ACTION.CLICK_BUTTON_ACTION,
                  data: {
                    selector: SELECTORS.loginButton,
                  },
                },
                async (response) => {
                  console.log(
                    `BG: openBaseUrlAndClickLogin ${JSON.stringify(response)}`
                  );
                  resolve(response);
                }
              );
            }
          );
        });
      }
    });
  });
};
