
const TokenKey = 'Token'

export function getToken() {
  let token = localStorage.getItem(TokenKey);
  if(!token){
    return ''
  };
  return token;
}

export function setToken(token) {
  return localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return localStorage.removeItem(TokenKey)
}
