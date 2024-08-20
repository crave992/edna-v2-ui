import https from 'https';
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

export function getApiRequestOptions(token: unknown) {
  return {
    headers: {
      'Content-Type': 'application/json',
      Accept: '*/*',
      clientId: `${process.env.NEXT_PUBLIC_API_CLIENT_ID}`,
      Authorization: `Bearer ${token}`,
    },
  };
}

export function postApiRequestOptions(token: unknown) {
  return {
    headers: {
      'Content-Type': 'application/json-patch+json',
      Accept: 'application/json',
      clientId: `${process.env.NEXT_PUBLIC_API_CLIENT_ID}`,
      Authorization: `Bearer ${token}`,
    },
  };
}

export function postApiRequestOptionsFormData(token: unknown) {
  return {
    headers: {
      clientId: `${process.env.NEXT_PUBLIC_API_CLIENT_ID}`,
      Authorization: `Bearer ${token}`,
    },
  };
}

export function postApiRequestOptionsFormDataJSON(token: unknown) {
  return {
    headers: {
      clientId: `${process.env.NEXT_PUBLIC_API_CLIENT_ID}`,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
}

export function delApiRequestOptions(token: unknown) {
  return {
    headers: {
      clientId: `${process.env.NEXT_PUBLIC_API_CLIENT_ID}`,
      Authorization: `Bearer ${token}`,
      Accept: '*/*',
    },
  };
}

export function postApiRequestOptionsForFile(token: unknown) {
  return {
    headers: {
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json',
      clientId: `${process.env.NEXT_PUBLIC_API_CLIENT_ID}`,
      Authorization: `Bearer ${token}`,
    },
  };
}

export function getApiRequestNoAuthOptions() {
  return {
    headers: {
      clientId: `${process.env.NEXT_PUBLIC_API_CLIENT_ID}`,
    },
  };
}

export function postApiRequestNoAuthOptions() {
  return {
    headers: {
      clientId: `${process.env.NEXT_PUBLIC_API_CLIENT_ID}`,
      'Content-Type': 'application/json-patch+json',
    },
  };
}

export function postApiRequestNoAuthOptionsFormDataJSON() {
  return {
    headers: {
      clientId: `${process.env.NEXT_PUBLIC_API_CLIENT_ID}`,
      'Content-Type': 'application/json',
    },
  };
}

export function postApiRequestNoAuthOptionsFormData() {
  return {
    headers: {
      clientId: `${process.env.NEXT_PUBLIC_API_CLIENT_ID}`,
    },
  };
}

export function delApiRequestNoAuthOptions() {
  return {
    headers: {
      clientId: `${process.env.NEXT_PUBLIC_API_CLIENT_ID}`,
      Accept: '*/*',
    },
  };
}