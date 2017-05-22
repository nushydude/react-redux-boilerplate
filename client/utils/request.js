export function ValidateResponse(res) {
  if (res.status >= 200 && res.status < 300) {
    return res;
  }
  throw new Error(`Server responded with status code ${res.status}`);
}

export function GetJson(res) {
  try {
    return res.json();
  } catch(e) {
    throw new Error('Error processing response data');
  }
}

export function GetToken(res) {
  try {
    return res.headers.get('x-auth')
  } catch(e) {
    throw new Error('Error extracting authentication token');
  }
}
