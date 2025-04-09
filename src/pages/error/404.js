import React from "react";

function NotFound() {
    return (
        <div>
            <head>
                <title>Page Not Found</title>
            </head>
            <div className="p-4">
                <h1 class="noto-sans-kr-900-normal text-[#5865f2] text-4xl">페이지를 찾을 수 없습니다</h1>
                <div>
                    <p class="noto-sans-kr-500-normal mt-2">죄송합니다. 요청하신 페이지를 찾을 수 없습니다.</p>
                </div>
            </div>
        </div>
    )
}

export default NotFound;