package ga.piroro.rnt;

import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

import java.util.HashMap;
import java.util.Map;

public class RNTModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext ctx;
    private final Map<String, TwitterStream> twitterStreams = new HashMap<>();

    public RNTModule(ReactApplicationContext reactContext) {
        super(reactContext);
        ctx = reactContext;
    }

    @Override
    public String getName() {
        return "RNTwitter";
    }

    @ReactMethod
    public void open(final String id, final ReadableMap tokens, final String url) {
        Log.d("RNT", url + ", id: " + id);
        twitterStreams.put(id, new TwitterStream(tokens, url, new NativeEmitter(ctx, id)));
    }

    @ReactMethod
    public void close(final String id) {
        twitterStreams.remove(id).close();
    }
}
