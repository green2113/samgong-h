import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/youtube.css';
import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.REACT_APP_OPENAI_API_KEY, dangerouslyAllowBrowser: true });
const YOUTUBE_API_KEY = process.env.REACT_APP_API_KEY;

function Home() {
  const [query, setQuery] = useState('');
  const [videos, setVideos] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gptResponse, setGptResponse] = useState('');

  useEffect(() => {
    if (query.trim() !== '') {
      setLoading(true);
    } else {
      setVideos([]);
      setLoading(false);
      return;
    }

    const delayDebounce = setTimeout(() => {
      const fetchVideos = async () => {
        try {
          const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
              part: 'snippet',
              maxResults: 5,
              q: query + ' 가사',
              type: 'video',
              order: 'relevance',
              key: YOUTUBE_API_KEY,
            },
          });
          setVideos(response.data.items);
        } catch (error) {
          console.error('Error fetching videos:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchVideos();
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const checkLyricsForInappropriateWords = async (title) => {
    try {
      const response = await client.responses.create({
        model: "gpt-4o",
        input: [
          {
            "role": "instructions",
            "content": [
              {
                "type": "input_text",
                "text": "사용자가 노래 제목을 입력하면 그 노래의 가사에 부적절한 단어가 있으면 \"[부른사람 - 노래제목] 에는 부적절한 단어가 포함되어 있습니다.\\n[부적절한 단어] -, -\" 이렇게 보내고 없다면 \"[부른사람 - 노래제목] 에는 부적절한 단어가 없습니다.\"라고 보내고. 만약 노래 가사를 찾을 수 없다거나 다른 문제가 있다면 \"에러: 가사를 확인하는 중에 오류가 발생했습니다. [에러내용]\"라고 보내. 만약 노래 제목만 있거나 가수만 있다면 그 중 아무 노래나 골라서 알려줘. 부적절한 단어가 있는지 없는지만 딱 말해\n\n부적절한 단어 예시 - sex, drunk, alcohol(술), ni***, fuck, Brat, Bullshit, Buffoon"
              }
            ]
          },
          {
            "role": "user",
            "content": [
              {
                "type": "input_text",
                "text": title
              }
            ]
          }
        ],
        text: {
          "format": {
            "type": "text"
          }
        },
        reasoning: {},
        tools: [
          {
            "type": "web_search_preview",
            "user_location": {
              "type": "approximate"
            },
            "search_context_size": "medium"
          }
        ],
        temperature: 1,
        max_output_tokens: 2048,
        top_p: 1,
        store: true
      });

      setGptResponse(response.output_text)
    } catch (error) {
      console.error('Error checking lyrics:', error);
      setGptResponse('Error checking lyrics');
    }
  };

  const handleVideoSelect = async (video) => {
    setSelectedVideoId(video.id.videoId);
    setGptResponse('가사에 부적절한 단어가 있는지 확인중이에요...');
    await checkLyricsForInappropriateWords(video.snippet.title);
  };

  return (
    <div className="app-background">
      <head>
        <title>노래 검색</title>
      </head>
      <div className={`search-container ${isFocused ? 'focused' : ''}`}>
        <input
          type="text"
          className="search-input"
          placeholder="검색"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {(loading || videos.length > 0) && (
          <div className="video-results">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="video-item shimmer">
                  <div className="video-thumbnail shimmer-box"></div>
                  <div className="video-info">
                    <div className="shimmer-line short"></div>
                    <div className="shimmer-line long"></div>
                  </div>
                </div>
              ))
            ) : (
              videos.map((video) => (
                <div
                  key={video.id.videoId}
                  className="video-item"
                  onClick={() => handleVideoSelect(video)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="video-link">
                    <img
                      className="video-thumbnail"
                      src={video.snippet.thumbnails.default.url}
                      alt={video.snippet.title}
                    />
                    <div className="video-info">
                      <p className="video-title" title={video.snippet.title}>{video.snippet.title}</p>
                      <p className="video-channel">{video.snippet.channelTitle}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {selectedVideoId && (
          <div className="video-player">
            <iframe
              width="100%"
              height="250"
              src={`https://www.youtube.com/embed/${selectedVideoId}?autoplay=1`}
              title="Youtube Video Player"
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
            <div className="gpt-response">
              {gptResponse}

              <ul className="gpt-response-text">
                <li>
                  * 해당 결과는 AI가 판단한 결과로 정확하지 않을 수 있습니다.<br />만약 오류가 발생했다면 다른 영상을 선택해 주세요.
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
