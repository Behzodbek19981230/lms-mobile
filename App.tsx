import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import NetInfo from '@react-native-community/netinfo';

const WEB_URI = 'https://lms.universal-uz.uz/';

const OFFLINE_HTML = `<!doctype html>
<html lang="uz">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Offline</title>
    <style>
      html, body { height: 100%; margin: 0; }
      body {
        font-family: -apple-system, system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px;
        background: #fff;
        color: #111827;
      }
      .card { width: 100%; max-width: 420px; text-align: center; }
      h1 { font-size: 22px; margin: 0 0 10px; }
      p { margin: 0 0 18px; opacity: .75; font-size: 16px; }
      button {
        padding: 10px 18px;
        border-radius: 10px;
        border: 1px solid rgba(17,24,39,.25);
        background: transparent;
        font-weight: 600;
        font-size: 16px;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Internet yo‘q</h1>
      <p>Tarmoq qaytgandan keyin yangilashni bosing.</p>
      <button id="refresh">Refresh</button>
    </div>
    <script>
      (function () {
        var btn = document.getElementById('refresh');
        if (!btn) return;
        btn.addEventListener('click', function () {
          try {
            window.ReactNativeWebView && window.ReactNativeWebView.postMessage('refresh');
          } catch (e) {}
        });
      })();
    </script>
  </body>
</html>`;

const injectedViewport = `
(function () {
  try {
    var meta = document.querySelector('meta[name=viewport]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'viewport');
      document.head.appendChild(meta);
    }
    // Make the page smaller (zoomed out) so more content fits on screen.
    meta.setAttribute(
      'content',
      'width=device-width, initial-scale=0.75, maximum-scale=1.0, user-scalable=yes'
    );

    // Android Chromium sometimes ignores meta scaling in WebView; force zoom too.
    var applyZoom = function () {
      try {
        if (document && document.body) {
          document.body.style.zoom = '1';
        }
        if (document && document.documentElement) {
          document.documentElement.style.zoom = '1';
        }
      } catch (e) {}
    };

    applyZoom();
    setTimeout(applyZoom, 250);
    setTimeout(applyZoom, 1000);
  } catch (e) {}
})();
true;
`;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  screenLight: {
    backgroundColor: '#ffffff',
  },
  screenDark: {
    backgroundColor: '#000000',
  },
  webView: {
    flex: 1,
  },
});

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const webViewRef = useRef<WebView>(null);

  const screenThemeStyle = useMemo(
    () => (isDarkMode ? styles.screenDark : styles.screenLight),
    [isDarkMode],
  );

  useEffect(() => {
    const sub = NetInfo.addEventListener((state) => {
      const online = Boolean(
        state.isConnected && state.isInternetReachable !== false,
      );
      setIsOnline(online);
    });
    return () => sub();
  }, []);

  useEffect(() => {
    if (isOnline) {
      webViewRef.current?.reload?.();
    }
  }, [isOnline]);

  const onPressRefresh = async () => {
    const state = await NetInfo.fetch();
    const online = Boolean(
      state.isConnected && state.isInternetReachable !== false,
    );
    setIsOnline(online);
    if (online) {
      webViewRef.current?.reload?.();
    }
  };

  const onMessage = (event: any) => {
    const data = event?.nativeEvent?.data;
    if (data === 'refresh') {
      onPressRefresh();
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <SafeAreaView style={[styles.screen, screenThemeStyle]} edges={['top', 'bottom']}>
        <WebView
          ref={webViewRef}
          style={styles.webView}
          source={isOnline ? { uri: WEB_URI } : { html: OFFLINE_HTML }}
          originWhitelist={['*']}
          onMessage={onMessage}
          javaScriptEnabled
          domStorageEnabled
          applicationNameForUserAgent="EduOneMobile"
          injectedJavaScriptBeforeContentLoaded={injectedViewport}
          injectedJavaScript={injectedViewport}
          setBuiltInZoomControls={Platform.OS === 'android'}
          setDisplayZoomControls={false}
          textZoom={Platform.OS === 'android' ? 100 : undefined}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default App;
