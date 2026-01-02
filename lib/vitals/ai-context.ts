// lib/vitals/ai-context.ts
// 💓 AI Context Builder - Vitals context for Dr. Reza

import { VitalsSummary, VitalTargets } from './types';
import { formatRelativeTime } from './calculations';
import { getStatusLabel } from './status';

/**
 * Build vitals context for AI system prompt
 */
export function buildVitalsAIContext(
  summary: VitalsSummary,
  targets: VitalTargets,
  language: 'en' | 'ms' = 'en'
): string {
  const contextLines: string[] = [];
  
  // Blood Pressure
  if (summary.bp) {
    const bpStatus = getStatusLabel(summary.bp.status, language);
    const timeAgo = formatRelativeTime(summary.bp.recordedAt, language);
    contextLines.push(
      `Blood Pressure: ${summary.bp.systolic}/${summary.bp.diastolic} mmHg (${bpStatus}) - recorded ${timeAgo}` +
      (summary.bp.pulse ? `, pulse ${summary.bp.pulse} bpm` : '')
    );
    
    if (summary.bp.status !== 'normal') {
      contextLines.push(`  → Target: <${targets.targetSystolicMax}/${targets.targetDiastolicMax} mmHg`);
    }
  }
  
  // Weight
  if (summary.weight) {
    const timeAgo = formatRelativeTime(summary.weight.recordedAt, language);
    let weightLine = `Weight: ${summary.weight.weightKg} kg`;
    if (summary.weight.bmi) {
      weightLine += ` (BMI: ${summary.weight.bmi})`;
    }
    weightLine += ` - recorded ${timeAgo}`;
    contextLines.push(weightLine);
    
    if (targets.targetWeightKg) {
      contextLines.push(`  → Target: ${targets.targetWeightKg} kg`);
    }
    
    if (summary.weight.change) {
      const direction = summary.weight.change.direction === 'up' ? '↑' : 
                       summary.weight.change.direction === 'down' ? '↓' : '→';
      contextLines.push(`  → Change: ${direction} ${Math.abs(summary.weight.change.value)} kg over past ${summary.weight.change.period}`);
    }
  }
  
  // Glucose
  if (summary.glucose) {
    const glucoseStatus = getStatusLabel(summary.glucose.status, language);
    const timeAgo = formatRelativeTime(summary.glucose.recordedAt, language);
    const timingLabel = getGlucoseTimingLabel(summary.glucose.timing, language);
    
    contextLines.push(
      `Blood Glucose: ${summary.glucose.glucoseMmol} mmol/L (${timingLabel}, ${glucoseStatus}) - recorded ${timeAgo}`
    );
    
    if (summary.glucose.timing === 'fasting') {
      contextLines.push(`  → Target: ${targets.targetFastingGlucoseMin}-${targets.targetFastingGlucoseMax} mmol/L`);
    } else if (summary.glucose.timing === 'after_meal') {
      contextLines.push(`  → Target: <${targets.targetPostmealGlucoseMax} mmol/L (2hr post-meal)`);
    }
  }
  
  // Lab Results
  if (summary.labs) {
    const timeAgo = formatRelativeTime(summary.labs.recordedAt, language);
    contextLines.push(`Lab Results (${timeAgo}):`);
    
    if (summary.labs.hba1cPercent) {
      const status = summary.labs.hba1cStatus ? getStatusLabel(summary.labs.hba1cStatus, language) : '';
      contextLines.push(`  • HbA1c: ${summary.labs.hba1cPercent}%${status ? ` (${status})` : ''} - Target: <${targets.targetHba1cMax}%`);
    }
    
    if (summary.labs.ldlMmol) {
      const status = summary.labs.ldlStatus ? getStatusLabel(summary.labs.ldlStatus, language) : '';
      contextLines.push(`  • LDL Cholesterol: ${summary.labs.ldlMmol} mmol/L${status ? ` (${status})` : ''} - Target: <${targets.targetLdlMax} mmol/L`);
    }
    
    if (summary.labs.hdlMmol) {
      contextLines.push(`  • HDL Cholesterol: ${summary.labs.hdlMmol} mmol/L - Target: >${targets.targetHdlMin} mmol/L`);
    }
    
    if (summary.labs.triglyceridesMmol) {
      contextLines.push(`  • Triglycerides: ${summary.labs.triglyceridesMmol} mmol/L - Target: <${targets.targetTriglyceridesMax} mmol/L`);
    }
    
    if (summary.labs.egfr) {
      const status = summary.labs.egfrStatus ? getStatusLabel(summary.labs.egfrStatus, language) : '';
      contextLines.push(`  • eGFR (Kidney Function): ${summary.labs.egfr} mL/min/1.73m²${status ? ` (${status})` : ''}`);
    }
    
    if (summary.labs.labProvider) {
      contextLines.push(`  • Lab Provider: ${summary.labs.labProvider}`);
    }
  }
  
  if (contextLines.length === 0) {
    return 'No vitals data recorded yet.';
  }
  
  return `
Recent Health Vitals:
${contextLines.join('\n')}

Vitals-Aware Guidance:
${generateVitalsGuidance(summary, targets)}
`;
}

/**
 * Generate specific guidance based on vitals status
 */
function generateVitalsGuidance(summary: VitalsSummary, targets: VitalTargets): string {
  const guidance: string[] = [];
  
  // BP guidance
  if (summary.bp) {
    if (summary.bp.status === 'high' || summary.bp.status === 'critical') {
      guidance.push('- Blood pressure is elevated. Emphasize low-sodium food choices and avoid high-salt Malaysian foods like processed meats, instant noodles, and heavily salted dishes.');
    } else if (summary.bp.status === 'borderline') {
      guidance.push('- Blood pressure is borderline. Encourage sodium awareness and DASH-friendly food options.');
    }
  }
  
  // Weight guidance
  if (summary.weight?.bmi) {
    if (summary.weight.bmi >= 25) {
      guidance.push('- BMI indicates overweight. Focus on portion control and lower-calorie meal options.');
    }
  }
  
  // Glucose guidance
  if (summary.glucose) {
    if (summary.glucose.status === 'high' || summary.glucose.status === 'critical') {
      guidance.push('- Recent blood glucose is elevated. Recommend low-GI foods and smaller carbohydrate portions.');
    } else if (summary.glucose.status === 'low') {
      guidance.push('- Recent blood glucose was low. Ensure adequate carbohydrate intake and regular meals.');
    }
  }
  
  // HbA1c guidance
  if (summary.labs?.hba1cPercent) {
    if (summary.labs.hba1cPercent >= 8) {
      guidance.push('- HbA1c indicates suboptimal glucose control. Long-term dietary improvements needed.');
    }
  }
  
  // Kidney function guidance
  if (summary.labs?.egfr && summary.labs.egfr < 60) {
    guidance.push('- Kidney function is reduced. Consider moderate protein intake and avoid high-potassium/phosphorus foods if appropriate.');
  }
  
  // LDL guidance
  if (summary.labs?.ldlMmol && summary.labs.ldlMmol > targets.targetLdlMax) {
    guidance.push('- LDL cholesterol is above target. Recommend reducing saturated fat and increasing fiber.');
  }
  
  if (guidance.length === 0) {
    guidance.push('- Vitals are generally within acceptable ranges. Continue with current dietary approach.');
  }
  
  return guidance.join('\n');
}

/**
 * Get glucose timing label
 */
function getGlucoseTimingLabel(timing: string, language: 'en' | 'ms'): string {
  const labels: Record<string, { en: string; ms: string }> = {
    fasting: { en: 'fasting', ms: 'puasa' },
    before_meal: { en: 'before meal', ms: 'sebelum makan' },
    after_meal: { en: 'after meal', ms: 'selepas makan' },
    bedtime: { en: 'bedtime', ms: 'waktu tidur' },
    random: { en: 'random', ms: 'rawak' },
  };
  
  return labels[timing]?.[language] || timing;
}

/**
 * Generate vitals reminders for AI context
 */
export function generateVitalsReminders(
  summary: VitalsSummary,
  userConditions: string[] = []
): string[] {
  const reminders: string[] = [];
  
  const hasHypertension = userConditions.some(c => c.includes('hypertension'));
  const hasDiabetes = userConditions.some(c => c.includes('diabetes'));
  
  // BP reminder
  if (!summary.bp || summary.bp.daysAgo > (hasHypertension ? 3 : 7)) {
    reminders.push('Consider logging blood pressure - it helps track cardiovascular health.');
  }
  
  // Weight reminder
  if (!summary.weight || summary.weight.daysAgo > 7) {
    reminders.push('Weekly weight check recommended for tracking progress.');
  }
  
  // Glucose reminder for diabetics
  if (hasDiabetes && (!summary.glucose || summary.glucose.daysAgo > 1)) {
    reminders.push('Regular glucose monitoring helps manage diabetes effectively.');
  }
  
  // HbA1c reminder
  if (hasDiabetes && (!summary.labs?.hba1cPercent || summary.labs.daysAgo > 90)) {
    reminders.push('HbA1c test recommended every 3 months for diabetics.');
  }
  
  return reminders;
}


