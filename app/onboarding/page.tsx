// app/onboarding/page.tsx
// 🚀 User Onboarding Flow - 4-Step Wizard

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useFood } from '@/context/FoodContext';
import { ChevronLeft, ChevronRight, Check, Sparkles } from 'lucide-react';
import Logo from '@/components/Logo';

// ============================================
// STEP CONFIGURATION
// ============================================

const STEPS = [
  { id: 1, title: 'Health Goal', subtitle: 'What do you want to achieve?' },
  { id: 2, title: 'Health Conditions', subtitle: 'Any concerns we should know?' },
  { id: 3, title: 'Your Details', subtitle: 'Tell us about yourself' },
  { id: 4, title: 'Activity Level', subtitle: 'How active are you?' },
];

// ============================================
// MAIN COMPONENT
// ============================================

export default function OnboardingPage() {
  const router = useRouter();
  const { userProfile, setGoal, toggleCondition, updateDetails, setUserName } = useFood();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  
  // Local state for form data
  const [name, setName] = useState('');
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [details, setDetails] = useState({
    age: 0,
    gender: 'male' as 'male' | 'female',
    height: 0,
    weight: 0,
  });
  const [activityLevel, setActivityLevel] = useState<string>('moderate');

  // Initialize from existing profile if available
  useEffect(() => {
    if (userProfile) {
      if (userProfile.name) setName(userProfile.name);
      if (userProfile.goal) setSelectedGoal(userProfile.goal);
      if (userProfile.healthConditions) setSelectedConditions(userProfile.healthConditions);
      if (userProfile.details) {
        setDetails({
          age: userProfile.details.age || 0,
          gender: userProfile.details.gender || 'male',
          height: userProfile.details.height || 0,
          weight: userProfile.details.weight || 0,
        });
        if (userProfile.details.activity) setActivityLevel(userProfile.details.activity);
      }
    }
  }, [userProfile]);

  // Hide welcome screen after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Step navigation
  const goToStep = (step: number) => {
    if (step < 1 || step > STEPS.length) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(step);
      setIsAnimating(false);
    }, 150);
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      goToStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  };

  // Complete onboarding and save data
  const completeOnboarding = () => {
    // Save to context
    if (name) setUserName(name);
    if (selectedGoal) setGoal(selectedGoal as any);
    
    // Handle conditions - clear and re-add
    if (userProfile?.healthConditions) {
      userProfile.healthConditions.forEach(c => {
        if (!selectedConditions.includes(c)) toggleCondition(c);
      });
    }
    selectedConditions.forEach(c => {
      if (!userProfile?.healthConditions?.includes(c)) toggleCondition(c);
    });
    
    // Save details
    updateDetails({
      age: details.age,
      gender: details.gender,
      height: details.height,
      weight: details.weight,
      activity: activityLevel as any,
    });

    // Mark onboarding complete
    if (typeof window !== 'undefined') {
      localStorage.setItem('boleh_makan_onboarding_complete', 'true');
    }

    // Navigate to dashboard
    router.push('/dashboard');
  };

  // Skip onboarding
  const skipOnboarding = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('boleh_makan_onboarding_complete', 'true');
    }
    router.push('/dashboard');
  };

  // Check if step is valid to proceed
  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedGoal !== null;
      case 2: return true; // Conditions are optional
      case 3: return details.age > 0 && details.height > 0 && details.weight > 0;
      case 4: return activityLevel !== null;
      default: return false;
    }
  };

  // ============================================
  // WELCOME SCREEN
  // ============================================

  if (showWelcome) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-600 flex items-center justify-center p-6">
        <div className="text-center animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 mx-auto mb-6 bg-white/20 backdrop-blur rounded-3xl flex items-center justify-center">
            <Logo className="w-16 h-16" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Welcome to Boleh Makan!</h1>
          <p className="text-white/80 text-lg">Let's set up your health profile</p>
          <div className="mt-8 flex justify-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // MAIN WIZARD
  // ============================================

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* HEADER */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 py-3">
        <div className="max-w-lg mx-auto">
          {/* Progress Bar */}
          <div className="flex items-center gap-2 mb-3">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex-1 flex items-center">
                <div 
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    index < currentStep ? 'bg-teal-500' : 'bg-slate-200'
                  }`}
                />
              </div>
            ))}
          </div>
          
          {/* Step Info */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">
                Step {currentStep} of {STEPS.length}
              </p>
              <h2 className="text-lg font-bold text-slate-800">
                {STEPS[currentStep - 1].title}
              </h2>
            </div>
            <button 
              onClick={skipOnboarding}
              className="text-sm text-slate-400 hover:text-slate-600 font-medium transition-colors"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className={`max-w-lg mx-auto px-4 py-6 transition-opacity duration-150 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
        
        {/* STEP 1: Health Goals */}
        {currentStep === 1 && (
          <Step1HealthGoals 
            selectedGoal={selectedGoal}
            onSelectGoal={setSelectedGoal}
          />
        )}

        {/* STEP 2: Health Conditions */}
        {currentStep === 2 && (
          <Step2HealthConditions 
            selectedConditions={selectedConditions}
            onToggleCondition={(condition) => {
              setSelectedConditions(prev => 
                prev.includes(condition) 
                  ? prev.filter(c => c !== condition)
                  : [...prev, condition]
              );
            }}
          />
        )}

        {/* STEP 3: Your Details */}
        {currentStep === 3 && (
          <Step3Details 
            name={name}
            onNameChange={setName}
            details={details}
            onDetailsChange={setDetails}
          />
        )}

        {/* STEP 4: Activity Level */}
        {currentStep === 4 && (
          <Step4Activity 
            activityLevel={activityLevel}
            onSelectActivity={setActivityLevel}
          />
        )}

      </div>

      {/* FOOTER NAVIGATION */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-4 py-4 pb-8">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          {currentStep > 1 && (
            <button
              onClick={prevStep}
              className="px-4 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold flex items-center gap-1 hover:bg-slate-200 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>
          )}
          
          <button
            onClick={nextStep}
            disabled={!canProceed()}
            className={`flex-1 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
              canProceed()
                ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-200 hover:shadow-xl'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {currentStep === STEPS.length ? (
              <>
                <Sparkles className="w-5 h-5" />
                Get Started!
              </>
            ) : (
              <>
                Continue
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// STEP 1: HEALTH GOALS
// ============================================

function Step1HealthGoals({ 
  selectedGoal, 
  onSelectGoal 
}: { 
  selectedGoal: string | null;
  onSelectGoal: (goal: string) => void;
}) {
  const goals = [
    { 
      id: 'lose_weight', 
      label: 'Lose Weight', 
      sublabel: 'Turun Berat',
      description: 'Burn fat and reach a healthier weight',
      icon: '/assets/icon-weight-loss.png',
      color: 'emerald',
      gradient: 'from-emerald-500 to-teal-500',
    },
    { 
      id: 'maintain', 
      label: 'Stay Healthy', 
      sublabel: 'Kekal Sihat',
      description: 'Maintain your current weight and health',
      icon: '/assets/icon-maintain.png',
      color: 'blue',
      gradient: 'from-blue-500 to-indigo-500',
    },
    { 
      id: 'build_muscle', 
      label: 'Build Muscle', 
      sublabel: 'Bina Otot',
      description: 'Gain lean muscle mass and strength',
      icon: '/assets/icon-muscle.png',
      color: 'purple',
      gradient: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <p className="text-slate-500">Choose your primary health goal. This helps us personalize your daily targets.</p>
      </div>
      
      {goals.map((goal) => (
        <button
          key={goal.id}
          onClick={() => onSelectGoal(goal.id)}
          className={`w-full p-5 rounded-2xl border-2 transition-all duration-300 text-left flex items-center gap-4 ${
            selectedGoal === goal.id
              ? `border-${goal.color}-400 bg-gradient-to-br ${goal.gradient} text-white shadow-lg scale-[1.02]`
              : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
          }`}
          style={{
            borderColor: selectedGoal === goal.id ? undefined : undefined,
            background: selectedGoal === goal.id 
              ? `linear-gradient(135deg, ${goal.id === 'lose_weight' ? '#10b981, #14b8a6' : goal.id === 'maintain' ? '#3b82f6, #6366f1' : '#a855f7, #ec4899'})` 
              : undefined,
          }}
        >
          <div className={`w-16 h-16 rounded-xl overflow-hidden ${selectedGoal === goal.id ? 'bg-white/20' : 'bg-slate-100'} flex items-center justify-center flex-shrink-0`}>
            <Image src={goal.icon} alt={goal.label} width={48} height={48} className="w-12 h-12 object-contain" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className={`font-bold text-lg ${selectedGoal === goal.id ? 'text-white' : 'text-slate-800'}`}>
                {goal.label}
              </h3>
              <span className={`text-xs px-2 py-0.5 rounded-full ${selectedGoal === goal.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                {goal.sublabel}
              </span>
            </div>
            <p className={`text-sm mt-1 ${selectedGoal === goal.id ? 'text-white/80' : 'text-slate-500'}`}>
              {goal.description}
            </p>
          </div>
          {selectedGoal === goal.id && (
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Check className="w-5 h-5 text-white" />
            </div>
          )}
        </button>
      ))}
    </div>
  );
}

// ============================================
// STEP 2: HEALTH CONDITIONS
// ============================================

function Step2HealthConditions({ 
  selectedConditions, 
  onToggleCondition 
}: { 
  selectedConditions: string[];
  onToggleCondition: (condition: string) => void;
}) {
  const conditions = [
    { 
      id: 'Diabetes', 
      label: 'Diabetes', 
      sublabel: 'Blood Sugar',
      description: 'We\'ll track sugar and carbs more closely',
      icon: '/assets/icon-diabetes.png',
    },
    { 
      id: 'High Blood Pressure', 
      label: 'Darah Tinggi', 
      sublabel: 'Blood Pressure',
      description: 'We\'ll monitor sodium intake',
      icon: '/assets/icon-kurang-masin.png',
    },
    { 
      id: 'High Cholesterol', 
      label: 'Kolesterol', 
      sublabel: 'Cholesterol',
      description: 'We\'ll flag high-fat foods',
      icon: '/assets/icon-tak-nak-minyak.png',
    },
    { 
      id: 'Kidney Care', 
      label: 'Jaga Buah Pinggang', 
      sublabel: 'Kidney Care',
      description: 'We\'ll track protein and potassium',
      icon: '/assets/icon-jaga-kidney.png',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <p className="text-slate-500">Select any health conditions. This helps Dr. Reza give you personalized advice.</p>
        <p className="text-xs text-slate-400 mt-2">You can skip this if none apply ✓</p>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {conditions.map((condition) => {
          const isSelected = selectedConditions.includes(condition.id);
          return (
            <button
              key={condition.id}
              onClick={() => onToggleCondition(condition.id)}
              className={`p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                isSelected
                  ? 'border-red-400 bg-red-50 shadow-md'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="relative">
                <div className={`w-14 h-14 mx-auto mb-3 rounded-xl overflow-hidden ${isSelected ? 'scale-110' : ''} transition-transform`}>
                  <Image src={condition.icon} alt={condition.label} width={56} height={56} className="w-full h-full object-contain" />
                </div>
                {isSelected && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <h3 className={`font-bold text-sm text-center ${isSelected ? 'text-red-700' : 'text-slate-700'}`}>
                {condition.label}
              </h3>
              <p className={`text-[10px] text-center mt-0.5 ${isSelected ? 'text-red-500' : 'text-slate-400'}`}>
                {condition.sublabel}
              </p>
            </button>
          );
        })}
      </div>
      
      {selectedConditions.length > 0 && (
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-amber-800 text-sm">
            <span className="font-bold">🩺 Great!</span> Dr. Reza will now monitor {selectedConditions.length === 1 ? 'this condition' : 'these conditions'} and adjust advice accordingly.
          </p>
        </div>
      )}
    </div>
  );
}

// ============================================
// STEP 3: YOUR DETAILS
// ============================================

function Step3Details({ 
  name,
  onNameChange,
  details, 
  onDetailsChange 
}: { 
  name: string;
  onNameChange: (name: string) => void;
  details: { age: number; gender: 'male' | 'female'; height: number; weight: number };
  onDetailsChange: (details: any) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="text-center mb-6">
        <p className="text-slate-500">Your details help us calculate accurate calorie targets using scientific formulas.</p>
      </div>
      
      {/* Name */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
          What should we call you?
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Enter your name or nickname"
          className="w-full text-xl font-bold text-slate-800 outline-none bg-transparent placeholder-slate-300"
        />
      </div>
      
      {/* Age & Gender */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
            Age
          </label>
          <div className="flex items-baseline gap-1">
            <input
              type="number"
              value={details.age || ''}
              onChange={(e) => onDetailsChange({ ...details, age: Number(e.target.value) })}
              placeholder="25"
              className="w-full text-2xl font-black text-slate-800 outline-none bg-transparent placeholder-slate-300"
            />
            <span className="text-slate-400 text-sm">years</span>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
            Gender
          </label>
          <div className="flex bg-slate-100 rounded-xl p-1">
            <button
              onClick={() => onDetailsChange({ ...details, gender: 'male' })}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                details.gender === 'male' ? 'bg-white shadow-md text-blue-600' : 'text-slate-400'
              }`}
            >
              👨 Male
            </button>
            <button
              onClick={() => onDetailsChange({ ...details, gender: 'female' })}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                details.gender === 'female' ? 'bg-white shadow-md text-pink-500' : 'text-slate-400'
              }`}
            >
              👩 Female
            </button>
          </div>
        </div>
      </div>
      
      {/* Height & Weight */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
            Height
          </label>
          <div className="flex items-baseline gap-1">
            <input
              type="number"
              value={details.height || ''}
              onChange={(e) => onDetailsChange({ ...details, height: Number(e.target.value) })}
              placeholder="165"
              className="w-full text-2xl font-black text-slate-800 outline-none bg-transparent placeholder-slate-300"
            />
            <span className="text-slate-400 text-sm">cm</span>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
            Weight
          </label>
          <div className="flex items-baseline gap-1">
            <input
              type="number"
              value={details.weight || ''}
              onChange={(e) => onDetailsChange({ ...details, weight: Number(e.target.value) })}
              placeholder="60"
              className="w-full text-2xl font-black text-slate-800 outline-none bg-transparent placeholder-slate-300"
            />
            <span className="text-slate-400 text-sm">kg</span>
          </div>
        </div>
      </div>
      
      {/* BMI Preview */}
      {details.height > 0 && details.weight > 0 && (
        <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-4 border border-teal-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-teal-600 uppercase tracking-wider">Your BMI</p>
              <p className="text-2xl font-black text-teal-700">
                {(details.weight / Math.pow(details.height / 100, 2)).toFixed(1)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-teal-600">
                {(() => {
                  const bmi = details.weight / Math.pow(details.height / 100, 2);
                  if (bmi < 18.5) return '📉 Underweight';
                  if (bmi < 25) return '✅ Healthy';
                  if (bmi < 30) return '⚠️ Overweight';
                  return '🔴 Obese';
                })()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// STEP 4: ACTIVITY LEVEL
// ============================================

function Step4Activity({ 
  activityLevel, 
  onSelectActivity 
}: { 
  activityLevel: string;
  onSelectActivity: (level: string) => void;
}) {
  const levels = [
    { 
      id: 'sedentary', 
      label: 'Sedentary', 
      sublabel: 'Duduk Jer',
      description: 'Office work, little to no exercise',
      emoji: '🪑',
      multiplier: '×1.2',
    },
    { 
      id: 'light', 
      label: 'Lightly Active', 
      sublabel: 'Ringan',
      description: 'Light exercise 1-3 days/week',
      emoji: '🚶',
      multiplier: '×1.375',
    },
    { 
      id: 'moderate', 
      label: 'Moderately Active', 
      sublabel: 'Aktif',
      description: 'Moderate exercise 3-5 days/week',
      emoji: '🏃',
      multiplier: '×1.55',
    },
    { 
      id: 'active', 
      label: 'Very Active', 
      sublabel: 'Atlet',
      description: 'Hard exercise 6-7 days/week',
      emoji: '🔥',
      multiplier: '×1.725',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <p className="text-slate-500">Your activity level affects how many calories you burn daily.</p>
      </div>
      
      {levels.map((level) => (
        <button
          key={level.id}
          onClick={() => onSelectActivity(level.id)}
          className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 text-left flex items-center gap-4 ${
            activityLevel === level.id
              ? 'border-orange-400 bg-orange-50 shadow-md'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl ${
            activityLevel === level.id ? 'bg-orange-100' : 'bg-slate-100'
          }`}>
            {level.emoji}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className={`font-bold ${activityLevel === level.id ? 'text-orange-700' : 'text-slate-700'}`}>
                {level.label}
              </h3>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                activityLevel === level.id ? 'bg-orange-200 text-orange-700' : 'bg-slate-100 text-slate-500'
              }`}>
                {level.sublabel}
              </span>
            </div>
            <p className={`text-sm ${activityLevel === level.id ? 'text-orange-600' : 'text-slate-500'}`}>
              {level.description}
            </p>
          </div>
          <div className={`text-sm font-mono font-bold ${
            activityLevel === level.id ? 'text-orange-600' : 'text-slate-400'
          }`}>
            {level.multiplier}
          </div>
        </button>
      ))}
      
      {/* Explanation */}
      <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
        <p className="text-slate-600 text-xs">
          <span className="font-bold">💡 How it works:</span> We multiply your BMR (Basal Metabolic Rate) by the activity multiplier to calculate your TDEE (Total Daily Energy Expenditure).
        </p>
      </div>
    </div>
  );
}

