import sinon from 'sinon';
import proxyquire from 'proxyquire';

const request = sinon.stub().resolves(true);
const module = proxyquire(
  '../../../src/services/ApiClient',
  {
    'request-promise': request
  }
);
const ApiClient = module.default;

describe('ApiClient', () => {

  let client;
  let baseUrl;
  let endpoint;

  beforeEach(() => {

    baseUrl = 'http://api.com';
    endpoint = '/contacts';

    client = new ApiClient(baseUrl);
  });

  it('should make a get request with the provided params',  async function() {

    const params = {
      rpp: 50,
      page: 2
    };

    await client.get(endpoint, params);

    expect(request).to.have.been.calledWith({
      url: `${baseUrl}${endpoint}`,
      method: 'GET',
      headers: {
        Accept: 'application/json'
      },
      qs: params,
      json: true
    });
  });

  it('should make a get request without params if none are provided',  async function() {

    await client.get(endpoint);

    expect(request).to.have.been.calledWith({
      url: `${baseUrl}${endpoint}`,
      method: 'GET',
      headers: {
        Accept: 'application/json'
      },
      qs: {},
      json: true
    });
  });

  it('should return the response of the get request',  async function() {

    const getResponse = { success: true };
    request.resolves(getResponse);

    const response = await client.get(endpoint);

    expect(response).to.equal(getResponse);
  });

  it('should make a post request with the provided body',  async function() {

    const body = {
      name: 'name',
      telephone: '0198729484'
    };

    await client.post(endpoint, body);

    expect(request).to.have.been.calledWith({
      url: `${baseUrl}${endpoint}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body,
      json: true
    });
  });

  it('should return the response of the post request',  async function() {

    const body = {
      name: 'name',
      telephone: '0198729484'
    };

    const postResponse = { success: true, item: body };
    request.resolves(postResponse);

    const response = await client.post(endpoint, body);

    expect(response).to.equal(postResponse);
  });

  it('should make a delete request with the provided params',  async function() {

    const params = {
      id: 3,
      version: 0
    };

    await client.delete(endpoint, params);

    expect(request).to.have.been.calledWith({
      url: `${baseUrl}${endpoint}`,
      method: 'DELETE',
      headers: {
        Accept: 'application/json'
      },
      qs: params,
      json: true
    });
  });

  it('should make a delete request without params if none are provided',  async function() {

    await client.delete(endpoint);

    expect(request).to.have.been.calledWith({
      url: `${baseUrl}${endpoint}`,
      method: 'DELETE',
      headers: {
        Accept: 'application/json'
      },
      qs: {},
      json: true
    });
  });

  it('should return the response of the delete request',  async function() {

    const deleteResponse = { success: true };
    request.resolves(deleteResponse);

    const response = await client.delete(endpoint);

    expect(response).to.equal(deleteResponse);
  });
});
