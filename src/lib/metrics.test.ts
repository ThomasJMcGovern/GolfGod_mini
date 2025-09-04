import { describe, it, expect } from "bun:test";
import {
  computeBasics,
  computeWindSplit,
  computeWaveSplit,
  exportToCSV,
} from "./metrics";
import type { Round } from "../types";

// Helper function to create a mock round
const createRound = (overrides: Partial<Round> = {}): Round => ({
  id: 1,
  tournament_id: 1,
  player_id: 1,
  round_no: 1,
  wave: "AM",
  score_to_par: -1,
  sg_app: 1.2,
  putts: 30,
  fairways_hit: 9,
  fairways_total: 14,
  wind_mph: 8,
  ...overrides,
});

describe("Metrics Computation", () => {
  describe("computeBasics", () => {
    it("should calculate basic metrics correctly", () => {
      const rounds: Round[] = [
        createRound({ sg_app: 1.5, putts: 30, fairways_hit: 10, fairways_total: 14 }),
        createRound({ sg_app: 0.5, putts: 32, fairways_hit: 8, fairways_total: 14 }),
      ];

      const result = computeBasics(rounds);

      expect(result.sgAppAvg).toBeCloseTo(1.0, 2);
      expect(result.puttsAvg).toBeCloseTo(31.0, 1);
      expect(result.fairwaysPct).toBeCloseTo(64.3, 1); // 18/28 * 100
    });

    it("should handle null values gracefully", () => {
      const rounds: Round[] = [
        createRound({ sg_app: 1.5, putts: null, fairways_hit: null }),
        createRound({ sg_app: null, putts: 32, fairways_total: null }),
      ];

      const result = computeBasics(rounds);

      expect(result.sgAppAvg).toBeCloseTo(1.5, 2);
      expect(result.puttsAvg).toBeCloseTo(32.0, 1);
      expect(result.fairwaysPct).toBeNull();
    });

    it("should return all nulls for empty rounds", () => {
      const result = computeBasics([]);

      expect(result.sgAppAvg).toBeNull();
      expect(result.puttsAvg).toBeNull();
      expect(result.fairwaysPct).toBeNull();
    });

    it("should handle rounds with all null metrics", () => {
      const rounds: Round[] = [
        createRound({ sg_app: null, putts: null, fairways_hit: null, fairways_total: null }),
      ];

      const result = computeBasics(rounds);

      expect(result.sgAppAvg).toBeNull();
      expect(result.puttsAvg).toBeNull();
      expect(result.fairwaysPct).toBeNull();
    });
  });

  describe("computeWindSplit", () => {
    it("should calculate wind split correctly", () => {
      const rounds: Round[] = [
        createRound({ wind_mph: 12, sg_app: 0.2 }), // Windy
        createRound({ wind_mph: 15, sg_app: 0.8 }), // Windy
        createRound({ wind_mph: 6, sg_app: 1.2 }),  // Calm
        createRound({ wind_mph: 8, sg_app: 1.8 }),  // Calm
      ];

      const result = computeWindSplit(rounds);

      expect(result.delta).toBeCloseTo(-1.0, 2); // 0.5 - 1.5
      expect(result.sampleWindy).toBe(2);
      expect(result.sampleCalm).toBe(2);
    });

    it("should handle no windy rounds", () => {
      const rounds: Round[] = [
        createRound({ wind_mph: 5, sg_app: 1.0 }),
        createRound({ wind_mph: 8, sg_app: 1.5 }),
      ];

      const result = computeWindSplit(rounds);

      expect(result.delta).toBeNull();
      expect(result.sampleWindy).toBe(0);
      expect(result.sampleCalm).toBe(2);
    });

    it("should handle no calm rounds", () => {
      const rounds: Round[] = [
        createRound({ wind_mph: 12, sg_app: 1.0 }),
        createRound({ wind_mph: 15, sg_app: 1.5 }),
      ];

      const result = computeWindSplit(rounds);

      expect(result.delta).toBeNull();
      expect(result.sampleWindy).toBe(2);
      expect(result.sampleCalm).toBe(0);
    });

    it("should treat null wind as calm", () => {
      const rounds: Round[] = [
        createRound({ wind_mph: null, sg_app: 1.0 }),
        createRound({ wind_mph: 12, sg_app: 0.5 }),
      ];

      const result = computeWindSplit(rounds);

      expect(result.sampleCalm).toBe(1);
      expect(result.sampleWindy).toBe(1);
    });
  });

  describe("computeWaveSplit", () => {
    it("should calculate wave split correctly", () => {
      const rounds: Round[] = [
        createRound({ wave: "AM", score_to_par: 1 }),
        createRound({ wave: "AM", score_to_par: -1 }),
        createRound({ wave: "PM", score_to_par: -2 }),
        createRound({ wave: "PM", score_to_par: -3 }),
      ];

      const result = computeWaveSplit(rounds);

      expect(result.delta).toBeCloseTo(2.5, 2); // 0 - (-2.5)
      expect(result.sampleAM).toBe(2);
      expect(result.samplePM).toBe(2);
    });

    it("should handle no AM rounds", () => {
      const rounds: Round[] = [
        createRound({ wave: "PM", score_to_par: -1 }),
        createRound({ wave: "PM", score_to_par: -2 }),
      ];

      const result = computeWaveSplit(rounds);

      expect(result.delta).toBeNull();
      expect(result.sampleAM).toBe(0);
      expect(result.samplePM).toBe(2);
    });

    it("should handle null scores", () => {
      const rounds: Round[] = [
        createRound({ wave: "AM", score_to_par: null }),
        createRound({ wave: "AM", score_to_par: 1 }),
        createRound({ wave: "PM", score_to_par: -2 }),
      ];

      const result = computeWaveSplit(rounds);

      expect(result.delta).toBeCloseTo(3, 2); // 1 - (-2)
      expect(result.sampleAM).toBe(2);
      expect(result.samplePM).toBe(1);
    });
  });

  describe("exportToCSV", () => {
    it("should generate valid CSV content", () => {
      const rounds: Round[] = [
        createRound({ round_no: 1, wave: "AM", score_to_par: -2 }),
        createRound({ round_no: 2, wave: "PM", score_to_par: -1 }),
      ];

      const metrics = computeBasics(rounds);
      const windSplit = computeWindSplit(rounds);
      const waveSplit = computeWaveSplit(rounds);

      const csv = exportToCSV(
        "Test Player",
        "Test Tournament",
        rounds,
        metrics,
        windSplit,
        waveSplit
      );

      expect(csv).toContain("GolfGod Mini - Player Statistics Export");
      expect(csv).toContain("Player:,Test Player");
      expect(csv).toContain("Tournament:,Test Tournament");
      expect(csv).toContain("Basic Metrics");
      expect(csv).toContain("Wind Split Analysis");
      expect(csv).toContain("Wave Split Analysis");
      expect(csv).toContain("Round Details");
    });

    it("should handle null values in CSV export", () => {
      const rounds: Round[] = [
        createRound({ 
          score_to_par: null, 
          sg_app: null, 
          putts: null,
          fairways_hit: null,
          fairways_total: null,
          wind_mph: null
        }),
      ];

      const metrics = computeBasics(rounds);
      const windSplit = computeWindSplit(rounds);
      const waveSplit = computeWaveSplit(rounds);

      const csv = exportToCSV(
        "Test Player",
        "Test Tournament",
        rounds,
        metrics,
        windSplit,
        waveSplit
      );

      expect(csv).toContain("N/A");
      expect(csv).not.toContain("null");
      expect(csv).not.toContain("undefined");
    });
  });
});