import cors from "@fastify/cors";
import rateLimit, { RateLimitOptions } from "@fastify/rate-limit";
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

export interface PuzzleResponse {
  status: number;
  id: number | string;
  problem: string;
  error?: string;
}

export const buildServer = async () => {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(cors, {
    // TODO(michaelfromyeg): restrict if production
    origin: true,
  });

  const rateLimitOptions: Record<string, RateLimitOptions> = {
    reddit: {
      max: 30,
      timeWindow: "1 hour",
    },
    adventOfCode: {
      max: 20,
      timeWindow: "1 hour",
    },
    projectEuler: {
      max: 50,
      timeWindow: "1 hour",
    },
    codingBat: {
      max: 50,
      timeWindow: "1 hour",
    },
  };

  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: "1 hour",
    errorResponseBuilder: function (request: any, context: any) {
      return {
        code: 429,
        error: "Too Many Requests",
        message: `Rate limit exceeded, retry in ${context.after}`,
        expiresIn: context.after,
      };
    },
  });

  // Configure stricter rate limits for specific puzzle sources
  const sourceRateLimits: Record<string, number> = {
    reddit: 30,
    adventOfCode: 20,
    projectEuler: 50,
    codingBat: 50,
  };

  // TODO(michaelfromyeg): server is returning 5xxs right now, why?
  // Object.entries(sourceRateLimits).forEach(([source, limit]) => {
  //   fastify.addHook('onRequest', async (request, reply) => {
  //     if (request.url.startsWith(`/puzzle/${source}`)) {
  //       const rateLimitOpts = {
  //         max: limit,
  //         timeWindow: '1 hour',
  //       };
  //       await rateLimit(rateLimitOpts)(request, reply);
  //     }
  //   });
  // });

  fastify.get("/health", async (request, reply) => {
    return { status: "up" };
  });

  fastify.get<{
    Querystring: PuzzleQuerystring;
    Params: PuzzleParams;
  }>(
    "/puzzle/:kind",
    {
      config: {
        rateLimit: {
          max: async (req: any) => {
            if (!req || !req.params || !req.params.kind) {
              return 100;
            }

            const kind = (req.params as any).kind as string;
            return sourceRateLimits[kind] || 100; // fallback to global limit if kind not found
          },
          timeWindow: "1 hour",
        },
      },
    },
    async (request, reply) => {
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

        // TODO(michaelfromyeg): make this _far_ more robust (to show really errors)
        if (!response?.problem || response.problem === "") {
          request.log.warn({ kind, id }, "No data received for request");
          return reply
            .code(response?.status ?? 404)
            .send(
              new Error(
                response?.error ?? "Problem not found or may have been deleted"
              )
            );
        }

        const problem = parse.render(response.problem);

        return {
          source: kind,
          id: response.id,
          problem,
        };
      } catch (err) {
        request.log.error({ err, kind, id }, "Error processing puzzle request");
        if ((err as any)?.statusCode === 429) {
          return reply.code(429).send(err);
        }

        return reply
          .code(500)
          .send(new Error("An error occurred while processing your request"));
      }
    }
  );

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
