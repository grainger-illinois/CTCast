const Application = require("spectron").Application;
const electronPath = require("electron");
const path = require("path");

jest.useRealTimers();

let app;

// make sure that the electron app can start
beforeAll(() => {
  app = new Application({
    path: electronPath,

    args: [path.join(__dirname, "../../")]
  });

  return app.start();
}, 60000);

afterAll(function () {
  if (app && app.isRunning()) {
    return app.stop();
  }
});

// test to see if the app opens a new window
test("Displays App window", async function () {
    jest.setTimeout(30000);
    let windowCount = await app.client.getWindowCount();
  
    expect(windowCount).toBe(1);
  });