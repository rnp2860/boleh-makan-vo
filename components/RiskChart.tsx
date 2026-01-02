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
import { RiskCorrelationInfo } from './InfoModal';

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
  mealY?: number; // Fixed Y position for meal icons
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
    
    // Format context tag for display
    const formatContextTag = (tag: string | undefined): { label: string; emoji: string; highlight: boolean } => {
      if (!tag) return { label: 'General', emoji: '📋', highlight: false };
      const normalized = tag.toLowerCase().replace(/[_-]/g, ' ').trim();
      
      if (normalized.includes('fasting')) {
        return { label: 'Fasting', emoji: '🌅', highlight: true };
      }
      if (normalized.includes('pre') && normalized.includes('meal')) {
        return { label: 'Pre-meal', emoji: '🍽️', highlight: false };
      }
      if (normalized.includes('post') || normalized.includes('2hr') || normalized.includes('2 hour') || normalized.includes('after')) {
        return { label: '2hr After Meal', emoji: '⏱️', highlight: false };
      }
      return { label: 'General', emoji: '📋', highlight: false };
    };

    const contextInfo = formatContextTag(data.glucoseContext);
    
    return (
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-3 min-w-[160px]">
        {/* Context Tag Banner (highlighted for Fasting) */}
        <div className={`flex items-center gap-1.5 mb-2 px-2 py-1 rounded-lg text-xs font-semibold ${
          contextInfo.highlight 
            ? 'bg-amber-100 text-amber-700 border border-amber-200' 
            : 'bg-slate-100 text-slate-600'
        }`}>
          <span>{contextInfo.emoji}</span>
          <span>Type: {contextInfo.label}</span>
        </div>
        
        {/* Glucose Value */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">🩸</span>
          <span className="font-bold text-slate-800 text-lg">{data.glucose} mmol/L</span>
        </div>
        
        {/* Status */}
        <div className="flex items-center gap-2">
          <div 
            className="w-2.5 h-2.5 rounded-full" 
            style={{ backgroundColor: color }}
          />
          <span className="text-xs font-medium" style={{ color }}>{status}</span>
        </div>
        
        {/* Time */}
        <p className="text-xs text-slate-400 mt-2 border-t border-slate-100 pt-2">
          🕐 {data.timeLabel}
        </p>
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
      {/* Outer glow - larger */}
      <circle cx={cx} cy={cy} r={14} fill={`${color}25`} />
      {/* Middle ring */}
      <circle cx={cx} cy={cy} r={10} fill={`${color}50`} />
      {/* Main dot - larger */}
      <circle cx={cx} cy={cy} r={7} fill={color} stroke="#fff" strokeWidth={2} />
      {/* Value label */}
      <text 
        x={cx} 
        y={cy - 16} 
        textAnchor="middle" 
        fontSize={9} 
        fontWeight="bold"
        fill={color}
      >
        {payload.glucose}
      </text>
    </g>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function RiskChart({ foodLogs, vitals, date }: RiskChartProps) {
  // 🐛 DEBUG: Log incoming data
  console.log('📊 RiskChart received:', {
    foodLogs: foodLogs.length,
    vitals: vitals.length,
    vitalsData: vitals,
    date: date?.toISOString(),
  });

  // ============================================
  // SEPARATE DATA LAYERS
  // ============================================
  
  // Layer 1: Glucose readings from vitals table
  const glucoseReadings = vitals.filter(v => v.vital_type === 'glucose');
  
  // 🐛 DEBUG: Log glucose readings
  console.log('🩸 Glucose readings from vitals:', glucoseReadings.length, glucoseReadings);
  
  // Create glucose data points
  const glucoseData: ChartDataPoint[] = glucoseReadings.map(reading => ({
    time: timeToMinutes(reading.measured_at),
    timeLabel: minutesToTime(timeToMinutes(reading.measured_at)),
    glucose: reading.reading_value,
    glucoseContext: reading.context_tag?.replace('_', ' ') || 'general',
    isGlucose: true,
  }));

  // Layer 2: Meal data points (positioned at bottom for visibility)
  const mealData: ChartDataPoint[] = foodLogs.map(meal => ({
    time: timeToMinutes(meal.created_at),
    timeLabel: minutesToTime(timeToMinutes(meal.created_at)),
    meal: meal.meal_name,
    mealCalories: meal.calories,
    mealImage: meal.image_url,
    mealId: meal.id,
    isMeal: true,
    mealY: 2, // Fixed Y position at bottom of chart for meals
  }));

  // Combined data for chart (meals first, then glucose on top)
  const chartData: ChartDataPoint[] = [...mealData, ...glucoseData].sort((a, b) => a.time - b.time);
  
  // 🐛 DEBUG: Log processed data
  console.log('📈 Chart data:', { 
    glucosePoints: glucoseData.length, 
    mealPoints: mealData.length,
    totalPoints: chartData.length 
  });

  // Calculate Y-axis domain for glucose (with room for meal icons at bottom)
  const glucoseValues = glucoseData.map(d => d.glucose!).filter(v => v !== undefined);
  const minGlucose = 1; // Fixed minimum to show meal icons at y=2
  const maxGlucose = glucoseValues.length > 0 ? Math.max(...glucoseValues, 10) + 1 : 12;

  // Check if we have data
  const hasData = chartData.length > 0;
  const hasGlucose = glucoseData.length > 0;
  const hasMeals = mealData.length > 0;
  
  // Total glucose reading count (for display)
  const glucoseReadingCount = glucoseData.length;

  // Generate time ticks (every 4 hours)
  const timeTicks = [0, 240, 480, 720, 960, 1200, 1440]; // 00:00, 04:00, 08:00, 12:00, 16:00, 20:00, 24:00

  if (!hasData) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-lg">📊</span>
          </div>
          <div className="flex items-center gap-2">
            <div>
              <h3 className="font-bold text-slate-800">Risk Correlation</h3>
              <p className="text-xs text-slate-500">Meals & Glucose Timeline</p>
            </div>
            <RiskCorrelationInfo />
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
          <div className="flex items-center gap-2">
            <div>
              <h3 className="font-bold text-slate-800">Risk Correlation</h3>
              <p className="text-xs text-slate-500">
                {date ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Today'} • Meals & Glucose
              </p>
            </div>
            <RiskCorrelationInfo />
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
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 15, right: 50, left: -15, bottom: 25 }}
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
              tick={{ fontSize: 9, fill: '#94A3B8' }}
              label={{ 
                value: 'Time', 
                position: 'bottom',
                offset: 10,
                style: { fontSize: 10, fill: '#64748B', fontWeight: 500 }
              }}
            />
            
            <YAxis
              yAxisId="glucose"
              orientation="left"
              domain={[minGlucose, maxGlucose]}
              axisLine={{ stroke: '#3B82F6' }}
              tickLine={{ stroke: '#3B82F6' }}
              tick={{ fontSize: 9, fill: '#3B82F6' }}
              tickFormatter={(value) => `${value}`}
              width={30}
            />

            {/* Reference lines for glucose zones - shortened labels */}
            <ReferenceLine 
              yAxisId="glucose"
              y={7} 
              stroke="#F59E0B" 
              strokeDasharray="4 4" 
              strokeWidth={1}
              label={{ 
                value: '7 Target', 
                position: 'insideTopRight', 
                fontSize: 8, 
                fill: '#F59E0B',
                offset: 5
              }}
            />
            <ReferenceLine 
              yAxisId="glucose"
              y={8} 
              stroke="#EF4444" 
              strokeDasharray="4 4" 
              strokeWidth={1}
              label={{ 
                value: '8 High', 
                position: 'insideTopRight', 
                fontSize: 8, 
                fill: '#EF4444',
                offset: 5
              }}
            />
            
            {/* Meal zone indicator line */}
            <ReferenceLine 
              yAxisId="glucose"
              y={2.5} 
              stroke="#14B8A6" 
              strokeDasharray="2 2" 
              strokeWidth={0.5}
              label={{ 
                value: '🍽️ Meals', 
                position: 'insideTopLeft', 
                fontSize: 8, 
                fill: '#14B8A6',
              }}
            />

            {/* Glucose Line - Bright Blue, Thick */}
            {hasGlucose && (
              <Line
                yAxisId="glucose"
                type="monotone"
                dataKey="glucose"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={<GlucoseDot />}
                activeDot={{ r: 10, fill: '#3B82F6', stroke: '#fff', strokeWidth: 2 }}
                connectNulls
              />
            )}

            {/* Meal Scatter Points - Positioned at Y=2 (bottom zone) */}
            {hasMeals && (
              <Scatter
                yAxisId="glucose"
                dataKey="mealY"
                shape={<MealDot />}
                data={mealData}
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
            <span className="text-xs font-bold text-slate-600">{mealData.length} meals</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm">🩸</span>
            <span className="text-xs font-bold text-slate-600">{glucoseReadingCount} readings</span>
          </div>
        </div>
        
        {hasGlucose && glucoseValues.length > 0 && (
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

