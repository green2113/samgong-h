import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../../supabase';
import Error from '../error/404';
import '../../App.css';

function AdminPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const pw = params.get('pw');

  const [responses, setResponses] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('broadcasting').select('*');

      if (error) {
        console.error('데이터 불러오기 오류:', error);
      } else {
        setResponses(data);
      }
    };

    fetchData();
  }, []);

  if (pw !== process.env.REACT_APP_ADMINPAGE_PASSWORD) {
    return <Error />;
  }

  const currentData = responses.length > 0 ? responses[currentIndex] : null;

  const handleNext = () => {
    if (currentIndex < responses.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div>
      <head>
        <title>방송부 신청 응답</title>
      </head>
      <div className='mt-10 max-w-3xl mx-auto flex flex-col'>
        {currentData ? (
          <>
            <div class='box p-4 rounded-lg mb-10'>
              <div className='text'>
                <p className='noto-sans-kr-900-normal mb-2 text-[#5865f2]'>진행 중</p>
                <h1 className='text-xl font-bold'>방송부 신청</h1>
                <p className='text-base text-gray-600'>2025.03.04. ~ 2025.03.11.</p>
              </div>
            </div>
            <div className='flex justify-end'>
              <div className='space-x-6'>
                <button onClick={handlePrev} disabled={currentIndex === 0}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={currentIndex === 0 ? 'gray' : 'black'}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 18l-6-6 6-6"></path>
                  </svg>
                </button>
                <button onClick={handleNext} disabled={currentIndex === responses.length - 1}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={currentIndex === responses.length - 1 ? 'gray' : 'black'}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 18l6-6-6-6"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div className='flex justify-between mb-2'>
              <div>
                <p className='text-[#5865f2] se-nanum-square-900-normal'>{responses.length > 0 ? `${currentIndex + 1} / ${responses.length}` : '0 / 0'}</p>
              </div>
              <div>
                <p className='noto-sans-kr-500-normal'>{new Date(currentData.created_at).toLocaleString()}</p>
              </div>
            </div>

            <div>
              <div className="rounded-lg form-box">
                <div className="p-4">
                  <div className="noto-sans-kr-600-normal title">
                    <p className='required-box'>1. 학번이름</p>
                  </div>
                  <div className="noto-sans-kr-400-normal mt-0.5 description">
                    <p>예) 1101 홍길동</p>
                  </div>
                  <div className="mt-4">
                    <textarea className="noto-sans-kr-400-normal w-full textarea bg-[#f7f8fb] rounded-lg outline-none resize-none cursor-default" 
                      value={currentData.name} readOnly rows="1"></textarea>
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
                    <textarea className="noto-sans-kr-400-normal w-full textarea bg-[#f7f8fb] rounded-lg outline-none resize-none cursor-default" 
                      value={currentData.number} readOnly rows="1"></textarea>
                  </div>
                </div>
              </div>

              
            </div>
          </>
        ) : (
          <p className="text-center noto-sans-kr-400-normal">제출된 데이터가 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
