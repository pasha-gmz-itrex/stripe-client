import {OAUTH_SERVER_URL} from "../constants/AppConstants";

export function getToken() {

  const headers = new Headers();
  headers.append("X-Device", "web/12.0");
  headers.append("Authorization", "Basic bWVldG1lOnNlY3JldA==");
  headers.append("Content-Type", "application/x-www-form-urlencoded");
  headers.append("Cookie", "COOK_INDICATOR=1; COOK_USERID=CzVSNAdlXWADMlc2BDUDOQ%3D%3D; PHPSESSID=b75f7d356fd01bdcba0ca131f2bb2796");

  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "urn:ietf:params:oauth:grant-type:token-exchange");
  urlencoded.append("subject_token", "b75f7d356fd01bdcba0ca131f2bb2796");
  urlencoded.append("subject_token_type", "urn:ietf:params:oauth:token-type:session");

  const requestOptions = {
    method: 'POST',
    headers: headers,
    body: urlencoded,
    redirect: 'follow'
  };

  return fetch(OAUTH_SERVER_URL + "/oauth/token", requestOptions)
    .then(response => response.json())
    .then((res) => {
      return res;
    })
}
