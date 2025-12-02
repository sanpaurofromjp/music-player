//ページ読み込み時に最初のプレイリストを表示
window.addEventListener('load',function(){
    playlistSelector.value = 'sample'; //最初sampleを選択
    playlistSelector.dispatchEvent(new Event('change')); //sampleへの選択を発火
    artist.textContent = playlistSelector.value;
    songTitle.textContent = playlists[playlistSelector.value][0].title;
});

//音楽再生用のAudio要素を作成
const audio = new Audio();
let isPlaying = false; //再生中かどうか記録

//再生ボタンを取得
const playButton = document.querySelectorAll('.controls button')[1];
//クリックされたら
playButton.addEventListener('click',function(){
    if (playButton.textContent === '再生'){
        if (currentPlaylist.length > 0){
            const currentSong = currentPlaylist[currentSongIndex];
            progressBar.style.width = '0%';
            audio.src = currentSong.file;
            audio.play();
            isPlaying = true;
        }
        playButton.textContent = '停止';
        console.log('再生開始！');
    }
    else{
        audio.pause();
        isPlaying = false;
        playButton.textContent = '再生';
        console.log('停止しました');
    }
});

//曲リストの全アイテムを取得
const songItems = document.querySelectorAll('.song-item');

//現在の曲名を表示する部分を取得
const songTitle = document.querySelector('.song-title');
const artist = document.querySelector('.artist');
// プログレスバーの要素を取得
const progressBar = document.querySelector('.progress');

//各曲アイテムにクリックイベントを設定
songItems.forEach(function(item){
    item.addEventListener('click',function(){
        //　data-text属性から曲名を取得
        const songName = item.getAttribute('data-text');

        //　曲名を更新
        songTitle.textContent = songName;
        artist.textContent = artist;

        console.log('選択された曲',songName);
    });
})

//プレイリスト選択を取得
const playlistSelector = document.querySelector('.playlist-selector select');
const songList = document.querySelector('.song-list');

const playlists = {
    "sample":[
        {title:"sample_1", file:"music/sample_1.wav"},
        {title:"sample_2", file:"music/sample_2.wav"},
        {title:"sample_3", file:"music/sample_3.mp3"},
        {title:"sample_4", file:"music/sample_4.mp3"}
    ],
    "THE IDOLM@STER":[
        {title:"M@STERPIECE",file:"#"},
        {title:"READY!",file:"#"},
        {title:"GO MY WAY!",file:"#"},
        {title:"dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",file:"#"}
    ],
    "μ's":[
        {title:"wonderful lush",file:"#"},
        {title:"wonder zone",file:"#"},
        {title:"No Brand Girls",file:"#"},
        {title:"Dancing stars on me!",file:"#"}
    ]
};

//プレイリストが変更されたら
playlistSelector.addEventListener('change',function(){
    const selectedPlaylist = playlistSelector.value;
    console.log('選択されたプレイリスト:',selectedPlaylist);

    //曲リストをクリア
    songList.innerHTML = '';

    //新しい曲リストを作成
    const songs = playlists[selectedPlaylist];
    console.log('曲データ:',songs);
    currentPlaylist = songs || [];
    currentSongIndex = 0;

    if(songs){
        songs.forEach(function(song,index){
            console.log('曲:',song);
            console.log('タイトル:',song.title);
            const songItem = document.createElement('div');
            songItem.className = 'song-item';
            songItem.setAttribute('data-text',song.title);
            songItem.textContent = (index + 1) + '. ' + song.title;

            //クリックイベントも追加
            songItem.addEventListener('click',function(){
                const songName = songItem.getAttribute('data-text');
                songTitle.textContent = songName;
                artist.textContent = selectedPlaylist;
                currentSongIndex = index;
                
                //曲も再生
                progressBar.style.width = '0%';
                audio.src = song.file;
                audio.play();
                isPlaying = true;
                playButton.textContent = '停止';
                console.log('再生開始！')
                
                console.log('選択された曲:',songName,'インデックス:',index);
            });

            songList.appendChild(songItem);
        });
    }
});

// 現在の曲のインデックスを記録
let currentSongIndex = 0;
let currentPlaylist = [];

// プログレスバーを更新する関数
function updateProgress(){
    if (audio.duration && progressBar){ //曲の長さがわかっている場合
        const progress = (audio.currentTime / audio.duration)*100;
        progressBar.style.width = progress + '%';
    }
}

// 音楽の再生中、定期的にプログレスバーを更新
audio.addEventListener('timeupdate',updateProgress);

//次へボタンを取得
const nextButton = document.querySelectorAll('.controls button')[2]; 
//次へボタンがクリックされたら
nextButton.addEventListener('click',function(){
    
    if (currentPlaylist.length==0){
        console.log('プレイリストが選択されていません');
        return;
    }

    //次の曲へ
    currentSongIndex = currentSongIndex + 1;

    //最後の曲を超えたら、最初に戻る
    if (currentSongIndex>=currentPlaylist.length){
        currentSongIndex = 0;
    }

    //曲名を更新
    const nextSong = currentPlaylist[currentSongIndex];
    songTitle.textContent = nextSong.title;

    // 再生中なら次の曲も再生
    if (isPlaying){
        audio.src = nextSong.file;
        audio.play();
    }

    console.log('次の曲', nextSong.title,'インデックス:',currentSongIndex);
});

//　前へボタンを取得
const prevButton = document.querySelectorAll('.controls button')[0];

// 前へボタンがクリックされたら
prevButton.addEventListener('click',function(){
    if(currentPlaylist.length==0){
        console.log('プレイリストが選択されていません');
        return;
    }

    //　前の曲へ
    currentSongIndex = currentSongIndex = currentSongIndex - 1;

    //最初の曲より前に行ったら最後に戻る
    if(currentSongIndex < 0){
        currentSongIndex = currentPlaylist.length - 1;
    }

    const prevSong = currentPlaylist[currentSongIndex];
    songTitle.textContent = prevSong.title;

    // 再生中なら前の曲も再生
    if(isPlaying){
        audio.src = prevSong.file;
        audio.play();
    }

    console.log('前の曲:',prevSong.title,'インデックス:',prevSong.title);
});

//　曲が終わったら次の曲へ
audio.addEventListener('ended',function(){
    console.log('曲が終わりました')

    currentSongIndex = currentSongIndex + 1;
    if(currentSongIndex >= currentPlaylist.length){
        currentSongIndex = 0;
    }

    const nextSong = currentPlaylist[currentSongIndex];
    songTitle.textContent = nextSong.title;
    progressBar.style.width = '0%';
    audio.src = nextSong.file;
    audio.play();

    console.log('次の曲を自動再生:',nextSong.title);
})