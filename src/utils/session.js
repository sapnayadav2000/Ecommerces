export function getOrCreateSessionId() {
    let sessionId = localStorage.getItem("sessionId");
  
    if (!sessionId) {
      sessionId = "guest_" + Math.random().toString(36).substring(2, 15);
      localStorage.setItem("sessionId", sessionId);
    }
  
    return sessionId;
  }
  