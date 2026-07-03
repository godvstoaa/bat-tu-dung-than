package com.battu.dungthan;

import android.app.Activity;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.Menu;
import android.view.MenuItem;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ProgressBar;

/**
 * Thin WebView wrapper around https://battu.god8.shop.
 *
 * Content (engine, 通 luận knowledge, prompts) is served from the live site, so
 * every deploy shows up after reload with NO apk rebuild. The site's own
 * service worker (sw.js) handles offline caching.
 *
 * UX: top ProgressBar while loading (no black screen), overflow menu with
 * "Tải lại" / "Trang chủ", and a friendly offline page on network error.
 */
public class MainActivity extends Activity {

    private static final String HOME_URL = "https://battu.god8.shop/";

    private static final String OFFLINE_HTML =
        "<html><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'>"
        + "<style>body{background:#0a0913;color:#d4af37;font-family:sans-serif;"
        + "display:flex;align-items:center;justify-content:center;height:100vh;margin:0;text-align:center;padding:28px}"
        + "h2{margin:0 0 10px;font-weight:600}p{color:#9a8a6a;margin:0;line-height:1.6}</style></head>"
        + "<body><div><h2>Không có kết nối mạng</h2>"
        + "<p>App cần mạng để tải <b>Bát Tự Dụng Thần</b>.<br>"
        + "Kiểm tra Wi-Fi/4G rồi mở menu ⋮ → <b>Tải lại</b>.</p></div></body></html>";

    private WebView webView;
    private ProgressBar progress;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        webView = findViewById(R.id.webview);
        progress = findViewById(R.id.progress);

        WebSettings ws = webView.getSettings();
        ws.setJavaScriptEnabled(true);
        ws.setDomStorageEnabled(true);
        ws.setDatabaseEnabled(true);
        ws.setAllowFileAccess(true);
        ws.setCacheMode(WebSettings.LOAD_DEFAULT);

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int p) {
                progress.setProgress(p);
                progress.setVisibility((p > 0 && p < 100) ? ProgressBar.VISIBLE : ProgressBar.GONE);
            }
        });

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest r) {
                return false;
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest req, WebResourceError error) {
                // Only replace the page on a main-frame failure (not sub-resources).
                if (req.isForMainFrame()) {
                    webView.loadDataWithBaseURL(HOME_URL, OFFLINE_HTML, "text/html", "utf-8", null);
                }
            }
        });

        if (savedInstanceState == null) {
            webView.loadUrl(HOME_URL);
        } else {
            webView.restoreState(savedInstanceState);
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        menu.add(0, 1, 0, "Tải lại").setShowAsAction(MenuItem.SHOW_AS_ACTION_NEVER);
        menu.add(0, 2, 0, "Trang chủ").setShowAsAction(MenuItem.SHOW_AS_ACTION_NEVER);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getItemId() == 1) { webView.reload(); return true; }
        if (item.getItemId() == 2) { webView.loadUrl(HOME_URL); return true; }
        return super.onOptionsItemSelected(item);
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        webView.saveState(outState);
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK && webView.canGoBack()) {
            webView.goBack();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }
}
