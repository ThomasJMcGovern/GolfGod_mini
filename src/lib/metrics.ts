import type { Round, BasicMetrics, WindSplit, WaveSplit } from "../types";

/**
 * Safely compute average of nullable numbers
 */
function safeAverage(values: (number | null | undefined)[]): number | null {
  const validNumbers = values.filter(
    (x): x is number => typeof x === "number" && Number.isFinite(x)
  );
  
  if (validNumbers.length === 0) return null;
  
  const sum = validNumbers.reduce((acc, val) => acc + val, 0);
  return sum / validNumbers.length;
}

/**
 * Compute basic metrics from rounds
 */
export function computeBasics(rounds: Round[]): BasicMetrics {
  if (rounds.length === 0) {
    return {
      sgAppAvg: null,
      puttsAvg: null,
      fairwaysPct: null,
    };
  }

  // SG:APP average
  const sgAppValues = rounds.map((r) => r.sg_app);
  const sgAppAvg = safeAverage(sgAppValues);

  // Putts average
  const puttsValues = rounds.map((r) => r.putts);
  const puttsAvg = safeAverage(puttsValues);

  // Fairways percentage
  let totalFairwaysHit = 0;
  let totalFairwaysPossible = 0;

  rounds.forEach((round) => {
    if (round.fairways_hit !== null && round.fairways_total !== null) {
      totalFairwaysHit += round.fairways_hit;
      totalFairwaysPossible += round.fairways_total;
    }
  });

  const fairwaysPct =
    totalFairwaysPossible > 0
      ? (totalFairwaysHit / totalFairwaysPossible) * 100
      : null;

  return {
    sgAppAvg: sgAppAvg !== null ? Number(sgAppAvg.toFixed(2)) : null,
    puttsAvg: puttsAvg !== null ? Number(puttsAvg.toFixed(1)) : null,
    fairwaysPct: fairwaysPct !== null ? Number(fairwaysPct.toFixed(1)) : null,
  };
}

/**
 * Compute wind split metrics
 * Compares performance in windy (≥10 mph) vs calm (<10 mph) conditions
 */
export function computeWindSplit(rounds: Round[]): WindSplit {
  const windyRounds = rounds.filter((r) => (r.wind_mph ?? 0) >= 10);
  const calmRounds = rounds.filter((r) => (r.wind_mph ?? 0) < 10);

  const windySgApp = safeAverage(windyRounds.map((r) => r.sg_app));
  const calmSgApp = safeAverage(calmRounds.map((r) => r.sg_app));

  let delta: number | null = null;
  if (windySgApp !== null && calmSgApp !== null) {
    // Positive delta means better performance in windy conditions
    delta = Number((windySgApp - calmSgApp).toFixed(2));
  }

  return {
    delta,
    sampleWindy: windyRounds.length,
    sampleCalm: calmRounds.length,
  };
}

/**
 * Compute wave split metrics
 * Compares AM vs PM performance in score to par
 */
export function computeWaveSplit(rounds: Round[]): WaveSplit {
  const amRounds = rounds.filter((r) => r.wave === "AM");
  const pmRounds = rounds.filter((r) => r.wave === "PM");

  const amScoreAvg = safeAverage(amRounds.map((r) => r.score_to_par));
  const pmScoreAvg = safeAverage(pmRounds.map((r) => r.score_to_par));

  let delta: number | null = null;
  if (amScoreAvg !== null && pmScoreAvg !== null) {
    // Positive delta means AM scored worse (higher score to par) than PM
    delta = Number((amScoreAvg - pmScoreAvg).toFixed(2));
  }

  return {
    delta,
    sampleAM: amRounds.length,
    samplePM: pmRounds.length,
  };
}

/**
 * Export metrics data to CSV format
 */
export function exportToCSV(
  playerName: string,
  tournamentName: string,
  rounds: Round[],
  metrics: BasicMetrics,
  windSplit: WindSplit,
  waveSplit: WaveSplit
): string {
  const lines: string[] = [
    "GolfGod Mini - Player Statistics Export",
    `Player:,${playerName}`,
    `Tournament:,${tournamentName}`,
    "",
    "Basic Metrics",
    `Avg SG:APP,${metrics.sgAppAvg ?? "N/A"}`,
    `Avg Putts/Round,${metrics.puttsAvg ?? "N/A"}`,
    `Fairways Hit %,${metrics.fairwaysPct ?? "N/A"}`,
    "",
    "Wind Split Analysis",
    `Wind Delta SG:APP,${windSplit.delta ?? "N/A"}`,
    `Windy Rounds (≥10mph),${windSplit.sampleWindy}`,
    `Calm Rounds (<10mph),${windSplit.sampleCalm}`,
    "",
    "Wave Split Analysis",
    `AM-PM Score Delta,${waveSplit.delta ?? "N/A"}`,
    `AM Rounds,${waveSplit.sampleAM}`,
    `PM Rounds,${waveSplit.samplePM}`,
    "",
    "Round Details",
    "Round,Wave,Score to Par,SG:APP,Putts,Fairways Hit,Fairways Total,Wind (mph)",
  ];

  // Add round details
  rounds.forEach((round) => {
    lines.push(
      [
        round.round_no,
        round.wave,
        round.score_to_par ?? "N/A",
        round.sg_app ?? "N/A",
        round.putts ?? "N/A",
        round.fairways_hit ?? "N/A",
        round.fairways_total ?? "N/A",
        round.wind_mph ?? "N/A",
      ].join(",")
    );
  });

  return lines.join("\n");
}

/**
 * Download CSV file
 */
export function downloadCSV(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}