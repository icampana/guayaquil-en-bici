import { createClient } from "tinacms/dist/client";
import { queries } from "./types";
export const client = createClient({ url: 'http://localhost:4001/graphql', token: '10c4c0aeae024e0a65154ede1b37ba6ae2d579c6', queries,  });
export default client;
  