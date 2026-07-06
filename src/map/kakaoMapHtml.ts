export function buildMapHTML(apiKey: string): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0,user-scalable=no">
<style>
  html,body,#map{margin:0;padding:0;width:100%;height:100%;}
  #msg{
    position:absolute;inset:0;z-index:10;display:flex;align-items:center;
    justify-content:center;background:#eef7ec;color:#2F5D35;
    font-size:13px;text-align:center;padding:16px;line-height:1.6;
    font-family:-apple-system,sans-serif;
  }
  #msg.h{display:none;}
</style>
<script>
  function rn(d){ if(window.ReactNativeWebView) window.ReactNativeWebView.postMessage(JSON.stringify(d)); }
  window.onerror=function(m){ rn({type:'error',message:String(m)}); };
  window._userMarker=null;
</script>
<script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false"
  onerror="rn({type:'error',message:'Kakao Maps SDK 로드 실패'})">
</script>
</head>
<body>
<div id="map"></div>
<div id="msg">지도 불러오는 중...</div>
<script>
kakao.maps.load(function(){
  window._map=new kakao.maps.Map(document.getElementById('map'),{
    center:new kakao.maps.LatLng(37.5665,126.9780), level:7
  });
  document.getElementById('msg').className='h';
  rn({type:'ready'});
});

function addUserMarker(uLat, uLng, recenter){
  if(window._userMarker) window._userMarker.setMap(null);
  window._userMarker=new kakao.maps.CustomOverlay({
    map:window._map,
    position:new kakao.maps.LatLng(uLat,uLng),
    content:'<div style="width:16px;height:16px;background:#4285F4;border:3px solid #fff;border-radius:50%;box-shadow:0 0 0 4px rgba(66,133,244,0.25),0 2px 6px rgba(0,0,0,.4)"></div>',
    zIndex:10
  });
  if(recenter){
    window._map.setCenter(new kakao.maps.LatLng(uLat,uLng));
    window._map.setLevel(5);
  }
}
</script>
</body>
</html>`;
}