import cors from "@fastify/cors";
import Fastify from "fastify";

import * as adventOfCode from "./helpers/advent-of-code.js";
import * as codingBat from "./helpers/coding-bat.js";
import * as parse from "./helpers/parse.js";
import * as projectEuler from "./helpers/project-euler.js";
import * as reddit from "./helpers/reddit.js";

interface PuzzleQuerystring {
  id?: string;
}

interface PuzzleParams {
  kind?: string;
}

interface PuzzleResponse {
  status: number;
  id: number | string;
  problem: string;
}

export const buildServer = async () => {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(cors, {
    // TODO(michaelfromyeg): restrict if production
    origin: true,
  });

  fastify.get("/health", async (request, reply) => {
    return { status: "up" };
  });

  fastify.get<{
    Querystring: PuzzleQuerystring;
    Params: PuzzleParams;
  }>("/puzzle/:kind", async (request, reply) => {
    const { kind } = request.params;
    const { id } = request.query;

    request.log.info({ kind, id }, "Fetching puzzle");

    let response: PuzzleResponse;
    try {
      switch (kind) {
        case "reddit":
          response = await reddit.getQuestion(id);
          break;
        case "projectEuler":
          response = await projectEuler.getQuestion(id);
          break;
        case "codingBat":
          response = await codingBat.getQuestion(id);
          break;
        case "adventOfCode":
          response = await adventOfCode.getQuestion(id);
          break;
        default:
          return reply
            .code(400)
            .send(new Error(`${kind} is not a valid problem type`));
      }

      if (!response?.problem || response.problem === "") {
        request.log.warn({ kind, id }, "No data received for request");
        return reply
          .code(404)
          .send(new Error("Problem not found or may have been deleted"));
      }

      const problem = parse.render(response.problem);

      return {
        source: kind,
        id: response.id,
        problem,
      };
    } catch (err) {
      request.log.error({ err, kind, id }, "Error processing puzzle request");
      return reply
        .code(500)
        .send(new Error("An error occurred while processing your request"));
    }
  });

  return fastify;
};

const isMainModule = import.meta.url === `file://${process.argv[1]}`;

if (isMainModule) {
  const start = async () => {
    try {
      const app = await buildServer();
      const port = parseInt(process.env.PORT || "8000", 10);
      const host = process.env.HOST || "0.0.0.0";

      await app.listen({ port, host });
      console.log(`Server listening at ${host}:${port}`);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  };

  start();
}
