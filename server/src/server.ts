import express, { Application, Request, Response, NextFunction } from 'express';
import bodyParser from "body-parser";
import * as controllers from "./controllers/controllers"

const app: Application = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
  res.send('The sedulous hyena ate the antelope!');
});

app.post('/problem', async (req: Request, res: Response, next: NextFunction) => {
  switch (req.body.source) {
    case "r/dailyprogrammer":
      res.send(await controllers.reddit())
      break;
    case "leetcode":
      res.send(controllers.leetcode())
      break;
    case "codingbat":
      res.send(controllers.codingbat())
      break;
    default:
      throw new Error("Invalid problem source given");
  }
})

app.listen(port, err => {
  if (err) {
    return console.error(err);
  }
  return console.log(`server is listening on ${port}`);
});