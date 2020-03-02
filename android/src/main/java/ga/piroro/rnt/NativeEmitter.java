package ga.piroro.rnt;

import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.RCTNativeAppEventEmitter;

public class NativeEmitter {
    private final ReactApplicationContext ctx;
    private final String id;

    public NativeEmitter(final ReactApplicationContext reactContext, final String id) {
        ctx = reactContext;
        this.id = id;
    }

    public void emit(final String eventName, final String data) {
        Log.d("RNT:NativeEmitter", "id: " + id + ", name: " + eventName + ", data: " + data);
        WritableMap params = new WritableNativeMap();
        params.putString("name", eventName);
        params.putString("data", data);
        ctx
            .getJSModule(RCTNativeAppEventEmitter.class)
            .emit(id, params);
    }
}
