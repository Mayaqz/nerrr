import express from "express";
import fs from "fs";
import cors from "cors";
import getRandomCat from "random-cat-img";
const PORT = 8080;

let responsive = "";
getRandomCat().then((data) => {
  responsive = data;
});
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (request, response) => {
  response.send(responsive);
});
app.get("/users", (req, res) => {
  fs.readFile("./newUser.json", "utf-8", (error, snBn) => {
    if (error) {
      res.json({ status: "zl" });
    } else {
      res.json(JSON.parse(snBn));
    }
  });
});

app.post("/users", function (req, res) {
  fs.readFile(process.cwd() + "/newUser.json", (readError, data) => {
    if (readError) {
      res.send({ status: "ZL" });
    }
    let fixedData = JSON.parse(data);
    let containsDupe = false;
    let filteredUsers = fixedData.filter((element) => {
      if (element.username !== req.body.username) {
        return element;
      } else {
        containsDupe = true;
      }
    });

    if (containsDupe === false) {
      fs.writeFile(
        process.cwd() + "/newUser.json",
        JSON.stringify([...filteredUsers, req.body]),
        (error) => {
          if (error) {
            res.status(404);
          } else {
            res.json([...filteredUsers, req.body]);
          }
        }
      );
    } else {
      fs.writeFile(
        process.cwd() + "/newUser.json",
        JSON.stringify(filteredUsers),
        (error) => {
          if (error) {
            res.status(404);
          } else {
            res.json(fixedData);
          }
        }
      );
    }
  });
});

app.delete("/users", (request, response) => {
  let body = request.body;

  fs.readFile("./newUser.json", "utf-8", (readError, data) => {
    if (readError) {
      response.json({
        status: "read file error",
      });
    } else {
      let deletedata = JSON.parse(data);
      let array = deletedata.filter((element) => {
        if (
          (element.username !== body.username) ^
          (element.password !== body.password)
        ) {
          return element;
        }
      });
      response.send(array);
      fs.writeFile("./newUser.json", JSON.stringify(array), (writeError) => {
        if (writeError) {
          response.json("269");
        } else {
          response.json({ status: "269", data: array });
        }
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
