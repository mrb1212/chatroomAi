import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { sendOtp, otpRegister, update } from '../../redux/actions/authActions';
import type { RootState } from '../../redux/stores/store';
import { AppDispatch } from '../../redux/stores/store';
import { LogIn, Phone, User, ArrowLeft } from 'lucide-react';
import { Typewriter } from '../common/Typewriter';
import './AuthForm.scss';

import OtpInput from 'react-otp-input';
import { LogoAnimation } from '../common/LogoAnimation';

type AuthStep = 'phone' | 'otp' | 'info';

const descriptions = [
  'دستیار هوشمند حقوقی',
  'مشاوره آنلاین با وکلای مجرب',
  'تنظیم قراردادهای حقوقی',
  'پاسخگویی 24 ساعته'
];

export const AuthForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const auth = useSelector((state: RootState) => state.auth);

  const [step, setStep] = useState<AuthStep>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [currentDescIndex, setCurrentDescIndex] = useState(0);

  useEffect(() => {
    if (auth.otpRegisterStatus === 'FAILURE' && auth.otpRegisterError) {
      enqueueSnackbar(auth.otpRegisterError.message || 'خطا در ورود', {
        variant: 'error'
      });
      setStep('otp');
    }
    
    if (auth.otpRegisterStatus === 'SUCCESS' && auth.user?.firstName) {
      setStep('info');
    }
  }, [auth.otpRegisterStatus]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDescIndex(prev => (prev + 1) % descriptions.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);
  



  useEffect(() => {
      if (auth.isAuthenticated && auth.user?.firstName && auth.user?.lastName && auth?.user?.phoneNumber) {
        navigate('/chat');
        return;
      }

      if(!auth.isAuthenticated) {
        setStep('phone');
        return
      }
      if(!auth.user?.firstName || !auth.user?.lastName) {
        setStep('info');
        return;
      }
  }, [auth.isAuthenticated]);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (step === 'phone') {
        if (!phoneNumber.match(/^09[0-9]{9}$/)) {
          enqueueSnackbar('شماره موبایل نامعتبر است', {
            variant: 'error'
          });
          return;
        }
        await dispatch(await sendOtp({ phoneNumber }));
        enqueueSnackbar('کد تایید ارسال شد', {
          variant: 'success'
        });
        setStep('otp');
      } 
      else if (step === 'otp') {
        if (!otpCode || otpCode.length !== 4) {
          enqueueSnackbar('کد تایید نامعتبر است', {
            variant: 'error'
          });
          return;
        }
        await dispatch(await otpRegister({ phoneNumber, otpCode }));
        if (auth.isAuthenticated) {
          if (auth.user?.firstName && auth.user?.lastName && auth?.user?.phoneNumber) {
            navigate('/chat');
          }
          setStep('info');
        }
      }
      else if (step === 'info') {
        if (!firstName.trim() || !lastName.trim()) {
          enqueueSnackbar('لطفا نام و نام خانوادگی را وارد کنید', {
            variant: 'error'
          });
          return;
        }
        await dispatch(await update({ mode: 'UPD', firstName, lastName }));
        enqueueSnackbar('ثبت نام با موفقیت انجام شد', {
          variant: 'success'
        });
        navigate('/chat');
      }
    } catch (err: any) {
      enqueueSnackbar(err.message || 'خطا در برقراری ارتباط', {
        variant: 'error'
      });
    }
  };

  const renderOtpStep = () => (
    <>
      <div className="form-group otp-group">
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          direction: "rtl",
          flexWrap: "wrap"
        }}>
          <p className="help-text">
            کد تایید به شماره
            <span className="phone-number">{phoneNumber}</span>
            ارسال شد
          </p>
          <button
            type="button"
            className="back-btn"
            onClick={() => {
              setOtpCode('');
              setStep('phone');
            }}
          >
            تغییر شماره
          </button>
        </div>
        <OtpInput
          value={otpCode}
          onChange={setOtpCode}
          numInputs={4}
          renderInput={(props) => <input {...props} />}
          shouldAutoFocus
          containerStyle={{display: "flex", alignItems: "center", gap: "30px", justifyContent: "center"}}
          inputStyle={{width: "3rem", height: "3.5rem"}}
          inputType="tel"
        />
      </div>
    </>
  );

  const renderInfoStep = () => {
    if (auth.user?.firstName && auth.user?.lastName) {
      return (
        <div className="welcome-message">
          <h2>خوش آمدید</h2>
          <p>
            {auth.user.firstName} {auth.user.lastName} عزیز
          </p>
          <p>در حال انتقال به پنل کاربری...</p>
        </div>
      );
    }

    return (
      <>
        <div className="form-group">
          <User size={20} />
          <input
            type="text"
            placeholder="نام"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <User size={20} />
          <input
            type="text"
            placeholder="نام خانوادگی"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-btn">
          تکمیل ثبت نام
          <ArrowLeft size={18} />
        </button>
      </>
    );
  };

  const getStepTitle = () => {
    switch (step) {
      case 'phone': return 'ورود به سیستم';
      case 'otp': return 'کد تایید';
      case 'info': return 'تکمیل اطلاعات';
    }
  };

  return (
    <div className="auth-container">
      {[...Array(20)].map((_, i) => (
        <div key={i} className="particle" />
      ))}
      
      <div className="auth-description" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <LogoAnimation size={40}  className="logo-animation" /> 
        <Typewriter 
          text={descriptions[currentDescIndex]} 
          speed={100}
          className="description-text"
        />
      </div>

      <div className="auth-card">
        <div className="auth-header">
          <LogIn size={28} />
          <h1>
            {getStepTitle()}
          </h1>
          {error && <p className="error-message">{error}</p>}
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {step === 'phone' && (
            <div className="form-group">
              <Phone size={20} />
              <input
                type="tel"
                placeholder="شماره موبایل"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                pattern="09[0-9]{9}"
                required
                disabled={auth.otpSendLoading === 'sending'}
              />
            </div>
          )}

          {step === 'otp' && renderOtpStep()}

          {step === 'info' && renderInfoStep()}

          {step !== "info" &&
            <button type="submit" className="submit-btn">
              {step === 'phone' && (auth.otpSendLoading === 'sending' ? 'در حال ارسال...' : 'دریافت کد تایید')}
              {step === 'otp' && (auth.otpRegisterLoading === 'loading' ? 'در حال بررسی...' : 'ورود')}
              <ArrowLeft size={18} />
            </button>
          }
        </form>
      </div>
    </div>
  );
};
