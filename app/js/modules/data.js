define(function () {
  return {
    data: null,
    //  just sends the request to fetch the data
    //  cb - callback, mandatory
    //  lastFetch - the id/title of the last fetched item
    fetch: function( cb, lastFetch ){

      var url = "https://www.reddit.com/r/videos/.json?count=25";
      //  next bit just adds shit to the url if it's a fetch beyond the first page
      if( lastFetch ){
        url += "&after="+lastFetch;
        console.log( "lastFetch exists, new URL: "+url );
      }

      //  The fetch:
      var r = new XMLHttpRequest();
      r.open("get", url , true);
      r.onload = function(xmlEvent){
        this.data = JSON.parse(r.response).data.children;
        console.warn("HERE COMES LE DATA");
        console.log(this.data);
        cb( this.data );
      };
      r.send();

    },
    //  used as the callback for the above function to parse the provided data
    //  accepts incoming data && the list of used videos
    //  returns an unwatched video
    parse: function( data, watchedVideos ){

      //  vidlist for new vids and watchedList for old
      var vidList     = [],
          watchedList = [];
          //  quickly builds just the list of watchedVid names
          watchedVideos.forEach(function(i){ watchedList.push(i.name); });

      data.forEach( function(val){
        if( watchedList.indexOf(val.data.name) !== -1 ){
          console.info('Found a watched video!');
        } else {
          //  if it's the mod or a self post, we don't want it
          //  also, if it has no media embed data we aren't going to bother with it
          if( val.data.distinguished !== 'moderator' && val.data.domain !== 'self.videos' && val.data.media_embed.content ){
            vidList.push(val);
          }
        }

      });

      return vidList;
    }
  };
});