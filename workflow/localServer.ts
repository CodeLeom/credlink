import express from "express";

// simple shim that pretends to trigger the workflow and returns a fake txHash
const app = express();
app.use(express.json());

app.post("/trigger", (req, res) => {
  const { user } = req.body || {};
  if (!user) {
    return res.status(400).json({ error: "Missing user" });
  }
  console.log("workflow trigger called for", user);
  // respond with a fake transaction hash after small delay
  setTimeout(() => {
    res.json({ txHash: "0xdeadbeef" });
  }, 500);
});

const port = 3002;
app.listen(port, () => {
  console.log(`Workflow shim listening on port ${port}`);
});
