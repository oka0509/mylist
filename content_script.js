$(function(){
  var head = document.getElementsByTagName('head')[0];
  var link = document.createElement('link');
  link.setAttribute('rel','stylesheet');
  link.setAttribute('href','bootstrap.min.css');
  head.appendChild(link);
  //サイドメニューの作成
  var menu_wrap = document.createElement('div');
  menu_wrap.id="menu_wrap";
  let sidemenu = document.createElement('div');
  sidemenu.id = "sidemenu";
  let subattrnode = document.createElement("form");
  subattrnode.id='here';
  let subsubattrnode = document.createElement("button");
  subsubattrnode.type = "button";
  subsubattrnode.id = "koko";
  subsubattrnode.classList.add("btn","btn-warning");
  subsubattrnode.setAttribute("data-toggle","tooltip");
  subsubattrnode.title="追加済み";
  subsubattrnode.textContent = "このページを追加";
  subattrnode.appendChild(subsubattrnode);
  $(subattrnode).find('[data-toggle="tooltip"]').tooltip();
  sidemenu.appendChild(subattrnode);
  let pagelist = document.createElement("ul");
  pagelist.id = "pagelist";
  chrome.storage.local.get(null, function(items) {
    for (key in items) {
      let pagememo = document.createElement('li');
      let pageatag = document.createElement('a');
      pageatag.classList.add('oneitem');
      pageatag.href = items[key];
      pageatag.textContent = key;
      pageatag.id=key;
      pageatag.type="button";
      pagememo.appendChild(pageatag);
      pagelist.appendChild(pagememo);
    }
  });
  let ttt=document.createElement("nav");
  ttt.id="menu";
  ttt.appendChild(pagelist);
  sidemenu.appendChild(ttt);
  menu_wrap.append(sidemenu);

  let sidemenu_key = document.createElement('div');
  sidemenu_key.id = "sidemenu_key";
  sidemenu_key.textContent = '→';
  menu_wrap.append(sidemenu_key);

  let clear = document.createElement('div');
  clear.id = 'clear';
  menu_wrap.append(clear);

  //サイドメニューを追加
  document.body.appendChild(menu_wrap);

  $( document ).ready(function() {
    $(".oneitem").css({
    'display':'block',
		'padding':'15px',
		'border-bottom':'rgb(18, 213, 129) solid 1px',
		'color':'rgb(219, 179, 77)',
		'text-decoration':'none'
  });
  $("#menu").css({
    'top': '0px',
    'left': '0px',
    'width': '150px',
    'height': '91vh',
    'overflow-y': 'scroll',
    'scrollbar-face-color': '#999',
    'scrollbar-track-color': '#eee'
  });
  $("#menu_wrap").css({
    'display' : 'block',
    'position' : 'fixed',
    'top' : '0',
    'width' : '200px',
    'left' : '-150px',
    'z-index':'9996'
  });
  $("#sidemenu").css({
    'background' : '#000',
    'opacity' : '0.95',
		'display':'inline-block',
		'width':'150px',
		'float':'left',
    'background': 'white',
  });
  $("#sidemenu_key").css({
		'display':'inline-block',
		'width':'50px',
		'float':'left',
    'border-radius':'0 5px 5px 0',
		'background':'#000',
		'opacity':'0.75',
		'color':'#FFF',
		'padding':'30px 0',
		'cursor':'pointer',
		'margin-top':'50px'
  });

  $(".oneitem").hover(function() {

    // カーソルが当たった時の処理
    $(this).css({
      'text-decoration': 'underline'
    });
  }, function() {
    // カーソルが離れた時の処理
    $(this).css({
      'text-decoration': 'none',
    });
  });
  chrome.storage.local.get(null, function(items) {
    let flag = false;
    for (key in items) {
      if(items[key]==location.href){
        flag = true;
      }
    }
    if(flag==true){
      //何も行わない(’追加済み’のポップアップを出したい)
    }
    else{
    $("[data-toggle='tooltip']").tooltip('dispose');
    }
  });
});

  /* ▼ここから初期設定 */

  // 1. メニューを囲んでるdivのid
  var menuWrap = '#menu_wrap';

  // 2.ボタンクリック時に現れる領域のid
  var sideMenu = '#sidemenu';

  // 3.ボタンのid
  var sidemenuKey = '#sidemenu_key';

  // 4.メニューの横幅（px）
  var menuWidth = '150';

  // 5.メニューが閉じてる時のボタンの中身（textでも画像でも可）
  var closeHtml = '→';

  // 6.メニューが開いてる時のボタンの中身（textでも画像でも可）
  var openHtml = '←';

  // 7.開閉アニメーションの速さ（単位ミリ秒）
  var speed = 130;


  //***********************************
  //▼ボタンをクリックしたらメニューが開いたり閉じたりする処理
  $(sidemenuKey).click(function(){
      if($(menuWrap).hasClass('active')){
      //activeのクラスを持っていたら
      //menuを閉じる(アニメーションの速さは300)＆activeを取る
      $(menuWrap).stop().animate({left:'-'+menuWidth+'px'},speed).removeClass('active');
      //ボタンの文言を変更
      $(sidemenuKey).html(closeHtml);
    }else{
      //activeのクラスを持っていなければ
      //menuを開く＆activeを付与
      $(menuWrap).stop().animate({left:'0'},speed).addClass('active');
      //ボタンの文言を変更
      $(sidemenuKey).html(openHtml);
    };
  });



  //変数windowHeightに画面の高さを取得、変数windowHeightに格納
  var windowHeight = $(window).height();

  //sideMenuのheightをwindowHeightにする
  $(sideMenu).height(windowHeight);

  //画面をリサイズした時、heightを読み直し
  var timer = false;
  $(window).resize(function() {
    if (timer !== false) {
      clearTimeout(timer);
    }
    timer = setTimeout(function() {
      windowHeight = $(window).height();
      $(sideMenu).height(windowHeight);
    }, 50);
  });


  const target = document.getElementById('sidemenu_key');
  target.addEventListener('mouseover', () => {
    target.style.opacity= '0.5';
  }, false);
  
  // ボタンから離れた時
  target.addEventListener('mouseleave', () => {
    target.style.opacity = '0.75';
  }, false);

/*
登録ボタン(または削除の右クリック)が行われるたびに既存の
削除の右クリック(または登録ボタン)を無効化して，再帰を一回分潜り，
DOMの読み込みが終わった後の最新のものを作り直す
*/
  let inf=111111111;
  let eexists=false;
  let aexists=false;
  function erase_or_add_query(n){
    if(n!=0){
      $( document ).ready(function() {
        if(eexists==false){
          eexists=true;

          //削除(右クリック)
          $('.oneitem').on('contextmenu', function(){
            eexists=false;
            $('#koko').off();
            aexists=false;
            console.log(n);
            var id =  $(this).attr("id");
            console.log(id);
            chrome.storage.local.remove([id]);
              //pagelist直下を全部消して，strogageからデータを読み直す
            const node = document.getElementById("pagelist");
            while(node.firstChild){
              node.removeChild(node.firstChild);
            }
            let pagelist2=document.getElementById("pagelist");
            chrome.storage.local.get(null, function(items) {
              for(key in items) {
                let pagememo2 = document.createElement('li');
                let pageatag2 = document.createElement('a');
                pageatag2.classList.add('oneitem');
                pageatag2.href = items[key];
                pageatag2.textContent = key;
                pageatag2.id=key;
                pageatag2.type="button";
                pagememo2.appendChild(pageatag2);
                pagelist2.appendChild(pagememo2);
              }
            });
            $( document ).ready(function() {
              $(".oneitem").css({
                'display':'block',
                'padding':'15px',
                'border-bottom':'rgb(18, 213, 129) solid 1px',
                'color':'rgb(219, 179, 77)',
                'text-decoration':'none'
              });
              $(".oneitem").hover(function() {
                // カーソルが当たった時の処理
                $(this).css({'text-decoration':'underline'});
            
              }, function() {
                // カーソルが離れた時の処理
                $(this).css({'text-decoration':'none'});
              });
              $( document ).ready(function() {
                erase_or_add_query(n-1);
              });
            });
          });
      }
        if(aexists==false){
          aexists=true;
          //追加
          $('#koko').on('click', function(){
            $('.oneitem').off();
            eexists=false;
            aexists=false;
            chrome.storage.local.get(null, function(items){
              let flag = false;
              for (key in items) {
                if(items[key]==location.href){
                  flag = true;
                }
              }
              if(flag==true){
                //何も行わない(’追加済み’のポップアップを出したい)
              }
              else{
                var temp = document.getElementById("pagelist");
                let pagememo=document.createElement("li");
                let pageatag=document.createElement("a");
                pageatag.href=location.href;
                pageatag.textContent=document.title;
                pageatag.classList.add('oneitem');
                pageatag.id=document.title;
                pagememo.appendChild(pageatag);
                temp.appendChild(pagememo);
                const val = location.href;
                const x = pageatag.textContent;
                const data2 = {[x]: val};
                chrome.storage.local.set(data2, function(){ });
                $("[data-toggle='tooltip']").tooltip('enable');
              }
            });
            $( document ).ready(function() {
              $(".oneitem").css({
              'display':'block',
              'padding':'15px',
              'border-bottom':'rgb(18, 213, 129) solid 1px',
              'color':'rgb(219, 179, 77)',
              'text-decoration':'none'
              });
              $(".oneitem").hover(function() {
                // カーソルが当たった時の処理
                $(this).css({'text-decoration':'underline'});
            
              }, function() {
                // カーソルが離れた時の処理
                $(this).css({'text-decoration':'none'});
              });
              $( document ).ready(function() {
                erase_or_add_query(n-1);
              });
            });
          });
        }
      });
    }
  }
  
  erase_or_add_query(inf);

});
