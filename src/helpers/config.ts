const env = {
  GOOGLE_CLIENT_ID: import.meta.env.VITE_APP_GOOGLE_CLIENT_ID,
  ACCOUNT_URL: import.meta.env.VITE_APP_ACCOUNT_URL,
  DRAWING_URL: import.meta.env.VITE_APP_DRAWING_URL,
  GAME_URL: import.meta.env.VITE_APP_GAME_URL
};

const checkConfig = (config: typeof env) => {
  const missingKeys = Object.keys(config).filter(
    (key) => config[key as keyof typeof config] === undefined
  );
  if (missingKeys.length > 0) {
    throw new Error(
      missingKeys
        .join(', ')
        .concat(` config ${missingKeys.length > 1 ? 'properties are' : 'property is'} missing`)
    );
  }
  return config;
};

const checkedConfig = checkConfig(env);

export const config = checkedConfig;
