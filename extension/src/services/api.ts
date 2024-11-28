import axios, { AxiosInstance } from "axios";
import { Config } from "../config";
import { Problem, ProblemSource } from "../types";

export class ApiService {
  private static instance: ApiService;
  private client: AxiosInstance;

  private constructor() {
    this.client = axios.create({
      baseURL: Config.getBaseUrl(),
      timeout: 10000,
    });
  }

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  async fetchProblem(source: ProblemSource, id?: string): Promise<Problem> {
    try {
      const url = `/puzzle/${source}${id ? `?id=${id}` : ""}`;
      const response = await this.client.get(url);
      return response.data;
    } catch (error) {
      throw new Error(
        `Failed to fetch problem: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    }
  }
}
