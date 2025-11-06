import { useRef, useState, useEffect } from 'react';

export default function MediaGrid() {
  const videoRefs = useRef({});
  const [playingVideos, setPlayingVideos] = useState({});
  const [loadedVideos, setLoadedVideos] = useState({});
  
  // Media com vídeos laterais do Imgur (9 vídeos)
  const media = [
    { src: 'https://i.imgur.com/ofey6L2.mp4', type: 'video', poster: 'https://i.imgur.com/ofey6L2.jpg' },
    { src: 'https://i.imgur.com/lvlRyIq.mp4', type: 'video', poster: 'https://i.imgur.com/lvlRyIq.jpg' },
    { src: 'https://i.imgur.com/v1Fi2rD.mp4', type: 'video', poster: 'https://i.imgur.com/v1Fi2rD.jpg' },
    { src: 'https://i.imgur.com/rIUM7wU.mp4', type: 'video', poster: 'https://i.imgur.com/rIUM7wU.jpg' },
    { src: 'https://i.imgur.com/d9Wjtg9.mp4', type: 'video', poster: 'https://i.imgur.com/d9Wjtg9.jpg' },
    { src: 'https://i.imgur.com/iIcW66z.mp4', type: 'video', poster: 'https://i.imgur.com/iIcW66z.jpg' },
    { src: 'https://i.imgur.com/lpZNnOh.mp4', type: 'video', poster: 'https://i.imgur.com/lpZNnOh.jpg' },
    { src: 'https://i.imgur.com/nSkM44v.mp4', type: 'video', poster: 'https://i.imgur.com/nSkM44v.jpg' },
    { src: 'https://i.imgur.com/dwXPENC.mp4', type: 'video', poster: 'https://i.imgur.com/dwXPENC.jpg' },
  ];

  // Lazy load vídeos apenas quando entrarem na viewport
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.dataset.index);
          setLoadedVideos(prev => ({ ...prev, [index]: true }));
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '50px' // Carregar 50px antes de entrar na viewport
    });

    // Observar apenas vídeos
    media.forEach((item, index) => {
      if (item.type === 'video') {
        const element = document.querySelector(`[data-media-index="${index}"]`);
        if (element) {
          observer.observe(element);
        }
      }
    });

    return () => observer.disconnect();
  }, []);

  const handleMouseEnter = (index) => {
    const video = videoRefs.current[`video-${index}`];
    if (video && !video.dataset.keepPlaying) {
      // Só reproduzir no hover se não estiver em modo "mantido" (por clique)
      if (!loadedVideos[index] && video.readyState === 0) {
        video.load();
        setLoadedVideos(prev => ({ ...prev, [index]: true }));
      }
      
      if (video.paused && !video.dataset.isPlaying) {
        video.dataset.isPlaying = 'true'; // Marcar que está tentando reproduzir
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setPlayingVideos(prev => ({ ...prev, [index]: true }));
              video.dataset.isPlaying = 'false';
            })
            .catch(err => {
              // Ignorar erros de abort (normal quando pausa enquanto está carregando)
              if (err.name !== 'AbortError' && err.name !== 'NotAllowedError') {
                console.log('Erro ao reproduzir vídeo:', err);
              }
              setPlayingVideos(prev => ({ ...prev, [index]: false }));
              video.dataset.isPlaying = 'false';
            });
        }
      }
    }
  };

  const handleMouseLeave = (index) => {
    // No mobile, não pausar ao sair do hover
    const video = videoRefs.current[`video-${index}`];
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Se for desktop e não estiver em modo "mantido" (por clique), pausar
    if (!isMobile && video && !video.paused && !video.dataset.keepPlaying && video.dataset.isPlaying !== 'true') {
      video.dataset.isPlaying = 'false';
      const pausePromise = video.pause();
      if (pausePromise && typeof pausePromise.catch === 'function') {
        pausePromise.catch(() => {}); // Ignorar erros ao pausar
      }
      video.currentTime = 0; // Resetar para o início
      setPlayingVideos(prev => ({ ...prev, [index]: false }));
    }
  };

  const pauseAllVideosExcept = (exceptIndex) => {
    // Pausar todos os vídeos exceto o que foi clicado
    Object.keys(videoRefs.current).forEach((key) => {
      const videoIndex = parseInt(key.replace('video-', ''));
      if (videoIndex !== exceptIndex) {
        const otherVideo = videoRefs.current[key];
        if (otherVideo) {
          // Pausar se estiver reproduzindo
          if (!otherVideo.paused) {
            otherVideo.dataset.keepPlaying = 'false';
            const pausePromise = otherVideo.pause();
            if (pausePromise && typeof pausePromise.catch === 'function') {
              pausePromise.catch(() => {});
            }
            otherVideo.currentTime = 0;
          }
        }
      }
    });
    
    // Limpar estado de todos os vídeos (o vídeo selecionado será marcado depois)
    setPlayingVideos({});
  };

  const handleClick = (index, itemType) => {
    const video = videoRefs.current[`video-${index}`];
    
    if (video && itemType === 'video') {
      // Toggle play/pause ao clicar
      if (video.paused) {
        // Pausar todos os outros vídeos primeiro
        pauseAllVideosExcept(index);
        
        // Carregar vídeo se ainda não foi carregado
        if (!loadedVideos[index] && video.readyState === 0) {
          video.load();
          setLoadedVideos(prev => ({ ...prev, [index]: true }));
        }
        
        // Marcar para manter reproduzindo
        video.dataset.keepPlaying = 'true';
        
        // Função para reproduzir o vídeo
        const playVideo = () => {
          const playPromise = video.play();
          
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setPlayingVideos(prev => ({ ...prev, [index]: true }));
              })
              .catch(err => {
                // Ignorar erros de abort e NotAllowed (autoplay bloqueado)
                if (err.name !== 'AbortError' && err.name !== 'NotAllowedError') {
                  console.log('Erro ao reproduzir vídeo:', err);
                }
                setPlayingVideos(prev => ({ ...prev, [index]: false }));
                video.dataset.keepPlaying = 'false';
              });
          } else {
            // Se play() não retornou Promise, assumir que está reproduzindo
            setPlayingVideos(prev => ({ ...prev, [index]: true }));
          }
        };
        
        // Se o vídeo já está carregado, reproduzir imediatamente
        // Caso contrário, aguardar um pouco para carregar
        if (video.readyState >= 2) {
          playVideo();
        } else {
          video.addEventListener('loadeddata', playVideo, { once: true });
          // Fallback: tentar reproduzir após 200ms mesmo se loadeddata não disparar
          setTimeout(() => {
            if (video.paused) {
              playVideo();
            }
          }, 200);
        }
      } else {
        // Pausar se já está reproduzindo
        video.dataset.keepPlaying = 'false';
        const pausePromise = video.pause();
        if (pausePromise && typeof pausePromise.catch === 'function') {
          pausePromise.catch(() => {}); // Ignorar erros
        }
        video.currentTime = 0;
        setPlayingVideos(prev => ({ ...prev, [index]: false }));
      }
    }
  };

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {media.map((item, index) => (
        <div 
          key={index} 
          className="aspect-square relative media-item" 
          data-media-index={index}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={() => handleMouseLeave(index)}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // No mobile, permitir clique para togglear vídeo
            handleClick(index, item.type);
          }}
        >
          {item.type === 'video' ? (
            <>
              {/* Thumbnail/Preview - sempre visível com blur */}
              <img 
                src={item.poster || item.src.replace('.mp4', '.jpg')} 
                alt={`Preview ${index + 1}`}
                className={`w-full h-full object-cover rounded-lg media-blur transition-all duration-300 ${
                  playingVideos[index] ? 'opacity-0 absolute' : 'opacity-100'
                }`}
                loading="lazy"
                onError={(e) => {
                  // Se a imagem de preview não existir, tentar gerar do vídeo
                  e.target.style.display = 'none';
                }}
              />
              {/* Vídeo - só aparece quando reproduzindo, com blur reduzido */}
              <video 
                ref={(el) => {
                  if (el) {
                    videoRefs.current[`video-${index}`] = el;
                  }
                }}
                className={`w-full h-full object-cover rounded-lg transition-all duration-300 ${
                  playingVideos[index] 
                    ? 'opacity-100' 
                    : 'opacity-0 absolute top-0 left-0'
                } ${playingVideos[index] ? 'blur-0' : 'blur-5'}`}
                muted 
                loop
                playsInline
                preload="none" // Não carregar até necessário
                poster={item.poster || item.src.replace('.mp4', '.jpg')} // Fallback para poster
              >
              <source src={item.src} type="video/mp4" />
              Seu navegador não suporta vídeos HTML5.
            </video>
            </>
          ) : (
            <img 
              src={item.src} 
              alt={`Media ${index + 1}`} 
              className="w-full h-full object-cover rounded-lg media-blur transition-all duration-300" 
              loading="lazy" // Lazy loading para imagens também
            />
          )}
          {/* Overlay escuro - sempre visível, mas mais sutil quando reproduzindo */}
          <div 
            className="absolute inset-0 media-overlay rounded-lg transition-opacity duration-300 pointer-events-none" 
            style={{ 
              opacity: item.type === 'video' && playingVideos[index] ? 0.2 : 0.5 
            }}
          ></div>
          {/* Ícone de câmera - sempre visível quando é vídeo */}
          {item.type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <svg className={`w-8 h-8 text-white transition-opacity duration-300 ${
                playingVideos[index] ? 'opacity-50' : 'opacity-70'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
          </div>
          )}
        </div>
      ))}
    </div>
  );
}

