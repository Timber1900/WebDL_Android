package com.webdl; // replace com.your-app-name with your app’s name
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.yausername.youtubedl_android.YoutubeDL;
import com.yausername.youtubedl_android.YoutubeDLException;
import com.yausername.youtubedl_android.YoutubeDLRequest;
import com.yausername.youtubedl_android.YoutubeDLResponse;
import com.yausername.youtubedl_android.mapper.VideoInfo;
import com.facebook.react.bridge.Callback;

import java.util.Arrays;
import java.util.Map;
import java.util.HashMap;
import android.util.Log;

public class YoutubeDL_Wrapper extends ReactContextBaseJavaModule {
    YoutubeDL_Wrapper(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "YoutubeDL_Wrapper";
    }

    @ReactMethod
    public void getInfoInner(String url, Promise promise) {
        try {
            YoutubeDLRequest request = new YoutubeDLRequest(url);
            request.addOption("--dump-json");
            YoutubeDLResponse response = YoutubeDL.getInstance().execute(request, null);
            promise.resolve(response.getOut());
        } catch (YoutubeDLException e) {
            promise.reject(e);
        } catch (InterruptedException e) {
            promise.reject(e);
        }
    }
}