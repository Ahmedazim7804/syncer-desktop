type AuthData = {
  serverUrl: string;
  token: Token;
}

interface Token {
  access_token: string;
  refresh_token: string;
}

export type { Token, AuthData };