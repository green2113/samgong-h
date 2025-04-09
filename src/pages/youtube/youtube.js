import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/youtube.css';

const YOUTUBE_API_KEY = process.env.REACT_APP_API_KEY;
const GPT_PROXY_URL = process.env.REACT_APP_GPT_PROXY;

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
              q: query,
              videoCategoryId: 10,
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
			const response = await axios.post(GPT_PROXY_URL, {
				model: 'gpt-3.5-turbo',
				messages: [
					{
						role: 'user',
						content: `${title} 이 노래의 가사를 찾아서 이 가사에 욕설 또는 부적절한 단어가 들어가는지 확인 해줘. 그게 들어가 있다면 '[부적절한 가사가 들어간 노래제목(찾은 제목)]에는 부적절한 단어가 포함되어 있습니다.\n[부적절한 단어들]' 이런식으로 말해. 부적절한 단어가 없다면 '부적절한 단어가 없습니다.' 라고 말해.`,
					},
				],
			});

			const reply = response.data.choices[0].message.content;
			setGptResponse(reply);
		} catch (error) {
			console.error('Error checking lyrics:', error);
			setGptResponse('Error checking lyrics');
		}
	};

	const handleVideoSelect = async	(video) => {
		setSelectedVideoId(video.id.videoId);
		setGptResponse('가사에 욕설이 있는지 확인중이에요.')
		await checkLyricsForInappropriateWords(video.snippet.title);
	}

  return (
    <div className="app-background">
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
              title="YouTube video player"
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
						<div className="gpt-response">
							{gptResponse}
						</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
