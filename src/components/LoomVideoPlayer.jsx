import React, { useState, useRef, useEffect } from 'react';

const LoomVideoPlayer = ({ videoUrl, title = "Chapter Video", onVideoWatched = null }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasWatched, setHasWatched] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const iframeRef = useRef(null);

  // Convert Loom share URL to embed URL
  const getEmbedUrl = (url) => {
    if (!url) return null;
    
    // Extract video ID from Loom share URL
    const match = url.match(/loom\.com\/share\/([a-zA-Z0-9]+)/);
    if (match) {
      return `https://www.loom.com/embed/${match[1]}`;
    }
    return url; // Return as-is if already an embed URL
  };

  const embedUrl = getEmbedUrl(videoUrl);

  // Handle video play button click
  const handlePlayClick = () => {
    setShowPlayer(true);
    setIsLoaded(true);
  };

  // Handle manual video completion marking
  const handleMarkAsWatched = () => {
    setHasWatched(true);
    if (onVideoWatched) {
      onVideoWatched();
    }
  };

  // Listen for messages from the Loom iframe to track video events
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== 'https://www.loom.com') return;
      
      try {
        const data = event.data;
        
        // Handle player.js events from Loom
        if (data && data.context === 'player.js') {
          // When iframe is ready, add event listeners
          if (data.event === 'ready') {
            console.log('Loom video ready, adding event listeners');
            const iframe = iframeRef.current;
            if (iframe) {
              // Add ended event listener
              iframe.contentWindow.postMessage({
                method: 'addEventListener',
                value: 'ended',
                context: 'player.js'
              }, '*');
              
              // Add timeupdate event listener for progress tracking
              iframe.contentWindow.postMessage({
                method: 'addEventListener',
                value: 'timeupdate',
                context: 'player.js'
              }, '*');
            }
          }
          
          // Handle video ended
          if (data.event === 'ended') {
            console.log('Video ended - marking as watched');
            setHasWatched(true);
            if (onVideoWatched) {
              onVideoWatched();
            }
          }
          
          // Handle time updates for progress tracking (simplified)
          if (data.event === 'timeupdate') {
            // For now, we'll rely primarily on the 'ended' event
            // and provide a manual button for users to mark completion
          }
        }
      } catch (e) {
        // Ignore non-JSON messages or parsing errors
        console.log('Non-JSON message received:', event.data);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onVideoWatched, hasWatched]);

  if (!embedUrl) {
    return (
      <div className="bg-silver-100 rounded-lg p-8 text-center">
        <i className="fas fa-exclamation-triangle text-silver-400 text-3xl mb-4"></i>
        <p className="text-silver-600">Video URL not available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-silver-200 overflow-hidden shadow-sm">
      {/* Video Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-navy-50 to-indigo-50 border-b border-silver-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <i className="fas fa-play-circle text-navy-600 text-xl mr-3"></i>
            <h4 className="text-lg font-semibold text-navy-800">{title}</h4>
          </div>
          {hasWatched && (
            <div className="flex items-center text-green-600">
              <i className="fas fa-check-circle mr-2"></i>
              <span className="text-sm font-medium">Watched</span>
            </div>
          )}
        </div>
      </div>

      {/* Video Player Container */}
      <div className="relative">
        {!showPlayer ? (
          // Play Button Overlay
          <div className="relative bg-gradient-to-br from-navy-800 to-navy-600 aspect-video flex items-center justify-center cursor-pointer group" onClick={handlePlayClick}>
            <div className="absolute inset-0 bg-black opacity-20 group-hover:opacity-10 transition-opacity"></div>
            <div className="relative z-10 text-center">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:bg-opacity-30 transition-all">
                <i className="fas fa-play text-white text-2xl ml-1"></i>
              </div>
              <p className="text-white text-lg font-medium mb-2">Watch Chapter Video</p>
              <p className="text-silver-200 text-sm">Click to start learning</p>
            </div>
          </div>
        ) : (
          // Loom Iframe Player
          <div className="relative aspect-video">
            <iframe
              ref={iframeRef}
              src={embedUrl}
              className="absolute inset-0 w-full h-full"
              frameBorder="0"
              webkitAllowFullScreen
              mozAllowFullScreen
              allowFullScreen
              allow="camera; microphone; fullscreen; display-capture; autoplay"
              loading="lazy"
              title={title}
              onLoad={() => setIsLoaded(true)}
            />
            
            {!isLoaded && (
              <div className="absolute inset-0 bg-silver-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-navy-600 mb-4"></div>
                  <p className="text-silver-600">Loading video...</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Video Footer */}
      <div className="px-6 py-3 bg-silver-50 border-t border-silver-200">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-silver-600">
            <i className="fas fa-info-circle mr-2"></i>
            <span>{showPlayer ? "Use fullscreen for best experience" : "Click to play the chapter walkthrough"}</span>
          </div>
          
          {showPlayer && !hasWatched && (
            <button
              onClick={handleMarkAsWatched}
              className="px-3 py-1 bg-navy-600 text-white rounded-md hover:bg-navy-700 transition-colors text-xs font-medium"
            >
              <i className="fas fa-check mr-1"></i>
              Mark as Watched
            </button>
          )}
          
          {hasWatched && (
            <div className="flex items-center text-green-600 font-medium">
              <i className="fas fa-check-circle mr-1"></i>
              Completed
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoomVideoPlayer;