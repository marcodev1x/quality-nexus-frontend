const EnvsVars = {
  API_URL: import.meta.env.VITE_API_URL,
  LIMIT_TESTS_PER_TEST_TYPE: import.meta.env.VITE_LIMITED_TESTS_PER_TEST_TYPE,
  NPS_MINIMAL_DEFAULT_LOGIN_QUANTITY: import.meta.env.VITE_NPS_MINIMAL_DEFAULT_LOGIN_QUANTITY,
  GROQ_API_KEY: import.meta.env.VITE_GROQ_API_KEY
};

export default EnvsVars;
