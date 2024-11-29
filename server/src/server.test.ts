import axios from "axios";
import * as cheerio from "cheerio";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import * as parse from "./helpers/parse.js";
import * as projectEuler from "./helpers/project-euler.js";
import * as reddit from "./helpers/reddit.js";

import { buildServer } from "./server.js";

vi.mock("axios");
vi.mock("cheerio", () => ({
  load: vi.fn(),
}));

describe("Server Tests", async () => {
  const app = await buildServer();

  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("Server Health Check", () => {
    it("should return status up", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/health",
      });

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.payload)).toEqual({ status: "up" });
    });
  });

  describe("Puzzle Endpoints", () => {
    it("should return 400 for invalid puzzle kind", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/puzzle/invalid",
      });

      expect(response.statusCode).toBe(400);
    });

    it("should return 404 when bad problem ID is given", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/puzzle/reddit?id=nonexistent",
      });

      expect(response.statusCode).toBe(404);
    });
  });
});

describe("Helper Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Reddit Helper", () => {
    it("should fetch latest problem when no id is provided", async () => {
      const mockRedditResponse = {
        status: 200,
        data: {
          data: {
            children: [
              {
                data: {
                  selftext: "Test problem content",
                },
              },
            ],
          },
        },
      };

      vi.mocked(axios.get).mockResolvedValueOnce(mockRedditResponse);

      const result = await reddit.getQuestion();

      expect(result.status).toBe(200);
      expect(result.problem).toBe("Test problem content");
      expect(axios.get).toHaveBeenCalledWith(
        "https://reddit.com/r/dailyprogrammer/hot.json?limit=1"
      );
    });

    it("should fetch specific problem when id is provided", async () => {
      const testId = "123abc";
      const mockRedditResponse = {
        status: 200,
        data: {
          data: {
            children: [
              {
                data: {
                  selftext: "Specific problem content",
                },
              },
            ],
          },
        },
      };

      vi.mocked(axios.get).mockResolvedValueOnce(mockRedditResponse);

      const result = await reddit.getQuestion(testId);

      expect(result.status).toBe(200);
      expect(result.problem).toBe("Specific problem content");
      expect(axios.get).toHaveBeenCalledWith(
        `https://reddit.com/r/dailyprogrammer/comments/${testId}.json`
      );
    });
  });

  describe("Project Euler Helper", () => {
    it("should fetch random problem when no id is provided", async () => {
      const mockHtml = '<div class="problem_content">Test Euler problem</div>';
      const mockResponse = {
        status: 200,
        data: mockHtml,
      };

      vi.mocked(axios.get).mockResolvedValueOnce(mockResponse);

      const mockSelector = {
        text: vi.fn().mockReturnValue("Test Euler problem"),
      };
      vi.mocked(cheerio.load).mockReturnValue(
        ((...args: any[]) => mockSelector) as unknown as cheerio.CheerioAPI
      );

      const result = await projectEuler.getQuestion();

      expect(result.status).toBe(200);
      expect(result.problem).toBe("Test Euler problem");
    });

    it("should validate problem id range", async () => {
      const mockResponse = {
        status: 400,
        id: "999999",
        problem: "",
      };
      vi.mocked(axios.get).mockResolvedValueOnce(mockResponse);
      await expect(projectEuler.getQuestion("999999")).resolves.toEqual(
        mockResponse
      );
    });
  });

  // TODO(michaelfromyeg): test Coding Bat with a random ID, specified ID
  // describe("CodingBat Helper", () => {
  // });

  describe("Parse Helper", () => {
    it("should convert HTML to markdown", () => {
      const html = "<h1>Test</h1><p>Content</p>";
      const markdown = parse.render(html);
      expect(markdown).toContain("# Test");
      expect(markdown).toContain("Content");
    });

    it("should handle undefined input", () => {
      const markdown = parse.render(undefined);
      expect(markdown).toBe("");
    });

    it("should handle complex HTML", () => {
      const html = `
        <div>
          <h1>Title</h1>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
          <pre><code>console.log('hello');</code></pre>
        </div>
      `;
      const markdown = parse.render(html);
      expect(markdown).toContain("# Title");
      expect(markdown).toContain("* Item 1");
      expect(markdown).toContain("* Item 2");
      expect(markdown).toContain("```");
      expect(markdown).toContain("console.log('hello');");
    });
  });
});
