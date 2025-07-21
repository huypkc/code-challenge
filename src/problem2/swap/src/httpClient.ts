import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
export const httpClient = axios.create(
  {
    baseURL: "https://api.switcheo.com/v2",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    timeout: 3000, // 10 seconds timeout
  }
);
const mock = new AxiosMockAdapter(httpClient);
mock.onPost("/swap")
  .withDelayInMs(2000)
  .reply(function (config) {
    const data = JSON.parse(config.data);
    if (data.sendAmount === '123') {
      return [
        400,
        {
          message: "Invalid send amount",
        },
      ];
    }
    return [
      200,
      data
    ];
  })
  .onAny()
  .withDelayInMs(2000)
  .passThrough();