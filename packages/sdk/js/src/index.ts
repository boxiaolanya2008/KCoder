export * from "./client.js"
export * from "./server.js"

import { createKcoderClient } from "./client.js"
import { createKCoderServer } from "./server.js"
import type { ServerOptions } from "./server.js"

export async function createKCoder(options?: ServerOptions) {
  const server = await createKCoderServer({
    ...options,
  })

  const client = createKcoderClient({
    baseUrl: server.url,
  })

  return {
    client,
    server,
  }
}
