import fastify, { RouteShorthandOptions } from 'fastify'

import * as reddit from './helpers/reddit'
import * as codingBat from './helpers/coding-bat'
import * as projectEuler from './helpers/project-euler'
import * as parse from './helpers/parse'

const server = fastify({ logger: true })

server.get('/health', async (request, reply) => {
  reply.code(200).send({
    status: 'up',
  })
})

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

const opts: RouteShorthandOptions = {}

server.get<{ Querystring: PuzzleQuerystring, Params: PuzzleParams }>('/puzzle/:kind', opts, async (request, reply) => {
  // Log the request
  server.log
    .child({ ...request.params, ...request.query })
    .info('Fetching puzzle!')

  // Fetch the problem
  let response: PuzzleResponse;
  switch (request.params.kind) {
    case 'reddit':
      response = await reddit.getQuestion(request.query.id)
      break;
    case 'projectEuler':
      response = await projectEuler.getQuestion(request.query.id)
      break;
    case 'codingBat':
      response = await codingBat.getQuestion(request.query.id)
      break;
    default:
      response = { status: 400, id: 'unknown', problem: '' }
      reply.code(400).send(`${request.params.kind} is not a valid problem type`)
  }

  if (!response || !response.problem || response.problem === '') {
    server.log
      .child({ ...request.params, ...request.query })
      .warn('Did not get any data for request')

    reply.code(404).send('The problem you tried to fetch does not exist, may have been deleted, or an error may have occurred.')
  }

  // Get a more Markdown friendly string
  const problem = parse.render(response.problem)

  reply.code(200).send({ source: request.params.kind, id: response.id, problem })
})

server.listen(process.env.PORT || 8000, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})