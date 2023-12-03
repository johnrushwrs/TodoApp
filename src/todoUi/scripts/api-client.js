// api-client.js
class APIClient {
  authServiceRoot = "http://localhost:8000";
  serviceRoot = "http://localhost:8000/Todo";

  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async makeRequest(url, options, expectNoContent = false) {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        ...options.headers
      }
    });

    if (expectNoContent) {
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      return response;
    }

    const data = await response.json();
    if (!response.ok) {
      var bodyString = JSON.stringify(data);
      throw new Error(`Request failed with status ${response.status} and body ${bodyString}`);
    }

    return data;
  }

  async makeRequestNoAuthorization(url, options) {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers
      }
    });

    const data = await response.json();
    if (!response.ok) {
      var bodyString = JSON.stringify(data);
      throw new Error(`Request failed with status ${response.status} and body ${bodyString}`);
    }

    return data;
  }

  async register(username, email, password) {
    const url = `${this.authServiceRoot}/api/Authentication/register`
    const response = this.makeRequestNoAuthorization(
      url,
      {
        method: 'POST',
        body: JSON.stringify({ username: username, email: email, password: password }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

    return response;
  }

  async login(username, password) {
    const url = `${this.authServiceRoot}/api/Authentication/login`
    const response = this.makeRequestNoAuthorization(
      url,
      {
        method: 'POST',
        body: JSON.stringify({ username: username, password: password }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

    return response;
  }

  async getTodoLists() {
    const url = `${this.serviceRoot}/AllLists`
    const response = this.makeRequest(
      url,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      });

    return response;
  }

  async getListItems(listId) {
    const url = `${this.serviceRoot}/${listId}`
    const response = this.makeRequest(
      url,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      });

    return response;
  }

  async deleteTodoList(listId) {
    const url = `${this.serviceRoot}/${listId}`
    const response = this.makeRequest(
      url,
      {
        method: 'DELETE',
      }, true);

    return response;
  }

  async createTodoList(listName) {
    const url = `${this.serviceRoot}`;
    const response = this.makeRequest(
      url,
      {
        method: 'POST',
        body: JSON.stringify({ listName: listName, tasks: [] }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

    return response;
  }

  async updateTodoList(listId, tasks) {
    const url = `${this.serviceRoot}/${listId}`;
    const response = this.makeRequest(
      url,
      {
        method: 'PATCH',
        body: JSON.stringify({ id: listId, tasks: tasks }),
        headers: {
          'Content-Type': 'application/json'
        }
      },
      true);

    return response;
  }
}

export default APIClient;
