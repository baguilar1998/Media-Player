export class Song {

  title: string;
  artist: string;
  filePath: string;
  albumArt: string;

  constructor(t: string, a: string, fp: string) {
    this.title = t;
    this.artist = a;
    this.filePath = fp;
  }

  setAlbumArt(a) {
    this.albumArt = a;
  }

}
