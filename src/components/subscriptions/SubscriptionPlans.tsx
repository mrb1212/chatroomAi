import React from 'react';
import { Crown, Check } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const plans = [
  {
    name: 'رایگان',
    price: '0',
    features: [
      'دسترسی به مشاور حقوقی هوشمند',
      '5 گفتگو در ماه',
      'دسترسی به قالب‌های پایه',
    ],
    recommended: false,
  },
  {
    name: 'پایه',
    price: '199,000',
    features: [
      'تمام امکانات پلن رایگان',
      '50 گفتگو در ماه',
      'دسترسی به تمام قالب‌ها',
      'پشتیبانی ایمیلی',
    ],
    recommended: true,
  },
  {
    name: 'حرفه‌ای',
    price: '499,000',
    features: [
      'گفتگوی نامحدود',
      'دسترسی به تمام قالب‌ها',
      'پشتیبانی تلفنی',
      'مشاوره اختصاصی',
      'اولویت در پاسخگویی',
    ],
    recommended: false,
  },
];

export function SubscriptionPlans() {
  const { user } = useAuthStore();

  const handleSubscribe = async (planName: string) => {
    // TODO: Implement payment gateway integration
    console.log(`Subscribing to ${planName}`);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">اشتراک‌ها</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-2xl p-6 ${
              plan.recommended
                ? 'bg-primary/10 border-2 border-primary'
                : 'bg-surface'
            }`}
          >
            {plan.recommended && (
              <div className="flex items-center justify-center gap-2 text-primary mb-4">
                <Crown className="w-5 h-5" />
                <span className="font-medium">پیشنهاد ویژه</span>
              </div>
            )}
            
            <h2 className="text-xl font-bold mb-2">{plan.name}</h2>
            
            <div className="mb-6">
              <span className="text-3xl font-bold">{plan.price}</span>
              <span className="text-gray-400"> تومان / ماهانه</span>
            </div>
            
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <button
              onClick={() => handleSubscribe(plan.name)}
              className={`w-full py-2 px-4 rounded-lg font-medium ${
                plan.recommended
                  ? 'bg-primary hover:bg-primary/90'
                  : 'bg-surface hover:bg-surface/90 border border-gray-700'
              }`}
            >
              انتخاب اشتراک
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}