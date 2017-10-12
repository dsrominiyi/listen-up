import request from 'request-promise';

class ApiClient {

  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async get(endpoint, params) {
    const url = `${this.baseUrl}${endpoint}`;

    return await request({
      url,
      method: 'GET',
      headers: {
        Accept: 'application/json'
      },
      qs: params || {},
      json: true
    });
  }

  async post(endpoint, body) {
    const url = `${this.baseUrl}${endpoint}`;

    return await request({
      url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body,
      json: true
    });
  }

  async delete(endpoint, params) {
    const url = `${this.baseUrl}${endpoint}`;

    return await request({
      url,
      method: 'DELETE',
      headers: {
        Accept: 'application/json'
      },
      qs: params || {},
      json: true
    });
  }
}

export default ApiClient;