import '../../css/main.css';
import '../../App.css';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';

function Main() {
  const [formData, setFormData] = useState({
    name: '',
    number: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isSubmitted = localStorage.getItem('submitted');
    if (isSubmitted === 'true') {
      setSubmitted(true);
    }

    const now = new Date()
    const startDate = new Date('2025-03-04T00:00:00')
    const endDate = new Date('2025-03-11T23:59:59')

    if(now < startDate || now > endDate) {
      setIsClosed(true);
    } else {
      setIsClosed(false);
    }

    setLoading(false);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = await supabase.from('broadcasting').insert(formData);

    if (error) {
      alert('오류가 발생했습니다. 다시 시도해주세요.');
      console.log(error);
    } else {
      setSubmitted(true);
      localStorage.setItem('submitted', 'true');
      setFormData({
        name: '',
        number: ''
      });
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    localStorage.removeItem('submitted');
  };

  if(loading) {
    return
  }

  return (
    <div>
      <head>
        <title>방송부 신청</title>
      </head>

      {isClosed ? (
        <>
        <div className="flex flex-col items-center justify-center text-center h-screen">
          <div className="flex items-center justify-center">
            <svg width="42" height="42" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45" stroke="black" strokeWidth="5" fill="none" />
              <path d="M30 30 L70 70 M70 30 L30 70" stroke="black" strokeWidth="5" strokeLinecap="round" />
            </svg>
          </div>
          <p className="mt-2 noto-sans-kr-400-normal">
            지금은 방송부 신청 기간이 아닙니다.<br />
            <a href="https://samgong-h.notion.site/" className="underline" target='_blank' rel='noopener noreferrer'>여기</a>에서 방송부 신청 기간을 확인 후 새로고침을 해주세요.
          </p>
        </div>
      </>
      
      ) : (
        !submitted ? (
          <form className="mt-6 max-w-2xl mx-auto flex flex-col" onSubmit={handleSubmit}>
            <div className="rounded-lg form-box">
              <div className="bg-[#5865f2] bg-opacity-85 w-full h-36 rounded-tl-lg rounded-tr-lg color-box"></div>
              <div className="p-5">
                <h1 className="noto-sans-kr-900-normal text-3xl">방송부 신청</h1>
                <div className='mt-1'>
                  <p className="noto-sans-kr-400-normal">
                    방송부 신청을 위해 아래에 정보를 입력해주세요.<br />
                    <a href='https://samgong-h.notion.site' className="underline" target='_blank' rel='noopener noreferrer'>여기</a>
                    를 클릭해 학사일정에서 자세한 일정을 볼 수 있습니다.<br /><br />
                    <span className='text-red-600 noto-sans-kr-600-normal'>양식은 제출 후 수정할 수 없습니다.</span>
                  </p>
                </div>
                <div className="mt-4">
                  <div className="noto-sans-kr-400-normal bg-gray-100 max-w-max rounded-3xl" style={{ padding: "8px 18px", fontSize: "14px" }}>
                    <p style={{ opacity: '.7' }}>2025.03.04. (화) ~ 2025.03.11. (화)</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="required text-red-600 noto-sans-kr-500-normal mt-1 mb-1">필수사항</div>
            </div>
            <div className="rounded-lg form-box">
              <div className="p-4">
                <div className="noto-sans-kr-600-normal title">
                  <p className='required-box'>1. 학번이름</p>
                </div>
                <div className="noto-sans-kr-400-normal mt-0.5 description">
                  <p>예) 1101 홍길동</p>
                </div>
                <div className="mt-4">
                  <textarea name="name" className="noto-sans-kr-400-normal w-full textarea bg-[#f7f8fb] rounded-lg resize-none req-content" value={formData.name} rows="1"
                    placeholder='학번이름을 입력해주세요.' spellCheck="false" autoComplete='off' autoCorrect='off' autoCapitalize='off' maxLength={100}
                    onInput={(e) => { e.target.style.height = "auto"; e.target.style.height = e.target.scrollHeight + "px"; }}
                    onChange={handleChange} required></textarea>
                </div>
              </div>
            </div>
            <div className="rounded-lg form-box mt-6">
              <div className="p-4">
                <div className="noto-sans-kr-600-normal title required-box">
                  2. 전화번호
                </div>
                <div className="noto-sans-kr-400-normal mt-0.5 description">
                  <p>예) 010-1234-5678</p>
                </div>
                <div className="mt-4">
                  <textarea name="number" className="noto-sans-kr-400-normal w-full textarea bg-[#f7f8fb] rounded-lg resize-none req-content" value={formData.number} rows="1"
                    placeholder='전화번호를 입력해주세요.' spellCheck="false" autoComplete='off' autoCorrect='off' autoCapitalize='off' maxLength={15}
                    onInput={(e) => { e.target.style.height = "auto"; e.target.style.height = e.target.scrollHeight + "px"; }}
                    onChange={handleChange} required></textarea>
                </div>
              </div>
            </div>
            <div className="p-4 mt-4 mb-4 mx-auto">
              <button type="submit" className="bg-[#414cca] text-white w-28 p-2 rounded-md noto-sans-kr-400-normal">제출</button>
            </div>
          </form>
        ) : (
          <div className="flex items-center h-screen justify-center flex-col">
            <div className="mb-4">
              <svg width="44" height="44" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" stroke="black" strokeWidth="5" fill="none" />
                <path d="M30 50 L45 65 L70 35" stroke="black" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="mb-4">
              <p className="text-lg noto-sans-kr-400-normal">답변이 제출되었습니다.</p>
            </div>
            <button type='button' className='bg-[#5076c8] bg-opacity-20 rounded-xl' style={{ padding: '10px 20px' }} onClick={handleReset}>
              <div>
                <p className='noto-sans-kr-600-normal text-blue-700 text-sm'>추가 작성 하기</p>
              </div>
            </button>
          </div>
        )
      )}
    </div>
  );
}

export default Main;
