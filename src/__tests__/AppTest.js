const Application = require("spectron").Application;
const electronPath = require("electron");
const path = require("path");

let app;

// make sure that the electron app can start
beforeAll(() => {
  app = new Application({
    path: electronPath,

    args: [path.join(__dirname, "../../")]
  });

  return app.start();
}, 30000);

afterAll(function () {
  if (app && app.isRunning()) {
    return app.stop();
  }
});

// test to see if the app opens a new window
test("Displays App window", async function () {
    let windowCount = await app.client.getWindowCount();
  
    expect(windowCount).toBe(1);
  });