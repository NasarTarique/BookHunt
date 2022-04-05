const express = require("express");
const path  = require("path")
const axios = require("axios");

const mongoose = require("mongoose");
const Queries = require("./models/Queries");
const app = express();

const PORT = process.env.PORT || 5000;
const absolutepath = path.resolve("./client/build/")

const users = [];
app.use(express.json());
app.use(express.static('./client/build/'))

const dbUri =
  "mongodb://"+process.env.DBUSER+":"+process.env.DBPWD+"@cluster0-shard-00-00.2axax.mongodb.net:27017,cluster0-shard-00-01.2axax.mongodb.net:27017,cluster0-shard-00-02.2axax.mongodb.net:27017/bookhunt?ssl=true&replicaSet=atlas-js1uc9-shard-0&authSource=admin&retryWrites=true&w=majority";
mongoose
  .connect(dbUri)
  .then((result) => {
    console.log("connnected to a db");
    app.listen(PORT, () => console.log(`server started on port ${PORT}`));
  })
  .catch((err) => console.log(err));


app.get("/",(req,res)=>{
		res.sendFile(absolutepath+"/index.html")
})
app.get("/search",(req,res)=>{
		res.sendFile(absolutepath+"/index.html")
})
app.get("/detail/:id",(req,res)=>{
		res.sendFile(absolutepath+"/index.html")
})
async function checkUser(data) {
  const user = await Queries.findOne({ email: data.email });
  if (user) {
    await Queries.updateOne(
      { email: data.email },
      {
        token: data.token,
      }
    );
  }
  const newuser = new Queries({
    token: data.token,
    name: data.name,
    email: data.email,
  });
  newuser.save();
  return data;
}

// login users
app.post("/login", (req, res) => {
  console.log(req.body.token);
  const token = req.body.token;
  const CLIENT_ID =
    "459246397163-jtf744jqrab926pq1fiuek7c8fi8vjst.apps.googleusercontent.com";
  const { OAuth2Client } = require("google-auth-library");
  const client = new OAuth2Client(CLIENT_ID);
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const userid = payload["sub"];
    return {
      token: token,
      name: req.body.name,
      email: req.body.email,
      image: req.body.image,
    };
  }
  verify()
    .then((verifydata) => {
      checkUser(verifydata)
        .then((data) => {
          res.json({ token: data });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      res.status(500);
    });
});
const addQueries = async (data) => {
  console.log(data.token);
  console.log("SFDKJSD:");
  const user = await Queries.findOne({ token: data.token });
  if (user) {
    console.log("User exists");
    await Queries.updateOne(
      { token: data.token },
      {
        querylist: [...user.querylist, data.query],
      }
    );
    return { query: data.query };
  }
  return null;
};
// Search Books
app.post("/api/search", (req, res) => {
  const token = req.body.token;
  const query = req.body.query;
  addQueries({ query: query, token: token }).then((data) => {
    if (data) {
      const searchq = `https://www.googleapis.com/books/v1/volumes?q=${query}`;
      axios
        .get(searchq)
        .then((response) => {
          res.json({ items: response.data.items });
        })
        .catch((err) => {
          res.json({});
        });
    } else {
			res.status(401).send({error:"Not Authorised"});
    }
  });
});
const checkAuthorised = async (token) => {
  const q = await Queries.findOne({ token: token });
  if (q) {
    return true;
  }
  return false;
};
// Book Detail
app.get("/api/detail/:id", (req, res) => {
  const id = req.params.id;
  const token = req.get('authorization').split(" ")[1]
	console.log(token)
  checkAuthorised(token).then((data) => {
    if (data) {
      axios
        .get("https://www.googleapis.com/books/v1/volumes/" + id)
        .then((response) => {
          console.log(response.data);
          res.json({ item: response.data });
        })
        .catch((err) => {
          res.json({});
        });
    }
		  else
				  res.status(401).send({error:"Not Authenticated"})
  });
});
