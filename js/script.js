/**
 * Search Song for particular input conditions
 */
function searchSong() {
	song_name = document.getElementById("song_name").value;
	artist_name = document.getElementById('artist_name').value;
	album_name = document.getElementById('album_name').value;
	genre = document.getElementById('genre').value;
	year = document.getElementById('year').value;
	query = 'q=';
	if (song_name == "" && artist_name == "" && album_name == "" && genre == "" && year == ""){
		alert('Please Input Something!');
		return;
	}
	if (song_name != null && song_name != ""){
		query += "track:"+song_name+"%20";
	}
	if (artist_name != null && artist_name != ""){
		query += "artist:"+artist_name+"%20";
	}
	if (album_name != null && album_name != ""){
		query += "album:"+album_name+"%20";
	}
	if(genre != null && genre != ""){
		query +="genre:%22"+genre+"%22";
	}
	if (year != null && year != ""){
		query += "year:"+year;
	}
	$.ajax({
		url : 'https://api.spotify.com/v1/search?type=track&limit=50&'+ query,
		success : formatSong,
		error : function() {
			console.log('fatal error!!!')
		},
		dataType : 'json'
	});
}

function loadMore(){
	if (query == null){
		alert('Please Input Something!');
		return;
	}
	$.ajax({
		url : 'https://api.spotify.com/v1/search?type=track&offset='+(gloable_count++)*50+'&limit=50&'
				+ query,
		success : load,
		error : function() {
			console.log('fatal error!!!')
		},
		dataType : 'json'
	});
}

function formatSong(songs) {
	var container = document.getElementById("song_list");
	container.innerHTML = "";
	console.log(songs['tracks']);
	var table = document.createElement('table');
	table.setAttribute('id', 'myTable');
	table.className = 'table table-striped';

	var thead = document.createElement('thead');
	var tr_name = document.createElement('tr');
	var th_name1 = document.createElement('th');
	th_name1.innerHTML = 'Cover';
	tr_name.appendChild(th_name1);

	var th_song_name = document.createElement('th');
	th_song_name.innerHTML = 'Song Name';
	tr_name.appendChild(th_song_name);

	var th_name2 = document.createElement('th');
	th_name2.innerHTML = 'Artist Name';
	tr_name.appendChild(th_name2);

	var th_album = document.createElement('th');
	th_album.innerHTML = 'Album Name';
	tr_name.appendChild(th_album);

	var th_name3 = document.createElement('th');
	th_name3.innerHTML = 'Play';
	tr_name.appendChild(th_name3);
	thead.appendChild(tr_name);
	table.appendChild(thead);
	var tbody = document.createElement('tbody');
	table.appendChild(tbody);
	// var table = document.getElementById('myTable');
	container.appendChild(table);
	addTable(songs);
};

function addTable(songs){
	console.log(songs['tracks']);
	var tbody = document.getElementById('myTable').getElementsByTagName('tbody')[0];
	// var start = (gloable_count++) * 10;
	for (i = 0; i < songs['tracks']['items'].length; i++) {
		var tr = tbody.insertRow(tbody.rows.length);
		var td1 = document.createElement('td');
		td1.innerHTML = '<img width="100" height="100" alt="song cover" src="'
				+ songs['tracks']['items'][i].album.images[0]['url'] + '">';
		tr.appendChild(td1);

		var td_song_name = document.createElement('td');
		td_song_name.innerHTML = songs['tracks']['items'][i].name;
		tr.appendChild(td_song_name);
		var td2 = document.createElement('td');

		var str = '';
		for (j = 0; j < songs['tracks']['items'][i]['artists'].length; j++){
			str += songs['tracks']['items'][i]['artists'][j].name + '<br>';
		}
		td2.innerHTML = str;
		tr.appendChild(td2);

		var td_alubum = document.createElement('td');
		td_alubum.innerHTML = songs['tracks']['items'][i].album.name;
		tr.appendChild(td_alubum);

		var td3 = document.createElement('td');
 		var audio = document.createElement("AUDIO");
        audio.setAttribute("src",songs['tracks']['items'][i].preview_url);
    	audio.setAttribute("controls", "controls");
    	td3.appendChild(audio);
    	tr.appendChild(td3);
	}
	$(document).ready(function(){
    $('#myTable').dataTable();
});
}

function load(songs){
	if (songs['tracks']['items'].length <= 0){
		alert('No More Result Can Be loaded!');
		var load_result = document.getElementById('song_list');
		load_result.innerHTML = tempContainer;
		return;
	}
	formatSong(songs);
}