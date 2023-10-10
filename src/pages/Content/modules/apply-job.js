export const SELECTORS = {
  loginButton: "//a/span[text()[contains(., 'Log in')]]",
  emailInput: '//input[@name="email"]',
  passwordInput: '//input[@name="password"]',
  loginSubmitButton: '//button[@type="submit"]',
  searchInput: '//input[@name="q"]',
  searchSubmitButton:
    '//form[contains(@action,"/jobs/search")]/*/button[@type="submit"][2]',
  firstJobQuickApplyButton: '//button[@data-testid="quick-apply-button"]',
};

const waitForElementToDisplay = (
  selector,
  checkFrequencyInMs = 400,
  timeoutInMs = 30000
) => {
  const startTimeInMs = Date.now();

  return new Promise((resolve) => {
    function loopSearch() {
      const element = getElementByXpath(selector);
      if (element) {
        resolve(element);
        return;
      } else {
        setTimeout(() => {
          if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs) {
            resolve(null);
            return;
          }
          loopSearch();
        }, checkFrequencyInMs);
      }
    }

    loopSearch();
  });
};

const simulateInput = async (inputElement, inputValue) => {
  if (!inputElement) {
    return;
  }

  const inputEvent = new Event('input', {
    bubbles: true,
    cancelable: true,
  });

  const changeEvent = new Event('change', {
    bubbles: true,
    cancelable: true,
  });

  inputElement.value = inputValue;
  inputElement.dispatchEvent(inputEvent);
  inputElement.dispatchEvent(changeEvent);
};

function getElementByXpath(path) {
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
}

// method to simulate click event
const simulateClick = (element) => {
  if (!element) {
    return;
  }

  const clickEvent = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  element.dispatchEvent(clickEvent);
};

export const clickButton = async (selector) => {
  const button = await waitForElementToDisplay(selector);

  if (!button) {
    return 'BUTTON_NOT_FOUND';
  }

  simulateClick(button);

  return true;
};

export const searchJob = async (formData) => {
  console.log('searchJob called');
  const searchInput = await waitForElementToDisplay(SELECTORS.searchInput);
  if (!searchInput) {
    return 'SEARCH_INPUT_NOT_FOUND';
  }

  simulateInput(searchInput, formData.jobTitleToSearch);

  const searchSubmitButton = await waitForElementToDisplay(
    SELECTORS.searchSubmitButton
  );

  simulateClick(searchSubmitButton);

  return true;
};

export const loginUser = async (formData) => {
  try {
    console.log('=====> loginUser called');

    const emailInput = await waitForElementToDisplay(SELECTORS.emailInput);

    if (!emailInput) {
      return 'EMAIL_INPUT_NOT_FOUND';
    }

    simulateInput(emailInput, formData.email);

    const passwordInput = await waitForElementToDisplay(
      SELECTORS.passwordInput
    );

    simulateInput(passwordInput, formData.password);

    const loginSubmitButton = await waitForElementToDisplay(
      SELECTORS.loginSubmitButton
    );

    console.log('Login done');
    simulateClick(loginSubmitButton);
    return true;
  } catch (error) {
    console.error('Error in loginUser:', error);
    return 'Exception ' + error;
  }
};
