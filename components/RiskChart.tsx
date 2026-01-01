// components/RiskChart.tsx
'use client';

import { useState } from 'react';
import {
  ComposedChart,
  Line,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

// ============================================
// TYPES
// ============================================

export interface FoodLogEntry {
  id: string;
  meal_name: string;
  calories: number;
  image_url?: string;
  created_at: string;
  meal_context?: string;
  preparation_style?: string;
}

export interface VitalEntry {
  id: string;
  vital_type: string;
  reading_value: number;
  unit: string;
  context_tag: string;
  measured_at: string;
}

interface RiskChartProps {
  foodLogs: FoodLogEntry[];
  vitals: VitalEntry[];
  date?: Date;
}

interface ChartDataPoint {
  time: number; // Minutes from midnight (0-1440)
  timeLabel: string;
  glucose?: number;
  glucoseContext?: string;
  meal?: string;
  mealCalories?: number;
  mealImage?: string;
  mealId?: string;
  isMeal?: boolean;
  isGlucose?: boolean;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

const timeToMinutes = (dateString: string): number => {
  const date = new Date(dateString);
  return date.getHours() * 60 + date.getMinutes();
};

const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

const getGlucoseColor = (value: number): string => {
  if (value >= 4.0 && value <= 7.0) return '#10B981'; // Green - healthy
  if (value > 7.0 && value <= 8.0) return '#F59E0B'; // Amber - elevated
  return '#EF4444'; // Red - high
};

// ============================================
// CUSTOM TOOLTIP
// ============================================

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: ChartDataPoint }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;

  // Meal Tooltip
  if (data.isMeal && data.meal) {
    return (
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-3 max-w-[200px]">
        {data.mealImage && (
          <div className="w-full h-24 rounded-lg overflow-hidden mb-2 bg-slate-100">
            <img 
              src={data.mealImage} 
              alt={data.meal} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <p className="font-bold text-slate-800 text-sm truncate">{data.meal}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-slate-500">{data.timeLabel}</span>
          <span className="text-xs font-bold text-teal-600">{data.mealCalories} kcal</span>
        </div>
      </div>
    );
  }

  // Glucose Tooltip
  if (data.isGlucose && data.glucose) {
    const color = getGlucoseColor(data.glucose);
    const status = data.glucose <= 7.0 ? 'Normal' : data.glucose <= 8.0 ? 'Elevated' : 'High';
    
    return (
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">🩸</span>
          <span className="font-bold text-slate-800">{data.glucose} mmol/L</span>
        </div>
        <div className="flex items-center gap-2">
          <div 
            className="w-2 h-2 rounded-full" 
            style={{ backgroundColor: color }}
          />
          <span className="text-xs text-slate-500">{status}</span>
          <span className="text-xs text-slate-400">• {data.glucoseContext}</span>
        </div>
        <p className="text-xs text-slate-400 mt-1">{data.timeLabel}</p>
      </div>
    );
  }

  return null;
};

// ============================================
// CUSTOM DOT COMPONENTS
// ============================================

const MealDot = (props: any) => {
  const { cx, cy, payload } = props;
  if (!payload.isMeal) return null;
  
  return (
    <g>
      {/* Outer glow */}
      <circle cx={cx} cy={cy} r={14} fill="#14B8A640" />
      {/* Main circle */}
      <circle cx={cx} cy={cy} r={10} fill="#14B8A6" stroke="#fff" strokeWidth={2} />
      {/* Food icon */}
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize={10}>
        🍽️
      </text>
    </g>
  );
};

const GlucoseDot = (props: any) => {
  const { cx, cy, payload } = props;
  if (!payload.isGlucose || !payload.glucose) return null;
  
  const color = getGlucoseColor(payload.glucose);
  
  return (
    <g>
      {/* Outer glow */}
      <circle cx={cx} cy={cy} r={10} fill={`${color}30`} />
      {/* Main dot */}
      <circle cx={cx} cy={cy} r={6} fill={color} stroke="#fff" strokeWidth={2} />
    </g>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function RiskChart({ foodLogs, vitals, date }: RiskChartProps) {
  // Process data for the chart
  const chartData: ChartDataPoint[] = [];
  
  // Add glucose readings
  const glucoseReadings = vitals.filter(v => v.vital_type === 'glucose');
  glucoseReadings.forEach(reading => {
    const minutes = timeToMinutes(reading.measured_at);
    chartData.push({
      time: minutes,
      timeLabel: minutesToTime(minutes),
      glucose: reading.reading_value,
      glucoseContext: reading.context_tag.replace('_', ' '),
      isGlucose: true,
    });
  });

  // Add meal logs
  foodLogs.forEach(meal => {
    const minutes = timeToMinutes(meal.created_at);
    chartData.push({
      time: minutes,
      timeLabel: minutesToTime(minutes),
      meal: meal.meal_name,
      mealCalories: meal.calories,
      mealImage: meal.image_url,
      mealId: meal.id,
      isMeal: true,
    });
  });

  // Sort by time
  chartData.sort((a, b) => a.time - b.time);

  // Calculate Y-axis domain for glucose
  const glucoseValues = glucoseReadings.map(r => r.reading_value);
  const minGlucose = Math.min(...glucoseValues, 3);
  const maxGlucose = Math.max(...glucoseValues, 10);

  // Check if we have data
  const hasData = chartData.length > 0;
  const hasGlucose = glucoseReadings.length > 0;
  const hasMeals = foodLogs.length > 0;

  // Generate time ticks (every 4 hours)
  const timeTicks = [0, 240, 480, 720, 960, 1200, 1440]; // 00:00, 04:00, 08:00, 12:00, 16:00, 20:00, 24:00

  if (!hasData) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-lg">📊</span>
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Risk Correlation</h3>
            <p className="text-xs text-slate-500">Meals & Glucose Timeline</p>
          </div>
        </div>
        
        <div className="h-48 flex flex-col items-center justify-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
          <span className="text-4xl mb-2">📈</span>
          <p className="text-slate-500 font-medium text-sm">No data for today</p>
          <p className="text-slate-400 text-xs mt-1">Log meals and glucose to see correlations</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200/50">
            <span className="text-white text-lg">📊</span>
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Risk Correlation</h3>
            <p className="text-xs text-slate-500">
              {date ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Today'} • Meals & Glucose
            </p>
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-teal-500"></div>
            <span className="text-[10px] text-slate-500 font-medium">Meals</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-[10px] text-slate-500 font-medium">Glucose</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 10, left: -20, bottom: 10 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#E2E8F0" 
              vertical={false}
            />
            
            <XAxis
              dataKey="time"
              type="number"
              domain={[0, 1440]}
              ticks={timeTicks}
              tickFormatter={(value) => minutesToTime(value)}
              axisLine={{ stroke: '#CBD5E1' }}
              tickLine={{ stroke: '#CBD5E1' }}
              tick={{ fontSize: 10, fill: '#94A3B8' }}
            />
            
            <YAxis
              domain={[minGlucose - 1, maxGlucose + 2]}
              axisLine={{ stroke: '#CBD5E1' }}
              tickLine={{ stroke: '#CBD5E1' }}
              tick={{ fontSize: 10, fill: '#94A3B8' }}
              tickFormatter={(value) => `${value}`}
              label={{ 
                value: 'mmol/L', 
                angle: -90, 
                position: 'insideLeft',
                style: { fontSize: 10, fill: '#94A3B8' },
                offset: 10
              }}
            />

            {/* Reference lines for glucose zones */}
            <ReferenceLine 
              y={7} 
              stroke="#F59E0B" 
              strokeDasharray="4 4" 
              strokeWidth={1}
              label={{ 
                value: 'Target', 
                position: 'right', 
                fontSize: 9, 
                fill: '#F59E0B' 
              }}
            />
            <ReferenceLine 
              y={8} 
              stroke="#EF4444" 
              strokeDasharray="4 4" 
              strokeWidth={1}
              label={{ 
                value: 'High', 
                position: 'right', 
                fontSize: 9, 
                fill: '#EF4444' 
              }}
            />

            {/* Glucose Line */}
            {hasGlucose && (
              <Line
                type="monotone"
                dataKey="glucose"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={<GlucoseDot />}
                activeDot={{ r: 8, fill: '#3B82F6' }}
                connectNulls
              />
            )}

            {/* Meal Scatter Points */}
            {hasMeals && (
              <Scatter
                dataKey="mealCalories"
                shape={<MealDot />}
              />
            )}

            <Tooltip content={<CustomTooltip />} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Stats */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">🍽️</span>
            <span className="text-xs font-bold text-slate-600">{foodLogs.length} meals</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm">🩸</span>
            <span className="text-xs font-bold text-slate-600">{glucoseReadings.length} readings</span>
          </div>
        </div>
        
        {hasGlucose && (
          <div className="text-xs text-slate-400">
            Avg: <span className="font-bold text-slate-600">
              {(glucoseValues.reduce((a, b) => a + b, 0) / glucoseValues.length).toFixed(1)} mmol/L
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

