const express = require("express");
const app = express();
const port = 3001;

const USERS = [
  { email: "test@test.com", password: "password" },
  { email: "user@example.com", password: "123456" },
];

const ADMIN = [
  {
    email: "admin",
    password: "secret",
  },
];

const QUESTIONS = [
  {
    questionId: 1,
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "5",
      },
    ],
  },
];

const SUBMISSION = [
  {
    problemId: 1,
    userId: 1,
    code: "function add(a, b) { return a + b; }",
    status: "accepted",
  },
  {
    problemId: 1,
    userId: 2,
    code: "function add(a, b) { return a - b; }",
    status: "rejected",
  },
  {
    problemId: 2,
    userId: 1,
    code: "function multiply(a, b) { return a * b; }",
    status: "accepted",
  },
];

app.post("/signup", function (req, res) {
  // Add logic to decode body
  const { email, password } = req.body;

  // body should have email and password
  const existingUser = USERS.find((user) => user.email === email);
  if (existingUser) {
    return res.status(409).json({ error: "User with email already exist" });
  }

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  USERS.push({ email, password });

  // return back 200 status code to the client
  return res.status(200).json({ message: "User created" });
});

app.post("/login", function (req, res) {
  // Add logic to decode body
  const { email, password } = req.body;

  // body should have email and password
  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  // If the password is not the same, return back 401 status code to the client

  const user = USERS.find(
    (user) => user.email == email && user.password == password
  );
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  const token = "random_toke_string";
  return res.status(200).json({ token });
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  return res.status(200).json({ question: QUESTIONS });
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  return res.status(200).json({ submission: SUBMISSION });
});

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  const { problemId, userId, code } = req.body;

  const status = Math.random() > 0.5 ? "accepted" : "rejected";

  const submission = { problemId, userId, code, status };
  SUBMISSION.push(submission);

  // Store the submission in the SUBMISSION array above
  return res.status(201).json({ submission });
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

function isAdmin(req, res, next) {
  const { email, password } = req.headers;

  const admin = ADMIN.find(
    (ad) => ad.email == email && ad.password == password
  );
  if (!admin) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  next();
}

app.post("/questions", isAdmin, function (req, res) {
  const { title, description, testCases } = req.body;

  const id = QUESTIONS.length + 1;

  const question = { id, title, description, testCases };

  QUESTIONS.push(question);

  return res.status(201).json({ question });
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
