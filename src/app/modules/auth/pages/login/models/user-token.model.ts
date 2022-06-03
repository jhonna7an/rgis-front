export interface UserToken {
  id: number;
  badgeId: string;
  profileFile: string;
  countryId: number;
  token: Token;
}

export interface Token {
  accessToken: string;
  expiresIn: number;
  tokenType: string;
  scope: string;
}
