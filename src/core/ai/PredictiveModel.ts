import type { Area } from '../../store/useAppStore';

// Mathematical representation of a sigmoid activation function 
// Normalizes any real value into a robust 0-1 probability curve.
const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));

/**
 * AI Predictive Engine Model
 * Simulates a Random Forest or Neural Network output layer by
 * compounding interaction variables dynamically.
 */
export class PredictiveModel {
  /**
   * Run the predictive inference on a given set of geographical and environmental factors.
   * This local synchronous model is used for bulk-generation of the 100+ map points on load.
   */
  static predictRiskLocal(factors: Area['factors']): { score: number, risk: 'low' | 'medium' | 'high', metrics: Area['metrics'] } {
    // 1. Normalize Inputs to 0-1 range based on maximum possible (10)
    const nLighting = factors.lighting / 10;
    const nCrowd = factors.crowd / 10;
    const nPolice = factors.police / 10;
    const nCctv = factors.cctvDensity / 10;
    const nEscape = factors.escapeRoutes / 10;
    const nHistory = factors.recentIncidents / 10;

    const lightingDeficiency = 1 - nLighting;
    const policeGap = 1 - nPolice;
    const surveillanceGap = 1 - nCctv;
    
    const shadowCrowdInterplay = (lightingDeficiency * 1.5) * (nCrowd * 1.5);
    const organizedCrimeInterplay = (nHistory * 2.0) * (nEscape * 1.5);
    const lawlessZoneMultiplier = (policeGap * surveillanceGap) * 2;

    let Z = -4.5; 
    Z += (nHistory * 3.5);           
    Z += shadowCrowdInterplay;       
    Z += organizedCrimeInterplay;    
    Z += lawlessZoneMultiplier;      
    
    Z -= (nPolice * 2);              
    Z -= (nCctv * 1.5);              
    Z -= (nLighting * 0.5);          

    const pRisk = sigmoid(Z);
    const finalScore = pRisk * 10;

    let riskTarget: 'low' | 'medium' | 'high' = 'low';
    if (finalScore >= 7.0) riskTarget = 'high';
    else if (finalScore >= 4.0) riskTarget = 'medium';

    return {
      score: Number(finalScore.toFixed(1)),
      risk: riskTarget,
      metrics: {
        crimeImpact: Math.min(100, Math.round((nHistory * 0.5 + organizedCrimeInterplay * 0.3) * 100)),
        lightingDeficiency: Math.min(100, Math.round((lightingDeficiency * 0.7 + shadowCrowdInterplay * 0.3) * 100)),
        crowdExposure: Math.min(100, Math.round((nCrowd * 0.6 + shadowCrowdInterplay * 0.4) * 100)),
        policePresence: Math.round(nPolice * 100), 
        surveillanceGap: Math.min(100, Math.round(surveillanceGap * 100)),
        escapeVulnerability: Math.min(100, Math.round((nEscape * 0.6 + organizedCrimeInterplay * 0.4) * 100))
      }
    };
  }

  /**
   * Asynchronously calls the Live LLM backend for deep single-sector inference.
   */
  static async predictRiskLLM(factors: Area['factors']): Promise<{ score: number, risk: 'low' | 'medium' | 'high', metrics: Area['metrics'] }> {
    try {
      const res = await fetch('/api/predictRisk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ factors })
      });
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch(err) {
      console.warn("LLM API Failed. Falling back to robust local modeling.", err);
      return this.predictRiskLocal(factors);
    }
  }
}
