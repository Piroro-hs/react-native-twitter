package ga.piroro.rnt;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.modules.core.RCTNativeAppEventEmitter;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.ResponseBody;
import se.akerfeldt.okhttp.signpost.OkHttpOAuthConsumer;
import se.akerfeldt.okhttp.signpost.SigningInterceptor;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.concurrent.TimeUnit;

public class TwitterStream {
    private final Call call;

    public TwitterStream(final ReadableMap tokens, final String url, final NativeEmitter emitter) {
        OkHttpOAuthConsumer consumer = new OkHttpOAuthConsumer(
                tokens.getString("consumerKey"),
                tokens.getString("consumerSecret")
        );
        consumer.setTokenWithSecret(
                tokens.getString("accessToken"),
                tokens.getString("accessTokenSecret")
        );
        Request request = new Request.Builder()
            .url(url)
            .get()
            .build();
        call = new OkHttpClient.Builder()
            .addInterceptor(new SigningInterceptor(consumer))
            .readTimeout(0, TimeUnit.SECONDS)
            .build()
            .newCall(request);
        call.enqueue(new Callback() {
            public void onResponse(Call call, Response response) throws IOException {
                try (ResponseBody responseBody = response.body()) {
                    if (!response.isSuccessful()) {
                        emitter.emit("twitterError", responseBody.string());
                        return;
                    }
                    BufferedReader reader = new BufferedReader(responseBody.charStream());
                    StringBuilder builder = new StringBuilder();
                    int c;
                    boolean rFlag = false;
                    while ((c = reader.read()) != -1) {
                        if (rFlag && c == '\n') {
                            String data = builder.deleteCharAt(builder.length() - 1).toString(); // Remove \r.
                            if (data != "") {
                                emitter.emit("data", data);
                            }
                            builder.setLength(0);
                        } else {
                            builder.append((char)c);
                        }
                        rFlag = c == '\r';
                    }
                }
            }

            @Override
            public void onFailure(Call call, IOException e) {
                emitter.emit("networkError", e.getMessage());
            }
        });
    }

    public void close() {
        call.cancel();
    }
}
