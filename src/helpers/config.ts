const env = {
  GOOGLE_CLIENT_ID: import.meta.env.VITE_APP_GOOGLE_CLIENT_ID
}

const checkConfig = (config: typeof env) => {
  const missingKeys = Object.keys(config).filter(
    (key) => config[key as keyof typeof config] === undefined
  )
  if (missingKeys.length > 0) {
    throw new Error(
      missingKeys
        .join(', ')
        .concat(` config ${missingKeys.length > 1 ? 'properties are' : 'property is'} missing`)
    )
  }
  return config
}

const checkedConfig = checkConfig(env)

export const config = checkedConfig
