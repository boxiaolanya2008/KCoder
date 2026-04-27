declare global {
  const KCODER_VERSION: string
  const KCODER_CHANNEL: string
}

export const InstallationVersion = typeof KCODER_VERSION === "string" ? KCODER_VERSION : "local"
export const InstallationChannel = typeof KCODER_CHANNEL === "string" ? KCODER_CHANNEL : "local"
export const InstallationLocal = InstallationChannel === "local"
