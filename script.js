// Shared script for slideshow, years, nearby locations, and simple form handling
document.addEventListener('DOMContentLoaded',function(){
  // set year in footers
  var y=new Date().getFullYear();
  ['year','year2','year3','year4'].forEach(function(id){
    var el=document.getElementById(id); if(el) el.textContent=y;
  });

  // Slideshow
  var slides=document.querySelectorAll('.slide');
  var current=0;
  function show(i){
    slides.forEach(function(s,idx){s.classList.toggle('active',idx===i)});
    var s=slides[i];
    var titleEl=document.getElementById('slideTitle');
    var descEl=document.getElementById('slideDesc');
    if(s && titleEl && descEl){
      titleEl.textContent=s.dataset.title||'';
      descEl.textContent=s.dataset.desc||'';
    }
  }
  if(slides.length){ show(0); }
  var nextBtn=document.getElementById('next');
  var prevBtn=document.getElementById('prev');
  if(nextBtn) nextBtn.addEventListener('click',function(){ current=(current+1)%slides.length; show(current); });
  if(prevBtn) prevBtn.addEventListener('click',function(){ current=(current-1+slides.length)%slides.length; show(current); });

  // Image fallback for missing files (ensures pictures appear everywhere)
  document.querySelectorAll('img[data-fallback]').forEach(function(img){
    img.addEventListener('error',function(){
      if(img.dataset.fallbackLoaded) return;
      img.dataset.fallbackLoaded='true';
      img.src=img.dataset.fallback;
    });
  });

  // Locations - simple nearby suggestion
  var locations=[
    {name:'Downtown',lat:37.7749,lng:-122.4194,address:'123 Main St, Cityville',hours:'9:00 AM — 9:00 PM'},
    {name:'Uptown',lat:37.7849,lng:-122.4094,address:'456 Market Ave, Cityville',hours:'10:00 AM — 10:00 PM'},
    {name:'Lakeside',lat:37.7649,lng:-122.4294,address:'789 Lake Rd, Cityville',hours:'8:00 AM — 8:00 PM'}
  ];
  function haversine(a,b){
    var R=6371; var toRad=Math.PI/180;
    var dLat=(b.lat-a.lat)*toRad; var dLon=(b.lng-a.lng)*toRad;
    var lat1=a.lat*toRad,lat2=b.lat*toRad;
    var h=Math.sin(dLat/2)*Math.sin(dLat/2)+Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLon/2)*Math.sin(dLon/2);
    return 2*R*Math.asin(Math.sqrt(h));
  }

  var findBtn=document.getElementById('findNearby');
  var nearbyList=document.getElementById('nearbyList');
  if(findBtn && navigator.geolocation){
    findBtn.addEventListener('click',function(){
      findBtn.disabled=true; findBtn.textContent='Locating...';
      navigator.geolocation.getCurrentPosition(function(pos){
        var me={lat:pos.coords.latitude,lng:pos.coords.longitude};
        var sorted=locations.map(function(loc){return Object.assign({},loc,{dist:haversine(me,loc)});}).sort(function(a,b){return a.dist-b.dist});
        renderNearby(sorted);
        findBtn.disabled=false; findBtn.textContent='Find Nearby';
      },function(){
        renderNearby(locations);
        findBtn.disabled=false; findBtn.textContent='Find Nearby';
      });
    });
  } else if(findBtn){
    findBtn.addEventListener('click',function(){ renderNearby(locations); });
  }

  function renderNearby(list){
    if(!nearbyList) return;
    nearbyList.innerHTML='';
    list.forEach(function(l){
      var div=document.createElement('div'); div.className='location-card';
      div.innerHTML='<h3>'+l.name+'</h3><p>'+l.address+'</p><p><strong>Hours:</strong> '+l.hours+'</p>'+
        '<div style="margin-top:8px"><button class="btn orderNow">Order Now</button> <button class="btn secondary orderCat">Order Catering</button></div>';
      nearbyList.appendChild(div);
    });
    // attach events
    nearbyList.querySelectorAll('.orderNow').forEach(function(b){b.addEventListener('click',function(){window.location.href='mailto:orders@delishbites.example?subject=Place%20Order';});});
    nearbyList.querySelectorAll('.orderCat').forEach(function(b){b.addEventListener('click',function(){window.location.href='catering.html';});});
  }

  // Catering form handling
  var catForm=document.getElementById('cateringForm');
  if(catForm){
    catForm.addEventListener('submit',function(e){e.preventDefault(); alert('Thank you! Your catering request was sent.'); catForm.reset();});
    var orderNowCatering=document.getElementById('orderNowCatering');
    if(orderNowCatering) orderNowCatering.addEventListener('click',function(){ window.location.href='mailto:catering@delishbites.example?subject=Catering%20Order'; });
  }
});
