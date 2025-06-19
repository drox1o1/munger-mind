// Mobile-specific utilities for enhanced user experience

export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 768;
};

export const isIOS = () => {
  if (typeof window === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

export const isAndroid = () => {
  if (typeof window === 'undefined') return false;
  return /Android/.test(navigator.userAgent);
};

export const supportsHapticFeedback = () => {
  return 'vibrate' in navigator || 'hapticFeedback' in navigator;
};

export const triggerHapticFeedback = (type: 'light' | 'medium' | 'heavy' = 'light') => {
  if (typeof window === 'undefined') return;
  
  try {
    // iOS Haptic Feedback
    if (isIOS() && 'hapticFeedback' in navigator) {
      // @ts-ignore - iOS specific API
      navigator.hapticFeedback?.impact(type);
    }
    // Android Vibration API
    else if (isAndroid() && 'vibrate' in navigator) {
      const duration = type === 'light' ? 10 : type === 'medium' ? 20 : 50;
      navigator.vibrate(duration);
    }
    // Fallback vibration
    else if ('vibrate' in navigator) {
      const duration = type === 'light' ? 10 : type === 'medium' ? 20 : 50;
      navigator.vibrate(duration);
    }
  } catch (error) {
    console.warn('Haptic feedback not supported:', error);
  }
};

export const addSwipeGestureListeners = (
  element: HTMLElement,
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  threshold: number = 50
) => {
  let startX = 0;
  let startY = 0;
  let endX = 0;
  let endY = 0;

  const handleTouchStart = (e: TouchEvent) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  };

  const handleTouchMove = (e: TouchEvent) => {
    endX = e.touches[0].clientX;
    endY = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    
    // Only trigger if horizontal swipe is dominant
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
      if (deltaX > 0 && onSwipeRight) {
        triggerHapticFeedback('light');
        onSwipeRight();
      } else if (deltaX < 0 && onSwipeLeft) {
        triggerHapticFeedback('light');
        onSwipeLeft();
      }
    }
  };

  element.addEventListener('touchstart', handleTouchStart, { passive: true });
  element.addEventListener('touchmove', handleTouchMove, { passive: true });
  element.addEventListener('touchend', handleTouchEnd, { passive: true });

  return () => {
    element.removeEventListener('touchstart', handleTouchStart);
    element.removeEventListener('touchmove', handleTouchMove);
    element.removeEventListener('touchend', handleTouchEnd);
  };
};

export const addPullToRefreshListener = (
  element: HTMLElement,
  onRefresh: () => Promise<void>,
  threshold: number = 100
) => {
  let startY = 0;
  let currentY = 0;
  let isPulling = false;
  let isRefreshing = false;

  const handleTouchStart = (e: TouchEvent) => {
    if (element.scrollTop === 0) {
      startY = e.touches[0].clientY;
      isPulling = true;
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isPulling || isRefreshing) return;
    
    currentY = e.touches[0].clientY;
    const pullDistance = currentY - startY;
    
    if (pullDistance > 0 && element.scrollTop === 0) {
      e.preventDefault();
      
      // Add visual feedback here (stretch effect, loading indicator)
      const progress = Math.min(pullDistance / threshold, 1);
      element.style.transform = `translateY(${Math.min(pullDistance * 0.5, 50)}px)`;
      element.style.opacity = `${1 - progress * 0.2}`;
    }
  };

  const handleTouchEnd = async () => {
    if (!isPulling || isRefreshing) return;
    
    const pullDistance = currentY - startY;
    
    if (pullDistance > threshold) {
      isRefreshing = true;
      triggerHapticFeedback('medium');
      
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        isRefreshing = false;
      }
    }
    
    // Reset visual state
    element.style.transform = '';
    element.style.opacity = '';
    isPulling = false;
    startY = 0;
    currentY = 0;
  };

  element.addEventListener('touchstart', handleTouchStart, { passive: false });
  element.addEventListener('touchmove', handleTouchMove, { passive: false });
  element.addEventListener('touchend', handleTouchEnd, { passive: true });

  return () => {
    element.removeEventListener('touchstart', handleTouchStart);
    element.removeEventListener('touchmove', handleTouchMove);
    element.removeEventListener('touchend', handleTouchEnd);
  };
};

export const optimizeForDevice = () => {
  if (typeof window === 'undefined') return;

  // iOS specific optimizations
  if (isIOS()) {
    // Prevent zoom on input focus
    const viewport = document.querySelector('meta[name=viewport]');
    if (viewport) {
      viewport.setAttribute('content', 
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
      );
    }
    
    // Add iOS safe area support
    document.body.classList.add('ios-device');
  }
  
  // Android specific optimizations
  if (isAndroid()) {
    // Enable hardware acceleration
    document.body.style.transform = 'translateZ(0)';
    document.body.classList.add('android-device');
  }
  
  // General mobile optimizations
  if (isMobile()) {
    // Disable text selection on UI elements
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    
    // Improve touch performance
    document.body.style.touchAction = 'manipulation';
    
    // Add mobile class for styling
    document.body.classList.add('mobile-device');
  }
};