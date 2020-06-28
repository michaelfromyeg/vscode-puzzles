import express, { Application, Request, Response } from 'express';
import bodyParser from "body-parser";
import * as controllers from "./controllers/controllers"

const app: Application = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (_: Request, res: Response) => {
  res.send('The sedulous hyena ate the antelope!');
});

app.post('/problem', async (req: Request, res: Response) => {
  switch (req.body.source) {
    case "reddit":
      res.send(await controllers.reddit())
      break;
    case "projectEuler":
      res.send(await controllers.projectEuler())
      break;
    case "codingBat":
      res.send(await controllers.codingBat())
      break;
    default:
      throw new Error("Invalid problem source given");
  }
})

app.listen(port, err => {
  if (err) {
    return console.error(err);
  }
  return console.log('\x1b[36m%s\x1b[0m', `[vscode-puzzle] Listening on port ${port}.`);
});