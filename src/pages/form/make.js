import '../../App.css';
import React, { useState } from 'react';

function Make() {
    const [text, setText] = useState();

    return(
        <div>
            <head>
                <title>폼 만들기</title>
            </head>
            <form className='flex flex-col max-w-2xl mx-auto mt-6'>
                <div className='box rounded-lg'>
                    <div className="bg-[#5865f2] bg-opacity-85 w-full h-36 rounded-tl-lg rounded-tr-lg color-box"></div>
                    <div className='p-5'>
                        <textarea className='noto-sans-kr-900-normal text-3xl w-full resize-none outline-none hover:border-b-2 focus:border-b-2 focus:border-[#5865f2]'
                        rows='1' placeholder='폼 제목 입력 (최대 30자)' spellCheck='false'
                        autoComplete='off' autoCapitalize='off' autoCorrect='off' maxLength={30}
                        onInput={(e) => { e.target.style.height = "auto"; e.target.style.height = e.target.scrollHeight + "px"; }}
                        onChange={(e) => setText(e.target.value)}
                        value={text}
                        style={{ overflow: 'hidden' }}></textarea>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Make;